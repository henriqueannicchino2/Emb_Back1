const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const DadosDoBebedouro = mongoose.model('DadosDoBebedouro');

const Bebedouro = require("../models/DadosDoBebedouro");

module.exports = {
	async showAll(req, res){
		const dadosDoBebedouro = await DadosDoBebedouro.find();
		return res.json(dadosDoBebedouro);
		//return res.json('TESTE')
	},

	async show(req, res){
		const id = req.params.id;
		Bebedouro.findById(id)
			.select('_id modulo_id serial_sensor temperatura_agua ph vazao createdAt')
			.exec()
			.then(doc => {
				console.log("Do banco de dados", doc);
				if(doc){
					res.status(200).json({
						Bebedouro: doc,
						request:{
							tipo: 'GET',
							descricao: 'Get todos os Dados do Bebedouro',
							url: 'http://localhost:5000/dados_do_Bebedouro'
						}
					});
				}else{
					res.status(404).json({message: 'Nenhum Bebedouro valido encontrado para o ID fornecido'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	},

	async store(req, res){
		//const dadosDoBebedouro = await DadosDoBebedouro.create(req.body);
		//return res.json(dadosDoBebedouro);
		//return res.json(req.body);
		const bebedouro = new Bebedouro({
			_id: new mongoose.Types.ObjectId(),
			modulo_id: req.body.mi,
			serial_sensor: req.body.se,
			temperatura_agua: req.body.TA,
			ph: req.body.ph, turbidez: req.body.TB,
			vazao: req.body.VZ, createdAt: req.body.CR
		});
		bebedouro
			.save()
			.then(result => {
				console.log(result);
				res.status(201).json({
					message: 'water_trough data created successfully',
					createdWater_Trough:{
						modulo_id: result.modulo_id,
						serial_sensor: result.serial_sensor,
						temperatura_agua: result.temperatura_agua,
						ph: result.ph,
						turbidez: result.TB,
						vazao: result.VZ,
						createdAt: req.body.CR,
						_id: result._id,
						request:{
							type: 'GET',
							url: 'http://localhost:5000/dados_do_Bebedouro/' + result._id
						}
					}
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	},


	//desnecessário na versão final
	async update(req,res){
		//const dadosDoBebedouro = await DadosDoBebedouro.findByIdAndUpdate(req.params.id, req.body, { new: true });
		//return res.json(dadosDoBebedouro);
		const id = req.params.id;
		const updateOps = {};
		for(const ops of req.body){
			updateOps[ops.propName] = ops.value;
		}
		Bebedouro.update({_id: id}, {$set: updateOps})
			.exec()
			.then(result => {
				console.log(result);
				res.status(200).json({
					message: 'Bebedouro Atualizado',
					request:{
						type: 'GET',
						url: 'http://localhost:5000/dados_do_bebedouro/' + id
					}
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				})
			});
	},

	//desnecessário na versão final
	async destroy(req, res){
		//await DadosDoBebedouro.findByIdAndRemove(req.params.id);
		//return res.json('Deleted');
		const id = req.params.id;
		Bebedouro.remove({_id: id})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Bebedouro deletado',
					request:{
						type: 'POST',
						url: 'http:// localhost:5000/dados_do_Bebedouro',
						body: {mi: 'Number', se: 'String', TA: 'Number', ph: 'Number', TB: 'Number', }
					}
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	}

};