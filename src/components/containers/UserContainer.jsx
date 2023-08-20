// ============================== STATE ============================== 
import mainManager from "../../state/main/mainManager";
import { useSpiccatoState } from "spiccato-react";

// ============================== COMPONENTS ============================== 
import LockManager from "../layout/LockManager";
import Sidebar from "../layout/Sidebar";
import UserDashboard from "../users/UserDashboard";
import apiManager, { apiPaths } from "../../api/apiManager";
import AuthorizationContainer from "../AuthorizationContainer";

export default function UserContainer() {

    // STATE
    const { state } = useSpiccatoState(mainManager, ["selectedUser"]);
    const {state: apiState} = useSpiccatoState(apiManager, [apiPaths.apiKey])

    return apiState.apiKey === ""
    ? (
        <AuthorizationContainer />
    )
    : (
        <div className="w-screen h-screen overflow-hidden">
            <LockManager />
            <Sidebar />
            {!!state.selectedUser && <UserDashboard />}
        </div>
    )
}