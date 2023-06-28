import axios from "axios"

export default {

    speak(message){
        if(this.state.speechSupported && !!message){
            const speaker = new SpeechSynthesisUtterance(message);
            speechSynthesis.speak(speaker);
        }
    }
}
