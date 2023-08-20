import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import apiManager from "./api/apiManager";
import AuthorizationContainer from "./components/AuthorizationContainer";
import UserContainer from "./components/containers/UserContainer";
import SocketManager from "./components/SocketManager";
import mainManager from "./state/main/mainManager";
import { useWindowSize } from "./utils/hooks";

const router = createBrowserRouter([
    { path: "/", element: <UserContainer /> },
]);

function App() {
    const windowSize = useWindowSize();

    useEffect(() => {
        // fetch user information
        mainManager.restAPI.getAdmins();
    }, []);

    return (
        <div className="App w-screen h-screen bg-indigo-50 text-gray-700  overflow-hidden">
            <SocketManager />
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
