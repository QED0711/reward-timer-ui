import { useEffect } from "react";
import { io } from "socket.io-client";
import { API_BASE } from "../config/parsedConfig";
import mainManager from "../state/main/mainManager";

export default function SocketManager(){
    useEffect(() => {
        const socket = io(API_BASE);
        mainManager.setters.setSocket(socket)

        socket.on("test", (data) => {
            debugger
            console.log(data)
        })
    }, [])

    return <></>
}