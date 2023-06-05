
const setters = {

    toggleSidebar() {
        this.setState(prevState => {
            return { showSidebar: !prevState.showSidebar }
        })
    },

    toggleIsLocked() {
        this.setState(prevState => {
            return { isLocked: !prevState.isLocked };
        })
    },
    adjustSelectedUserPoints(amount) {
        this.setState(prevState => {
            const { selectedUser } = prevState;
            if (!selectedUser) return {};

            return { selectedUser: { ...selectedUser, points: selectedUser.points + amount } };

        })

    }
}
export default setters;
