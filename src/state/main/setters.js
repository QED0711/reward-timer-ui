
const setters = {

    toggleSidebar(){
        this.setState(prevState => {
            return {showSidebar: !prevState.showSidebar}
        })
    },

    toggleIsLocked(){
        this.setState(prevState => {
            return {isLocked: !prevState.isLocked};
        })
    }

}

export default setters;
