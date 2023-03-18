import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

// =============================== STATE =============================== 
import { useSpiccatoState } from 'spiccato-react';
import mainManager from '../../state/main/mainManager';

// =============================== COMPONENTS =============================== 
import UserList from '../users/UserList'

// =============================== ICONS =============================== 
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';


// EVENTS
const toggleSidebarClick = () => {
    mainManager.setters.toggleSidebar();
}

// EFFECTS
const resizeUserList = (setListHeight, containerRef) => {
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!!container) {
            const containerRect = container.getBoundingClientRect();
            setListHeight(window.innerHeight - containerRect.top)
        }
    }, [/* TODO: add window resize dependency */])
}

const toggleCollapse = (showSidebar, setSidebarTranslation, sidebarRef) => {
    useLayoutEffect(() => {
        const sidebarRect = sidebarRef.current?.getBoundingClientRect();
        if (!!sidebarRect) {
            showSidebar ? setSidebarTranslation(0) : setSidebarTranslation(-1 * sidebarRect.width)
        }
    }, [showSidebar])
}

export default function Sidebar({ }) {

    // STATE
    const { state } = useSpiccatoState(mainManager, ["showSidebar"]);
    const [searchFilter, setSearchFilter] = useState("");
    const [listHeight, setListHeight] = useState("100vh")
    const [sidebarTranslation, setSidebarTranslation] = useState(0);
    const sidebarRef = useRef(null)
    const listContainerRef = useRef(null)

    // EFFECTS
    resizeUserList(setListHeight, listContainerRef)
    toggleCollapse(state.showSidebar, setSidebarTranslation, sidebarRef)

    return (
        <div
            ref={sidebarRef}
            className='fixed top-0 left-0 z-5 w-screen lg:w-[33vw] h-screen py-2 pl-2 bg-indigo-200 shadow-md shadow-gray-800'
            style={{ transform: `translateX(${sidebarTranslation}px)` }}
        >
            <div className='absolute w-8 h-8 px-2 right-[-32px] top-4 bg-indigo-200 cursor-pointer' onClick={toggleSidebarClick}>
                {
                    state.showSidebar
                        ? <MdArrowBackIos className='h-full w-full' size={"2rem"} />
                        : <MdArrowForwardIos className='h-full w-full' size={"2rem"} />
                }
            </div>
            <div className='w-full pr-2'>
                <input
                    type="search"
                    placeholder='Search for User'
                    className='w-full p-1 mb-2 text-lg bg-indigo-50 text-indigo-800 rounded-md '
                    onChange={e => setSearchFilter(e.target.value)}
                />
            </div>
            <div ref={listContainerRef} className='pr-2 overflow-auto' style={{ height: listHeight }}>
                <UserList {...{ searchFilter }} />
            </div>
        </div>
    )
}