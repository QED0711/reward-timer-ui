import {randFullName, randNumber, randUuid} from "@ngneat/falso";

export default {

    getUsers(){
        return new Promise(resolve => {
            // axios.get("/users")
            const users = Array.from({length:20}, () => ({
                id: randUuid(),
                name: randFullName(), 
                timers: Array.from({length: randNumber({min: 0, max: 5})}),
                rewards: Array.from({length: randNumber({min: 0, max: 7})}),
                points: Array.from({length: randNumber({min: -10_000, max: 10_000, precision: 100})})

            }))
            this.setters.setUsers(users)
            resolve(users)
        })
    }

}

