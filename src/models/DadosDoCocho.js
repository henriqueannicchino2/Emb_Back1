 
const mongoose = require('mongoose');

const DadosDoCochoSchema = new mongoose.Schema({
    createdAt:{
			type: Date,
			//default: Date.now
			required: true
    },
    updatedAt:{
			type: Date,
			default: Date.now
    },
    _id: mongoose.Schema.Types.ObjectId,
    modulo_id:{
        type: Number,
        required: true
    },
    serial_sensor:{
        type: String,
        required: true
    },
    peso:{
        type: Number,
        required: true
	}
});

const DadosDoCocho = mongoose.model('DadosDoCocho', DadosDoCochoSchema);

module.exports = DadosDoCocho;