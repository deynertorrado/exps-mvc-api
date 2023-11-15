// Módulos de funcionamiento
import { Router } from "express";
import supabase from "../models/supabase.js";
import { createJWTToken, verifyJWT } from '../service/protocol.js'

// Código del router
const router = Router();

// Métodos (verbos) http
router.get('/api', (req, res) => {
    res.send('Welcome to Express-API ❤️');
})


// ------------------------- Cow Routes --------------------------
// POST: Crear nueva vaquita en Supabase
router.post("/api/cows", verifyJWT, async (req, res) => {
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
router.get("/api/cows", verifyJWT, async (req, res) => {
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
router.put("/api/cows", verifyJWT, async (req, res) => {
    const Code = req.body.cowCode;
    const Name = req.body.cowName;
    const Breed = req.body.cowBreed;
    const Date = req.body.cowDate;
    const Weight = req.body.cowWeight;
    const Childs = req.body.cowChilds;
    const Id = req.body.cowID;
    console.log(Breed, Date)
    
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
router.delete("/api/cows/:delete", verifyJWT, async (req, res) => {
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

    let { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('username', username)
    .eq('password', password)
  
    if (usuarios == null || usuarios.length == 0) {
        res.status(404).json({
            success: false,
            message: "Usuario no registrado"
        });
    } else {
        // Obtenemos el nombre del usuario
        const name = usuarios[0].name;
        const userName = usuarios[0].username;
        const userType = usuarios[0].type
        // Creamos el JWT
        const token = createJWTToken(username)
        // Devuelve una respuesta
        res.header("authorization", token).json({
            message: "Acceso Autorizado",
            name: name,
            userName: userName,
            userType: userType,
            token: token
        })
    }
});

// POST: Crear nuevo usuario en Supabase
router.post("/api/users", verifyJWT, async (req, res) => {
    const userName = req.body.userName;
    const user = req.body.user;
    const userPassword = req.body.userPassword;
    const userType = req.body.userType;

    const { data, error } = await supabase
        .from('usuarios')
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
router.get("/api/users", verifyJWT, async (req, res) => {
    const { data } = await supabase
        .from('usuarios')
        .select('*')

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "No se encontró información de los usuarios"
        });
    } else {
        res.status(200).send(data);
    }
})

// PUT: Actualizar usuario en Supabase
router.put("/api/users", verifyJWT, async (req, res) => {
    const userName = req.body.userName;
    const user = req.body.user;
    const userPassword = req.body.userPassword;
    const userType = req.body.userType;
    const id = req.body.userId

    const { data, error } = await supabase
        .from('usuarios')
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
router.delete("/api/users/:delete", verifyJWT, async (req, res) => {
    const id = req.params.delete;

    const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)

    res.status(200).send(error)
})

// ------------------------- Production Routes --------------------------
// GET: Consultar producción lechera en Supabase
router.get("/api/production", verifyJWT, async (req, res) => {
    const { data, error } = await supabase
        .from('produccion')
        .select(`
            *,
            vacas(
                id,
                cow_name
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

// POST: Agregar producción lechera a Supabase
router.post("/api/production", verifyJWT, async (req, res) => {
    const cowId = req.body.cowID;
    const date = req.body.date;
    const production = req.body.production;

    const { data, error } = await supabase
        .from('produccion')
        .insert([{ id_cow: cowId, date: date, production: production }])
        .select()

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "No se pudo agregar la nueva Producción Lechera",
            error
        });
    } else {
        res.status(200).send(data);
    }
})

// PUT: Actualizar producción en Supabase
router.put("/api/production", verifyJWT, async (req, res) => {
    const cowId = req.body.cowID;
    const date = req.body.date;
    const production = req.body.production;
    const id = req.body.productionId

    const { data, error } = await supabase
        .from('produccion')
        .update([{ id_cow: cowId, date: date, production: production }])
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

// DELETE: Eliminar producción en Supabase
router.delete("/api/production/:delete", verifyJWT, async (req, res) => {
    const id = req.params.delete;

    const { error } = await supabase
        .from('produccion')
        .delete()
        .eq('id', id)

    res.status(200).send(error)
})

// GET: Consultar producción lechera para la gráfica en Supabase
router.get("/api/production/graph", verifyJWT, async (req, res) => {
    const { data, error } = await supabase
        .from('produccion')
        .select(`
            *,
            vacas(
                id,
                cow_name
            )
        `)

    const produccionesPorVaca = {};
    data.forEach((produccion) => {
        const nombreVaca = produccion.vacas.cow_name;
        
        if (!produccionesPorVaca[nombreVaca]) {
            produccionesPorVaca[nombreVaca] = [];
        }
        
        produccionesPorVaca[nombreVaca].push({
            id: produccion.id,
            date: produccion.date,
            production: produccion.production,
        });
    });

    // const produccionesOrganizadas = {};

    // data.forEach((produccion) => {
    // const nombreVaca = produccion.vacas.cow_name;
    // const fecha = new Date(produccion.date);
    // const año = fecha.getFullYear();
    // const mes = fecha.getMonth() + 1; // Meses en JavaScript van de 0 a 11

    // if (!produccionesOrganizadas[nombreVaca]) {
    //     produccionesOrganizadas[nombreVaca] = {};
    // }

    // if (!produccionesOrganizadas[nombreVaca][año]) {
    //     produccionesOrganizadas[nombreVaca][año] = {};
    // }

    // if (!produccionesOrganizadas[nombreVaca][año][mes]) {
    //     produccionesOrganizadas[nombreVaca][año][mes] = [];
    // }

    // produccionesOrganizadas[nombreVaca][año][mes].push({
    //         id: produccion.id,
    //         date: produccion.date,
    //         production: produccion.production,
    //     });
    // });

    // const result = produccionesPorVaca.reduce((acc, curr) => {
    //     const month = new Date(curr[0].date).getMonth();
      
    //     if (!acc[curr[0].name]) {
    //       acc[curr[0].name] = {
    //         month: month,
    //         S1: 0,
    //         S2: 0,
    //         S3: 0,
    //         S4: 0
    //       };
    //     }
      
    //     acc[curr[0].name][`S${month + 1}`] += curr[0].production;
      
    //     return acc;
    //   }, {});

    if (data == null) {
        res.status(404).json({
            success: false,
            message: "No se encontró información de la producción lechera",
            error
        });
    } else {
        res.status(200).send(produccionesPorVaca);
    }
})

// Exportamos el router al index.js
export default router;