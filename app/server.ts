import express = require("express");
import { resolve } from "path"
require("dotenv-safe").config({ path: resolve(__dirname, "../.env"),sample: resolve(__dirname, "../.env.example")  });
var cors = require('cors');
var bodyParser = require('body-parser');

const app: express.Application = express();

var singleton = require('./kernel/singleton');
singleton.setExpressApp(app);

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('./actions');

const port: number = 3000;

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});