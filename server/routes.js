import { nanoid } from 'nanoid';
import db from './db/db.js'

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
        }
    },

    {
        method: "delete",
        path: "/user",
        async callback(req, res) {
            db.data.users = db.data.users.filter(user => user.id !== req.body.id)
            await db.write()
            res.send(req.body.id);
        }
    },

]