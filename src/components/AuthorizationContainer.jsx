import { useState } from "react"
import apiManager from "../api/apiManager"

export default function AuthorizationContainer(){
    // STATE
    const [key, setKey] = useState("")
    
    // EVENTS
    const handleClick = () => {
        apiManager.setters.setApiKey(key);
        window.location.reload();
    }

    return (
        <div className="text-center text-2xl">
            <p>You are not authorized to view this content. </p>
            <p>Please enter your API key to continue</p>
            <input type="text" className="p-2 text-3xl font-bold text-center bg-gray-300" value={key} onChange={e => {setKey(e.target.value)}}/>
            <br/>
            <button className="mt-2 text-xl" onClick={handleClick}>Enter</button>
        </div>
    )
}