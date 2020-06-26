const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
   
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    //Extraer mail y password
    const {email, password} = req.body;

    try {
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        //Revisar el password
        let passCorrecto = await bcryptjs.compare(password, usuario.password); //Se usa compare de bcryptjs
        //              para poder comparar los password que en su estructura hash son diferentes pero 
        //              pueden ser iguales si no tienen el hash
        if(!passCorrecto){
            return res.status(400).json({msg: 'Password Incorrecto'});
        }

        //Si todo esta correcto se accede a crear el token
        //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn: 3600 //1 hora
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmacion
            res.json({token});
        });        

    } catch (error) {
        console.log(error);
    }

}

//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}