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
        <div>
            <Sidebar />
            {!!state.selectedUser && <UserDashboard />}
        </div>
    )
}