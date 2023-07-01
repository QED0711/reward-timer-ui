import React from 'react';
// ============================ STATE ============================ 
import mainManager from '../../state/main/mainManager';

// ============================ ICONS ============================ 
import {RiDeleteBin5Fill} from 'react-icons/ri'
import { useSpiccatoState } from 'spiccato-react';

// EVENTS :::::::::::::::::::::::::::::::::::::::::::::::::::
const handleCardClick = (user) => () => {
    mainManager.setters.setShowSidebar(false);
    mainManager.setters.setSelectedUser(user);
}

const handleDeleteClick = (user) => e => {
    e.stopPropagation();
    console.log({user})
    mainManager.restAPI.deleteUser(user);
}

// SUBCOMPONENTS :::::::::::::::::::::::::::::::::::::::::::::::::::
function CardSummarySection({ title, value, className }) {
    return (
        <div className={`bg-yellow-50 shadow-sm shadow-gray-500 ${className}`}>
            <h4 className='text-center font-bold bg-yellow-300 text-gray-800 truncate ...'>{title}</h4>
            <p className='text-center text-2xl text-gray-800'>{value}</p>
        </div>
    )
}

export default function UserCard({ user }) {

    const {state} = useSpiccatoState(mainManager, [mainManager.paths.isLocked])

    return (
        <div
            className='p-2 my-2 text-left bg-indigo-50 shadow-md shadow-gray-500 rounded-md cursor-pointer'
            onClick={handleCardClick(user)}
        >
            <h3 className='relative text-2xl text-indigo-800'>
                {user.name}
                {!state.isLocked && <RiDeleteBin5Fill className='absolute right-2 top-0' onClick={handleDeleteClick(user)} />}
            </h3>
            <div className='grid grid-cols-2 xl:grid-cols-5 gap-2'>
                <CardSummarySection title="Points" value={user.points} className="col-span-2 xl:col-span-1" />
                <CardSummarySection title="Tasks" value={user.tasks?.length} />
                <CardSummarySection title="Timers" value={user.timers?.length} />
                <CardSummarySection title="Rewards" value={user.rewards?.length} />
                <CardSummarySection title="Deductions" value={user.deductions?.length} />
          </div>
        </div>
    )
}