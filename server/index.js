import express from 'express';
import bodyParser from 'body-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// import db from './db/db.js'
import routes from './routes.js'

const app = express();
const port = 8000

app.use("/", express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist")))

// app.get("/", (req, res) => {
//     res.send("Hello world!!!");
// })

for(let route of routes) {
    app[route.method]?.(route.path, bodyParser.json(), route.callback)
}

app.listen(port, () => {
    console.log(`Serving at http://localhost:${port}/`);
})
