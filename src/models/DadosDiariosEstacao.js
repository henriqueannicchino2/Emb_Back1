const mongoose = require('mongoose');

const DadosDiariosEstacaoSchema = new mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now,
    required: true
  },
  _id: mongoose.Schema.Types.ObjectId,
	modulo_id:{
    type: Number,
    required: true
  },
  data:{
    type: Date,
    required: true
	},
  precipitacao:{
    type: Number,
    required: true
  },
	pressaoArMedia:{
    type: Number,
    required: true
  },
	pressaoArMaxima:{
    type: Number,
    required: true
  },
	pressaoArMinima:{
    type: Number,
    required: true
  },
	temperaturaArMedia:{
    type: Number,
    required: true
  },
	temperaturaArMaxima:{
    type: Number,
    required: true
  },
	temperaturaArMinima:{
    type: Number,
    required: true
  },
	temperaturaSoloMedia:{
    type: Number,
    required: true
  },
	temperaturaSoloMaxima:{
    type: Number,
    required: true
  },
	temperaturaSoloMinima:{
    type: Number,
    required: true
  },
	umidadeArMedia:{
    type: Number,
    required: true
  },
	umidadeArMaxima:{
    type: Number,
    required: true
  },
	umidadeArMinima:{
    type: Number,
    required: true
  },
	umidadeSoloMedia:{
    type: Number,
    required: true
  },
	umidadeSoloMaxima:{
    type: Number,
    required: true
  },
	umidadeSoloMinima:{
    type: Number,
    required: true
  },
	ventoMedia:{
    type: Number,
    required: true
  },
	ventoMaxima:{
    type: Number,
    required: true
  },
	ventoMinima:{
    type: Number,
    required: true
  },
	mediaUv:{
    type: Number,
    required: true
  },
	maxUv:{
    type: Number,
    required: true
  },
	minUv:{
    type: Number,
    required: true
  },
	anoElNino:{
    type: Number,
    default: 0
  },
	anoLaNina:{
    type: Number,
    default: 0
  }
});

const DadosDiariosEstacao = mongoose.model('DadosDiariosEstacao', DadosDiariosEstacaoSchema);

module.exports = DadosDiariosEstacao;