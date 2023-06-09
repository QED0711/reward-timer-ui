import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

// =============================== STATE =============================== 
import { useSpiccatoState } from 'spiccato-react';
import mainManager from '../../state/main/mainManager';

// =============================== COMPONENTS =============================== 
import UserList from '../users/UserList'
import UserForms from '../users/NewUserForms';

// =============================== ICONS =============================== 
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import Modal from './Modal';
import { useWindowSize } from '../../utils/hooks';


// EVENTS
const toggleSidebarClick = () => {
    mainManager.setters.toggleSidebar();
}

// EFFECTS
const resizeUserList = (setListHeight, containerRef, windowSize) => {
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!!container) {
            const containerRect = container.getBoundingClientRect();
            setListHeight(window.innerHeight - containerRect.top)
        }
    }, [windowSize])
}

const toggleCollapse = (showSidebar, setSidebarTranslation, sidebarRef, windowSize) => {
    useLayoutEffect(() => {
        const sidebarRect = sidebarRef.current?.getBoundingClientRect();
        if (!!sidebarRect) {
            showSidebar ? setSidebarTranslation(0) : setSidebarTranslation(-1 * sidebarRect.width)
        }
    }, [showSidebar, windowSize])
}

export default function Sidebar({ }) {

    // STATE
    const { state } = useSpiccatoState(mainManager, [mainManager.paths.showSidebar, mainManager.paths.isLocked]);
    const [searchFilter, setSearchFilter] = useState("");
    const [listHeight, setListHeight] = useState("100vh")
    const [sidebarTranslation, setSidebarTranslation] = useState(0);
    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const [showNewAdminModal, setShowNewAdminModal] = useState(false);
    const windowSize = useWindowSize();
    const sidebarRef = useRef(null);
    const listContainerRef = useRef(null);

    // EFFECTS
    resizeUserList(setListHeight, listContainerRef, windowSize)
    toggleCollapse(state.showSidebar, setSidebarTranslation, sidebarRef, windowSize)

    return (
        <>
            {showNewUserModal && <Modal closeButton onClose={() => setShowNewUserModal(false)}><UserForms.NewUser onClose={() => { setShowNewUserModal(false) }} /></Modal>}
            {showNewAdminModal && <Modal closeButton onClose={() => setShowNewAdminModal(false)}><UserForms.NewAdmin onClose={() => setShowNewAdminModal(false)} /></Modal>}
            <div
                ref={sidebarRef}
                className='absolute top-0 left-0 w-screen lg:w-[33vw] h-screen py-2 pl-2 bg-indigo-200 shadow-md shadow-gray-800'
                style={{ transform: `translateX(${sidebarTranslation}px)` }}
            >
                {
                    (!state.showSidebar || windowSize.width >= 1024)
                    &&
                    <div className='absolute w-8 h-8 px-2 right-[-32px] top-4 bg-indigo-200 cursor-pointer' onClick={toggleSidebarClick}>
                        {
                            state.showSidebar
                                ? <MdArrowBackIos className='h-full w-full' size={"2rem"} />
                                : <MdArrowForwardIos className='h-full w-full' size={"2rem"} />
                        }
                    </div>
                }
                <div className='w-full pr-2'>
                    <div className='grid grid-cols-2 gap-2 mb-2'>
                        <button
                            className='bg-indigo-100 hover:shadow-sm hover:shadow-indigo-500 text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => setShowNewUserModal(true)}
                            disabled={state.isLocked}
                        >New User</button>
                        <button
                            className='bg-indigo-100 hover:shadow-sm hover:shadow-indigo-500 text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => setShowNewAdminModal(true)}
                            disabled={state.isLocked}
                        >New Admin</button>
                    </div>
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
        </>
    )
}