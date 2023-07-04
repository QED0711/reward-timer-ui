import { useEffect, useLayoutEffect, useRef, useState } from "react"

// =============================== STATE =============================== 
import mainManager from "../../state/main/mainManager"

// =============================== COMPONENTS =============================== 
import FullScreenTimer from "./FullScreenTimer"
import Modal from "../layout/Modal"
import EditForm from "./EditForm"

// =============================== ICONS =============================== 
import { RiDeleteBinFill, RiEdit2Fill, RiVolumeUpFill, RiPlayFill, RiStopFill, RiFullscreenLine } from 'react-icons/ri'

// =============================== UTILS =============================== 
import { millisIntoDay, msToDigital, msToHMS } from "../../utils/time"
import { useSpiccatoState } from "spiccato-react"

// STYLES
const ICON_BUTTON_STYLE = "mr-1 mb-1 disabled:opacity-60 disabled:cursor-not-allowed"

// EVENTS
const handleDeleteClick = (type, entity) => e => {
    e.stopPropagation();
    mainManager.setters.deleteEntity(type, entity);
}

const handleSpeakClick = (entity) => e => {
    e.stopPropagation();
    mainManager.methods.speak(entity.description)
}
// ======================================================================================
const ListItemWrapper = ({ className, onClick = () => { }, children }) => {
    return (
        <div className={`my-1 p-1 border-b-2 border-b-yellow-500 cursor-pointer hover:font-bold ${className}`} onClick={onClick}>
            {children}
        </div>
    )
}

