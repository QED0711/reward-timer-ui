
const setters = {

    toggleSidebar(){
        this.setState(prevState => {
            return {showSidebar: !prevState.showSidebar}
        })
    }

}

export default setters;
