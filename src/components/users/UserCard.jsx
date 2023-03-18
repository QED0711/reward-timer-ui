import React from 'react';
import mainManager from '../../state/main/mainManager';

// EVENTS :::::::::::::::::::::::::::::::::::::::::::::::::::
const handleCardClick = (user) => () => {
    mainManager.setters.setShowSidebar(false);
    mainManager.setters.setSelectedUser(user);
}

// SUBCOMPONENTS :::::::::::::::::::::::::::::::::::::::::::::::::::
function CardSummarySection({ title, value }) {
    return (
        <div className='bg-yellow-50 shadow-sm shadow-gray-500'>
            <h4 className='text-center font-bold bg-yellow-300 text-gray-800'>{title}</h4>
            <p className='text-center text-2xl text-gray-800'>{value}</p>
        </div>
    )
}

export default function UserCard({ user }) {

    return (
        <div
            className='p-2 my-2 text-left bg-indigo-50 shadow-md shadow-gray-500 rounded-md cursor-pointer'
            onClick={handleCardClick(user)}
        >
            <h3 className='text-2xl text-indigo-800'>{user.name}</h3>
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
                <CardSummarySection title="Points" value={user.points?.length} />
                <CardSummarySection title="Timers" value={user.timers?.length} />
                <CardSummarySection title="Rewards" value={user.rewards?.length} />
            </div>
        </div>
    )
}