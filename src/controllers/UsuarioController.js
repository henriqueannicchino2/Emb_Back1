const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
 
const Usuario = mongoose.model('Usuario');

module.exports = {
	async index(req, res) {
		const usuarios = await Usuario.find();
		return res.json(usuarios);
	},

	async show(req, res) {
		const usuario = await Usuario.findById(req.params.id);
		return res.json(usuario);
	},

	async store(req, res) {
		//const person = await Person.create(req.body);
		Usuario.create(req.body);
		return res.json({
			"status": "success",
			"message": "Pessoa Física cadastrada com sucesso"
		});
		//return res.json(person);
		//return res.json(req.body);
	},

	async update(req, res) {
		const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
		return res.json(usuario);
	},

	async destroy(req, res) {
		await Usuario.findByIdAndRemove(req.params.id);
		return res.json('Deleted');
	},

	//Consult CPF
	async consultCpf(req, res) {
		const usuario = await Usuario.find({ 'dados.cpf': (req.params.cpf) });
		//res.json(person);
		if (usuario.length == 0) {
			//return res.json('CPF NÃO ENCONTRADO');
			return res.json(1);
		} else {
			if (usuario[0].sistemas.socialMe.password === null || usuario[0].sistemas.socialMe.password === undefined) {
				//return res.json('CPF VÁLIDO E SEM SENHA');
				return res.json(2);
			} else {
				//return res.json('CPF VÁLIDO E COM SENHA');
				return res.json(3);
			}

		}
	},

	//Update By CPF
	async updateByCpf(req, res) {
		const usuario = await Usuario.findOneAndUpdate({ 'dados.cpf': (req.params.cpf) }, req.body, { new: true });
		return res.json(usuario);
	},

	//LOGIN
	async login(req, res) {
		const usuario = await Usuario.find({ 'dados.cpf': (req.params.cpf), 'sistemas.socialMe.password': (req.params.password) });

		if (usuario.length == 0) {
			//return res.json('USUÁRIO NÃO ENCONTRADO');
			return res.json(1);
		} else {
			//return res.json('USUÁRIO ENCONTRADO');
			return res.json(usuario);
		}
	}

};