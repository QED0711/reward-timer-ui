// ========================== STATE ========================== 
import mainManager from "../../state/main/mainManager"

// STYLES
const INPUT_STYLE = "form-input inline-block w-full m-2 p-1 rounded-sm bg-white text-gray-800 shadow-sm shadow-gray-800 resize-none"

// COMPONENTS
const FormLabel = ({ text, display = "block", className, children }) => {
    return (
        <label className={`${display} mx-1 ${className}`}>
            <sub className={`block relative top-2 mx-2 text-sm`}>{text}</sub>
            {children}
        </label>
    )
}


export default {
    NewUser({ onClose }) {

        // EVENTS
        const handleSubmit = e => {
            e.preventDefault();
            const user = {
                name: document.querySelector(".form-input").value,
                points: 0,
                tasks: [],
                timers: [],
                rewards: [],
                deductions: []
            }

            mainManager.restAPI.createUser(user);
            onClose();
        }

        return (
            <form onSubmit={handleSubmit}>
                <h2 className="text-center text-2xl font-bold capitalize">Create New User</h2>
                <FormLabel text="Name">
                    <input className={INPUT_STYLE} type="text" autoFocus />
                </FormLabel>
                <input className="block w-full mx-auto mt-4 bg-yellow-300 text-indigo-700 shadow-sm shadow-gray-800 cursor-pointer" type="submit" value="Create" />
            </form>
        )
    },

    NewAdmin({onClose}) {
        // EVENTS
        const handleSubmit = e => {
            e.preventDefault();
            const inputs = document.querySelectorAll(".form-input") 
            const admin = {}
            for(let input of inputs) {
                admin[input.dataset.field] = input.value;
            }
            mainManager.restAPI.createAdmin(admin);
            onClose();
        }
        
        return (
            <form onSubmit={handleSubmit}>
                <h2 className="text-center text-2xl font-bold capitalize">Create New Admin</h2>
                <FormLabel text="Name">
                    <input className={INPUT_STYLE} type="text" data-field="name" autoFocus />
                </FormLabel>
                <FormLabel text="Passcode">
                    <input className={INPUT_STYLE} type="number" data-field="unlockCode" />
                </FormLabel>
                <input className="block w-full mx-auto mt-4 bg-yellow-300 text-indigo-700 shadow-sm shadow-gray-800 cursor-pointer" type="submit" value="Create" />
            </form>
        )
    },
}