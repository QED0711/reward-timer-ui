import { useEffect, useLayoutEffect, useRef, useState } from "react"

// ============================ STATE ============================ 
import { useSpiccatoState } from "spiccato-react"
import mainManager from "../../state/main/mainManager"

// ============================ COMPONENTS ============================ 
import ElementList from "./ElementList"
import SelectedSection from "./SelectedSection"

// EVENTS 
const handleSectionClick = (section, setSelectedSection) => () => {
    setSelectedSection(section);
}

const adjustPoints = (amount) => () => {
    mainManager.setters.adjustSelectedUserPoints(amount)
}


// EFFECTS
const resizeBodyContainer = (bodyRef, setBodyHeight) => {
    useLayoutEffect(() => {
        const bodyRect = bodyRef.current?.getBoundingClientRect();
        if (!!bodyRect) {
            setBodyHeight(window.innerHeight - bodyRect.top - 32)
        }
    }, [])
}

const resetSelectedSection = (setSelectedSection, selectedUser) => {
    useEffect(() => {
        setSelectedSection(null);
    }, [selectedUser])
}

// SUB-COMPONENTS
const DashboardNavButton = ({ title, onClick }) => {
    return (
        <button
            className="relative bottom-1 py-0 px-1 rounded-sm"
            onClick={onClick}
        >
            {title}
        </button>
    )
}

const DashboardSection = ({ heading, onClick, children, className }) => {
    return (
        <section className={`h-full bg-yellow-50 rounded-md shadow-sm hover:shadow-lg shadow-indigo-800 hover:shadow-indigo-900 ${className}`}>
            <h2
                className="text-center text-2xl font-bold bg-yellow-300 cursor-pointer rounded-tl-md rounded-tr-md hover:drop-shadow-lg"
                onClick={onClick}
            >
                {heading}
            </h2>
            <div className="w-full p-2">
                {children}
            </div>
        </section>
    )
}

export default function UserDashboard() {

    // STATE
    const { state } = useSpiccatoState(mainManager, ["selectedUser"])
    const [selectedSection, setSelectedSection] = useState(null);
    const [bodyHeight, setBodyHeight] = useState(window.innerHeight);
    const bodyRef = useRef(null)

    // EFFECTS
    resizeBodyContainer(bodyRef, setBodyHeight);
    resetSelectedSection(setSelectedSection, state.selectedUser);

    return (
        <div
            className="w-11/12  mx-auto mt-4 p-4 bg-indigo-300 rounded-lg shadow-lg shadow-indigo-900 overflow-hidden"
            style={{ height: "calc(100vh - 2rem)" }}
        >

            <h1 className="inline-block mr-4 text-3xl">{state.selectedUser.name}</h1>

            {selectedSection && <DashboardNavButton title={"Dashboard"} onClick={() => { setSelectedSection(null) }} />}

            <div ref={bodyRef} className="grid grid-cols-2 grid-rows-[9] md:grid-rows-12 gap-4 overflow-y-auto" style={{ height: `calc(${bodyHeight}px - 0.25rem)` }}>
                
                <DashboardSection heading="Points" className={"col-span-2 row-span-2 md:row-span-2"}>
                    <h1 className="g:text-5xl text-2xl text-center drop-shadow-md" style={{ color: state.selectedUser.points > 0 ? "#22c55e" : "#ef4444" }}>
                        <button className="py-0 px-1 mx-8 text-red-500" onClick={adjustPoints(-5)}>-5</button>
                        {state.selectedUser.points}
                        <button className="py-0 px-1 mx-8 text-green-500" onClick={adjustPoints(5)}>+5</button>
                    </h1>
                </DashboardSection>

                {
                    !selectedSection
                        ? (
                            <>
                                <DashboardSection 
                                    heading="Tasks" 
                                    onClick={handleSectionClick("tasks", setSelectedSection)}
                                    className="row-span-2 md:row-span-5 col-span-2"
                                >
                                    <ElementList elType={"task"} elements={state.selectedUser.tasks} />
                                </DashboardSection>

                                <DashboardSection 
                                    heading="Timers" 
                                    onClick={handleSectionClick("timers", setSelectedSection)}
                                    className="row-span-2 md:row-span-5 col-span-2"
                                >
                                    <ElementList elType={"timer"} elements={state.selectedUser.timers} />
                                </DashboardSection>

                                <DashboardSection 
                                    heading="Rewards" 
                                    onClick={handleSectionClick("rewards", setSelectedSection)}
                                    className="row-span-2 md:row-span-5 col-span-2"
                                >
                                    <ElementList elType={"reward"} elements={state.selectedUser.rewards} />
                                </DashboardSection>

                                <DashboardSection 
                                    heading="Deductions" 
                                    onClick={handleSectionClick("deductions", setSelectedSection)}
                                    className="row-span-2 md:row-span-5 col-span-2"
                                >
                                    <ElementList elType={"deduction"} elements={state.selectedUser.deductions} />
                                </DashboardSection>
                            </>
                        )
                        : (
                            <SelectedSection section={selectedSection} />
                        )
                }
            </div>
        </div>
    )
}