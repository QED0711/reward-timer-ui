import { useEffect, useState } from "react";
import { CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import mainManager from "../../state/main/mainManager";

const ActiveDot = (props) => {
    const { cx, cy, stroke, index: dataIndex, value, activeIndex } = props;
    return dataIndex === activeIndex ? (
        <svg x={cx - 10} y={cy - 30} width={20} height={40}>
            <text x={10} y={15} textAnchor="middle" fill={value > 0 ? "#16a34a" : "#dc2626"}>
                {value}
            </text>
            <circle cx={10} cy={30} r={4} stroke={"white"} strokeWidth={2} fill={stroke} />
        </svg>
    ) : (
        <></>
    );
};

const HoveredDotLabel = (props) => {
    const { active, payload, label: dataIndex, activeIndex } = props;
    if (active && payload && payload.length) {
        const val = payload[0].value;
        return <div className={val > 0 ? "text-green-600" : "text-red-600"}>{val}</div>;
    }
    return null;
};

export default function HistoryChart({ history, activeIndex, formattedData, setFormattedData }) {
    // const [formattedData, setFormattedData] = useState([]);

    // EFFECTS
    useEffect(() => {
        // const selectedUser = mainManager.getters.getSelectedUser();
        // let { points } = selectedUser;
        // let data = Array.from({ length: history.length });

        // for (let i = 0; i < history.length; i++) {
        //     points -= history[i].points;
        //     data[history.length - 1 - i] = { name: history[i].time, points }; // flip the indeces so the chart reads left to right
        // }

        // setFormattedData(data);
    }, [history]);

    return (
        <div className="w-full h-[150px] pt-4 rounded-md bg-indigo-100">
            <ResponsiveContainer height="100%" width="98%">
                <LineChart data={formattedData} height={100}>
                    <CartesianGrid strokeDasharray={[3, 3]} fill="#fde047" />
                    <Line
                        dataKey="points"
                        stroke="#6366f1"
                        type={"monotone"}
                        dot={<ActiveDot {...{ activeIndex }} />}
                        // dot={false}
                        // activeDot={activeIndex !== null ? { r: 4 } : {r: 0}}
                        // activeDot={ }
                    />
                    <XAxis tick={<></>}>
                        <Label value="Last 30 Days" />
                    </XAxis>
                    <YAxis>
                        <Label value="Points" angle={-90} position={"left"} offset={-15} />
                    </YAxis>
                    <Tooltip content={<HoveredDotLabel {...{ activeIndex }} />} isAnimationActive={false} active={true} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
