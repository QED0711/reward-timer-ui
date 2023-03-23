// ============================== STATE ============================== 
import mainManager from "../../state/main/mainManager";
import { useSpiccatoState } from "spiccato-react";

// ============================== COMPONENTS ============================== 
import Sidebar from "../layout/Sidebar";
import UserDashboard from "../users/UserDashboard";

export default function UserContainer() {

    // STATE
    const { state } = useSpiccatoState(mainManager, ["selectedUser"]);

    return (
        <div className="w-screen h-screen overflow-hidden">
            <Sidebar />
            {!!state.selectedUser && <UserDashboard />}
        </div>
    )
}