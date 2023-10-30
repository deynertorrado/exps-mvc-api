// Módulos de funcionamiento
import express from 'express';
import router from '../src/routes/router.js';
import morgan from 'morgan'
import bodyParser from "body-parser";
import cors from "cors";

// Código del servidor
const app = express();
const PORT = process.env.PORT || 3000

// Configuramos los middlewares 
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

// Realizamos el routing
app.use('/', router);
app.use('*', (req, res) => {
    res.status(404).send('Error 404: Not Found');
})

// Inicializamos el servidor
app.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
})