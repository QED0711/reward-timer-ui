import { useEffect, useLayoutEffect, useRef, useState } from "react"

// ============================ STATE ============================ 
import { useSpiccatoState } from "spiccato-react"
import mainManager from "../../state/main/mainManager"

// ============================ COMPONENTS ============================ 
import ElementList from "./ElementList"
import SelectedSection from "./SelectedSection"

// ============================ ICONS ============================ 
import { RiAddCircleLine, RiFileHistoryLine } from 'react-icons/ri'
import NewEntityForm from "./NewEntityForm"
import { useWindowSize } from "../../utils/hooks"
import EventHistory from "./EventHistory"

// EVENTS 
const handleAddClick = (section, setSelectedSection) => () => {
    setSelectedSection(section)
}

const adjustPoints = (amount) => () => {
    mainManager.setters.adjustSelectedUserPoints(amount, {eventType: "Point Adjustment", eventName: amount > 0 ? "Add" : "Subtract"})
}


// EFFECTS ===========================================
const resizeBodyContainer = (args) => {
    const { bodyRef, setBodyHeight, windowSize, setCondensedView } = args

    useLayoutEffect(() => {
        const bodyRect = bodyRef.current?.getBoundingClientRect();
        if (!!bodyRect) {
            setBodyHeight(window.innerHeight - bodyRect.top - 32)
        }

        if (windowSize.width < 1024) { // md or smaller
            setCondensedView(true);
        } else { // lg or greater
            setCondensedView(false)
        }

    }, [windowSize])
}

const resetSelectedSection = (setSelectedSection, selectedUser) => {
    useEffect(() => {
        setSelectedSection(null);
    }, [selectedUser])
}


// SUB-COMPONENTS ===========================================
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

const DashboardSection = ({ heading, onClick = () => { }, addButton, onAddClick = () => { }, children, className, windowSize }) => {

    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(10);

    // EFFECTS
    useLayoutEffect(() => {
        const exec = async () => {
            await new Promise(r => setTimeout(r, 50));
            const containerRect = sectionRef.current?.getBoundingClientRect?.();
            const contentRect = contentRef.current?.getBoundingClientRect?.();
            if (!!containerRect && !!contentRect) setContentHeight(containerRect.bottom - contentRect.top);
        }
        exec();
    }, [windowSize])

    return (
        <section ref={sectionRef} className={`h-full bg-yellow-50 rounded-md shadow-sm hover:shadow-lg shadow-indigo-800 hover:shadow-indigo-900 ${className}`}>

            <h2
                className="text-center text-2xl font-bold bg-yellow-300 rounded-tl-md rounded-tr-md hover:drop-shadow-lg"
                onClick={onClick}
            >
                {heading} {addButton && <RiAddCircleLine className="inline-block cursor-pointer" onClick={onAddClick} />}
            </h2>

            <div ref={contentRef} className="w-full p-2" style={{ height: contentHeight }}>
                {children}
            </div>

        </section>
    )
}

const TabSelector = ({ tab, setTab }) => {
    return (
        <div className="fixed bottom-0 left-0 z-30 grid grid-cols-5 w-screen text-center md:uppercase text-sm bg-gray-200 cursor-pointer">
            <div className={`py-4 ${tab === "points" && "bg-gray-500 text-gray-100"}`} onClick={() => setTab("points")}>points</div>
            <div className={`py-4 ${tab === "tasks" && "bg-gray-500 text-gray-100"}`} onClick={() => setTab("tasks")}>tasks</div>
            <div className={`py-4 ${tab === "timers" && "bg-gray-500 text-gray-100"}`} onClick={() => setTab("timers")}>timers</div>
            <div className={`py-4 ${tab === "rewards" && "bg-gray-500 text-gray-100"}`} onClick={() => setTab("rewards")}>rewards</div>
            <div className={`py-4 ${tab === "deductions" && "bg-gray-500 text-gray-100"}`} onClick={() => setTab("deductions")}>deductions</div>
        </div>
    )
}

