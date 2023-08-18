import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthorizationContainer from "./components/AuthorizationContainer";
import UserContainer from "./components/containers/UserContainer";
import Sidebar from './components/layout/Sidebar'
import SocketManager from "./components/SocketManager";
import mainManager from "./state/main/mainManager";
import { useWindowSize } from "./utils/hooks";

const router = createBrowserRouter([
    { path: "/", element: <UserContainer />, errorElement: <AuthorizationContainer /> },
    { path: "/admin", element: <div>ADMIN</div> },
])

function App() {

    const windowSize = useWindowSize();

    useEffect(() => {
        // fetch user information
        mainManager.restAPI.getAdmins();
    }, [])

    return (
        <div className="App w-screen h-screen bg-indigo-50 text-gray-700  overflow-hidden" >
            <SocketManager />
            <RouterProvider router={router} />
        </div>
    )
}

export default App
