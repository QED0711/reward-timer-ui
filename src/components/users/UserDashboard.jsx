import { useEffect, useLayoutEffect, useRef, useState } from "react"

// ============================ STATE ============================ 
import { useSpiccatoState } from "spiccato-react"
import mainManager from "../../state/main/mainManager"

// ============================ COMPONENTS ============================ 
import ElementList from "./ElementList"

// EFFECTS
const resizeBodyContainer = (bodyRef, setBodyHeight) => {
    useLayoutEffect(() => {
        const bodyRect = bodyRef.current?.getBoundingClientRect();
        if (!!bodyRect) {
            setBodyHeight(window.innerHeight - bodyRect.top - 32)
        }
    }, [])
}

// SUB-COMPONENTS
const DashboardSection = ({ heading, onClick, children, className }) => {
    return (
        <section className={`h-full bg-yellow-50 rounded-md shadow-sm hover:shadow-lg shadow-indigo-800 hover:shadow-indigo-900 cursor-pointer ${className}`}>
            <h2 className="text-center text-2xl font-bold bg-yellow-300 rounded-tl-md rounded-tr-md">{heading}</h2>
            <div className="w-full p-2">
                {children}
            </div>
        </section>
    )
}

export default function UserDashboard() {

    // STATE
    const { state } = useSpiccatoState(mainManager, ["selectedUser"])
    const [bodyHeight, setBodyHeight] = useState(window.innerHeight);
    const bodyRef = useRef(null)

    // EFFECTS
    resizeBodyContainer(bodyRef, setBodyHeight);

    return (
        <div
            className="w-11/12  mx-auto mt-4 p-4 bg-indigo-300 rounded-lg shadow-lg shadow-indigo-900"
            style={{ height: "calc(100vh - 2rem)" }}
        >
            <h1 className="text-3xl">{state.selectedUser.name}</h1>
            <div ref={bodyRef} className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: `calc(${bodyHeight}px - 0.25rem)` }}>
                <DashboardSection heading="Points" className={"col-span-2"}>
                    <h1 className="absolute w-full translate-y-[50%] text-5xl text-center">
                        {state.selectedUser.points}
                    </h1>
                </DashboardSection>

                <DashboardSection heading="Tasks">
                    <ElementList elType={"task"} elements={state.selectedUser.tasks} />
                </DashboardSection>

                <DashboardSection heading="Timers">
                    <ElementList elType={"timer"} elements={state.selectedUser.timers} />
                </DashboardSection>

                <DashboardSection heading="Rewards">
                    <ElementList elType={"reward"} elements={state.selectedUser.rewards} />
                </DashboardSection>

                <DashboardSection heading="Consequences">
                    <ElementList elType={"consequence"} elements={state.selectedUser.consequences} />
                </DashboardSection>
            </div>
        </div>
    )
}