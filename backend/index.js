import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import appointmentRouter from "./routes/appointment.js";
import sql_Setup from "./sql_Setup/sql_Setup.js";
import {studentAuth , facultyAuth , adminstaffAuth} from "./routes/auth/general.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.BE_PORT || 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

async function main() {
    try {
        const db = await sql_Setup();
        console.log("✅ Database connected successfully.");

        

        // app.use('/appointments', appointmentRouter(db));
        app.use('/auth/student', studentAuth(db));
        app.use('/auth/faculty', facultyAuth(db));
        app.use('/auth/adminstaff', adminstaffAuth(db));
        

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Error connecting to database:", error);
        process.exit(1);
    }
}

main();