export default function UserDashboard() {

    // STATE
    const { state } = useSpiccatoState(mainManager, [mainManager.paths.selectedUser, mainManager.paths.isLocked])
    const [selectedSection, setSelectedSection] = useState(null);
    const [bodyHeight, setBodyHeight] = useState(window.innerHeight);
    const [condensedView, setCondensedView] = useState(false);
    const [tab, setTab] = useState("points")
    const [showEventHistory, setShowEventHistory] = useState(false)
    const windowSize = useWindowSize();
    const bodyRef = useRef(null)

    // EFFECTS
    resizeBodyContainer({ bodyRef, setBodyHeight, windowSize, setCondensedView });
    resetSelectedSection(setSelectedSection, state.selectedUser);

    return (
        <div
            className="w-11/12  mx-auto mt-4 p-4 bg-indigo-300 rounded-lg shadow-lg shadow-indigo-900 overflow-hidden"
            style={{ height: windowSize.width < 1024 ? "calc(100vh - 6rem)" : "calc(100vh - 2rem)" }}
        >
            {selectedSection && <NewEntityForm type={selectedSection} setSelectedSection={setSelectedSection} />}
            <h1 className="lg:inline-block block mr-4 text-3xl">
                {state.selectedUser.name}
                <RiFileHistoryLine className="inline-block mx-2 cursor-pointer" onClick={() => {setShowEventHistory(true)}} />
            </h1>
            {showEventHistory && <EventHistory {...{setShowEventHistory}} />}
            {/* {selectedSection && <DashboardNavButton title={"Dashboard"} onClick={() => { setSelectedSection(null) }} />} */}

            <div
                ref={bodyRef}
                className="grid grid-cols-2 grid-rows-6 lg:grid-rows-12 gap-4 overflow-y-auto"
                style={{ height: windowSize.width < 1024 ? `calc(${bodyHeight}px - 4rem)` : `calc(${bodyHeight}px - 0.25rem)` }}
            >

                {
                    (!condensedView || tab === "points")
                    &&
                    <DashboardSection heading="Points" className={"col-span-2 row-span-6 lg:row-span-2"}>
                        <h1 className="relative top-[45%] lg:top-0 text-5xl  text-center" style={{ color: state.selectedUser.points > 0 ? "#22c55e" : "#ef4444" }}>
                            {
                                !state.isLocked
                                &&
                                <button className="py-0 px-1 mx-8 text-red-500 shadow-sm shadow-gray-400 disabled:cursor-not-allowed" disabled={state.isLocked} onClick={adjustPoints(-5)}>-5</button>
                            }
                            {state.selectedUser.points}
                            {
                                !state.isLocked
                                &&
                                <button className="py-0 px-1 mx-8 text-green-500 shadow-sm shadow-gray-400 disabled:cursor-not-allowed" disabled={state.isLocked} onClick={adjustPoints(5)}>+5</button>
                            }
                        </h1>
                    </DashboardSection>
                }

                {
                    (!condensedView || tab === "tasks")
                    &&
                    <DashboardSection
                        heading="Tasks"
                        addButton
                        onAddClick={handleAddClick("task", setSelectedSection)}
                        className="row-span-6 lg:row-span-5 col-span-2 lg:col-span-1"
                        windowSize={windowSize}
                    >
                        <ElementList elType={"task"} elements={state.selectedUser.tasks.sort((a,b) => a.amount - b.amount)} />
                    </DashboardSection>
                }

                {
                    (!condensedView || tab === "timers")
                    &&
                    < DashboardSection
                        heading="Timers"
                        addButton
                        onAddClick={handleAddClick("timer", setSelectedSection)}
                        className="row-span-6 lg:row-span-5 col-span-2 lg:col-span-1"
                        windowSize={windowSize}
                    >
                        <ElementList elType={"timer"} elements={state.selectedUser.timers} />
                    </DashboardSection>
                }

                {
                    (!condensedView || tab === "rewards")
                    &&
                    <DashboardSection
                        heading="Rewards"
                        addButton
                        onAddClick={handleAddClick("reward", setSelectedSection)}
                        className="row-span-6 lg:row-span-5 col-span-2 lg:col-span-1"
                        windowSize={windowSize}
                    >
                        <ElementList elType={"reward"} elements={state.selectedUser.rewards.sort((a,b) => a.cost - b.cost)} />
                    </DashboardSection>
                }
                {
                    (!condensedView || tab === "deductions")
                    &&
                    <DashboardSection
                        heading="Deductions"
                        addButton
                        onAddClick={handleAddClick("deduction", setSelectedSection)}
                        className="row-span-6 lg:row-span-5 col-span-2 lg:col-span-1"
                        windowSize={windowSize}
                    >
                        <ElementList elType={"deduction"} elements={state.selectedUser.deductions.sort((a,b) => a.cost - b.cost)} />
                    </DashboardSection>
                }
            </div>
            {condensedView && <TabSelector {...{ tab, setTab }} />}
        </div >
    )
}