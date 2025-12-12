 const mongoose = require('mongoose');

//inemtBoaVista id-1
const DadosDaEstacaoSchema = new mongoose.Schema({
    createdAt:{
      type: Date,
      //default: Date.now
      required: true
    },
    /*updatedAt:{
      type: Date,
			//default: Date.now
    },*/
    _id: mongoose.Schema.Types.ObjectId,
    modulo_id:{
      type: Number,
      required: true
    },
    data:{
      type: Date,
      required: true
		},
    horario:{
      type: String,
      required: true
    },
    precipitacao:{
      type: Number,
      required: true
    },
    temperaturaAr:{
      type: Number,
      required: true
    },
    umidadeAr:{
      type: Number,
      required: true
    },
    pressaoAr:{
      type: Number,
      required: true
    },
    temperaturaSolo:{
      type: Number,
      required: true
    },
    umidadeSolo:{
      type: Number,
      required: true
    },
    vento:{
      type: Number,
      required: true
    },
    nivelUv:{
      type: Number,
      required: true
    }
});

const DadosDaEstacao = mongoose.model('DadosDaEstacao', DadosDaEstacaoSchema);

module.exports = DadosDaEstacao;