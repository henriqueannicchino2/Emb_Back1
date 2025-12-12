const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const DadosDoCocho = mongoose.model('DadosDoCocho');

const Cocho  = require("../models/DadosDoCocho");

module.exports = {
	async showAll(req, res){
		const dadosDoCocho = await DadosDoCocho.find();
		return res.json(dadosDoCocho);
		//return res.json('TESTE')
	},

	async show(req, res){
		const id = req.params.id;
		Cocho.findById(id)
			.select('_id modulo_id serial_sensor peso createdAt')
			.exec()
			.then(doc => {
				console.log("Do banco de dados", doc);
				if(doc){
					res.status(200).json({
						Cocho: doc,
						request:{
							tipo: 'GET',
							descricao: 'Get todos os cochos',
							url: 'http://localhost:5000/dados_do_cocho'
						}
					});
				}else{
					res.status(404).json({message: 'Nenhum cocho valido encontrado para o ID fornecido'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	},

	async store(req, res){
		//const dadosDoCocho = await DadosDoCocho.create(req.body);
		//return res.json(dadosDoCocho);
		//return res.json(req.body);
		const cocho = new Cocho({
			_id: new mongoose.Types.ObjectId(),
			modulo_id: req.body.mi,
			serial_sensor: req.body.se,
			peso: req.body.pe, createdAt: req.body.CR
		});
		cocho
			.save()
			.then(result => {
				console.log(result);
				res.status(201).json({
					message: 'trough data created successfully',
					createdTrough:{
						modulo_id: result.modulo_id,
						serial_sensor: result.serial_sensor,
						peso: result.peso,
						createdAt: req.body.CR,
						_id: result._id,
						request:{
							type: 'GET',
							url: 'http://localhost:5000/dados_do_cocho' + result._id
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
		//const dadosDoCocho = await DadosDoCocho.findByIdAndUpdate(req.params.id, req.body, { new: true });
		//return res.json(dadosDoCocho);
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
					message: 'Cocho Atualizado',
					request:{
						type: 'GET',
						url: 'http://localhost:5000/dados_do_cocho' + id
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
		//await DadosDoCocho.findByIdAndRemove(req.params.id);
		//return res.json('Deleted');
		const id = req.params.id;
		Cocho.remove({_id: id})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Cocho deletado',
					request:{
						type: 'POST',
						url: 'http:// localhost:5000/dados_do_cocho',
						body: {mi: 'Number', se: 'String', pe: 'Number'}
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