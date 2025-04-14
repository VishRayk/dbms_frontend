import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// const generalAuth = (db)=>{
//     const router = Router();
//     router.post("/signup" , async (req, res) => {
//         try {
//             const { username, email, password } = req.body;
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const [found] = await db.query("SELECT * FROM members WHERE email = ?", [email]);
//             if (found) {
//                 return res.status(400).json({ message: "Email already exists" });
//             }
//             const [result] = await db.query("INSERT INTO members (username, email, password) VALUES (?,?,?)", [username, email, hashedPassword]);
//             res.json({ message: "User created successfully"  ,result });

//         }
//         catch(error){
//             console.error(error);
//             res.status(500).json({ message: "Error creating user" });
//         }
//     })

//     return router;
// } 


const studentAuth = (db)=>{
    const router = Router();
    router.post("/signup" , async (req, res) => {
        try{
        const {sid , s_name , s_email , s_password  , branch  , phone} = req.body;
        const hashedPassword = await bcrypt.hash(s_password, 10);

        const [found] = await db.query("SELECT * FROM students WHERE email = ? OR sid = ? OR phone = ?", [s_email, sid, branch]);
        if (found[0]) {
            return res.status(400).json({ message: "Email or Enrollemnt number or phone number already exists" });
    }
        const [result] = await db.query("INSERT INTO students (sid , sname , email , password , branch , phone) VALUES (?,?,?,?,?,?)", [sid , s_name, s_email, hashedPassword, branch, phone]);
        await db.query("INSERT INTO members (member_id , member_type , email) VALUES (?,?,?)", [sid, "student", s_email]);
        res.json({ message: "Student created successfully" });
}
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error creating student" });
    }
    
    })


    router.post("/login" , async (req, res) => {
        try{
        const { s_email, s_password } = req.body;
        const [student] = await db.query("SELECT * FROM students WHERE email =?", [s_email]);
        if (!student) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(s_password, student[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: student[0].sid }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(201).json({ message: "Logged in successfully", token });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error logging in student" });
    }
    }
)

    return router;
}


const facultyAuth = (db)=>{
    const router = Router();
    router.post("/signup" , async (req, res) => {
        try{
        const { f_name , f_email , f_password  , department  , phone} = req.body;
        const hashedPassword = await bcrypt.hash(f_password, 10);

        const [found] = await db.query("SELECT * FROM faculty WHERE femail = ?", [f_email]);
        if (found[0]) {
            return res.status(400).json({ message: "Email already exists" });
    }
        const [result] = await db.query("INSERT INTO faculty (fname , femail , password ,department , phone) VALUES (?,?,?,?,?)", [ f_name, f_email, hashedPassword, department, phone]);
        console.log(result)
        await db.query("INSERT INTO members (member_id , member_type , email) VALUES (?,?,?)", [result.insertId, "faculty", f_email]);
        res.json({ message: "Faculty created successfully" });
}
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error creating faculty" });
    }
    
    })


    router.post("/login" , async (req, res) => {
        try{
        const { f_email, f_password } = req.body;
        const [faculty] = await db.query("SELECT * FROM faculty WHERE femail =?", [f_email]);
        if (!faculty) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(f_password, faculty[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: faculty[0].id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(201).json({ message: "Logged in successfully", token });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error logging in as a faculty" });
    }
    }
)

    return router;
}

const adminstaffAuth = (db)=>{
    const router = Router();
    router.post("/signup" , async (req, res) => {
        try{
        const {w_name , w_email , w_password    , phone} = req.body;
        const hashedPassword = await bcrypt.hash(w_password, 10);

        const [found] = await db.query("SELECT * FROM adminstaff WHERE email = ?", [w_email]);
        if (found[0]) {
            return res.status(400).json({ message: "Email already exists" });
    }
        const [result] = await db.query("INSERT INTO adminstaff (name , email , password , phone) VALUES (?,?,?,?)", [ w_name, w_email, hashedPassword, phone]);  
        const [[{ wid: newWid }]] = await db.query(
            "SELECT wid FROM adminstaff WHERE wid = LAST_INSERT_ID()"
        );
        
        await db.query(
            "INSERT INTO members (member_id, member_type, email) VALUES (?,?,?)",
            [newWid, "adminstaff", w_email]
        );
        res.json({ message: "Administrative Staff created successfully" });
}
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error creating administrative staff" });
    }
    
    })


    router.post("/login", async (req, res) => {
        try {
            const { w_email, w_password } = req.body;
    
            const [admin] = await db.query("SELECT * FROM adminstaff WHERE email = ?", [w_email]);
            if (!admin) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
    
            const isMatch = await bcrypt.compare(w_password, admin[0].password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
    
            const token = jwt.sign({ wid: admin[0].wid }, process.env.JWT_SECRET, { expiresIn: "24h" });
    
            res.status(201).json({ message: "Logged in successfully", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error logging in admin" });
        }
    });
    

    return router;
}
export { studentAuth, facultyAuth, adminstaffAuth};