// =============================== COMPONENTS =============================== 
import { useState } from "react";
import Modal from "../layout/Modal";

// =============================== STYLES =============================== 
const LABEL_STYLE = "text-black"
const INPUT_STYLE = "form-input inline-block w-full m-2 p-1 rounded-sm bg-white shadow-sm shadow-gray-800"
// =============================== SUB-COMPONENTS =============================== 
const Forms = {
    Task() {
        return (
            <label >
                <sub className="block relative top-2 mx-2 text-sm">Points</sub>
                <input className={INPUT_STYLE} type="number" min="1" data-field="points" data-type="number" required />
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
                                    <input className={INPUT_STYLE} type="time" required  />
                                </label>
                                <label >
                                    <sub className="block relative top-2 mx-2 text-sm">End Time</sub>
                                    <input className={INPUT_STYLE} type="time" required  />
                                </label>
                            </>
                        )
                        : (
                            <label className="inline-block w-full">
                                <sub className="block relative top-2 mx-2 text-sm">Duration</sub>
                                <input className={INPUT_STYLE} type="time" required  />
                            </label>
                        )
                }
                {/* <input className={INPUT_STYLE} type="number" min="1" data-field="points" data-type="number" placeholder="points" /> */}
            </div>
        )
    },
    Reward() {
        return (
            <label>
                <sub className="block relative top-2 mx-2 text-sm">Points</sub>
                <input className={INPUT_STYLE} type="number" min="1" data-field="points" data-type="number" required  />
            </label>
        )
    },
    Deduction() {
        return (
            <label>
                <sub className="block relative top-2 mx-2 text-sm">Points</sub>
                <input className={INPUT_STYLE} type="number" min="1" data-field="points" data-type="number" required />
            </label>
        )
    },
}

// EVENTS
const handleSubmit = e => {
    e.preventDefault()
    const inputs = [...document.querySelectorAll(".form-input")]
    const newItem = {}
    for (let input of inputs){
        newItem[input.dataset?.field] = input.type === "number" ? parseFloat(input.value) : input.value
    }
    console.log(newItem)

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