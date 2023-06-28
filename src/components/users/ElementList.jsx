import { useLayoutEffect, useRef, useState } from "react"

// =============================== STATE =============================== 
import mainManager from "../../state/main/mainManager"

// =============================== ICONS =============================== 
import { RiDeleteBinFill, RiEdit2Fill, RiVolumeUpFill, RiPlayFill } from 'react-icons/ri'

// =============================== UTILS =============================== 
import { msToDigital } from "../../utils/time"
import Modal from "../layout/Modal"
import EditForm from "./EditForm"

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
                        <button className="mr-1" >{<RiVolumeUpFill />}</button>
                        <button className="mr-1" onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className="mr-1" >{<RiDeleteBinFill />}</button>
                    </div>
                </ListItemWrapper>
            </>
        )
    },

    Timer({ timer }) {

        // STATE
        const [showEdit, setShowEdit] = useState(false);

        return (
            <>
                {
                    showEdit
                    &&
                    <Modal closeButton onClose={() => { setShowEdit(false) }}>
                        <EditForm type={"timer"} content={timer} onClose={() => setShowEdit(false)}/>
                    </Modal>
                }

                <ListItemWrapper className={"grid grid-cols-3 lg:grid-cols-3 gap-2"}>
                    <div>{timer.name}</div>
                    <div className="p-1 bg-gray-100 rounded-sm">
                        {timer.type === "countdown" && msToDigital(timer.time)}
                        {
                            timer.type === "period"
                            &&
                            <div>
                                <span className="font-bold">start:</span> {msToDigital(timer.start, 12)}
                                <br/>
                                <span className="font-bold">end:</span> {msToDigital(timer.end, 12)}
                            </div>
                        }
                    </div>
                    <div>
                        <button className="mr-1" title="start timer">{<RiPlayFill />}</button>
                        <button className="mr-1" onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className="mr-1" >{<RiDeleteBinFill />}</button>
                    </div>
                </ListItemWrapper>
            </>
        )
    },

    Reward({ reward }) {

        // STATE
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
                        <button className="mr-1" >{<RiVolumeUpFill />}</button>
                        <button className="mr-1" onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className="mr-1" >{<RiDeleteBinFill />}</button>
                    </div>
                </ListItemWrapper>
            </>
        )
    },

    Deduction({ deduction }) {
        // STATE
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
                        <button className="mr-1" >{<RiVolumeUpFill />}</button>
                        <button className="mr-1" onClick={e => { e.stopPropagation(); setShowEdit(true) }}>{<RiEdit2Fill className="" />}</button>
                        <button className="mr-1" >{<RiDeleteBinFill />}</button>
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