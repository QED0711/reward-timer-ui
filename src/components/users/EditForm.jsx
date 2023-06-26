import { useState } from "react"
import { hmsToMs, msToDigital, msToHMS } from '../../utils/time'

// STYLES
const INPUT_STYLE = "form-input inline-block w-full m-2 p-1 rounded-sm bg-white text-gray-800 shadow-sm shadow-gray-800"

// EVENTS
const handleUpdate = (obj, key, setter, options = { isNum: false }) => e => {
    setter(() => {
        let val;
        if ("timeinput" in e.target.dataset) {
            const hms = {}
            const timeElements = [...document.querySelectorAll("[data-timeinput='true']")]
            timeElements.forEach(el => {
                hms[el.dataset.unit] = parseInt(el.value)
            })
            val = hmsToMs(hms);
        } else if (e.target.type === "number") {
            val = parseFloat(e.target.value)
        }

        return {
            ...obj,
            [key]: val 
        }
    })
}

// COMPONENTS
const FormLabel = ({ text, display = "block", className, children }) => {
    return (
        <label className={`${display} mx-1 ${className}`}>
            <sub className={`block relative top-2 mx-2 text-sm`}>{text}</sub>
            {children}
        </label>
    )
}

const FormType = {
    Task({ task }) {
        // STATE
        const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(task)))

        return (
            <>

                <FormLabel text={"name"}>
                    <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
                </FormLabel>
                <FormLabel text={"points"}>
                    <input className={INPUT_STYLE} type="number" step="5" value={cloned.amount} onChange={handleUpdate(cloned, "amount", setCloned)} />
                </FormLabel>
            </>
        )
    },

    Timer({ timer }) {
        // STATE
        const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(timer)))

        return (
            <>
                <FormLabel text="type">
                    {/* <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} /> */}
                    <select className={INPUT_STYLE + " cursor-pointer"} value={cloned.type} onChange={handleUpdate(cloned, "type", setCloned)}>
                        <option value="countdown">Countdown</option>
                        <option value="period">Period</option>
                    </select>
                </FormLabel>
                <FormLabel text="name">
                    <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
                </FormLabel>

                {
                    cloned.type === "countdown"
                    &&
                    <div className="grid grid-cols-3 gap-1">
                        <FormLabel text="hours" className={"w-16"}>
                            <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="hours" value={msToHMS(cloned.time).hours} onChange={handleUpdate(cloned, "time", setCloned)} />
                        </FormLabel>
                        <FormLabel text="minutes" className={"w-16"}>
                            <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="minutes" value={msToHMS(cloned.time).minutes} onChange={handleUpdate(cloned, "time", setCloned)} />
                        </FormLabel>
                        <FormLabel text="seconds" className={"w-16"}>
                            <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="seconds" value={msToHMS(cloned.time).seconds} onChange={handleUpdate(cloned, "time", setCloned)} />
                        </FormLabel>
                    </div>
                }
                {
                    cloned.type === "period"
                    &&
                    <>
                        <FormLabel text="start time">
                            <input className={INPUT_STYLE} type="time" value={msToDigital(cloned.start)} />
                        </FormLabel>
                        <FormLabel text="end time">
                            <input className={INPUT_STYLE} type="time" value={msToDigital(cloned.end)}/>
                        </FormLabel>
                    </>
                }
            </>
        )

    },

    Reward({ reward }) {
        // STATE
        const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(reward)))

        return (
            <>

                <FormLabel text={"name"}>
                    <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
                </FormLabel>
                <FormLabel text={"points"}>
                    <input className={INPUT_STYLE} type="number" step="5" value={cloned.cost} onChange={handleUpdate(cloned, "cost", setCloned)} />
                </FormLabel>
            </>
        )
    },

    Deduction({ deduction }) {
        // STATE
        const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(deduction)))

        return (
            <>
                <FormLabel text="name">
                    <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
                </FormLabel>
                <FormLabel text={"points"}>
                    <input className={INPUT_STYLE} type="number" step="5" value={cloned.cost} onChange={handleUpdate(cloned, "cost", setCloned)} />
                </FormLabel>
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

