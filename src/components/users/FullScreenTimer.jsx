// ============================== STATE ============================== 
import { useSpiccatoState } from "spiccato-react"
import mainManager from "../../state/main/mainManager"

// ============================== ICONS ============================== 
import { RiFullscreenExitFill } from 'react-icons/ri'
import { msToDigital } from "../../utils/time"

export default function FullScreenTimer({ timer, isActive, timeRemaining, percentageComplete, onClose }) {
    // STATE
    const { state } = useSpiccatoState(mainManager, [mainManager.paths.isLocked, mainManager.paths.serverTimezone])
    
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-600 z-30 flex items-center justify-center">
            {
                !state.isLocked
                &&
                <div className="absolute top-2 left-2 p-2 border-[3px] border-black rounded-full cursor-pointer">
                    <RiFullscreenExitFill className=" w-4 h-4 lg:w-[2rem] lg:h-[2rem] text-gray-800  " onClick={onClose} />
                </div>
            }

            <div className="absolute top-8 text-gray-100">
                <h3 className="text-center text-sm lg:text-lg italic font-bold">{timer.name}</h3>
                {

                    timer.type === "period"
                    &&
                    <>
                        <h3 className="text-center text-sm lg:text-lg italic">{msToDigital(timer.start, 12)} - {msToDigital(timer.end, 12)}</h3>
                        <h3 className="text-center text-sm lg:text-lg italic">{state.serverTimezone}</h3>
                    </>
                }
            </div>

            <div className="relative flex justify-center items-center h-3/4 w-5/6">
                <div className="absolute top-0 left-0 h-full bg-green-400 opacity-50" style={{ width: `${percentageComplete * 100}%` }}></div>
                <div className="absolute top-0 right-0 h-full bg-red-400 opacity-50" style={{ width: `${(1 - percentageComplete) * 100}%` }}></div>
                <h1 className="text-center text-gray-100 text-[4rem] font-mono">{msToDigital(timeRemaining)}</h1>
            </div>

        </div>
    )
}