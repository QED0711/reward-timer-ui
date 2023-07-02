import { useLayoutEffect, useRef, useState } from "react"

// =============================== STATE =============================== 
import mainManager from "../../state/main/mainManager"

// =============================== ICONS =============================== 
import { RiDeleteBinFill, RiEdit2Fill, RiVolumeUpFill, RiPlayFill, RiStopFill, RiFullscreenLine } from 'react-icons/ri'

// =============================== UTILS =============================== 
import { msToDigital } from "../../utils/time"
import Modal from "../layout/Modal"
import EditForm from "./EditForm"
import { useSpiccatoState } from "spiccato-react"

// STYLES
const ICON_BUTTON_STYLE = "mr-1 disabled:opacity-60 disabled:cursor-not-allowed"

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
        const {state} = useSpiccatoState(mainManager, [mainManager.paths.isLocked])
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
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={handleDeleteClick("task", task)} >{<RiDeleteBinFill  />}</button>
                    </div>
                </ListItemWrapper>
            </>
        )
    },

    Timer({ timer }) {

        // STATE
        const {state} = useSpiccatoState(mainManager, [mainManager.paths.isLocked, mainManager.paths.serverTimezone])
        const [isActive, setIsActive] = useState(false);
        const [showEdit, setShowEdit] = useState(false);

        // EVENTS
        const handleStartCountdownClick = e => {
            e.preventDefault();
            mainManager.restAPI.startCountdown(timer.id);
        }

        return (
            <>
                {
                    showEdit
                    &&
                    <Modal closeButton onClose={() => { setShowEdit(false) }}>
                        <EditForm type={"timer"} content={timer} onClose={() => setShowEdit(false)}/>
                    </Modal>
                }

                <ListItemWrapper className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"}>
                    <div>{timer.name}</div>
                    <div className="p-1 bg-gray-100 rounded-sm">
                        {timer.type === "countdown" && msToDigital(timer.time)}
                        {
                            timer.type === "period"
                            &&
                            <div className="relative pt-3">
                                <sub className="absolute top-1 font-sm italic">{state.serverTimezone.replace(/_/g, " ")}</sub>
                                <span className="font-bold">start:</span> {msToDigital(timer.start, 12)}
                                <br/>
                                <span className="font-bold">end:</span> {msToDigital(timer.end, 12)}
                            </div>
                        }
                    </div>
                    <div className="row-span-1 md:row-span-2">
                        <button className={ICON_BUTTON_STYLE} disabled={!isActive} title="start timer" >{<RiFullscreenLine />}</button>
                        {
                            timer.type === "countdown" 
                            && 
                            <button 
                                className={ICON_BUTTON_STYLE} 
                                disabled={state.isLocked} 
                                title="start timer" 
                                onClick={handleStartCountdownClick}
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
        const {state} = useSpiccatoState(mainManager, [mainManager.paths.isLocked])
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
                        <EditForm type={"reward"} content={reward} onClose={() => setShowEdit(false)}/>
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
        const {state} = useSpiccatoState(mainManager, [mainManager.paths.isLocked])
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
                        <EditForm type={"deduction"} content={deduction} onClose={() => setShowEdit(false)}/>
                    </Modal>
                }
                <ListItemWrapper className={"grid grid-cols-3"} onClick={handleRowClick}>
                    <div>{deduction.name}</div>
                    <div>-{deduction.cost}</div>
                    <div>
                        <button className={ICON_BUTTON_STYLE} disabled={!mainManager.state.speechSupported} onClick={handleSpeakClick(deduction)}>{<RiVolumeUpFill />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className={ICON_BUTTON_STYLE} disabled={state.isLocked} onClick={handleDeleteClick("deduction", deduction)} >{<RiDeleteBinFill  />}</button>
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