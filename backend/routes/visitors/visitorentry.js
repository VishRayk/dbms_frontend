import { Router } from "express";
import {middleware} from '../../middleware/islogin.js'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const visitorEntry = (db)=>{
    const router = Router()

    router.post('/entry' , async(req , res)=>{
        const {gid , phone} = req.body
        try{
            const [found] = await db.query("SELECT * FROM guards WHERE gid = ? AND phone = ?", [gid , phone])
            if(!found){
                return res.status(400).json({ message: "Guard not found" })
            }
            
        }
        catch(error){
            res.status(404).json({
                message : "Error while making an entry"
            })
        }
    })
}


