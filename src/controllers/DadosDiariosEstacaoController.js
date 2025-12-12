const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const DadosDiariosEstacao = mongoose.model('DadosDiariosEstacao');

const DadosDiarios = require("../models/DadosDiariosEstacao");

module.exports = {
	async showAll(req, res){
		DadosDiarios.find().sort({data: 1})
		.select()
		.exec()
		.then(doc => {
			if(doc){
				res.status(200).json({
					Dados: doc
				});
			}
			else{
				res.status(404).json({message: 'sem dados'});
			}
		})
	},
	
	async showMod(req, res){
		const modulo_id = req.query.modulo_id;
		DadosDiarios.find({"modulo_id": modulo_id}).sort({data: -1})
		.select()
		.exec()
		.then(doc => {
			if(doc){
				res.status(200).json({
					Dados: doc
				});
			}else{
				res.status(404).json({message: 'Dado invalido'});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: err});
		});
	},
	
	async showAnual(req, res){
		const modulo_id = req.query.modulo_id;
		DadosDiarios.find({"modulo_id": modulo_id}).sort({data: -1}).limit(1)
		.select('data')
		.exec()
		.then(doc => { 
			if(doc){
				if(doc.length > 0){
					var tempData1 = JSON.stringify(doc[0].data);
					var tempMes1 = tempData1.slice(6,11), tempAno1 = tempData1.slice(1,5);
					if(tempMes1 !== "12-31"){
						tempAno1 = parseInt(tempAno1);
						tempAno1--;
					}
					DadosDiarios.find({"modulo_id": modulo_id}).sort({data: 1}).limit(1)
					.select('data')
					.exec()
					.then(doc2 => {
						var tempData2 = JSON.stringify(doc2[0].data);
						var tempMes2 = tempData2.slice(6,11), tempAno2 = tempData2.slice(1,5);
						if(tempMes2 !== "01-01"){
							tempAno2 = parseInt(tempAno2);
							tempAno2++;//comentar aqui para teste
						}
						if(tempAno2 > tempAno1){
							res.status(200).json({
								Anoi: '',
								Anof: '',
								Precipitacao: []
							});
						}
						else{
							tempData1 = tempAno1+"-12-31"; tempData2 = tempAno2+"-01-01";
							
							DadosDiarios.find({"modulo_id": modulo_id, "data": { $gte: tempData2, $lte: tempData1 }})
							.select('precipitacao data')
							.exec()
							.then(doc3 => {
								var precipitacaoMeses = [0,0,0,0,0,0,0,0,0,0,0,0], cont=0;
								var tempData, tempMes;
								while(cont < doc3.length){
									tempData = JSON.stringify(doc3[cont].data);
									tempMes = parseInt(tempData.slice(6,8));
									precipitacaoMeses[tempMes-1] += doc3[cont].precipitacao;
									
									cont++;
								}
								cont=0;
								while(cont < 12){
									precipitacaoMeses[cont] = precipitacaoMeses[cont].toFixed(1);
									cont++;
								}
								res.status(200).json({
									Anoi: tempAno2,
									Anof: tempAno1,
									Precipitacao: precipitacaoMeses
								});
							})
							.catch(err => {
								console.log(err);
								res.status(500).json({error: err});
							});
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({error: err});
					});
				}else{
					res.status(200).json({
						Anoi: '',
						Anof: '',
						Precipitacao: []
					});
				}
			}else{
				res.status(404).json({message: 'Dado invalido'});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: err});
		});
	},
	
	async store(req, res){
		const dadosDiari0s = new DadosDiarios({
			_id: new mongoose.Types.ObjectId(),
			modulo_id: req.body.mid,
			data: req.body.da,
			precipitacao: req.body.pr,
			pressaoArMedia: req.body.Prm,
			pressaoArMaxima: req.body.PRM,
			pressaoArMinima: req.body.PRm,
			temperaturaArMedia: req.body.tam,
			temperaturaArMaxima: req.body.tAM,
			temperaturaArMinima: req.body.tAm,
			temperaturaSoloMedia: req.body.tsm,
			temperaturaSoloMaxima: req.body.tSM,
			temperaturaSoloMinima: req.body.tSm,
			umidadeArMedia: req.body.uam,
			umidadeArMaxima: req.body.uAM,
			umidadeArMinima: req.body.uAm,
			umidadeSoloMedia: req.body.usm,
			umidadeSoloMaxima: req.body.uSM,
			umidadeSoloMinima: req.body.uSm,
			ventoMedia: req.body.vtm,
			ventoMaxima: req.body.vTM,
			ventoMinima: req.body.vTm,
			mediaUv: req.body.uvm,
			maxUv: req.body.uVM,
			minUv: req.body.uVm
		});
		dadosDiari0s
			.save()
			.then(result => {
				res.status(201).json({
					message: 'data created successfully',
					createdStation:{
						modulo_id: result.modulo_id,
						data: result.data,
						precipitacao: result.precipitacao,
						pressaoArMedia: result.pressaoArMedia,
						pressaoArMaxima: result.pressaoArMaxima,
						pressaoArMinima: result.pressaoArMinima,
						temperaturaArMedia: result.temperaturaArMedia,
						temperaturaArMaxima: result.temperaturaArMaxima,
						temperaturaArMinima: result.temperaturaArMinima,
						temperaturaSoloMedia: result.temperaturaSoloMedia,
						temperaturaSoloMaxima: result.temperaturaSoloMaxima,
						temperaturaSoloMinima: result.temperaturaSoloMinima,
						umidadeArMedia: result.umidadeArMedia,
						umidadeArMax: result.umidadeArMax,
						umidadeArMin: result.umidadeArMin,
						umidadeSoloMedia: result.umidadeArMedia,
						umidadeSoloMaxima: result.umidadeSoloMaxima,
						umidadeSoloMinima: result.umidadeSoloMinima,
						ventoMedia: result.ventoMedia,
						ventoMaxima: result.ventoMaxima,
						ventoMinima: result.ventoMinima,
						mediaUv: result.mediaUv,
						maxUv: result.maxUv,
						minUv: result.minUv,
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
	
	async update(req,res){
		const id = req.params.id;
		const updateOps = {};
		for(const ops of req.body){
			updateOps[ops.propName] = ops.value;
		}
		DadosDiarios.update({_id: id}, {$set: updateOps})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Dados do módulo Atualizado'
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				})
			});
	},
	
	async destroy(req, res){
		const id = req.params.id;
		DadosDiarios.deleteOne({_id: id})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Dados do módulo deletado',
					/*request:{
						type: 'POST',
						body: {da: 'Date', pr: 'Number',CR: 'Date'}
					}*/
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