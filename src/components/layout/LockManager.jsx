import { useEffect, useState } from "react";

// =============================== STATE =============================== 
import { useSpiccatoState } from "spiccato-react";
import mainManager from "../../state/main/mainManager";

// =============================== ICONS =============================== 
import { RiLock2Fill, RiLockUnlockLine, RiDeleteBack2Fill } from 'react-icons/ri';
import Modal from "./Modal";

// COMPONENTS
const KeypadButton = ({children, onClick}) => {
    return (
        <button className="bg-indigo-200 text-indigo-900 text-xl lg:text-2xl border-indigo-700 shadow-sm shadow-indigo-800" onClick={onClick}>
            {children}
        </button>
    )
}

export default function LockManager() {
    const { state } = useSpiccatoState(mainManager, [mainManager.paths.isLocked]);
    const [showKeypad, setShowKeypad] = useState(false);
    const [code, setCode] = useState("");

    // EVENTS
    const appendToCode = num => () => {
        setCode(code => code + num.toString())
    }

    const handleDeleteCodeEntry = () => {
        setCode(code => code.slice(0,-1));
    }

    useEffect(() => {
        if(showKeypad){
            window._handleKeypress = e => {
                if(e.key.match(/^\d$/)){
                    setCode(code => code + e.key);
                } else if (e.key === "Delete") {
                    setCode(code => code.slice(0,-1))
                }
            }
            window.addEventListener("keypress", window._handleKeypress)
        } else {
            window.removeEventListener("keypress", window._handleKeypress ?? function(){})
        }

        return () => {
            window.removeEventListener("keypress", window._handleKeypress ?? function(){})
        }
    }, [showKeypad])

    useEffect(() => {
        const checkCode = async () => {
            if(code === "") return;
            const s = await mainManager.setters.toggleIsLocked(code);
            if(!s.isLocked) {
                setShowKeypad(false)
                setCode("")
            }
        }
        checkCode();
    }, [code])

    return (
        <div className="fixed top-3 right-3 p-2 inline-block border-[3px] border-black rounded-full cursor-pointer select-none z-50" onPointerUp={() => state.isLocked ? setShowKeypad(true) : mainManager.setters.toggleIsLocked("")}>
            {
                state.isLocked
                    ? <RiLock2Fill className="w-4 h-4 lg:w-[2rem] lg:h-[2rem] text-red-500" />
                    : <RiLockUnlockLine className="w-4 h-4 lg:w-[2rem] lg:h-[2rem] text-gray-800" />
            }
            {
                showKeypad
                &&
                <Modal closeButton onClose={() => setShowKeypad(false)}>
                    <h1 className="text-gray-800 text-2xl font-bold text-center">Enter Pass Code</h1>
                    <div className={`text-gray-800 font-bold text-4xl text-center ${code.length ? "opacity-100" : "opacity-0"}`}>{code.length ? "* ".repeat(code.length) : "*"}</div>
                    <div className="grid grid-cols-3 gap-1 p-2 rounded-sm text-gray-800 bg-yellow-200 shadow-sm shadow-yellow-500">
                        <KeypadButton onClick={appendToCode(7)}>7</KeypadButton>
                        <KeypadButton onClick={appendToCode(8)}>8</KeypadButton>
                        <KeypadButton onClick={appendToCode(9)}>9</KeypadButton>
                        <KeypadButton onClick={appendToCode(4)}>4</KeypadButton>
                        <KeypadButton onClick={appendToCode(5)}>5</KeypadButton>
                        <KeypadButton onClick={appendToCode(6)}>6</KeypadButton>
                        <KeypadButton onClick={appendToCode(1)}>1</KeypadButton>
                        <KeypadButton onClick={appendToCode(2)}>2</KeypadButton>
                        <KeypadButton onClick={appendToCode(3)}>3</KeypadButton>
                        <div></div>
                        <KeypadButton onClick={appendToCode(0)}>0</KeypadButton>
                        <KeypadButton onClick={handleDeleteCodeEntry}><RiDeleteBack2Fill /></KeypadButton>


                    </div>
                </Modal>
            }
        </div>
    )
}