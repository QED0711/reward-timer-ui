import { API_BASE } from "../../config/parsedConfig";
import axios from "axios";
import {
    randFullName,
    randNumber,
    randUuid,
    randPhrase,
    randJobDescriptor,
    randVerb,
    randAlpha
} from "@ngneat/falso";

import { DateTime } from "luxon"
import apiManager from "../../api/apiManager";

axios.defaults.headers.common['x-api-key'] = apiManager.getters.getApiKey() ?? ""

const _randomTaskFactory = () => (
    {
        id: randUuid(),
        name: randVerb(),
        amount: randNumber({ min: 10, max: 100, precision: 5 }),
        description: randPhrase({ length: 1 })[0],
    }
)

const _randomTimerFactory = () => {
    const variant = randNumber({ min: 0, max: 1 })
    const timer = {
        id: randUuid(),
        name: randAlpha({ length: randNumber({ min: 3, max: 10 }) }).join(""),
        description: randPhrase({ length: 1 })[0],
    }

    switch (variant) {
        case 0: // countdown: counts down for specified time
            timer.type = "countdown"
            timer.time = randNumber({ min: 60_000, max: 60_000 * 60 * 4, precision: 1000 }) // gives total time in milliseconds
            timer.activatedAt = null;
            return timer;
        case 1: //
            timer.type = "period";
            timer.start = randNumber({ min: 0, max: 8.64e+7, precision: 1000 });
            timer.end = timer.start + randNumber({ min: 10 * 1000, max: 60 * 8 * 1000 })
            timer.time = (timer.end - timer.start) * 60 * 1000
            if (timer.end > 8.64e+7) timer.end = timer.end - 8.64e+7
            return timer;
    }
}

const _randomRewardFactory = () => (
    {
        id: randUuid(),
        name: randAlpha({ length: randNumber({ min: 3, max: 10 }) }).join(""),
        cost: randNumber({ min: 10, max: 500, precision: 10 }),
        description: randPhrase({ length: 1 })[0],
    }
)

const _randomDeductionFactory = () => (
    {
        id: randUuid(),
        name: randAlpha({ length: randNumber({ min: 3, max: 10 }) }).join(""),
        cost: randNumber({ min: 10, max: 500, precision: 10 }),
        description: randPhrase({ length: 1 })[0],
    }
)

export default {

    getUsers() {
        return new Promise(resolve => {
            axios.get(API_BASE + "/users")
                .then(response => {
                    if (response.status === 200) {
                        this.setters.setUsers(response.data);
                    }
                    resolve(response.data)
                })
                .catch(err => {
                    console.error(err)
                    this.setters.setUsers([])
                    resolve([])
                })
            // const users = Array.from({length:20}, () => ({
            //     id: randUuid(),
            //     name: randFullName(), 
            //     points: randNumber({min: -10_000, max: 10_000, precision: 100}),
            //     tasks: Array.from({length: randNumber({min: 0, max: 10})}, _randomTaskFactory),
            //     timers: Array.from({length: randNumber({min: 0, max: 5})}, _randomTimerFactory),
            //     rewards: Array.from({length: randNumber({min: 0, max: 7})}, _randomRewardFactory),
            //     deductions: Array.from({length: randNumber({min: 0, max: 7})}, _randomDeductionFactory),

            // }))
            // this.setters.setUsers(users)
            // resolve(users)
        })
    },

    createUser(user) {
        return new Promise(resolve => {
            axios.post(API_BASE + "/user", user)
                .then(response => {
                    if (response.status === 200) {
                        this.restAPI.getUsers();
                        resolve(response.data)
                    }
                })
                .catch(err => {
                    console.error(err);
                    resolve(null);
                })
        })
    },

    updateUser(user) {
        return new Promise(resolve => {
            axios.put(API_BASE + "/user", user)
                .then(response => {
                    if (response.status === 200) {
                        this.restAPI.getUsers();
                        resolve(response.data)
                    } else {
                        resolve(null)
                    }
                })
                .catch(err => {
                    console.error(err)
                    resolve(null)
                })
        })
    },

    deleteUser(user) {
        return new Promise(resolve => {
            axios.delete(API_BASE + "/user", { data: { id: user.id } })
                .then(response => {
                    this.restAPI.getUsers();
                    resolve(user.id)
                })
                .catch(err => {
                    console.error(err);
                    resolve(null);
                })
        })
    },


    startCountdown(timerID) {
        const userID = this.state.selectedUser?.id;
        return new Promise(resolve => {
            axios.post(API_BASE + "/timer/start", { userID, timerID })
                .then(response => {
                    resolve(response.data)
                })
                .catch(err => {
                    console.error(err)
                    resolve(null)
                })
        })
    },

    stopCountdown(timerID) {
        const userID = this.state.selectedUser?.id;
        return new Promise(resolve => {
            axios.post(API_BASE + "/timer/stop", { userID, timerID })
                .then(response => {
                    resolve(response.data)
                })
                .catch(err => {
                    console.error(err)
                    resolve(null)
                })
        })
    },

    getAdmins() {
        return new Promise(resolve => {
            axios.get(API_BASE + "/admins")
                .then(response => {
                    if (response.status === 200) {
                        this.setters.setAdmins(response.data);
                        resolve(response.data);
                    } else {
                        this.setters.setAdmins([]);
                        resolve([])
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.setters.setAdmins([]);
                    resolve([])
                })
            //     const admins = Array.from({length: 3}, () => ({
            //         id: randUuid(),
            //         name: randFullName(),
            //         unlockCode: "123"
            //     }))
            //     this.setters.setAdmins(admins)
            //     resolve(admins)
        })
    },

    createAdmin(admin) {
        return new Promise(resolve => {
            axios.post(API_BASE + "/admin", admin)
                .then(response => {
                    if (response.status === 200) {
                        this.restAPI.getAdmins();
                        resolve(response.data)
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.restAPI.getAdmins();
                    resolve([])
                })
        })
    },

    getUserHistory() {
        return new Promise(resolve => {
            axios.get(API_BASE + `/${this.state.selectedUser.id}/history`)
                .then(response => {
                    if (response.status === 200) {
                        resolve(response.data);
                    }
                })
                .catch(err => {
                    resolve([]);
                    console.error(err);
                })
        })
    },

    recordEvent({ eventType, eventName, points, }) {
        return new Promise(resolve => {
            axios.post(API_BASE + `/${this.state.selectedUser.id}/history`, {eventType, eventName, points})
                .then(response => {
                    if (response.status === 200) {
                        resolve(response.data);
                    }
                })
                .catch(err => {
                    resolve({ success: false });
                    console.error(err);
                })
        })
    }

}

