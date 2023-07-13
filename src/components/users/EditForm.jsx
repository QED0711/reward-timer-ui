import { useState } from "react"

// ============================ STATE ============================ 
import mainManager from "../../state/main/mainManager"

// ============================ UTILITIES ============================ 
import { digitalToMs, hmsToMs, msToDigital, msToHMS } from '../../utils/time'

// STYLES
const INPUT_STYLE = "form-input inline-block w-full m-2 p-1 rounded-sm bg-white text-gray-800 shadow-sm shadow-gray-800 resize-none"

// EVENTS
const handleUpdate = (obj, key, setter, options = { isNum: false }) => e => {
    setter(() => {
        let val;
        switch (true) {
            case "timeinput" in e.target.dataset:
                const hms = {}
                const timeElements = [...document.querySelectorAll("[data-timeinput='true']")]
                timeElements.forEach(el => {
                    hms[el.dataset.unit] = parseInt(el.value)
                })
                val = hmsToMs(hms);
                break;
            case (e.target.type === "number"):
                val = parseFloat(e.target.value)
                break;
            case e.target.type === "time":
                val = digitalToMs(e.target.value)
                break;
            default:
                val = e.target.value
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
    Task({ cloned, setCloned }) {

        return (
            <>

                <FormLabel text={"Name"}>
                    <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
                </FormLabel>
                <FormLabel text={"Points"}>
                    <input className={INPUT_STYLE} type="number" step="5" value={cloned.amount} onChange={handleUpdate(cloned, "amount", setCloned)} />
                </FormLabel>
            </>
        )
    },

    Timer({ cloned, setCloned }) {

        return (
            <>
                <FormLabel text="Type">
                    {/* <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} /> */}
                    <select className={INPUT_STYLE + " cursor-pointer"} value={cloned.type} onChange={handleUpdate(cloned, "type", setCloned)}>
                        <option value="countdown">Countdown</option>
                        <option value="period">Period</option>
                    </select>
                </FormLabel>
                <FormLabel text="Name">
                    <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
                </FormLabel>

                {
                    cloned.type === "countdown"
                    &&
                    <div className="grid grid-cols-3 gap-1">
                        <FormLabel text="Hours" className={"w-16"}>
                            <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="hours" value={msToHMS(cloned.time)?.hours ?? 0} onChange={handleUpdate(cloned, "time", setCloned)} />
                        </FormLabel>
                        <FormLabel text="Minutes" className={"w-16"}>
                            <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="minutes" value={msToHMS(cloned.time)?.minutes ?? 0} onChange={handleUpdate(cloned, "time", setCloned)} />
                        </FormLabel>
                        <FormLabel text="Seconds" className={"w-16"}>
                            <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="seconds" value={msToHMS(cloned.time)?.seconds ?? 0} onChange={handleUpdate(cloned, "time", setCloned)} />
                        </FormLabel>
                    </div>
                }
                {
                    cloned.type === "period"
                    &&
                    <>
                        <FormLabel text="Start Time">
                            <input className={INPUT_STYLE} type="time" value={msToDigital(cloned.start)} step="1" onChange={handleUpdate(cloned, "start", setCloned)} />
                        </FormLabel>
                        <FormLabel text="End Time">
                            <input className={INPUT_STYLE} type="time" value={msToDigital(cloned.end)} step="1" onChange={handleUpdate(cloned, "end", setCloned)} />
                        </FormLabel>
                    </>
                }
            </>
        )

    },

    Reward({ cloned, setCloned }) {

        return (
            <>

                <FormLabel text={"Name"}>
                    <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
                </FormLabel>
                <FormLabel text={"Cost"}>
                    <input className={INPUT_STYLE} type="number" step="5" value={cloned.cost} onChange={handleUpdate(cloned, "cost", setCloned)} />
                </FormLabel>
            </>
        )
    },

    Deduction({ cloned, setCloned }) {

        return (
            <>
                <FormLabel text="Name">
                    <input className={INPUT_STYLE} type="text" value={cloned.name} onChange={handleUpdate(cloned, "name", setCloned)} />
                </FormLabel>
                <FormLabel text={"Points"}>
                    <input className={INPUT_STYLE} type="number" step="5" value={cloned.cost} onChange={handleUpdate(cloned, "cost", setCloned)} />
                </FormLabel>
            </>
        )
    },
}

// RENDERERS
const renderEditType = (type, cloned, setCloned) => {
    switch (type) {
        case "task":
            return <FormType.Task {...{ cloned, setCloned }} />
        case "timer":
            return <FormType.Timer {...{ cloned, setCloned }} />
        case "reward":
            return <FormType.Reward {...{ cloned, setCloned }} />
        case "deduction":
            return <FormType.Deduction {...{ cloned, setCloned }} />
    }
}
export default function EditForm({ type, content, onClose }) {

    const [cloned, setCloned] = useState(() => JSON.parse(JSON.stringify(content)))

    // EVENTS
    const handleSubmit = e => {
        e.preventDefault();
        console.log(cloned);
        mainManager.setters.updateEntity(type, cloned);
        onClose();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-center text-2xl text-gray-800 font-bold capitalize">Edit {type}</h2>
            {renderEditType(type, cloned, setCloned)}

            <FormLabel text={"Description (optional)"}>
                <textarea className={INPUT_STYLE + " h-32"} value={cloned.description} onChange={handleUpdate(cloned, "description", setCloned)} ></textarea>
            </FormLabel>
            <input className="block w-full mx-auto mt-4 bg-yellow-300 text-indigo-700 shadow-sm shadow-gray-800 cursor-pointer" type="submit" value="Save" />
        </form>
    )
}

