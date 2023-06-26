import { useState } from "react"

// EVENTS
const handleUpdate = (obj, key, setter) => e => {
    setter(() => {
        const val = e.target.value; // TODO: need to parser numbers, booleans, etc. here
        return {
            ...obj,
            [key]: e.target.value
        }
    })
}

const FormType = {
    Task({ task }) {
        // STATE
        const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(task)))

        return (
            <>
                <input type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
            </>
        )
    },
    Timer({ timer }) {
        // STATE
        const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(timer)))

        return (
            <>
                <input type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
            </>
        )
    },
    Reward({ reward }) {
        // STATE
        const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(reward)))

        return (
            <>
                <input type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
            </>
        )
    },
    Deduction({ deduction }) {
        // STATE
        const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(deduction)))

        return (
            <>
                <input type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
            </>
        )
    },
}

// RENDERERS
const renderEditType = (type, content) => {
    switch (type) {
        case "task":
            return <FormType.Task task={content} />
        case "timer":
            return <FormType.Timer timer={content} />
        case "reward":
            return <FormType.Reward reward={content} />
        case "deduction":
            return <FormType.Deduction deduction={content} />
    }
}
export default function EditForm({ type, content }) {
    return (
        <form>
            <h2 className="text-center text-2xl font-bold capitalize">Edit {type}</h2>
            {renderEditType(type, content)}
            <input className="block w-full mx-auto mt-4 bg-yellow-300 text-indigo-700 shadow-sm shadow-gray-800 cursor-pointer" type="submit" value="Save" />
        </form>
    )
}

