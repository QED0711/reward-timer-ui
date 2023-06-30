import axios from "axios"

export default {

    syncSelectedUser(){
        if(!!this.state.selectedUser){
            this.restAPI.updateUser(this.state.selectedUser)
        }
    },

    speak(message){
        if(this.state.speechSupported && !!message){
            const speaker = new SpeechSynthesisUtterance(message);
            speechSynthesis.speak(speaker);
        }
    }
}
