import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './models/usuario.model.js';

dotenv.config();

const app = express();
const port = 3000;
const uri = process.env.uri;

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) =>{
    res.send('Bienvenido a mi crud');
})

app.get('/usuario', async (req, res) => {
    try {
    const usuario = await Usuario.find(); 
        res.status(200).json(usuario); 
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
});

app.get('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const usuario = await Usuario.findById(id); 

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" }); 
        }

        res.status(200).json(usuario); 
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
});


app.post("/usuario", async (req, res) => {//
    try{
        const usuario = await Usuario.create(req.body);
        res.status(201).json(usuario);
    }catch (error) {
        console.error("Error al crear el usuario: ", error);
        res.status(500).json({error: "Error al crear el usuario"});
    }
});


app.put("/usuario/:id", async (req, res) => {
    try {
        const { id } = req.params; 
        const usuario = await Usuario.findByIdAndUpdate(id, req.body);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const usuarioActualizado = await Usuario.findById(id); 
        res.status(200).json(usuarioActualizado);
        console.log(usuarioActualizado); 

    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
});

app.delete("/usuario/:id", async (req, res) => {
    try {
        const { id } = req.params; 
        const usuario = await Usuario.findByIdAndDelete(id); 

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado' }); 
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
});


mongoose.connect(uri)
.then ( () => {
    console.log("Conexion exitosa a la base de datos");
})
.catch((error) => {
    console.error("Error al conectarse a la base de datos")
})


app.listen(port, ()=>{
    console.log(`Servidor al escucha en http://localhost:${port}/`)
})
