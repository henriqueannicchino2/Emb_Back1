const mongoose = require('mongoose');

const ModulosSchema = new mongoose.Schema({
  createdAt:{
    type: Date,
    //default: Date.now
    required: true
  },
  _id: mongoose.Schema.Types.ObjectId,
	modulo_id:{
    type: Number,
		unique: true,
    required: true
  },
	nome_modulo:{
		type: String,
		unique: true,
		required: true
	},
	municipio:{
		type: String,
		required: true
	},
	altitude:{
		type: Number,
		default: -99,
		required: true
	},
	estado:{
		type: String,
		required: true
	},
	longitude:{
		type: String,
		required: true
	},
	latitude:{
		type: String,
		required: true
	},
	responsavel:{
		type: String,
		required: true
	},
	proprietario:{
		type: String,
		required: true
	},
	gestor:{
		type: String,
		required: true
	},
	tipo:{
		type: String,
		required: true
	},
	online:{
		type: Number,
		required: true
	}
});

const Modulos = mongoose.model('Modulos', ModulosSchema);

module.exports = Modulos;