// ======================================================================================
const ElementTypes = {
    Task({ task }) {

        // STATE
        const { state } = useSpiccatoState(mainManager, [mainManager.paths.isLocked])
        const [showEdit, setShowEdit] = useState(false);

        // EVENTS
        const handleRowClick = () => {
            mainManager.setters.adjustSelectedUserPoints(task.amount)
        }

        return (
            <>
                {
                    showEdit
                    &&
                    <Modal closeButton onClose={() => { setShowEdit(false) }}>
                        <EditForm type={"task"} content={task} onClose={() => setShowEdit(false)} />
                    </Modal>
                }
                <ListItemWrapper className={"grid grid-cols-3"} onClick={handleRowClick}>
                    <div>{task.name}</div>
                    <div>+{task.amount}</div>
                    <div>
                        <button className={ICON_BUTTON_STYLE} disabled={!mainManager.state.speechSupported} onClick={handleSpeakClick(task)} >{<RiVolumeUpFill />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={handleDeleteClick("task", task)} >{<RiDeleteBinFill />}</button>
                    </div>
                </ListItemWrapper>
            </>
        )
    },

    Timer({ timer }) {

        // STATE
        const { state } = useSpiccatoState(mainManager, [mainManager.paths.isLocked, mainManager.paths.serverTimezone])
        const [isActive, setIsActive] = useState(false);
        const [showEdit, setShowEdit] = useState(false);
        const [showFullScreen, setShowFullScreen] = useState(false)
        const [timeRemaining, setTimeRemaining] = useState(null)
        const [percentageComplete, setPercentageComplete] = useState(0);
        
        // EVENTS
        const handleToggleStartCountdown = e => {
            e.preventDefault();
            !!timer.startedAt
                ? mainManager.restAPI.stopCountdown(timer.id)
                : mainManager.restAPI.startCountdown(timer.id)
        }

        const handleFullScreenClick = () => {
            setShowFullScreen(true);
        }

        // EFFECTS
        // Handle start/stopping of countdown timer
        useEffect(() => {

            clearInterval(window[timer.id + "_interval"])
            if (timer.type === "countdown") {
                // TODO - BUG: if another session is connected to the backend, the startedAt indicator gets reset
                if (!!timer.startedAt) {
                    window[timer.id + "_interval"] = setInterval(() => {
                        const timeSyncConstant = mainManager.getters.getTimeSyncConstant();
                        const now = Date.now()
                        const remaining = timer.time - (now - timeSyncConstant - timer.startedAt)
                        if (remaining <= 0) {
                            clearInterval(window[timer.id + "_interval"])
                            mainManager.restAPI.stopCountdown(timer.id);
                            setTimeRemaining(null)
                            setPercentageComplete(0)
                        } else {
                            setTimeRemaining(remaining);
                            setPercentageComplete(Math.min(1 - (remaining / timer.time), 1));
                        }
                    }, 250)
                    // console.log("FIRED", window[timer.id + "_interval"])
                    setIsActive(true)
                } else {
                    clearInterval(window[timer.id + "_interval"]);
                    setIsActive(false)
                }
            }
        }, [timer.startedAt, timer.time])

        // Handle start/stopping of period timer
        useEffect(() => {
            clearInterval(window[timer.id + "_period_interval"])
            if (timer.type === "period") {
                window[timer.id + "_period_interval"] = setInterval(() => {
                    const currentServerTime = Date.now() - mainManager.getters.getTimeSyncConstant();
                    const dayMS = millisIntoDay(currentServerTime);
                    if (timer.end > timer.start) { // period contained within the day
                        if (dayMS >= timer.start && dayMS < timer.end) {
                            const remaining = timer.end - dayMS;
                            setTimeRemaining(remaining)
                            setPercentageComplete(Math.min(1 - (remaining / (timer.end - timer.start)), 1));
                            setIsActive(true)
                        } else {
                            setIsActive(false)
                            setTimeRemaining(null)
                            setPercentageComplete(0)
                            clearInterval(window[timer.id + "_period_interval"])
                        }
                    } else if (timer.end < timer.start) { // period spans overnight
                        if (dayMS >= timer.start || dayMS < timer.end) {
                            const periodDuration = 8.64e+7 - timer.start + timer.end; // 8.64e+7 = ms per day
                            const remaining = dayMS >= timer.start ? 8.64e+7 - dayMS + timer.end : timer.end - dayMS;
                            setTimeRemaining(remaining);
                            setPercentageComplete(Math.min(1 - remaining / periodDuration), 1);
                            setIsActive(true)
                        } else {
                            setIsActive(false)
                            setTimeRemaining(null)
                            setPercentageComplete(0)
                            clearInterval(window[timer.id + "_period_interval"])
                        }
                    }
                }, 1000);
            }

        }, [timer.type, timer.start, timer.end])

        return (
            <>
                {
                    showEdit
                    &&
                    <Modal closeButton onClose={() => { setShowEdit(false) }}>
                        <EditForm type={"timer"} content={timer} onClose={() => setShowEdit(false)} />
                    </Modal>
                }

                {
                    showFullScreen
                    &&
                    <FullScreenTimer onClose={() => setShowFullScreen(false)} {...{timer, timeRemaining, percentageComplete}} />
                }

                <ListItemWrapper className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"}>
                    <div>{timer.name}</div>
                    <div className="relative p-1 bg-gray-100 rounded-sm">
                        { // COUNTDOWN
                            timer.type === "countdown"
                            &&
                            msToDigital(isActive ? timeRemaining : timer.time)
                        }

                        { // PERIOD
                            timer.type === "period"
                            &&
                            <div className="relative pt-3">
                                <sub className="absolute top-1 font-sm italic">{state.serverTimezone.replace(/_/g, " ")}</sub>
                                <span className="font-bold">start:</span> {msToDigital(timer.start, 12)}
                                <br />
                                <span className="font-bold">end:</span> {msToDigital(timer.end, 12)}
                            </div>
                        }
                        {
                            isActive
                            &&
                            <>
                                <div className="absolute top-0 left-0 h-full bg-yellow-500 opacity-50" style={{ width: `${percentageComplete * 100}%` }}></div>
                                <div className="absolute top-0 right-0 h-full bg-red-400 opacity-50" style={{ width: `${(1 - percentageComplete) * 100}%` }}></div>
                            </>
                        }
                    </div>
                    <div className="row-span-1 md:row-span-2">
                        <button className={ICON_BUTTON_STYLE} disabled={!isActive} title="start timer" onClick={handleFullScreenClick}><RiFullscreenLine /></button>
                        {
                            timer.type === "countdown"
                            &&
                            <button
                                className={ICON_BUTTON_STYLE}
                                disabled={state.isLocked}
                                title="start timer"
                                onClick={handleToggleStartCountdown}
                            >
                                {!timer.startedAt ? <RiPlayFill /> : <RiStopFill />}
                            </button>}
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={handleDeleteClick("timer", timer)} >{<RiDeleteBinFill />}</button>
                    </div>
                </ListItemWrapper>
            </>
        )
    },

    Reward({ reward }) {

        // STATE
        const { state } = useSpiccatoState(mainManager, [mainManager.paths.isLocked])
        const [showEdit, setShowEdit] = useState(false);

        // EVENTS
        const handleRowClick = () => {
            mainManager.setters.giveReward(reward)
        }

        return (
            <>
                {
                    showEdit
                    &&
                    <Modal closeButton onClose={() => { setShowEdit(false) }}>
                        <EditForm type={"reward"} content={reward} onClose={() => setShowEdit(false)} />
                    </Modal>
                }
                <ListItemWrapper className={"grid grid-cols-3"} onClick={handleRowClick}>
                    <div>{reward.name}</div>
                    <div>{reward.cost}</div>
                    <div>
                        <button className={ICON_BUTTON_STYLE} disabled={!mainManager.state.speechSupported} onClick={handleSpeakClick(reward)}>{<RiVolumeUpFill />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={handleDeleteClick("reward", reward)} >{<RiDeleteBinFill />}</button>
                    </div>
                </ListItemWrapper>
            </>
        )
    },

    Deduction({ deduction }) {
        // STATE
        const { state } = useSpiccatoState(mainManager, [mainManager.paths.isLocked])
        const [showEdit, setShowEdit] = useState(false);

        // EVENTS
        const handleRowClick = () => {
            mainManager.setters.adjustSelectedUserPoints(deduction.cost * -1)
        }
        return (
            <>
                {
                    showEdit
                    &&
                    <Modal closeButton onClose={() => { setShowEdit(false) }}>
                        <EditForm type={"deduction"} content={deduction} onClose={() => setShowEdit(false)} />
                    </Modal>
                }
                <ListItemWrapper className={"grid grid-cols-3"} onClick={handleRowClick}>
                    <div>{deduction.name}</div>
                    <div>-{deduction.cost}</div>
                    <div>
                        <button className={ICON_BUTTON_STYLE} disabled={!mainManager.state.speechSupported} onClick={handleSpeakClick(deduction)}>{<RiVolumeUpFill />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={handleDeleteClick("deduction", deduction)} >{<RiDeleteBinFill />}</button>
                    </div>
                </ListItemWrapper>
            </>
        )
    }

}

// RENDERERS
const renderListItems = (elType, elements) => {
    switch (elType) {
        case "task":
            return elements.map(el => <ElementTypes.Task key={el.id} task={el} />)
        case "timer":
            return elements.map(el => <ElementTypes.Timer key={el.id} timer={el} />)
        case "reward":
            return elements.map(el => <ElementTypes.Reward key={el.id} reward={el} />)
        case "deduction":
            return elements.map(el => <ElementTypes.Deduction key={el.id} deduction={el} />)
    }
}

//EFFECTS
const setListHeight = (containerRef, setHeight) => {
    useLayoutEffect(() => {
        const parentRect = containerRef.current?.parentElement?.parentElement?.getBoundingClientRect()
        const rect = containerRef.current?.getBoundingClientRect();
        if (!!parentRect && rect) {
            const parentHeight = parentRect.height;
            const topDiff = rect.top - parentRect.top;
            setHeight(parentHeight - topDiff)
        }
    }, [])
}

export default function ElementList({ elType, elements }) {
    const [height, setHeight] = useState(1)
    const containerRef = useRef(null)

    // EFFECTS
    setListHeight(containerRef, setHeight)
    return (
        <div ref={containerRef} className="p-2 bg-yellow-200 rounded-md overflow-y-auto" style={{ height }}>
            {renderListItems(elType, elements)}
        </div>
    )
}