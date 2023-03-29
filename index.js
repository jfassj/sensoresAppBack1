const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
require ('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

app.use('/img', express.static(__dirname + '/imagenes'));

const sensorSchema = require('./src/models/sensores');

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log('connected to mongoDB Atlas');
})
.catch((err)=>{
    console.log(`not connected to mongoDB Atlas: ${err}`);
});

app.get('/', (req, res) =>{
    res.send('hello world');
});

app.post('/sensor', (req, res)=>{
    const sensor = sensorSchema(req.body);
    sensor.save()
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch((err)=>{
        res.status(101).send(err)
    })
});

app.listen(port, ()=>console.log(`servidor escuchando en el puerto ${port}`));

