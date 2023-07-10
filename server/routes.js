import { nanoid } from 'nanoid';
import db from './db/db.js'
import { io } from './index.js';

export default [
    {
        method: "get",
        path: "/users",
        callback(req, res) {
            res.send(db.data.users)
        }
    },

    {
        method: "post",
        path: "/user",
        async callback(req, res) {
            const newUser = req.body;
            newUser.id = nanoid();
            db.data.users.push(req.body);
            await db.write()
            res.send(newUser);
            io.emit("usersUpdated", { users: db.data.users })
        }
    },

    {
        method: "put",
        path: "/user",
        async callback(req, res) {
            const update = req.body;
            db.data.users = db.data.users.map(user => user.id !== update.id ? user : update)
            await db.write()
            res.send(update);
            io.emit("usersUpdated", { users: db.data.users })
        }
    },

    {
        method: "delete",
        path: "/user",
        async callback(req, res) {
            db.data.users = db.data.users.filter(user => user.id !== req.body.id)
            await db.write()
            res.send(req.body.id);
            io.emit("usersUpdated", { users: db.data.users })
        }
    },


    {
        method: "post",
        path: "/timer/start",
        async callback(req, res) {
            const { userID, timerID } = req.body
            const startTime = Date.now();
            db.data.users = db.data.users.map(user => {
                if (user.id !== userID) return user;
                user.timers = user.timers.map(timer => {
                    if (timer.id !== timerID) return timer;
                    return { ...timer, startedAt: startTime };
                })
                return user;
            })
            await db.write();
            res.send({ startedAt: startTime })
            io.emit("usersUpdated", { users: db.data.users });
        }
    },

    {
        method: "post",
        path: "/timer/stop",
        async callback(req, res) {
            const { userID, timerID } = req.body
            const startTime = Date.now();
            db.data.users = db.data.users.map(user => {
                if (user.id !== userID) return user;
                user.timers = user.timers.map(timer => {
                    if (timer.id !== timerID) return timer;
                    return { ...timer, startedAt: null };
                })
                return user;
            })
            await db.write();
            res.send({ startedAt: startTime })
            io.emit("usersUpdated", { users: db.data.users });
        }
    },

    {
        method: "get",
        path: "/:userID/history",
        async callback(req, res){
            const {userID} = req.params;
            res.send(db.data.eventHistory.filter(event => event.userID === userID));
        }
    },

    {
        method: "post",
        path: "/:userID/history",
        async callback(req, res){
            const {userID} = req.params;
            const {eventType, eventName, points} = req.body;
            const time = Date.now()
            db.data.eventHistory.push({
                userID, 
                time,
                eventType,
                eventName,
                points,
            })
            await db.write();
            res.send({status: "success"})

        }
    },

    {
        method: "get",
        path: "/admins",
        async callback(req, res) {
            res.send(db.data.admins);
        }
    },

    {
        method: "post",
        path: "/admin",
        async callback(req, res) {
            const admin = req.body;
            const existingAdmin = db.data.admins.find(a => a.name === admin.name);
            if (existingAdmin) {
                existingAdmin.unlockCode = admin.unlockCode;
            } else {
                admin.id = nanoid();
                db.data.admins.push(admin);
            }
            await db.write();
            res.send(db.data.admins.find(a => a.name === admin.name));
        }
    }
]