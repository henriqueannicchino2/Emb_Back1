const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const jwt = require('jsonwebtoken');

const Usuario = mongoose.model('Usuario');

const secret = '';

module.exports = {
    async authenticate(req, res) {
        //res.json(req.body);
        const {email, senha} = req.body;
        //res.json(senha);
        Usuario.findOne(
            {$or: [ {"email": email} ]},
            function (err, usuario) {
            if (err) {
                console.error(err);
                res.status(500)
                    .json({
                        error: 'Internal error please try again'
                    });
            } else if (!usuario) {
                res.status(401)
                    .json({
                        error: 'Incorrect email or password'
                    });
            } else {
                usuario.isCorrectPassword(senha, function (err, same) {
                    if (err) {
                        res.status(500)
                            .json({
                                status: "error",
                                code: "XXXX-XX-XX",
                                message: 'Internal error please try again'
                            });
                    } else if (!same) {
                        res.status(401)
                            .json({
                                error: 'Incorrect email or password'
                            });
                    } else {
                        // Issue token
                        const payload = {email};
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '12h'
                        });

                        return res.cookie('token', token, {httpOnly: true}).status(200).json({
                            "status": true,
                            "message": "Login efetuado",
                            "token":token,
                            //"usuario": "empresa",
                            "usuario": usuario
                        });
                        //res.json(token);
                    }
                });
            }
        });
    },
    async checkToken(req, res) {

        jwt.verify(req.body.token, secret, function(err, decoded) {
            if (err) {
                res.status(401).json('Unauthorized: Invalid token');
            } else {
                //console.log(decoded);
                Usuario.findOne(
                    {$or: [ {"email": decoded.email} ]},
                    function (err, usuario) {
                        if (err) {
                            console.error(err);
                            res.status(500)
                                .json({
                                    error: 'Internal error please try again'
                                });
                        } else if (!usuario) {
                            res.status(401)
                                .json({
                                    error: 'Incorrect email or password'
                                });
                        } else {
                            return res.status(200).json({
                                "status": "success",
                                "message": "Token Valido",
                                "usuario": usuario
                            });
                        }
                    });



            }
        });

        //res.sendStatus(200);
    }


};