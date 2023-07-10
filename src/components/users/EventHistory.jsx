import { useEffect } from "react";
import { useSpiccatoState } from "spiccato-react";
import mainManager from "../../state/main/mainManager";
import Modal from "../layout/Modal";

export default function EventHistory({setShowEventHistory}){
    
    const {state} = useSpiccatoState(mainManager, [mainManager.paths.eventHistory])
    
    useEffect(() => {
        mainManager.restAPI.getUserHistory()
    }, [])

    return (
        <Modal closeButton onClose={() => {setShowEventHistory(false)}}>
            EVENT HISTORY
        </Modal>
    )
}