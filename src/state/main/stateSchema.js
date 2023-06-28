
const stateSchema = {
    showSidebar: true,
    isLocked: false,

    users: [],
    selectedUser: null,
    
    admins: [],

    speechSupported: 'speechSynthesis' in window,

}

export default stateSchema;
