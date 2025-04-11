import { Router } from "express";
import {middleware} from '../middleware/islogin.js'
const appointmentRouter =(db)=>{
    const router = Router()
    
    router.get('/' , async (req, res ) => {
        const [appointments] = await db.query("SELECT * FROM appointments")
        res.json(appointments)
    }

    )  
    
    router.post('/make-appointment' ,middleware(db) ,  async(req,res)=>{
        const id = req.id

        try{
            const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id])
            if(!user){
                return res.status(400).json({ message: "Member not found in the institution" })

            }

            const {visitor_name , visitor_phone , requested_by , appointed_by_id } = req.body

            const [appointment] = await db.query("INSERT INTO apppintments (requested_by , visitor_phone , visitor_name , appointed_by_id ) VALUES (?,?,?)", [requested_by , visitor_phone , visitor_name , appointed_by_id ])


            if (!appointment) {
                return res.status(500).json({ message: "Error creating appointment" })
            }
            res.status(201).json({ message: "Appointment created successfully" })
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error creating appointment" })
    }


    })


    return router


    

}
export default appointmentRouter
