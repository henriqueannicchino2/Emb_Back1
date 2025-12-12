 
const mongoose = require('mongoose');

const DadosDoBebedouroSchema = new mongoose.Schema({
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
  temperatura_agua:{
    type: Number,
    required: true
	},
	ph:{
    type: Number,
    required: true
	},
  turbidez:{
    type: Number,
    required: true
	},
	vazao:{
		type: Number,
		required: true
	}
});

const DadosDoBebedouro = mongoose.model('DadosDoBebedouro', DadosDoBebedouroSchema);

module.exports = DadosDoBebedouro;