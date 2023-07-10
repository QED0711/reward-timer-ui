import React, { useEffect, useState } from "react";
import { DateTime } from 'luxon';

// ======================== STATE ======================== 
import mainManager from "../../state/main/mainManager";

// ======================== COMPONENTS ======================== 
import Modal from "../layout/Modal";

// ======================== STYLES ======================== 
const GRID_STYLE = "grid grid-cols-4 gap-4"


// RENDERERS
const renderHistory = history => {
    return history.map(event => (
        <React.Fragment key={event.key}>
            <div className={GRID_STYLE + ` ${event.points > 0 ? "text-green-500" : "text-red-500"}`}>
                <div>{DateTime.fromMillis(event.time).toFormat("LLL d, yyyy - hh:mm a")}</div>
                <div>{event.eventType}</div>
                <div>{event.eventName}</div>
                <div>{event.points}</div>
            </div>
        </React.Fragment>
    ))
}

export default function EventHistory({ setShowEventHistory }) {

    // STATE
    const [history, setHistory] = useState([])


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