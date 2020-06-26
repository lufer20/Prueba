const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crear el servidor
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

//Habilitar express.json que permite leer datos que el usuario coloque. Se puede usar tambien express.bodyParser()
app.use(express.json({ extented: true }));

// puerto de la app
const port = process.env.port || 4000;

//Definir la pagina principal
/* app.get('/', (req, res) => {
    res.send('Hola Mundo');
}); */

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//arrancar la app o servidor
app.listen(port, '0.0.0.0',() => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});