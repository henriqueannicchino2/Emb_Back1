const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const modulos = mongoose.model('Modulos');
const Modulo = require("../models/Modulos");

module.exports = {
	async showAll(req, res){
		const Modulos = await modulos.find();
		return res.json(Modulos);
	},
	
	async show(req, res){
		const id = req.params.id;
		Modulo.find({"modulo_id": id})
			.select()
			.exec()
			.then(doc => {
				//console.log("Do banco de dados", doc);
				if(doc){
					res.status(200).json({
						Modulo: doc,
						request:{
							tipo: 'GET',
							descricao: 'Get todos os modulos',
							url: 'http://localhost:3000/modulos'
						}
					});
				}else{
					res.status(404).json({message: 'Nenhuma modulo encontrado para o ID fornecido'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	},
	
	
	async show_type(req, res){
		const tipo = req.query.tipo;
		const online = req.query.online;
		Modulo.find({"tipo": tipo}).sort({modulo_id: 1})
			.select()
			.exec()
			.then(doc => {
				//console.log("Do banco de dados", doc);
				if(doc){
					res.status(200).json({
						Modulo: doc,
						request:{
							tipo: 'GET',
							descricao: 'Get todos os modulos',
							url: 'http://localhost:3000/modulos'
						}
					});
				}else{
					res.status(404).json({message: 'Nenhum modulo encontrado para o ID fornecido'});
				}
				})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	},

//temporario
	async store(req, res){
		const modul0 = new Modulo({
			_id: new mongoose.Types.ObjectId(),
			modulo_id: req.body.mid,
			nome_modulo: req.body.nm,
			municipio: req.body.mun,
			estado: req.body.uf,
			longitude: req.body.lng,
			latitude: req.body.lat,
			responsavel: req.body.res,
			proprietario: req.body.prop,
			gestor: req.body.gtr,
			tipo: req.body.ty,
			online: req.body.on,
      createdAt: req.body.CR
		});
		modul0
			.save()
			.then(result => {
				res.status(201).json({
					message: 'data created successfully',
					createdStation:{
						modulo_id: result.modulo_id,
						nome_modulo: result.nome_modulo,
						municipio: result.municipio,
						estado: result.estado,
						latitude: result.latitude,
						longitude: result.longitude,
						responsavel: result.responsavel,
						proprietario: result.proprietario,
						gestor: result.gestor,
						tipo: result.tipo,
						online: result.online,
						createdAt: result.createdAt,
						_id: result._id
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

	//desnecessario na versao final
	async update(req,res){
		const id = req.params.id;
		const updateOps = {};
		for(const ops of req.body){
			updateOps[ops.propName] = ops.value;
		}
		Modulo.update({modulo_id: id}, {$set: updateOps})
			.exec()
			.then(result => {
				console.log(result);
				res.status(200).json({
					message: 'Modulo atualizado'
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				})
			});
	},

	//desnecessario na versao final
	async destroy(req, res){
		const id = req.params.id;
		Modulo.remove({modulo_id: id})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Modulo deletado',
					request:{
						type: 'POST',
						body: {mid: 'Number', nm: 'String', mun: 'String', uf: 'String', lng: 'String', lat: 'String', res: 'String',
						prop: 'String', gtr: 'String', ty: 'String', on: 'Number', CR: 'Date'}
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
	
};