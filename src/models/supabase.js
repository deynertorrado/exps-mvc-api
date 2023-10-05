// Módulos de funcionamiento
import {createClient} from '@supabase/supabase-js'
import dotenv from "dotenv";

// Cargamos las variables de ambiente
dotenv.config()
const URL_DB = process.env.URL_SUPABASE;
const KEY_DB = process.env.KEY_SUPABASE;

// Conexión a Supabase
const supabase = createClient(URL_DB, KEY_DB);

// Exportamos el objeto supabase
export default supabase;