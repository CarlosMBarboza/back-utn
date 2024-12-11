const express = require("express");
const router = require("./routes/routing");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");



mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/utn-restapi", {
}).then(() => {
console.log("Conectado a la base de datos");
}).catch((error) => {
console.log("Error al conectar a la base de datos", error);
});


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/', router());
app.use(express.static('img'));



app.listen(3000, () => {
  console.log("Esta escuchando en el puerto 3000");
});
