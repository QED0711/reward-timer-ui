import React, { useEffect, useState } from "react";
import { DateTime } from 'luxon';

// ======================== STATE ======================== 
import mainManager from "../../state/main/mainManager";

// ======================== COMPONENTS ======================== 
import Modal from "../layout/Modal";
import HistoryChart from "./HistoryChart";

// ======================== STYLES ======================== 
const GRID_STYLE = "grid grid-cols-4 gap-4"

export default function EventHistory({ setShowEventHistory }) {

    // STATE
    const [history, setHistory] = useState([])
    const [activeIndex, setActiveIndex] = useState(null);

    // RENDERERS
    const renderHistory = (history) => {
        return history.map((event, i) => (
                <div 
                    key={event.id} 
                    className={GRID_STYLE + ` my-2 p-2 text-gray-800 shadow-sm shadow-gray-500 rounded-md cursor-pointer ${event.points > 0 ? "bg-green-500" : event.eventType === "Reward" ? "bg-yellow-400" : "bg-red-500"}`}
                    onMouseEnter={() => {setActiveIndex(history.length - 1 - i)}}
                    onMouseLeave={() => {setActiveIndex(null)}}
                >
                    <div>{DateTime.fromMillis(event.time).toFormat("LLL d - hh:mm a")}</div>
                    <div>{event.eventType}</div>
                    <div>{event.eventName}</div>
                    <div>{event.points}</div>
                </div>
        ))
    }

    // EFFECTS
    useEffect(() => {
        const exec = async () => {
            const events = await mainManager.restAPI.getUserHistory()
            setHistory(events);
        }
        exec();
    }, [])

    return (
        <Modal closeButton onClose={() => { setShowEventHistory(false) }}>
            <div className="text-gray-800">
                <h3 className="text-3xl">History</h3>
                <HistoryChart {...{ history, activeIndex, setActiveIndex }} />

                <div className={GRID_STYLE + " font-bold"}>
                    <div>Time</div>
                    <div>Type</div>
                    <div>Event</div>
                    <div>Points</div>
                </div>
                <div className="h-[66vh] w-[75vw] md:w-[66vw] overflow-y-auto">
                    {renderHistory(history)}
                </div>
            </div>
        </Modal>
    )
}