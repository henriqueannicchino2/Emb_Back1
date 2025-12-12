 
const mongoose = require('mongoose');

const DadosDaCercaSchema = new mongoose.Schema({
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
  tensao:{
    type: Number,
    required: true
	}
});

const DadosDaCerca = mongoose.model('DadosDaCerca', DadosDaCercaSchema);

module.exports = DadosDaCerca;