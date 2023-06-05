import { useLayoutEffect, useRef, useState } from "react"

// ======================================================================================
const ListItemWrapper = ({ className, children }) => {
    return (
        <div className={`my-1 p-1 border-b-2 border-b-yellow-500 cursor-pointer hover:font-bold ${className}`}>
            {children}
        </div>
    )
}

// ======================================================================================
const ElementTypes = {
    Task({ task }) {
        return (
            <ListItemWrapper className={"grid grid-cols-2"}>
                <div>{task.name}</div>
                <div>+{task.amount}</div>
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
        return (
            <ListItemWrapper className={"grid grid-cols-2"}>
                <div>{reward.name}</div>
                <div>{reward.cost}</div>
            </ListItemWrapper>
        )
    },
    
    Consequence({ consequence }) {
        return (
            <ListItemWrapper className={"grid grid-cols-2"}>
                <div>{consequence.name}</div>
                <div>-{consequence.cost}</div>
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
            return elements.map(el => <ElementTypes.Consequence key={el.id} consequence={el} />)
    }
}

//EFFECTS
const setListHeight = (containerRef, setHeight) => {
    useLayoutEffect(() => {
        const parentRect = containerRef.current?.parentElement?.parentElement?.getBoundingClientRect()
        const rect = containerRef.current?.getBoundingClientRect();
        if(!!parentRect && rect) {
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
        <div ref={containerRef} className="p-2 bg-yellow-200 rounded-md overflow-y-auto" style={{height}}> 
            {renderListItems(elType, elements)}
        </div>
    )
}