
import Spiccato from 'spiccato';

import stateSchema from './stateSchema'
import getters from './getters'
import setters from './setters'
import methods from './methods'
import restAPI from './restAPI';

const mainManager = new Spiccato(
    stateSchema, 
    { 
        id: "main", 
        enableWriteProtection: false 
    }
)

mainManager.addCustomGetters(getters)
mainManager.addCustomSetters(setters)
mainManager.addCustomMethods(methods)
mainManager.addNamespacedMethods({ restAPI })

// Uncomment below to connect state to localStorage
/*
mainManager.connectToLocalStorage({ 
    persistKey: "main"
})
*/

mainManager.init();

if(import.meta.env.MODE === "development") window._mainManager = mainManager;

export default mainManager; 
export const paths = mainManager.paths;
