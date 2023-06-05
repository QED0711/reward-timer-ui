const setters = {

    _syncSelectedToUsersArray(selectedUser){
        this.setState(prevState => {
            const users = [...prevState.users].map(user => user.id === selectedUser.id ? selectedUser : user);
            return {users}
        }, null, [this.paths.users])
    },

    toggleSidebar() {
        this.setState(prevState => {
            return { showSidebar: !prevState.showSidebar }
        })
    },

    toggleIsLocked(code) {
        this.setState(prevState => {
            if(prevState.isLocked) {
                const isAuthorized = !!prevState.admins.find(admin => admin.unlockCode === code)
                if(isAuthorized) {
                    return {isLocked: false}
                } else {
                    alert("Not a valid admin password!")
                    return {}
                }
            }
            return { isLocked: !prevState.isLocked };
        }, null, [this.paths.isLocked])
    },

    adjustSelectedUserPoints(amount) {
        this.setState(prevState => {
            const { selectedUser } = prevState;
            if (!selectedUser || prevState.isLocked) return {};

            return { selectedUser: { ...selectedUser, points: selectedUser.points + amount } };

        }, (state) => {
            this.setters._syncSelectedToUsersArray(state.selectedUser);
        })
    }, 
    
    giveReward(reward){
        this.setState(prevState => {
            const selectedUser = !!prevState.selectedUser ? {...prevState.selectedUser} : null;
            if(!selectedUser || prevState.isLocked) return {};
            if(reward.cost > selectedUser.points){
                alert(`${selectedUser.name} does not have enough points for "${reward.name}"`)
                return {}
            }
            return {selectedUser: {...selectedUser, points: selectedUser.points - reward.cost}};
        }, (state) => {
            this.setters._syncSelectedToUsersArray(state.selectedUser);
        })
    }
}
export default setters;
