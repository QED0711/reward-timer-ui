import { useEffect } from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import UserContainer from "./components/containers/UserContainer";
import Sidebar from './components/layout/Sidebar'
import mainManager from "./state/main/mainManager";

const router = createBrowserRouter([
    {path: "/", element: <UserContainer/>},
    {path: "/admin", element: <div>ADMIN</div>},
])

function App() {

    useEffect(() => {
        mainManager.restAPI.getAdmins();
    }, [])

    return (
        <div className="App w-screen h-screen bg-indigo-50 text-gray-700  overflow-hidden">
            <RouterProvider router={router} />
        </div>
    )
}

export default App
