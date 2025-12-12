const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const DadosDaEstacao = mongoose.model('DadosDaEstacao');

const Estacao  = require("../models/DadosDaEstacao");
const DadosDiarios = require("../models/DadosDiariosEstacao");

module.exports = {
	async showAll(req, res){
		const dadosDaEstacao = await DadosDaEstacao.find();
		return res.json(dadosDaEstacao);
		//return res.json('TESTE')
	},

	async show(req, res){
		//const dadosDaEstacao = await DadosDaEstacao.findById(req.params.id);
		//return res.json(dadosDaEstacao);
		const id = req.params.id;
		//Estacao.findById(id)
		Estacao.find({"modulo_id": id}).sort({createdAt: -1})
			.select('_id modulo_id serial_sensor data horario precipitacao temperaturaAr umidadeAr pressaoAr temperaturaSolo umidadeSolo vento nivelUv mediaUv createdAt')
			.exec()
			.then(doc => {
				//console.log("Do banco de dados", doc);
				if(doc){
					res.status(200).json({
						Estacao: doc,
						request:{
							tipo: 'GET',
							descricao: 'Get todos as estacoes',
							url: 'http://localhost:5000/dados_da_estacao'
						}
					});
				}else{
					res.status(404).json({message: 'Nenhuma estacao valida encontrada para o ID fornecido'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	},
	
	async show_online_data(req, res){
		const modulo_id = req.query.modulo_id;
		Estacao.find({"modulo_id": modulo_id}).sort({createdAt: -1}).limit(1)
		.select('data temperaturaAr umidadeAr vento')
		.exec()
		.then(doc => {
			if(doc){
				var date = doc[0].data, temperature = doc[0].temperaturaAr, moisture = doc[0].umidadeAr, wind = doc[0].vento;
				Estacao.find({"modulo_id": modulo_id, "data": date})
				.select('precipitacao')
				.exec()
				.then(doc2 => {
					if(doc2){
						var tempdate = JSON.stringify(date);
						date = tempdate.slice(9,11)+"/"+tempdate.slice(6,8)+"/"+tempdate.slice(1,5);
						var count=0, precipitation=0;
						while(count < doc2.length){
							precipitation+=doc2[count].precipitacao;
							count++;
						}
						res.status(200).json({
							data: date,
							temperatura: temperature,
							umidade: moisture,
							vento: wind,
							precipitacao: precipitation
						});
					}else{
						res.status(404).json({message: 'Dado invalido2'});
					}
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({error: err});
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
	
	async show_precipitation(req, res){
		const paramenter = req.query.periodo, modulo_id = req.query.modulo_id;
		if(paramenter==="hoje"){
			Estacao.find({"modulo_id": modulo_id}).sort({createdAt: -1}).limit(1)
			.select('data')
			.exec()
			.then(doc => {
				//console.log("Do banco de dados", doc);
				if(doc){
					/*var temp = JSON.stringify(doc[0].createdAt), temp2 = JSON.stringify(doc[0].createdAt);
					temp = temp.slice(1,11) + "T00:00:00.000Z";
					temp2 = temp2.slice(1,11) + "T23:59:59.000Z";*/
					var temp = doc[0].data;
					Estacao.find({"data": temp}).sort({createdAt: -1})
					.select('precipitacao data horario')
					.exec()
					.then(doc2 => {
						if(doc2){
							res.status(200).json({
								MesesCount: 0,
								IgualBotao: 1,
								Precipitacao: doc2
							});
						}else{
							res.status(404).json({message: 'Dado invalido2'});
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({error: err});
					});
				}else{
					res.status(404).json({message: 'Dado invalido'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
		}		
		else if(paramenter==="dia"){
			Estacao.find({"modulo_id": modulo_id}).sort({createdAt: -1}).limit(49)
			.select('data')
			.exec()
			.then(doc => {
				//console.log("Do banco de dados", doc);
				if(doc){
					if(doc.length > 1){
						var cont = 2;
						var temp = JSON.stringify(doc[0].data);
						var temp2 = JSON.stringify(doc[1].data);
						while(temp===temp2 && cont<doc.length){
							var temp2 = JSON.stringify(doc[cont].data);
							cont++;
						}
						if(temp!==temp2){
							temp2 = temp2.slice(1,25);
							Estacao.find({"data": temp2 }).sort({createdAt: -1})
							.select('precipitacao data horario')
							.exec()
							.then(doc2 => {
								if(doc2){
									res.status(200).json({
										MesesCount: 0,
										IgualBotao: 1,
										Precipitacao: doc2
									});
								}else{
									res.status(404).json({message: 'Dado invalido2'});
								}
							})
							.catch(err => {
								console.log(err);
								res.status(500).json({error: err});
							});
						}
						else{
							res.status(200).json({
								MesesCount: 0,
								IgualBotao: 0,
								Precipitacao: []
							});
						}
					}else{
						res.status(200).json({
							MesesCount: 0,
							IgualBotao: 0,
							Precipitacao: doc
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
		}
	},
	
	async show_temperatura_ar(req, res){
		const paramenter = req.query.periodo, modulo_id = req.query.modulo_id;
		if(paramenter==="hoje"){
			Estacao.find({"modulo_id": modulo_id}).sort({createdAt: -1}).limit(1)
			.select('data')
			.exec()
			.then(doc => {
				//console.log("Do banco de dados", doc);
				if(doc){
					var temp = doc[0].data;
					Estacao.find({"modulo_id": modulo_id, "data": temp}).sort({createdAt: -1})
					.select('temperaturaAr data horario')
					.exec()
					.then(doc2 => {
						if(doc2){
							res.status(200).json({
								MesesCount: 0,
								IgualBotao: 1,
								Temperatura: doc2
							});
						}else{
							res.status(404).json({message: 'Dado invalido2'});
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({error: err});
					});
				}else{
					res.status(404).json({message: 'Dado invalido'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
		}
		else if(paramenter==="dia"){
			Estacao.find({"modulo_id": modulo_id}).sort({createdAt: -1}).limit(49)
			.select('data')
			.exec()
			.then(doc => {
				//console.log("Do banco de dados", doc);
				if(doc){
					if(doc.length > 1){
						var cont = 2;
						var temp = JSON.stringify(doc[0].data);
						var temp2 =JSON.stringify(doc[1].data);
						while(temp===temp2){
							var temp2 =JSON.stringify(doc[cont].data);
							cont++;
						}
						if(temp!==temp2){
							temp2 = temp2.slice(1,25);
							Estacao.find({"modulo_id": modulo_id, "data": temp2}).sort({createdAt: -1})
							.select('temperaturaAr data horario')
							.exec()
							.then(doc2 => {
								if(doc2){
									res.status(200).json({
										MesesCount: 0,
										IgualBotao: 1,
										Temperatura: doc2
									});
								}else{
									res.status(404).json({message: 'Dado invalido2'});
								}
							})
							.catch(err => {
								console.log(err);
								res.status(500).json({error: err});
							});
						}
						else{
							res.status(200).json({
								MesesCount: 0,
								IgualBotao: 0,
								Precipitacao: []
							});
						}
					}else{
						res.status(200).json({
							MesesCount: 0,
							IgualBotao: 0,
							Temperatura: doc
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
		}
	},

	async store(req, res){
		//const dadosDaEstacao = await DadosDaEstacao.create(req.body);
		//return res.json(dadosDaEstacao);
		//return res.json(req.body);
		
		//salva os dados recebidos do corpo da requisicao na constante estacao
		const estacao = new Estacao({
			_id: new mongoose.Types.ObjectId(),
			modulo_id: req.body.mi,
			data: req.body.da,
			horario: req.body.ho,
			precipitacao: req.body.pr,
			temperaturaAr: req.body.ta,
			umidadeAr: req.body.ua,
			pressaoAr: req.body.pa,
			temperaturaSolo: req.body.ts,
			umidadeSolo: req.body.us,
			vento: req.body.ve,
			nivelUv: req.body.nu,
			//mediaUv: req.body.mu,
			//updatedAt: req.body.UP,
      createdAt: req.body.CR
		});
		var modulo_id = estacao.modulo_id;
		estacao
		.save()
		.then(result => {
			
			//apos salvar os novos dados busca no banco pelo os ultimos dois dados e checa a data de criação deles
			//eh diferente caso seja ira salvar a soma da precipitacao do dia anterior na colecao precipitacao
			Estacao.find({"modulo_id": modulo_id}).sort({data: -1}).limit(2)
			.select('data')
			.exec()
			.then(doc => {
				if(doc.length > 1){
					//console.log("Do banco de dados", doc);
					var data1 = JSON.stringify(doc[0].data), data2 = JSON.stringify(doc[1].data), temp, temp2;
					temp = data1.slice(1,11); temp2 = data2.slice(1,11);
					if(temp !== temp2){
						temp = doc[0].data;
						temp2 = doc[1].data;
						Estacao.find({"modulo_id": modulo_id, "data": temp2})
						.select('horario precipitacao temperaturaAr umidadeAr pressaoAr temperaturaSolo umidadeSolo vento nivelUv')
						.exec()
						.then(doc2 => {
							//Vet[0] soma, vet[1] maxima, vet[2] minima
							var count = 0, precipitacaoTotal = 0, temperaturaArVet=[], umidadeArVet=[], pressaoArVet=[], temperaturaSoloVet=[],
							umidadeSoloVet=[], ventoVet=[], nivelUvVet=[];
							temperaturaArVet[0] = 0; temperaturaArVet[1] = doc2[0].temperaturaAr; temperaturaArVet[2] = doc2[0].temperaturaAr;
							umidadeArVet[0] = 0; umidadeArVet[1] = doc2[0].umidadeAr; umidadeArVet[2] = doc2[0].umidadeAr;
							pressaoArVet[0] = 0; pressaoArVet[1] = doc2[0].pressaoAr; pressaoArVet[2] = doc2[0].pressaoAr;
							temperaturaSoloVet[0] = 0; temperaturaSoloVet[1] = doc2[0].temperaturaSolo; temperaturaSoloVet[2] = doc2[0].temperaturaSolo;
							umidadeSoloVet[0] = 0; umidadeSoloVet[1] = doc2[0].umidadeSolo; umidadeSoloVet[2] = doc2[0].umidadeSolo;
							ventoVet[0] = 0; ventoVet[1] = doc2[0].vento; ventoVet[2] = doc2[0].vento;
							nivelUvVet[0] = 0; nivelUvVet[1] = doc2[0].nivelUv; nivelUvVet[2] = doc2[0].nivelUv;
							while(count < doc2.length){
								precipitacaoTotal += doc2[count].precipitacao;
								temperaturaArVet[0] += doc2[count].temperaturaAr;
								if(temperaturaArVet[1] < doc2[count].temperaturaAr) temperaturaArVet[1] = doc2[count].temperaturaAr;
								if(temperaturaArVet[2] > doc2[count].temperaturaAr) temperaturaArVet[2] = doc2[count].temperaturaAr;
								umidadeArVet[0] += doc2[count].umidadeAr;
								if(umidadeArVet[1] < doc2[count].umidadeAr) umidadeArVet[1] = doc2[count].umidadeAr;
								if(umidadeArVet[2] > doc2[count].umidadeAr) umidadeArVet[2] = doc2[count].umidadeAr;
								pressaoArVet[0] += doc2[count].pressaoAr;
								if(pressaoArVet[1] < doc2[count].pressaoAr) pressaoArVet[1] = doc2[count].pressaoAr;
								if(pressaoArVet[2] > doc2[count].pressaoAr) pressaoArVet[2] = doc2[count].pressaoAr;
								temperaturaSoloVet[0] += doc2[count].temperaturaSolo;
								if(temperaturaSoloVet[1] < doc2[count].temperaturaSolo) temperaturaSoloVet[1] = doc2[count].temperaturaSolo;
								if(temperaturaSoloVet[2] > doc2[count].temperaturaSolo) temperaturaSoloVet[2] = doc2[count].temperaturaSolo;
								umidadeSoloVet[0] += doc2[count].umidadeSolo;
								if(umidadeSoloVet[1] < doc2[count].umidadeSolo) umidadeSoloVet[1] = doc2[count].umidadeSolo;
								if(umidadeSoloVet[2] > doc2[count].umidadeSolo) umidadeSoloVet[2] = doc2[count].umidadeSolo;
								ventoVet[0] += doc2[count].vento;
								if(ventoVet[1] < doc2[count].vento) ventoVet[1] = doc2[count].vento;
								if(ventoVet[2] > doc2[count].vento) ventoVet[2] = doc2[count].vento;
								nivelUvVet[0] += doc2[count].nivelUv;
								if(nivelUvVet[1] < doc2[count].nivelUv) nivelUvVet[1] = doc2[count].nivelUv;
								if(nivelUvVet[2] > doc2[count].nivelUv) nivelUvVet[2] = doc2[count].nivelUv;
								count++;
							}
							temperaturaArVet[0] = temperaturaArVet[0]/count;  umidadeArVet[0] = umidadeArVet[0]/count;
							pressaoArVet[0] = pressaoArVet[0]/count; temperaturaSoloVet[0] = temperaturaSoloVet[0]/count;
							umidadeSoloVet[0] = umidadeSoloVet[0]/count;  ventoVet[0] = ventoVet[0]/count;
							nivelUvVet[0] = nivelUvVet[0]/count;
							const Novo_Diario = new DadosDiarios({
								_id: new mongoose.Types.ObjectId(),
								modulo_id: modulo_id,
								data: temp2,
								precipitacao: precipitacaoTotal.toFixed(1),
								pressaoArMedia: pressaoArVet[0].toFixed(1),
								pressaoArMaxima: pressaoArVet[1].toFixed(1),
								pressaoArMinima: pressaoArVet[2].toFixed(1),
								temperaturaArMedia: temperaturaArVet[0].toFixed(1),
								temperaturaArMaxima: temperaturaArVet[1].toFixed(1),
								temperaturaArMinima: temperaturaArVet[2].toFixed(1),
								temperaturaSoloMedia: temperaturaSoloVet[0].toFixed(1),
								temperaturaSoloMaxima: temperaturaSoloVet[1].toFixed(1),
								temperaturaSoloMinima: temperaturaSoloVet[2].toFixed(1),
								umidadeArMedia: umidadeArVet[0].toFixed(1),
								umidadeArMaxima: umidadeArVet[1].toFixed(1),
								umidadeArMinima: umidadeArVet[2].toFixed(1),
								umidadeSoloMedia: umidadeSoloVet[0].toFixed(1),
								umidadeSoloMaxima: umidadeSoloVet[1].toFixed(1),
								umidadeSoloMinima: umidadeSoloVet[2].toFixed(1),
								ventoMedia: ventoVet[0].toFixed(1),
								ventoMaxima: ventoVet[1].toFixed(1),
								ventoMinima: ventoVet[2].toFixed(1),
								mediaUv: nivelUvVet[0].toFixed(1),
								maxUv: nivelUvVet[1].toFixed(1),
								minUv: nivelUvVet[2].toFixed(1),
								
								//createdAt: temp2
							});
							Novo_Diario
							.save()
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({error: err});
						});
					}
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
			//retorna os novos dados criados
			res.status(201).json({
				message: 'station data created successfully',
				createdStation:{
					modulo_id: result.modulo_id,
					data: result.data,
					horario: result.horario,
					precipitacao: result.precipitacao,
					temperaturaAr: result.temperaturaAr,
					umidadeAr: result.umidadeAr,
					pressaoAr: result.pressaoAr,
					temperaturaSolo: result.temperaturaSolo,
					umidadeSolo: result.umidadeSolo,
					vento: result.vento,
					nivelUv: result.nivelUv,
					//mediaUv: result.mediaUv,
					//updatedAt: result.updatedAt,
          createdAt: result.createdAt,
					_id: result._id,
					request:{
						type: 'GET',
						url: 'http://localhost:5000/dados_da_estacao' + result._id + '/' + result.modulo_id
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


	//desnecessario na versao final
	async update(req,res){
		//const dadosDaEstacao = await DadosDaEstacao.findByIdAndUpdate(req.params.id, req.body, { new: true });
		//return res.json(dadosDaEstacao);
		const id = req.params.id;
		const updateOps = {};
		for(const ops of req.body){
			updateOps[ops.propName] = ops.value;
		}
		Estacao.update({_id: id}, {$set: updateOps})
			.exec()
			.then(result => {
				console.log(result);
				res.status(200).json({
					message: 'Estacao Atualizada',
					request:{
						type: 'GET',
						url: 'http://localhost:5000/dados_da_estacao' + id
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

	//desnecess�rio na vers�o final
	async destroy(req, res){
		//await DadosDaEstacao.findByIdAndRemove(req.params.id);
		//return res.json('Deleted');
		const id = req.params.id;
		Estacao.deleteOne({_id: id})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Estacao deletada',
					request:{
						type: 'POST',
						url: 'http:// localhost:5000/dados_da_estacao',
						body: {mi: 'Number', se: 'String',
								da: 'Date', ho: 'String', pr: 'Number',
								ta: 'Number', ua: 'Number', pa: 'Number',
								ts: 'Number', us: 'Number', ve: 'Number',
								nu: 'Number', mu: 'Number'}
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