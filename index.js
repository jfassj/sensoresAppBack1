const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const lecturasSchema = require('./src/models/lecturas.js')
const sensorSchema = require('./src/models/sensores');
require ('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

app.use('/img', express.static(__dirname + '/imagenes'));


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

app.get('/sensores', (req, res)=>{
    sensorSchema.find()
    .then((data)=>{
        res.status(200).send({
            datos:cambiarDatos(data),
        })
    })
    .catch((err)=>{
        res.status(101).send(err);
    })
});

const cambiarDatos = (datos) => {
    let datos1 = [];
    datos.map((dato)=>(
        datos1.push({
            label:dato.nombre,
            value:dato._id,
        })
    ));
    return datos1;
}

app.get('/sensor/:id', (req, res) => {
    const{id} = req.params;
    sensorSchema.findById(id)
    .then((data)=>{
        res.status(200).send(data)
    })
    .catch((err)=>{
        res.status(101).send(err);
    }) 
})

app.get('/lecturas/:id', (req, res) => {
    const{id} = req.params;
    lecturasSchema.find({"id_sensor":id})
    .then((data)=>{
        res.status(200).send(data)
    })
    .catch((err)=>{
        res.status(101).send(err);
    })    
    })

app.post('/lectura', (req, res)=>{
    let lec = {
        'id_sensor': req.body.id_sensor,
        'valor': Number.parseFloat(req.body.valor),
        'fecha': new Date(),
    }
    const lectura = lecturasSchema(lec);
    lectura.save()
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch((err)=>{
        res.status(101).send(err)
    })
});
app.listen(port, ()=>console.log(`servidor escuchando en el puerto ${port}`));

