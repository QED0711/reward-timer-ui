import { useEffect, useState } from "react"
import { CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useSpiccatoState } from "spiccato-react"
import mainManager from "../../state/main/mainManager"


const HoveredDot = ({active, payload}) => {
    if(active && payload && payload.length) {
        console.log({payload})
        const val = payload[0].value;
        return (
            <div className={val > 0 ? "text-green-600" : "text-red-600"}>
                {val}
            </div>
        )
    }
    return null;
}

export default function HistoryChart({ history }) {
    const [formattedData, setFormattedData] = useState([{ name: "test", points: 10 }, { name: "test2", points: 20 }])

    useEffect(() => {
        const selectedUser = mainManager.getters.getSelectedUser();
        let { points } = selectedUser;
        let data = Array.from({length: history.length});
        // TODO: need to flip the data from its original order
        for(let i = history.length - 1; i >= 0; i--) {
            points -= history[i].points;
            data[i] = {name: history[i].time, points};
        }

        setFormattedData(data);

    }, [history])

    return (
        <div className="w-full h-[150px] pt-4 rounded-md bg-indigo-100" >
            <ResponsiveContainer height="100%" width="98%" >
                <LineChart
                    data={formattedData}
                    height={100}
                >
                    <CartesianGrid strokeDasharray={[3,3]} fill="#fde047" />
                    <Line dataKey="points" stroke="#6366f1" type={"monotone"} dot={false} activeDot={{r: 4}} />
                    <XAxis tick={<></>}>
                        <Label value="Last 30 Days" />
                    </XAxis>
                    <YAxis >
                        <Label value="Points" angle={-90} position={"left"} offset={-15} />
                    </YAxis>
                    <Tooltip content={<HoveredDot/>} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}