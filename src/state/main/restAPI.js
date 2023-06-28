import {
    randFullName, 
    randNumber, 
    randUuid, 
    randPhrase,
    randJobDescriptor,
    randVerb,
    randAlpha
} from "@ngneat/falso";

import {DateTime} from "luxon"

const _randomTaskFactory = () => (
    {
        id: randUuid(),
        name: randVerb(),
        amount: randNumber({min: 10, max: 100, precision: 5}),
        description: randPhrase({length: 1})[0],
    }
)

const _randomTimerFactory = () => {
    const variant = randNumber({min: 0, max: 1})
    const timer = {
        id: randUuid(),
        name: randAlpha({length: randNumber({min: 3, max: 10})}).join(""),
        description: randPhrase({length: 1})[0],
    }
    
    switch(variant) {
        case 0: // countdown: counts down for specified time
            timer.type = "countdown"
            timer.time = randNumber({min: 60_000, max: 60_000 * 60 * 4, precision: 1000}) // gives total time in milliseconds
            timer.activatedAt = null;
            return timer;
        case 1: //
            timer.type = "period";
            timer.start = randNumber({min: 0, max: 8.64e+7, precision: 1000});
            timer.end = timer.start + randNumber({min: 10*1000, max: 60 * 8 * 1000})
            timer.time = (timer.end - timer.start) * 60 * 1000
            if (timer.end > 8.64e+7) timer.end = timer.end - 8.64e+7
            return timer;
    }
}

const _randomRewardFactory = () => (
    {
        id: randUuid(),
        name: randAlpha({length: randNumber({min: 3, max: 10})}).join(""),
        cost: randNumber({min: 10, max: 500, precision: 10}),
        description: randPhrase({length: 1})[0],
    } 
)

const _randomDeductionFactory = () => (
    {
        id: randUuid(),
        name: randAlpha({length: randNumber({min: 3, max: 10})}).join(""),
        cost: randNumber({min: 10, max: 500, precision: 10}),
        description: randPhrase({length: 1})[0],
    } 
)

export default {

    getUsers(){
        return new Promise(resolve => {
            // axios.get("/users")
            const users = Array.from({length:20}, () => ({
                id: randUuid(),
                name: randFullName(), 
                points: randNumber({min: -10_000, max: 10_000, precision: 100}),
                tasks: Array.from({length: randNumber({min: 0, max: 10})}, _randomTaskFactory),
                timers: Array.from({length: randNumber({min: 0, max: 5})}, _randomTimerFactory),
                rewards: Array.from({length: randNumber({min: 0, max: 7})}, _randomRewardFactory),
                deductions: Array.from({length: randNumber({min: 0, max: 7})}, _randomDeductionFactory),

            }))
            this.setters.setUsers(users)
            resolve(users)
        })
    },

    getAdmins(){
        return new Promise(resolve => {
            // axios.get("/admins")
            const admins = Array.from({length: 3}, () => ({
                id: randUuid(),
                name: randFullName(),
                unlockCode: "123"
            }))
            this.setters.setAdmins(admins)
            resolve(admins)
        })
    }

}

