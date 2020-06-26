const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//crea una nueva tarea
exports.crearTarea = async(req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {

        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;

        const proyectoBD = await Proyecto.findById(proyecto);
        if(!proyectoBD) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(proyectoBD.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Instanciamos un objeto de modelo Tarea y Creamos registro tarea en BD
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Obtener Tareas por proyecto
exports.obtenerTareas = async(req, res) => {
    try {
        
        //Extraer el proyecto y comprobar si existe
        //Se usa req.query cuando desde el cliente se envia en la peticion como { params: {proyecto}}. proyecto es una VARIABLE con el ide del proyecto y no es un objeto
        //const { proyecto } = req.body;
        const { proyecto } = req.query;

        const proyectoBD = await Proyecto.findById(proyecto);
        if(!proyectoBD) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(proyectoBD.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto: proyectoBD._id }).sort({creado: -1});
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualizar Tarea
exports.actualizarTarea = async(req, res) => {
    try {
        
        //Extraer nombre estado y proyecto y comprobar si existe
        const { nombre, estado, proyecto } = req.body;

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        const proyectoBD = await Proyecto.findById(proyecto);
        if(proyectoBD.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Crear un objeto con la nueva informacion
        const nuevaTarea = {};

        //Si el usuario decide cambiar el nombre, se agrega este atributo al objeto
        //if(nombre) Estaba habilitado cuando en el cliente estaba 2 funciones separadas para actualizar nombre de tarea y otra para actualizar estado de la tarea, ahora se unifico en una unica funcion que actualiza toda la tarea
        nuevaTarea.nombre = nombre;
        
        //Si el usuario decide cambiar el estado, se agrega este atributo al objeto
        //if(estado) Estaba habilitado cuando en el cliente estaba 2 funciones separadas para actualizar nombre de tarea y otra para actualizar estado de la tarea, ahora se unifico en una unica funcion que actualiza toda la tarea
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});

        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
    
}

//Elimina una tarea
exports.eliminarTarea = async(req, res) => {
    try {
        
        //Extraer nombre estado y proyecto y comprobar si existe
        //Se usa req.query cuando desde el cliente se envia en la peticion como { params: {proyecto}}. proyecto es una VARIABLE con el ide del proyecto y no es un objeto
        //const { proyecto } = req.body;
        const { proyecto } = req.query;

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        const proyectoBD = await Proyecto.findById(proyecto);
        if(proyectoBD.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Eliminar tarea
        const tareaEliminada = await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada', tareaEliminada});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}