import React, { useEffect, useState } from 'react';
import { useSpiccatoState } from 'spiccato-react';
import mainManager from '../../state/main/mainManager';
import UserCard from './UserCard';

// RENDERERS :::::::::::::::::::::::::::::::::::::::::::::::::
const renderUsers = (users) => {
    return users.map(user => (
        <UserCard key={user.id} user={user} />
    ))
}

// EFFECTS :::::::::::::::::::::::::::::::::::::::::::::::::
const loadUsers = () => {
    useEffect(() => {
        mainManager.restAPI.getUsers();
    }, [])
}

const filterUsers = (users, searchFilter, setFilteredUsers, ) => {
    useEffect(() => {
        let re;
        try{
            re = new RegExp(searchFilter, "gi");
        } catch {
            re = ""
        }
        setFilteredUsers(users.filter(user => !!user.name.match(re)));
    }, [users, searchFilter])
}

// COMPONENT :::::::::::::::::::::::::::::::::::::::::::::::::
export default function UserList({ searchFilter }) {

    const { state } = useSpiccatoState(mainManager, ["users"])
    const [filteredUsers, setFilteredUsers] = useState([])

    loadUsers()
    filterUsers(state.users, searchFilter, setFilteredUsers);

    return (
        <div className=''>
            {!!filteredUsers.length && renderUsers(filteredUsers)}
        </div>
    )
}