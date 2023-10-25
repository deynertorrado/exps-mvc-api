// Módulos de funcionamiento
import { Router } from "express";
import supabase from "../models/supabase.js";

// Código del router
const router = Router();

// Métodos (verbos) http
router.get('/api', (req, res) => {
    res.send('Welcome to Express-API ❤️');
})


// ------------------------- Cow Routes --------------------------
// POST: Crear nueva vaquita en Supabase
router.post("/api/cows", async (req, res) => {
    const Code = req.body.cowCode;
    const Name = req.body.cowName;
    const Breed = req.body.cowBreed;
    const Date = req.body.cowDate;
    const Weight = req.body.cowWeight;
    const Childs = req.body.cowChilds;

    const { data, error } = await supabase
        .from('vacas')
        .insert([{ cow_code: Code, cow_name: Name, cow_breed: Breed, cow_date: Date, cow_weight: Weight, cow_childs: Childs }])
        .select()

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "No se pudo agregar la vaquita al corral",
            error
        });
    } else {
        res.status(200).send(data);
    }
})

// GET: Consultar Vaquitas en Supabase
router.get("/api/cows", async (req, res) => {
    const { data, error } = await supabase
        .from('vacas')
        .select('*')

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "No se encontró información de las vacas",
            error
        });
    } else {
        res.status(200).send(data);
    }
})

// PUT: Actualizar vaquita en Supabase
router.put("/api/cows", async (req, res) => {
    const Code = req.body.cowCode;
    const Name = req.body.cowName;
    const Breed = req.body.cowbreed;
    const Date = req.body.cowDate;
    const Weight = req.body.cowWeight;
    const Childs = req.body.cowChilds;
    const Id = req.body.cowID;
    
    const { data, error } = await supabase
        .from('vacas')
        .update([{ cow_code: Code, cow_name: Name, cow_breed: Breed, cow_date: Date, cow_weight: Weight, cow_childs: Childs }])
        .eq('id', Id)
        .select()

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "Ocurrió un error al actualizar los datos",
            error
        });
    } else {
        res.status(200).send(data);
    }
})

// DELETE: Eliminamos vaquitas en Supabase
router.delete("/api/cows/:delete", async (req, res) => {
    const Id = req.params.delete;

    const { error } = await supabase
        .from('vacas')
        .delete()
        .eq('id', Id)

    res.status(200).send(error)
})


// ------------------------- Users Routes --------------------------
// POST: Verificar la existencia del usuario en Supabase
router.post("/api/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const { data } = await supabase
        .from('perfiles')
        .select("*")
        .eq('username', username)
        .eq('password', password);

    if (data.length == 0) {
        res.status(404).json({
            success: false,
            message: "Usuario no registrado",
            error
        });
    } else {
        res.status(200).send(data);
    }
});

// POST: Crear nuevo usuario en Supabase
router.post("/api/users", async (req, res) => {
    const userName = req.body.userName;
    const user = req.body.user;
    const userPassword = req.body.userPassword;
    const userType = req.body.userType;

    const { data, error } = await supabase
        .from('perfiles')
        .insert([{ name: userName, username: user, password: userPassword, type: userType }])
        .select()

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "No se pudo agregar el nuevo usuario",
            error
        });
    } else {
        res.status(200).send(data);
    }
})

// GET: Consultar usuarios en Supabase
router.get("/api/users", async (req, res) => {
    const { data, error } = await supabase
        .from('perfiles')
        .select('*')

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "No se encontró información de los usuarios",
            error
        });
    } else {
        res.status(200).send(data);
    }
})

// PUT: Crear nuevo usuario en Supabase
router.put("/api/users", async (req, res) => {
    const userName = req.body.userName;
    const user = req.body.user;
    const userPassword = req.body.userPassword;
    const userType = req.body.userType;
    const id = req.body.userId

    const { data, error } = await supabase
        .from('perfiles')
        .update([{ name: userName, username: user, password: userPassword, type: userType }])
        .eq('id', id)
        .select()

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "Ocurrió un error al actualizar los datos",
            error
        });
    } else {
        res.status(200).send(data);
    }
})

// DELETE: Eliminar usuario en Supabase
router.delete("/api/users/:delete", async (req, res) => {
    const id = req.params.delete;

    const { error } = await supabase
        .from('perfiles')
        .delete()
        .eq('id', id)

    res.status(200).send(error)
})

// ------------------------- Production Routes --------------------------
// GET: Consultar producción lechera en Supabase
router.get("/api/production", async (req, res) => {
    const { data, error } = await supabase
        .from('produccion')
        .select(`
            *,
            vacas(
                id,
                cow_name
            ),
            meses(
                id,
                month
            )
        `)

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "No se encontró información de la producción lechera",
            error
        });
    } else {
        res.status(200).send(data);
    }
})

// Exportamos el router al index.js
export default router;