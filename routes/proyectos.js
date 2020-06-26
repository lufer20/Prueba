const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crea un proyecto
// api/proyectos POST
router.post('/',
    auth,
    [
       check('nombre','El nombre del proyecto es obligatorio').not().isEmpty() 
    ],
    proyectoController.crearProyecto
);

// Obtener Proyectos
// api/proyectos GET
router.get('/',
    auth,
    proyectoController.obtenerProyectos
)

//Actualizar un proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre','El nombre del proyecto es obligatorio').not().isEmpty() 
    ],
    proyectoController.actualizarProyecto
);

// Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);


module.exports = router;