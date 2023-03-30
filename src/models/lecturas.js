const mongoose = require('mongoose');

const lecturasSchema = mongoose.Schema({
    id_sensor:{
        type: String,
        required: true,
    },
    valor:{
        type: Number,
        required: true,
    },
    fecha:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("lectura", lecturasSchema);
 
