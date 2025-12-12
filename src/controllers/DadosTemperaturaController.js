//dps apagar td e reinserir com a model modificada e fazer o get selecionar o modelo a partir do id
const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const DadosTemperatura = mongoose.model('DadosDiariosEstacao');

const TEmperatura = require("../models/DadosDiariosEstacao");

module.exports = {
	async showAll(req, res){
		const dadosTemperatura = await DadosTemperatura.find();
		return res.json(dadosTemperatura);
	},
	
	async show(req, res){
		const paramenter = req.query.periodo, modulo_id = req.query.modulo_id;
		if(paramenter==="semana"){
			TEmperatura.find({"modulo_id": modulo_id}).sort({data: -1}).limit(7)
			.select('temperaturaArMedia temperaturaArMaxima temperaturaArMinima data')
			.exec()
			.then(doc => {
				if(doc){
					res.status(200).json({
						MesesCount: 0,
						IgualBotao: 1,
						Temperatura: doc
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
		else if(paramenter==="quinzena"){
			TEmperatura.find({"modulo_id": modulo_id}).sort({data: -1}).limit(15)
			.select('temperaturaArMedia temperaturaArMaxima temperaturaArMinima data')
			.exec()
			.then(doc => {
				if(doc){
					res.status(200).json({
						MesesCount: 0,
						IgualBotao: 1,
						Temperatura: doc
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
		else if(paramenter==="mes"){
			TEmperatura.find({"modulo_id": modulo_id}).sort({data: -1}).limit(31)
			.select('data')
			.exec()
			.then(doc => {
				if(doc){
					var cont = 2;
					var temp = JSON.stringify(doc[0].data);
					var temp2 =JSON.stringify(doc[1].data);
					temp = temp.slice(6,8);
					temp2 = temp2.slice(6,8);
					while(temp===temp2){
						var temp2 =JSON.stringify(doc[cont].data);
						temp2 = temp2.slice(6,8);
						cont++;
					}
					cont-=2;
					temp=JSON.stringify(doc[0].data);
					temp = temp.slice(1,5);
					temp2=doc[cont].data;
					var mes = JSON.stringify(doc[cont+1].data),mesesCount=0,tipoMes;
					mes = mes.slice(6,8);
					var periodo;
					if(mes==='01' || mes==='03' || mes==='05' || mes==='07' || mes==='08' || mes==='10' || mes==='12'){
						tipoMes=1;
						periodo=31;
					}else if(mes==='04' || mes==='06' || mes==='09' || mes==='11'){
						tipoMes=2;
						periodo=30;
					}else{
						if((temp%4===0 && temp%100!==0) || temp%400===0){
							tipoMes=3;
							periodo=29;
						}else{
							tipoMes=4;
							periodo=28;
						}
					}
					TEmperatura.find({"modulo_id": modulo_id, "data": { $lt: temp2 }}).sort({data: -1}).limit(periodo)
					.select('temperaturaArMedia temperaturaArMaxima temperaturaArMinima data')
					.exec()
					.then(doc2 => {
						if(doc2){
							if((doc2.length === 31 && tipoMes === 1) || (doc2.length === 30 && tipoMes === 2) || (doc2.length === 29 && tipoMes === 3) ||
								 (doc2.length === 28 && tipoMes === 4)){
								mesesCount=1
							}
							
							res.status(200).json({
								MesesCount: mesesCount,
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
		else if(paramenter==="ano"){
			TEmperatura.find({"modulo_id": modulo_id}).sort({data: -1}).limit(31)
			.select('data')
			.exec()
			.then(doc => {
				if(doc){
					var cont = 2;
					var temp = JSON.stringify(doc[0].data);
					var temp2 =JSON.stringify(doc[1].data);
					temp = temp.slice(6,8);
					temp2 = temp2.slice(6,8);
					while(temp===temp2){
						var temp2 =JSON.stringify(doc[cont].data);
						temp2 = temp2.slice(6,8);
						cont++;
					}
					cont-=2;
					//pega a parte equivalente ao ano
					temp=JSON.stringify(doc[0].data);
					temp = temp.slice(1,5);
					//pega a ultima data do mes atual
					temp2=doc[cont].data;
					var periodo;
					//checa se o ano eh bissexto
					if((temp%4===0 && temp%100!==0) || temp%400===0){
						periodo=366;
					}else{
						periodo=365;
					}
					TEmperatura.find({"modulo_id": modulo_id, "data": { $lt: temp2 }}).sort({data: -1}).limit(periodo)
					.select('temperaturaArMedia temperaturaArMaxima temperaturaArMinima data')
					.exec()
					.then(doc2 => {
						if(doc2){
							cont=0;
							
							var cont2=doc2.length-1,doc3=[];
							var mes = JSON.stringify(doc[doc.length-1].data);
							var ano = mes.slice(1,5), mesesCount = 0, bissexto=0;
							mes = mes.slice(6,8);
							
							if((ano%4===0 && ano%100!==0) || ano%400===0){
								bissexto = 1;
							}else{
								bissexto=0;
							}
							
							if(((mes==='01' || mes==='03' || mes==='05' || mes==='07' || mes==='08' || mes==='10' || mes==='12') && periodo>=31) ||
								 ((mes==='04' || mes==='06' || mes==='09' || mes==='11') && periodo>=30) ||
									(mes==='02' && bissexto===1 && periodo >= 29) || (mes==='02' && bissexto===0 && periodo >= 28)){
								var tempMes = JSON.stringify(doc2[0].data),tempMes2;//começa pelo ultimo 
								tempMes = tempMes.slice(6,8);
								mesesCount++;
								while(cont < doc2.length){
									tempMes2 = JSON.stringify(doc2[cont].data);
									tempMes2 = tempMes2.slice(6,8);
									if(tempMes !== tempMes2){
										tempMes = tempMes2;
										mesesCount++;
									}
									cont++;
								}
							}
							
							cont=0;
							while(cont < doc2.length){
								doc3[cont] = doc2[cont2];
								cont++;
								cont2--;
							}
							res.status(200).json({
								MesesCount: mesesCount,
								IgualBotao: 1,
								Temperatura: doc3
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
		else{
			var periodoInicio = paramenter.slice(0,10), periodoFinal = paramenter.slice(11,21);		
			TEmperatura.find({"modulo_id": modulo_id, "data": { $gte: periodoInicio, $lte: periodoFinal }}).sort({data: -1})
			.select('temperaturaArMedia temperaturaArMaxima temperaturaArMinima data')
			.exec()
			.then(doc => {
				if(doc){
					var UgualePulsante = 0, periodo=doc.length,  mesesCount = 0;
					if(periodo > 0){
						var mes = JSON.stringify(doc[doc.length-1].data);
						var ano = mes.slice(1,5), bissexto=0;
						mes = mes.slice(6,8);
						
						if((ano%4===0 && ano%100!==0) || ano%400===0){
							bissexto = 1;
						}else{
							bissexto=0;
						}
						
						if(((mes==='01' || mes==='03' || mes==='05' || mes==='07' || mes==='08' || mes==='10' || mes==='12') && periodo>31) ||
							 ((mes==='04' || mes==='06' || mes==='09' || mes==='11') && periodo>30) ||
							  (mes==='02' && bissexto===1 && periodo > 29) || (mes==='02' && bissexto===0 && periodo > 28)){
							var count = 0,tempMes = JSON.stringify(doc[0].data),tempMes2;//começa pelo ultimo 
							tempMes = tempMes.slice(6,8);
							mesesCount++;
							while(count < doc.length){
								tempMes2 = JSON.stringify(doc[count].data);
								tempMes2 = tempMes2.slice(6,8);
								if(tempMes !== tempMes2){
									tempMes = tempMes2;
									mesesCount++;
								}
								count++;
							}
						}
						
						if(periodo<32){
							if((mes==='01' || mes==='03' || mes==='05' || mes==='07' || mes==='08' || mes==='10' || mes==='12') && periodo===31){
								mesesCount++;
								UgualePulsante=1;
							}else if((mes==='04' || mes==='06' || mes==='09' || mes==='11') && periodo===30){
								mesesCount++;
								UgualePulsante=1;
							}else if(mes==='02'){
								if(bissexto===1 && periodo===29){
									mesesCount++;
									UgualePulsante=1;
								}else if(bissexto===0 && periodo===28){
									mesesCount++;
									UgualePulsante=1;
								}
							}
						}
					}
					
					if(mesesCount > 1){
						var docSize=doc.length-1, tempPrec1 = JSON.stringify(doc[0].data), tempPrec2 = JSON.stringify(doc[docSize].data);
						if(tempPrec1.slice(6,8) === tempPrec2.slice(6,8) && parseInt(tempPrec1.slice(9,11)) <  parseInt(tempPrec2.slice(9,11)) ){
							mesesCount--;
						}						
					}
					
					if(mesesCount > 3 && mesesCount < 13){
						cont=0;
						var cont2=doc.length-1,doc2=[];
						while(cont < doc.length){
							doc2[cont] = doc[cont2];
							cont++;
							cont2--;
						}
						doc = doc2;
					}
					if(mesesCount > 12){
						var TemperatureDate1 = JSON.stringify(doc[0].data),TemperatureDate2;
						TemperatureDate1 = TemperatureDate1.slice(1,8);
						cont = cont2 = 0;
						var NewMonth = 0, doc2=[],temperaturaArMaxima,temperaturaArMinima,temperaturaArMedia;cont3=0,tempData1='',tempData2='';
						temperaturaArMaxima = doc[0].temperaturaArMaxima;temperaturaArMinima = doc[0].temperaturaArMinima;
						doc2[0]='{"data"'+':'+'"'+TemperatureDate1.slice(6,8)+'/'+TemperatureDate1.slice(1,5)+'"'+',';
						while(cont<doc.length){
							TemperatureDate2 = JSON.stringify(doc[cont].data);
							TemperatureDate2 = TemperatureDate2.slice(1,8);
							if(TemperatureDate1 !== TemperatureDate2){
								mes=TemperatureDate1.slice(5,8);
								NewMonth = 1;
								ano = JSON.stringify(doc[cont-1].data);
								ano = ano.slice(1,5);
								if((ano%4===0 && ano%100!==0) || ano%400===0){
									bissexto = 1;
								}else{
									bissexto = 0;
								}
								
								//implementar funcao no futuro tem muito codigo repetido
								if((mes==='01' || mes==='03' || mes==='05' || mes==='07' || mes==='08' || mes==='10' || mes==='12') && cont3 < 31){
									tempData1 = JSON.stringify(doc[cont-1].data); tempData2 = JSON.stringify(doc[cont-cont3].data);
									tempData1 = tempData1.slice(9,11) + '/' + tempData1.slice(6,8)+ '/' + tempData1.slice(1,5); tempData2 = tempData2.slice(9,11) + '/' + tempData2.slice(6,8) + '/' + tempData2.slice(1,5);
									doc2[cont2]='{"data"'+':'+'"'+tempData1+' a '+tempData2+'"'+',';
								}else if((mes==='04' || mes==='06' || mes==='09' || mes==='11') && cont3 < 30){
									tempData1 = JSON.stringify(doc[cont-1].data); tempData2 = JSON.stringify(doc[cont-cont3].data);
									tempData1 = tempData1.slice(9,11) + '/' + tempData1.slice(6,8)+ '/' + tempData1.slice(1,5); tempData2 = tempData2.slice(9,11) + '/' + tempData2.slice(6,8) + '/' + tempData2.slice(1,5);
									doc2[cont2]='{"data"'+':'+'"'+tempData1+' a '+tempData2+'"'+',';
								}else if(mes==='02'){
									if(bissexto===1 && cont3 < 29){
										tempData1 = JSON.stringify(doc[cont-1].data); tempData2 = JSON.stringify(doc[cont-cont3].data);
										tempData1 = tempData1.slice(9,11) + '/' + tempData1.slice(6,8)+ '/' + tempData1.slice(1,5); tempData2 = tempData2.slice(9,11) + '/' + tempData2.slice(6,8) + '/' + tempData2.slice(1,5);
										doc2[cont2]='{"data"'+':'+'"'+tempData1+' a '+tempData2+'"'+',';
									}else if(bissexto===0 && cont3 < 28){
										tempData1 = JSON.stringify(doc[cont-1].data); tempData2 = JSON.stringify(doc[cont-cont3].data);
										tempData1 = tempData1.slice(9,11) + '/' + tempData1.slice(6,8)+ '/' + tempData1.slice(1,5); tempData2 = tempData2.slice(9,11) + '/' + tempData2.slice(6,8) + '/' + tempData2.slice(1,5);
										doc2[cont2]='{"data"'+':'+'"'+tempData1+' a '+tempData2+'"'+',';
									}
								}
								
								cont3=0;
								TemperatureDate1 = TemperatureDate2;
								temperaturaArMedia = ((temperaturaArMaxima + temperaturaArMinima)/2).toFixed(1);
								doc2[cont2] = doc2[cont2] + '"'+"temperaturaArMedia"+'"'+':'+temperaturaArMedia+',';
								doc2[cont2] = doc2[cont2] + '"'+"temperaturaArMaxima"+'"'+':'+temperaturaArMaxima+',';
								doc2[cont2] = doc2[cont2] + '"'+"temperaturaArMinima"+'"'+':'+temperaturaArMinima+'}';
								doc2[cont2] = JSON.parse(doc2[cont2]);
								cont2++;
								doc2[cont2]='{"data"'+':'+'"'+TemperatureDate1.slice(0,4) + '/' + TemperatureDate1.slice(5,7) +'"'+',';
							}
							if(NewMonth){
								NewMonth=0;
								temperaturaArMaxima = doc[cont].temperaturaArMaxima;
								temperaturaArMinima = doc[cont].temperaturaArMinima;
							}
							
							if(doc[cont].temperaturaArMaxima > temperaturaArMaxima)
								temperaturaArMaxima = doc[cont].temperaturaArMaxima;
							if(doc[cont].temperaturaArMinima < temperaturaArMinima)
								temperaturaArMinima = doc[cont].temperaturaArMinima;
							cont3++;
							cont++;
						}
						
						mes=TemperatureDate1.slice(5,8);
						//implementar funcao no futuro tem muito codigo repetido
						if((mes==='01' || mes==='03' || mes==='05' || mes==='07' || mes==='08' || mes==='10' || mes==='12') && cont3 < 31){
							tempData1 = JSON.stringify(doc[cont-1].data); tempData2 = JSON.stringify(doc[cont-cont3].data);
							tempData1 = tempData1.slice(9,11) + '/' + tempData1.slice(6,8)+ '/' + tempData1.slice(1,5); tempData2 = tempData2.slice(9,11) + '/' + tempData2.slice(6,8) + '/' + tempData2.slice(1,5);
							doc2[cont2]='{"data"'+':'+'"'+tempData1+' a '+tempData2+'"'+',';
						}else if((mes==='04' || mes==='06' || mes==='09' || mes==='11') && cont3 < 30){
							tempData1 = JSON.stringify(doc[cont-1].data); tempData2 = JSON.stringify(doc[cont-cont3].data);
							tempData1 = tempData1.slice(9,11) + '/' + tempData1.slice(6,8)+ '/' + tempData1.slice(1,5); tempData2 = tempData2.slice(9,11) + '/' + tempData2.slice(6,8) + '/' + tempData2.slice(1,5);
							doc2[cont2]='{"data"'+':'+'"'+tempData1+' a '+tempData2+'"'+',';
						}else if(mes==='02'){
							if(bissexto===1 && cont3 < 29){
								tempData1 = JSON.stringify(doc[cont-1].data); tempData2 = JSON.stringify(doc[cont-cont3].data);
								tempData1 = tempData1.slice(9,11) + '/' + tempData1.slice(6,8)+ '/' + tempData1.slice(1,5); tempData2 = tempData2.slice(9,11) + '/' + tempData2.slice(6,8) + '/' + tempData2.slice(1,5);
								doc2[cont2]='{"data"'+':'+'"'+tempData1+' a '+tempData2+'"'+',';
							}else if(bissexto===0 && cont3 < 28){
								tempData1 = JSON.stringify(doc[cont-1].data); tempData2 = JSON.stringify(doc[cont-cont3].data);
								tempData1 = tempData1.slice(9,11) + '/' + tempData1.slice(6,8)+ '/' + tempData1.slice(1,5); tempData2 = tempData2.slice(9,11) + '/' + tempData2.slice(6,8) + '/' + tempData2.slice(1,5);
								doc2[cont2]='{"data"'+':'+'"'+tempData1+' a '+tempData2+'"'+',';
							}
						}
						
						
						temperaturaArMedia = ((temperaturaArMaxima + temperaturaArMinima)/2).toFixed(1);
						doc2[cont2] = doc2[cont2] + '"'+"temperaturaArMedia"+'"'+':'+temperaturaArMedia+',';
						doc2[cont2] = doc2[cont2] + '"'+"temperaturaArMaxima"+'"'+':'+temperaturaArMaxima+',';
						doc2[cont2] = doc2[cont2] + '"'+"temperaturaArMinima"+'"'+':'+temperaturaArMinima+'}';
						doc2[cont2] = JSON.parse(doc2[cont2]);
						
						doc = doc2;
					}
						
					res.status(200).json({
						MesesCount: mesesCount,
						IgualBotao: UgualePulsante,
						Temperatura: doc
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
	},

	//desnecessario na versao final
	async update(req,res){
		const id = req.params.id;
		const updateOps = {};
		for(const ops of req.body){
			updateOps[ops.propName] = ops.value;
		}
		TEmperatura.update({_id: id}, {$set: updateOps})
			.exec()
			.then(result => {
				console.log(result);
				res.status(200).json({
					message: 'Temperatura Atualizada'
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				})
			});
	},
	
};