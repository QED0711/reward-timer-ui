// =============================== STATE =============================== 
import { useSpiccatoState } from "spiccato-react";
import mainManager from "../../state/main/mainManager";

// =============================== ICONS =============================== 
import {RiLock2Fill, RiLockUnlockLine} from 'react-icons/ri';

// EVENTS
const handleClick = () => {
    mainManager.setters.toggleIsLocked();
}

export default function LockManager(){
    const {state} = useSpiccatoState(mainManager, ["isLocked"]);
    
    return (
        <div className="fixed top-3 right-3 p-2 inline-block border-[3px] border-black rounded-full cursor-pointer select-none" onPointerUp={handleClick}>
            {
                state.isLocked
                    ? <RiLock2Fill className="w-4 h-4 lg:w-[2rem] lg:h-[2rem] text-red-500" />
                    : <RiLockUnlockLine className="w-4 h-4 lg:w-[2rem] lg:h-[2rem] text-gray-800" />
            }
        </div>
    )
}