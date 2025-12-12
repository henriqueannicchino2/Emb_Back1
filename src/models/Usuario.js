const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const rodadasDeSalt = 10;

const UsuarioSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    senha: {
        type: String
    }
});

UsuarioSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('senha')) {
        const usuario = this;
        bcrypt.hash(this.senha, rodadasDeSalt, function (err, senhaCriptografada) {
            if (err) {
                next(err);
            } else {
                usuario.senha = senhaCriptografada;
                next();
            }
        });
    } else {
        next();
    }
});

//isCorrectPassword
UsuarioSchema.methods.isCorrectPassword = function (senha, callback) {
    bcrypt.compare(senha, this.senha, function (err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
};

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;