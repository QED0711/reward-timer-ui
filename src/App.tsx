import {createBrowserRouter, RouterProvider} from "react-router-dom";
import UserContainer from "./components/containers/UserContainer";
import Sidebar from './components/layout/Sidebar'

const router = createBrowserRouter([
    {path: "/", element: <UserContainer/>},
    {path: "/admin", element: <div>ADMIN</div>},
])

function App() {

    return (
        <div className="App w-screen h-screen bg-indigo-50 text-gray-700  overflow-hidden">
            <RouterProvider router={router} />
        </div>
    )
}

export default App
