
import Spiccato from 'spiccato';

import stateSchema from './stateSchema'
import getters from './getters'
import setters from './setters'


const apiManager = new Spiccato(stateSchema, {id: "api"})

// Uncomment below to connect state to localStorage

apiManager.connectToLocalStorage({ 
    persistKey: "api",
    providerID: "api",
    initializeFromLocalStorage: true,
    clearStorageOnUnload: false
})


apiManager.init(); // IMPORTANT: This must be called prior to addCustomGetters and addCustomSetters

apiManager.addCustomGetters(getters)
apiManager.addCustomSetters(setters)


export default apiManager; 
export const apiPaths = apiManager.paths;
