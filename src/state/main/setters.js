const setters = {

    toggleSidebar() {
        this.setState(prevState => {
            return { showSidebar: !prevState.showSidebar }
        })
    },

    toggleIsLocked(code) {
        return this.setState(prevState => {
            if(prevState.isLocked) {
                const isAuthorized = !!prevState.admins.find(admin => admin.unlockCode === code)
                if(isAuthorized) {
                    return [{isLocked: false}, [this.paths.isLocked]]
                } else {
                    // alert("Not a valid admin password!")
                    return [{}, []]
                }
            }
            return [{ isLocked: !prevState.isLocked }, [this.paths.isLocked]];
        }, null, [this.paths.isLocked])
    },

    adjustSelectedUserPoints(amount) {
        this.setState(prevState => {
            const { selectedUser } = prevState;
            if (!selectedUser || prevState.isLocked) return {};

            return [{ selectedUser: { ...selectedUser, points: selectedUser.points + amount } }, [this.paths.selectedUser]];

        }, () => {
            this.methods.syncSelectedUser();
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
        }, () => {
            this.methods.syncSelectedUser()
        })
    },

    appendEntity(type, entity){
        this.setState(prevState => {
            const selectedUser = !!prevState.selectedUser ? {...prevState.selectedUser} : null
            if(!selectedUser) return [{}, []];

            switch(type) {
                case "task":
                    return [{selectedUser: {...selectedUser, tasks: [...selectedUser.tasks, entity]}}, [this.paths.selectedUser]]
                case "timer":
                    return [{selectedUser: {...selectedUser, timers: [...selectedUser.timers, entity]}}, [this.paths.selectedUser]]
                case "reward":
                    return [{selectedUser: {...selectedUser, rewards: [...selectedUser.rewards, entity]}}, [this.paths.selectedUser]]
                case "deduction":
                    return [{selectedUser: {...selectedUser, deductions: [...selectedUser.deductions, entity]}}, [this.paths.selectedUser]]
            }
        }, () => {
            this.methods.syncSelectedUser();
        })
    },

    updateEntity(type, update){
        this.setState(prevState => {
            switch(type){
                case "task":
                    const tasks = prevState.selectedUser?.tasks?.map(task => task.id === update.id ? update : task)
                    return [{selectedUser: {...prevState.selectedUser, tasks}}, [this.paths.selectedUser]]
                case "timer":
                    const timers = prevState.selectedUser?.timers?.map(timer => timer.id === update.id ? update : timer)
                    return [{selectedUser: {...prevState.selectedUser, timers}}, [this.paths.selectedUser]]
                case "reward":
                    const rewards = prevState.selectedUser?.rewards?.map(reward => reward.id === update.id ? update : reward)
                    return [{selectedUser: {...prevState.selectedUser, rewards}}, [this.paths.selectedUser]]
                case "deduction":
                    const deductions = prevState.selectedUser?.deductions?.map(deduction => deduction.id === update.id ? update : deduction)
                    return [{selectedUser: {...prevState.selectedUser, deductions}}, [this.paths.selectedUser]]
            }
        }, () => {
            this.methods.syncSelectedUser()
        })
    }, 

    deleteEntity(type, entity) {
        this.setState(prevState => {
            switch(type){
                case "task":
                    const tasks = prevState.selectedUser?.tasks?.filter(task => task.id !== entity.id);
                    return [{selectedUser: {...prevState.selectedUser, tasks}}, [this.paths.selectedUser]];
                case "timer":
                    const timers = prevState.selectedUser?.timers?.filter(timer => timer.id !== entity.id);
                    return [{selectedUser: {...prevState.selectedUser, timers}}, [this.paths.selectedUser]];
                case "reward":
                    const rewards = prevState.selectedUser?.rewards?.filter(reward => reward.id !== entity.id);
                    return [{selectedUser: {...prevState.selectedUser, rewards}}, [this.paths.selectedUser]];
                case "deduction":
                    const deductions = prevState.selectedUser?.deductions?.filter(deduction => deduction.id !== entity.id);
                    return [{selectedUser: {...prevState.selectedUser, deductions}}, [this.paths.selectedUser]];
            }
        }, () => {
            this.methods.syncSelectedUser();
        })
    },

}
export default setters;
