const ListItemWrapper = ({ className, children }) => {

    return (
        <div className={`cursor-pointer hover:font-bold ${className}`}>
            {children}
        </div>
    )
}

const ElementTypes = {
    Task({ task }) {
        return (
            <ListItemWrapper className={"grid grid-cols-2"}>
                <div>{task.name}</div>
                <div>{task.amount}</div>
            </ListItemWrapper>
        )
    },

    Timer({ timer }) {
        return (
            <ListItemWrapper className={"grid grid-cols-3"}>
                <div>{timer.name}</div>
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
            </ListItemWrapper>
        )
    },

    Reward({ reward }) {
        return (
            <ListItemWrapper>
                {reward.name}
            </ListItemWrapper>
        )
    },

    Consequence({ consequence }) {
        return (
            <ListItemWrapper>
                {consequence.name}
            </ListItemWrapper>
        )
    }

}

// RENDERERS
const renderElements = (elType, elements) => {
    switch (elType) {
        case "task":
            return elements.map(el => <ElementTypes.Task key={el.id} task={el} />)
        case "timer":
            return elements.map(el => <ElementTypes.Timer key={el.id} timer={el} />)
        case "reward":
            return elements.map(el => <ElementTypes.Reward key={el.id} reward={el} />)
        case "consequence":
            return elements.map(el => <ElementTypes.Consequence key={el.id} consequence={el} />)
    }
}

export default function ElementList({ elType, elements }) {

    return (
        <div>
            {renderElements(elType, elements)}
        </div>
    )
}