import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
const port = 3000;
const uri = process.env.uri;
const client = new MongoClient(uri);
const database = client.db('test');
const usuarios = database.collection('usuarios'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Bienvenido a mi crud');
});

app.get('/usuario', async (req, res) => {
  try {
    const listaUsuarios = await usuarios.find().toArray();
    res.status(200).json(listaUsuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarios.findOne({ _id: new ObjectId(id) });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

app.post("/usuario", async (req, res) => {
  try {
    const ahora = new Date();
    const { nombre, edad, correo } = req.body;
    const formatoUsuario = {
      nombre,
      edad: parseInt(edad),
      correo,
      createdAt: ahora,
      updatedAt: ahora,
      __v: 0
    };

    const resultado = await usuarios.insertOne(formatoUsuario);

    res.status(201).json({ _id: resultado.insertedId, ...formatoUsuario });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});


app.put("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const filtro = { _id: new ObjectId(id) };
    const updateDoc = { $set: req.body };

    const resultado = await usuarios.updateOne(filtro, updateDoc);

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuarioActualizado = await usuarios.findOne(filtro);
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

app.delete("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const filtro = { _id: new ObjectId(id) };
    const resultado = await usuarios.deleteOne(filtro);

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

app.listen(port, () => {
  console.log(`Servidor al escucha en http://localhost:${port}/`);
});
