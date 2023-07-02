import axios from "axios"

export default {

    syncSelectedUser(){
        if(!!this.state.selectedUser){
            this.restAPI.updateUser(this.state.selectedUser)
        }
    },

    syncUsersUpdate(){
        if(!this.state.selectedUser) return;
        for(let user of this.state.users){
            if (user.id === this.state.selectedUser.id) {
                this.setters.setSelectedUser({...JSON.parse(JSON.stringify(user))});
                return;
            }
        }
    },

    speak(message){
        if(this.state.speechSupported && !!message){
            const speaker = new SpeechSynthesisUtterance(message);
            speechSynthesis.speak(speaker);
        }
    }
}
