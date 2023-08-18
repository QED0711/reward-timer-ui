import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

// ======================== STATE ========================
import mainManager from "../../state/main/mainManager";
import { useWindowSize } from "../../utils/hooks";

// ======================== COMPONENTS ========================
import Modal from "../layout/Modal";
import HistoryChart from "./HistoryChart";

// ======================== STYLES ========================
const GRID_STYLE = "grid grid-cols-5 gap-4";

export default function EventHistory({ setShowEventHistory }) {
    // STATE
    const [history, setHistory] = useState([]);
    const [formattedData, setFormattedData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const windowSize = useWindowSize();

    // RENDERERS
    const renderHistory = (history, formattedData) => {
        return history.map((event, i) => (
            <div
                key={event.id}
                className={GRID_STYLE + ` my-2 p-2 text-gray-800 shadow-sm shadow-gray-500 rounded-md cursor-pointer ${event.points > 0 ? "bg-green-500" : event.eventType === "Reward" ? "bg-yellow-400" : "bg-red-500"}`}
                onMouseEnter={() => {
                    setActiveIndex(history.length - 1 - i);
                }}
                onMouseLeave={() => {
                    setActiveIndex(null);
                }}
            >
                <div>{DateTime.fromMillis(event.time).toFormat(windowSize.width < 768 ? "MM/d HH:mm" : "LLL d - hh:mm a")}</div>
                <div className="truncate" title={event.eventType}>{event.eventType}</div>
                <div className="" title={event.eventName}>{event.eventName}</div>
                <div>
                    {" "}
                    {event.points > 0 && "+"}
                    {event.points}
                </div>
                <div>{formattedData[history.length - 1 - i]?.points}</div>
            </div>
        ));
    };

    // EFFECTS
    useEffect(() => {
        const exec = async () => {
            const events = await mainManager.restAPI.getUserHistory();
            setHistory(events);

            const selectedUser = mainManager.getters.getSelectedUser();
            let { points } = selectedUser;
            let data = Array.from({ length: events.length });

            for (let i = 0; i < events.length; i++) {
                data[events.length - 1 - i] = { name: events[i].time, points }; // flip the indeces so the chart reads left to right
                points -= events[i].points;
            }

            setFormattedData(data);
        };
        exec();
    }, []);

    return (
        <Modal
            closeButton
            onClose={() => {
                setShowEventHistory(false);
            }}
        >
            <div className="text-sm md:text-md text-gray-800 ">
                <h3 className="text-3xl">History</h3>
                <HistoryChart {...{ history, activeIndex, formattedData, setFormattedData }} />

                <div className={GRID_STYLE + " font-bold"}>
                    <div>Time</div>
                    <div>Type</div>
                    <div>Event</div>
                    <div>Change</div>
                    <div>Points</div>
                </div>
                <div className="max-h-[66%] h-[55vh] w-[75vw] md:w-[66vw] overflow-y-auto">{renderHistory(history, formattedData)}</div>
            </div>
        </Modal>
    );
}
