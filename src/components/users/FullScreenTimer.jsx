import { useEffect, useRef, useState } from 'react';
// ============================== MODULES ============================== 
import * as Tone from 'tone';
// ============================== STATE ============================== 
import { useSpiccatoState } from "spiccato-react"
import mainManager from "../../state/main/mainManager"

// ============================== ICONS ============================== 
import { RiFullscreenExitFill, RiVoiceprintFill } from 'react-icons/ri'

// ============================== ICONS ============================== 
import { msToDigital } from "../../utils/time"

export default function FullScreenTimer({ timer, isActive, timeRemaining, percentageComplete, onClose }) {

    // STATE
    const { state } = useSpiccatoState(mainManager, [mainManager.paths.isLocked, mainManager.paths.serverTimezone])
    const [noise, setNoise] = useState(null);
    const [soundActive, setSoundActive] = useState(false)
    const [volume, setVolume] = useState(-20);

    const handleToggleNoise = async () => {
        let activeNoise = noise;
        if (!activeNoise) {
            await Tone.start();
            activeNoise = new Tone.Noise({ type: "pink"}).toDestination();
            setNoise(activeNoise)
        }

        if (activeNoise.state === "started") {
            activeNoise.stop()
            setSoundActive(false)
        } else {
            activeNoise.start();
            activeNoise.volume.value = volume;
            setSoundActive(true)
        }
    }

    const handleVolumeChange = e => {
        const vol = parseFloat(e.target.value)
        setVolume(vol);
        noise.volume.value = vol;
    }

    const handleClose = () => {
        noise?.stop();
        noise?.dispose()
        onClose();
    }

    // EFFECTS
    useEffect(() => {
        if (percentageComplete === 0) {
            noise?.stop();
            noise?.dispose();
            setSoundActive(false)
            setNoise(null)
        }
    }, [percentageComplete])

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-600 z-30 flex items-center justify-center">
            {
                <div className="absolute top-2 left-2">
                    {
                        !state.isLocked
                        &&
                        <div className='inline-block mr-1 p-2 border-[3px] border-black rounded-full cursor-pointer'>
                            <RiFullscreenExitFill className=" w-4 h-4 lg:w-[2rem] lg:h-[2rem] text-gray-800  " onClick={handleClose} />
                        </div>
                    }
                    <div className='inline-block mr-1 p-2 border-[3px] border-black rounded-full cursor-pointer' onClick={handleToggleNoise}>
                        <RiVoiceprintFill className={`w-4 h-4 lg:w-[2rem] lg:h-[2rem] ${soundActive ? "text-gray-100" : "text-gray-800"}`} />
                    </div>
                    {
                        (!!noise && soundActive)
                        &&
                        <input type="range"
                            className='absolute top-0 lg:top-3 cursor-pointer my-2 mx-auto'
                            onChange={handleVolumeChange}
                            value={volume}
                            min={-30}
                            max={0}
                        />
                    }
                </div>
            }

            <div className="absolute top-12 text-gray-100">
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
                {
                    percentageComplete > 0
                        ? (
                            <>
                                <div className="absolute top-0 left-0 h-full bg-yellow-400 opacity-50" style={{ width: `${percentageComplete * 100}%` }}></div>
                                <div className="absolute top-0 right-0 h-full bg-red-400 opacity-50" style={{ width: `${(1 - percentageComplete) * 100}%` }}></div>
                            </>
                        )
                        : (
                            <div className="absolute top-0 right-0 h-full w-full bg-green-400 opacity-50"></div>
                        )
                }
                <h1 className="text-center text-gray-100 text-[4rem] font-mono">{msToDigital(timeRemaining)}</h1>
            </div>
        </div>
    )
}