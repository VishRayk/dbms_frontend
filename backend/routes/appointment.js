import { Router } from "express";
import { middleware,middleware1, guardmiddleware, withDB } from '../middleware/islogin.js';

const appointmentRouter = (db) => {
    const router = Router();

    router.use(withDB(db));

    router.get('/', guardmiddleware, async (req, res) => {
        console.log(req, res);
        try {
            const [appointments] = await req.db.query("SELECT * FROM appointments");
            res.status(200).json(appointments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching appointments" });
        }
    });
    router.get('/me', middleware1, async (req, res) => {
        try {
          const userId = req.id; // This is the user ID set by the middleware
            console.log(userId);
          // Query appointments where requested_by (user) matches the logged-in user
          const [appointments] = await req.db.query(
            "SELECT * FROM appointments WHERE appointed_by_id = ?",
            [userId] // Filter by the logged-in user's ID
          );
          
          if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
          }
    
          res.status(200).json(appointments); // Return the appointments data
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error fetching appointments" });
        }
      });
    

    router.post('/make-appointment', middleware, async (req, res) => {
        try {
            const { visitor_name, visitor_phone, requested_by, appointed_by_id } = req.body;
    
            const appointment_date = new Date().toISOString().split('T')[0];
    
            const [result] = await req.db.query(
                "INSERT INTO appointments (requested_by, appointment_date, visitor_phone, visitor_name, appointed_by_id) VALUES (?, ?, ?, ?, ?)",
                [requested_by, appointment_date, visitor_phone, visitor_name, appointed_by_id]
            );
    
            if (result.affectedRows > 0) {
                return res.status(201).json({ message: "Appointment created successfully" });
            } else {
                return res.status(400).json({ message: "Failed to create appointment" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating appointment" });
        }
    });
    router.post("/accept-appointment", guardmiddleware, async (req, res) => {
        try {
            console.log("h");
            const { appointment_id } = req.body;
            console.log("hello");
            const [appointmentRows] = await req.db.query(
                "SELECT * FROM appointments WHERE appointment_id = ?",
                [appointment_id]
            );
            console.log("h1");
            if (appointmentRows.length === 0) {
                return res.status(404).json({ message: "Appointment not found" });
            }
    
            const appointment = appointmentRows[0];
    
            await req.db.query(
                "UPDATE appointments SET status = 'accepted' WHERE appointment_id = ?",
                [appointment_id]
            );
            console.log("hi");
            const intime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current datetime
    
            await req.db.query(
                `INSERT INTO visitors (
                    visitor_name,
                    visitor_phone,
                    intime,
                    visitor_type,
                    appointment_id
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    appointment.visitor_name,
                    appointment.visitor_phone,
                    intime,
                    appointment.requested_by,
                    appointment.appointment_id
                ]
            );
    
            res.status(200).json({ message: "Appointment accepted and visitor added" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
    
    

    return router;
};

export default appointmentRouter;