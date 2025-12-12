const express = require('express');
const routes = express.Router();

routes.get('/',(req, res) => {
    res.send('Hello World From Embrapa Project')
})

//rotas do Auth
const AuthController = require('./controllers/AuthController');
routes.post('/checkToken', AuthController.checkToken);
routes.post('/logar', AuthController.authenticate);

const UsuarioController = require('./controllers/UsuarioController');
routes.get('/usuarios', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.post('/usuario', UsuarioController.store);
routes.put('/usuario/:id', UsuarioController.update);
routes.delete('/usuario/:id', UsuarioController.destroy);
//Consult CPF
routes.get('/usuario_consult_cpf/:cpf', UsuarioController.consultCpf);
routes.put('/usuario_update_by_cpf/:cpf', UsuarioController.updateByCpf);
routes.get('/usuario_login/:cpf/:password', UsuarioController.login);

//rotas do modulo
const ModuloController = require('./controllers/ModulosController');
routes.get('/modules', ModuloController.showAll);
routes.post('/modulos', ModuloController.store);
routes.get('/modulo/:id', ModuloController.show);
routes.get('/modulos', ModuloController.show_type);
routes.patch('/modulos/:id', ModuloController.update);
routes.delete('/modulos/:id', ModuloController.destroy);

//rotas da estacao
const DadosDaEstacaoController = require('./controllers/DadosDaEstacaoController');
routes.get('/dados_da_estacao/:id', DadosDaEstacaoController.show);
routes.get('/station_data', DadosDaEstacaoController.showAll);
routes.get('/dados_da_precipitacao', DadosDaEstacaoController.show_precipitation);
routes.get('/dados_da_temperatura_ar', DadosDaEstacaoController.show_temperatura_ar);
routes.get('/dados_da_estacao_online', DadosDaEstacaoController.show_online_data);
routes.post('/dados_da_estacao', DadosDaEstacaoController.store);
routes.patch('/dados_da_estacao/:id', DadosDaEstacaoController.update);
routes.delete('/dados_da_estacao/:id', DadosDaEstacaoController.destroy);

//rotas dados diarios estacao
const DadosDiariosEstacaoController = require('./controllers/DadosDiariosEstacaoController');
routes.get('/Todos_dados_diario',DadosDiariosEstacaoController.showAll);
routes.get('/Todos_dados_diario_modulo', DadosDiariosEstacaoController.showMod);
routes.get('/dados_mensais_anos', DadosDiariosEstacaoController.showAnual);
routes.post('/dadosDiariosEstacao', DadosDiariosEstacaoController.store);
routes.patch('/dadosDiariosEstacao/:id', DadosDiariosEstacaoController.update);
routes.delete('/dadosDiariosEstacao/:id', DadosDiariosEstacaoController.destroy);


//rotas da cerca
const DadosDaCercaController = require('./controllers/DadosDaCercaController');
routes.get('/dados_da_cerca', DadosDaCercaController.showAll);
routes.post('/dados_da_cerca', DadosDaCercaController.store);
routes.get('/dados_da_cerca/:id', DadosDaCercaController.show);
routes.patch('/dados_da_cerca/:id', DadosDaCercaController.update);
routes.delete('/dados_da_cerca/:id', DadosDaCercaController.destroy);

//rotas da cocho
const DadosDoCochoController = require('./controllers/DadosDoCochoController');
routes.get('/dados_do_cocho', DadosDoCochoController.showAll);
routes.post('/dados_do_cocho', DadosDoCochoController.store);
routes.get('/dados_do_cocho/:id', DadosDoCochoController.show);
routes.patch('/dados_do_cocho/:id', DadosDoCochoController.update);
routes.delete('/dados_do_cocho/:id', DadosDoCochoController.destroy);

//rotas da Bebedouro
const DadosDoBebedouroController = require('./controllers/DadosDoBebedouroController');
routes.get('/dados_do_Bebedouro', DadosDoBebedouroController.showAll);
routes.post('/dados_do_Bebedouro', DadosDoBebedouroController.store);
routes.get('/dados_do_Bebedouro/:id', DadosDoBebedouroController.show);
routes.patch('/dados_do_Bebedouro/:id', DadosDoBebedouroController.update);
routes.delete('/dados_do_Bebedouro/:id', DadosDoBebedouroController.destroy);

//rotas da precipitacao
const DadosPrecipitacaoController = require('./controllers/DadosPrecipitacaoController');
routes.get('/dados_precipitation', DadosPrecipitacaoController.showAll);
routes.get('/dados_precipitacao', DadosPrecipitacaoController.show);


//rotas da Temperatura
const DadosTemperaturaController = require('./controllers/DadosTemperaturaController');
routes.get('/dados_temperature', DadosTemperaturaController.showAll);
routes.get('/dados_temperatura_ar', DadosTemperaturaController.show);
routes.patch('/dados_da_temperatura_ar/:id', DadosTemperaturaController.update);


module.exports = routes;