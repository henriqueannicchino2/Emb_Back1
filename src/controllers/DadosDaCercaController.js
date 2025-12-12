const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const DadosDaCerca = mongoose.model('DadosDaCerca');

const Cerca  = require("../models/DadosDaCerca");

module.exports = {
	async showAll(req, res){
		const dadosDaCerca = await DadosDaCerca.find();
		return res.json(dadosDaCerca);
		//return res.json('TESTE')
	},

	async show(req, res){
		const id = req.params.id;
		Cerca.findById(id)
			.select('_id modulo_id serial_sensor tensao createdAt')
			.exec()
			.then(doc => {
				console.log("Do banco de dados", doc);
				if(doc){
					res.status(200).json({
						Cerca: doc,
						request:{
							tipo: 'GET',
							descricao: 'Get todos as cercas',
							url: 'http://localhost:3000/dados_da_cerca'
						}
					});
				}else{
					res.status(404).json({message: 'Nenhuma cerca valida encontrada para o ID fornecido'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	},

	async store(req, res){
		//const dadosDaEstacao = await DadosDaEstacao.create(req.body);
		//return res.json(dadosDaEstacao);
		//return res.json(req.body);
		const cerca = new Cerca({
			_id: new mongoose.Types.ObjectId(),
			modulo_id: req.body.mi,
			serial_sensor: req.body.se,
			tensao: req.body.te,
			createdAt: req.body.CR
		});
		cerca
			.save()
			.then(result => {
				console.log(result);
				res.status(201).json({
					message: 'fence data created successfully',
					createdFence:{
						modulo_id: result.modulo_id,
						serial_sensor: result.serial_sensor,
						tensao: result.tensao,
						createdAt: result.createdAt,
						_id: result._id,
						request:{
							type: 'GET',
							url: 'http://localhost:3000/dados_da_cerca' + result._id
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
		//const dadosDaEstacao = await DadosDaEstacao.findByIdAndUpdate(req.params.id, req.body, { new: true });
		//return res.json(dadosDaEstacao);
		const id = req.params.id;
		const updateOps = {};
		for(const ops of req.body){
			updateOps[ops.propName] = ops.value;
		}
		Cerca.update({_id: id}, {$set: updateOps})
			.exec()
			.then(result => {
				console.log(result);
				res.status(200).json({
					message: 'Cerca Atualizada',
					request:{
						type: 'GET',
						url: 'http://localhost:3000/dados_da_cerca' + id
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
		//await DadosDaEstacao.findByIdAndRemove(req.params.id);
		//return res.json('Deleted');
		const id = req.params.id;
		Cerca.remove({_id: id})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Cerca deletada',
					request:{
						type: 'POST',
						url: 'http:// localhost:3000/dados_da_cerca',
						body: {mi: 'Number', se: 'String', te: 'Number'}
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