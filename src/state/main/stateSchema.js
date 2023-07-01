
const stateSchema = {
    socket: null, 
    timeSyncConstant: 0,
    serverTimezone: "",

    showSidebar: true,
    isLocked: true,

    users: [],
    selectedUser: null,
    
    admins: [],

    speechSupported: 'speechSynthesis' in window,

}

export default stateSchema;
