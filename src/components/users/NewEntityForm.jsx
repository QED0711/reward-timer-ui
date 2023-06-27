// =============================== MODULES =============================== 
import { useState } from "react";
import { nanoid } from "nanoid";

// =============================== STATE =============================== 
import mainManager from "../../state/main/mainManager";

// =============================== COMPONENTS =============================== 
import Modal from "../layout/Modal";

// =============================== UTILITIES =============================== 
import { digitalToMs, hmsToMs } from "../../utils/time";

// =============================== STYLES =============================== 
const INPUT_STYLE = "form-input inline-block w-full m-2 p-1 rounded-sm bg-white shadow-sm shadow-gray-800"

// =============================== SUB-COMPONENTS =============================== 
const Forms = {
    Task() {
        return (
            <label >
                <sub className="block relative top-2 mx-2 text-sm">Points</sub>
                <input className={INPUT_STYLE} type="number" min="1" data-field="amount" data-type="number" required />
            </label>
        )
    },
    Timer() {
        const [timerType, setTimerType] = useState("countdown")
        return (
            <div>
                <label>
                    <sub className="block relative top-2 mx-2 text-sm">Timer Type</sub>
                    <select className={INPUT_STYLE + " cursor-pointer"} data-field="type" value={timerType} onChange={e => setTimerType(e.target.value)} required >
                        <option value="countdown">Countdown</option>
                        <option value="period">Period</option>
                    </select>
                </label>
                <br />
                {
                    timerType === "period"
                        ? (
                            <>
                                <label>
                                    <sub className="block relative top-2 mx-2 text-sm">Start Time</sub>
                                    <input className={INPUT_STYLE} type="time" data-field="start" step="1" required />
                                </label>
                                <label >
                                    <sub className="block relative top-2 mx-2 text-sm">End Time</sub>
                                    <input className={INPUT_STYLE} type="time" data-field="end" step="1" required />
                                </label>
                            </>
                        )
                        : (
                            <div className="grid grid-cols-3">
                                <label className="w-16">
                                    <sub className="block relative top-2 mx-2 text-sm">Hours</sub>
                                    <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="hours" data-field="time" required />
                                </label>
                                <label className="w-16">
                                    <sub className="block relative top-2 mx-2 text-sm">Minutes</sub>
                                    <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="minutes" required />
                                </label>
                                <label className="w-16">
                                    <sub className="block relative top-2 mx-2 text-sm">Seconds</sub>
                                    <input className={INPUT_STYLE} type="number" data-timeinput={true} data-unit="seconds" required />
                                </label>
                                
                            </div>
                            // <label className="inline-block w-full">
                            //     <sub className="block relative top-2 mx-2 text-sm">Duration</sub>
                            //     <input className={INPUT_STYLE} type="time" data-field="time" required />
                            // </label>
                        )
                }
                {/* <input className={INPUT_STYLE} type="number" min="1" data-field="points" data-type="number" placeholder="points" /> */}
            </div>
        )
    },
    Reward() {
        return (
            <label>
                <sub className="block relative top-2 mx-2 text-sm">Cost</sub>
                <input className={INPUT_STYLE} type="number" min="1" data-field="cost" data-type="number" required />
            </label>
        )
    },
    Deduction() {
        return (
            <label>
                <sub className="block relative top-2 mx-2 text-sm">Cost</sub>
                <input className={INPUT_STYLE} type="number" min="1" data-field="cost" data-type="number" required />
            </label>
        )
    },
}

// RENDERERS
const renderFormContents = (type) => {
    switch (type) {
        case "task":
            return <Forms.Task />
        case "timer":
            return <Forms.Timer />
        case "reward":
            return <Forms.Reward />
        case "deduction":
            return <Forms.Deduction />
    }
}

export default function NewEntityForm({ type, setSelectedSection }) {

    // EVENTS
    const handleSubmit = e => {
        e.preventDefault()
        const inputs = [...document.querySelectorAll(".form-input")]
        const newEntity = {}
        let field;
        for (let input of inputs) {
            field = input.dataset?.field;
            if (!field) continue;
            switch (true) {
                case input.type === "time":
                    newEntity[field] = digitalToMs(input.value)
                    break;
                case "timeinput" in input.dataset:
                    const hms = {}
                    const timeElements = document.querySelectorAll("[data-timeinput='true']")
                    timeElements.forEach(el => {hms[el.dataset.unit] = parseInt(el.value)});
                    newEntity[field] = hmsToMs(hms);
                    break;
                case input.type === "number":
                    newEntity[field] = parseFloat(input.value)
                    break;
                default:
                    newEntity[field] = input.value;
            }
            // newEntity[input.dataset?.field] = input.type === "number" ? parseFloat(input.value) : input.value
        }
        newEntity.id = nanoid();
        console.log(newEntity)
        mainManager.setters.appendEntity(type, newEntity)
    }

    return (
        <Modal
            closeButton
            onClose={() => { setSelectedSection(null) }}
            containerStyle="bg-indigo-100"
        >
            <form onSubmit={handleSubmit}>
                <h2 className="text-center text-2xl font-bold capitalize">New {type}</h2>
                <label>
                    <sub className="block relative top-2 mx-2 text-sm">Name</sub>
                    <input className={INPUT_STYLE} type="text" data-field="name" autoFocus required />
                </label>
                {renderFormContents(type)}

                <input className="block w-full mx-auto mt-4 bg-yellow-300 text-indigo-700 shadow-sm shadow-gray-800 cursor-pointer" type="submit" value="Create" />
            </form>
        </Modal>
    )
}