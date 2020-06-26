const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    //Extraer email y password
    const {email, password} = req.body;
   
    try {

        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }
 
       //Crea un nuevo usuario que va a tener los campos del modelo Usuario
       //con los valores recibidos en el body de la peticion request
       usuario = new Usuario(req.body);
        
        //Hashear el password
        const salt = await bcryptjs.genSalt(10);//Salt sirve para generar un hash unico; aunque en la BD hayan password iguales al convertirlos a formato hash y agregarle un salt se guardan diferentes
        usuario.password = await bcryptjs.hash(password, salt);

       //guardar o insertar usuario en la BD
       await usuario.save();

       //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600//Expresados en segundos
        }, (error, token) => {//Callback
           if(error) throw error;//Llama una excepcion
            
           //mensaje de confirmacion
           res.json({ token });// es lo mismo que {token: token}

        });


   } catch (error) {
       console.log(error);
       res.status(400).send('Hubo un error');
   }
}