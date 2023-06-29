import express from 'express';
import bodyParser from 'body-parser';
// import db from './db/db.js'
import routes from './routes.js'

const app = express();
const port = 8000

app.get("/", (req, res) => {
    res.send("Hello world!!!");
})

for(let route of routes) {
    app[route.method]?.(route.path, bodyParser.json(), route.callback)
}

app.listen(port, () => {
    console.log(`Serving at http://localhost:${port}/`);
})
