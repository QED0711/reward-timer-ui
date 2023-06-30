
const stateSchema = {
    showSidebar: true,
    isLocked: true,

    users: [],
    selectedUser: null,
    
    admins: [],

    speechSupported: 'speechSynthesis' in window,

}

export default stateSchema;
