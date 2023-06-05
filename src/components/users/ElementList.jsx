import { useLayoutEffect, useRef, useState } from "react"

// =============================== STATE =============================== 
import mainManager from "../../state/main/mainManager"

// =============================== ICONS =============================== 
import { RiDeleteBinFill, RiEdit2Fill } from 'react-icons/ri'

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
        // EVENTS
        const handleRowClick = () => {
            mainManager.setters.adjustSelectedUserPoints(task.amount)
        }
        return (
            <ListItemWrapper className={"grid grid-cols-3"} onClick={handleRowClick}>
                <div>{task.name}</div>
                <div>+{task.amount}</div>
                <div>
                    <button className="mr-1">{<RiEdit2Fill className="" />}</button>
                    <button className="mr-1">{<RiDeleteBinFill className="" />}</button>
                </div>
            </ListItemWrapper>
        )
    },

    Timer({ timer }) {
        return (
            <ListItemWrapper className={"grid grid-cols-2 lg:grid-cols-4"}>
                <div>{timer.name}</div>
                <div>{timer.type}</div>
                <div>
                    {timer.type === "countdown" && timer.time}
                    {
                        timer.type === "period"
                        &&
                        <div>
                            {timer.start} - {timer.end}
                        </div>
                    }
                </div>
                <div>
                    {
                        timer.activatedAt !== null
                            ? <></>
                            : <button>Start Now</button>
                    }
                </div>
            </ListItemWrapper>
        )
    },

    Reward({ reward }) {
        // EVENTS
        const handleRowClick = () => {
            mainManager.setters.giveReward(reward)
        }
        return (
            <ListItemWrapper className={"grid grid-cols-2"} onClick={handleRowClick}>
                <div>{reward.name}</div>
                <div>{reward.cost}</div>
            </ListItemWrapper>
        )
    },

    Deduction({ deduction }) {
        // EVENTS
        const handleRowClick = () => {
            mainManager.setters.adjustSelectedUserPoints(deduction.cost * -1)
        }
        return (
            <ListItemWrapper className={"grid grid-cols-2"} onClick={handleRowClick}>
                <div>{deduction.name}</div>
                <div>-{deduction.cost}</div>
            </ListItemWrapper>
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