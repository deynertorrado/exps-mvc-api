// Módulos de funcionamiento
import { Router } from "express";
import supabase from "../models/supabase.js";

// Código del router
const router = Router();

// Métodos (verbos) http
router.get('/api', (req, res) => {
    res.send('Welcome to Express-API ❤️');
})

// POST: Verificar la existencia del usuario en Supabase
router.post("/api/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const { data } = await supabase
        .from("administradores")
        .select("*")
        .eq("username", username)
        .eq("password", password);

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

// POST: Crear nueva vaquita en Supabase
router.post("/api/cows", async (req, res) => {
    const Name = req.body.cowName;
    const Breed = req.body.cowBreed;
    const Date = req.body.cowDate;
    const Weight = req.body.cowWeight;
    const Births = req.body.cowBirths;

    const { data, error } = await supabase
        .from('vaquitas')
        .insert([{cowName: Name, cowBreed: Breed, cowDate: Date, cowWeight: Weight, cowBirths: Births}])
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

// Exportamos el router al index.js
export default router;