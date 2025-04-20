import { Router } from "express";
import { middleware ,guardmiddleware } from '../../middleware/islogin.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'visitor_images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const visitorEntry = (db) => {
    const router = Router();

    router.post('/entry', async (req, res) => {
        const { visitor_name, visitor_phone, visiting_whom, intime, visitor_type } = req.body;

        try {
            if (!visitor_name || !visitor_phone || !visiting_whom || !intime || !visitor_type) {
                return res.status(400).json({ message: "Invalid request data" });
            }

            const [result] = await db.query(
                "INSERT INTO visitors (visitor_name, visitor_phone, visiting_whom, intime, visitor_type) VALUES (?, ?, ?, ?, ?)",
                [visitor_name, visitor_phone, visiting_whom, intime, visitor_type]
            );

            res.status(200).json({
                message: "Visitor entry made successfully",
                visitorId: result.insertId
            });

        } catch (error) {
            console.error("Error inserting visitor:", error);
            res.status(500).json({
                message: "Error while making an entry"
            });
        }
    });
    router.post("/ai-image-post", async (req, res) => {
      const { visitorId } = req.body;
      try {
        const imageUrl = `http://localhost:3000/visitor_images/${visitorId}.jpg`;
        const pictureUrlForDB = `/uploads/visitor_images/${visitorId}.jpg`; 
        
        await db.query(
          "UPDATE visitors SET imgverification = ? WHERE visid = ?",
          [imageUrl, visitorId]
        );
    
        await db.query(
          "INSERT INTO visitor_photos (visid, picture_url, uploaded_at) VALUES (?, ?, NOW())",
          [visitorId, pictureUrlForDB]
        );
    
        res.status(200).json({ success: true, message: "Image URL updated and photo record inserted successfully." });
      } catch (error) {
        console.error("Error updating image info:", error);
        res.status(500).json({ success: false, message: "Failed to update image info." });
      }
    });
    
    router.post("/post_image", async (req, res) => {
        const { visitorId, image } = req.body;

        try {
            if (!visitorId || !image) {
                return res.status(400).json({ message: "Invalid request data" });
            }

            // Save image to disk
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const filename = `${uuidv4()}.png`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, imageBuffer);

            // Save only path to DB (frontend should access this via `/uploads/visitor_images/filename.png`)
            const relativePath = `/uploads/visitor_images/${filename}`;
            const [result] = await db.query(
                "INSERT INTO visitor_photos (visid, picture_url) VALUES (?, ?)",
                [visitorId, relativePath]
            );

            res.status(200).json({
                message: "Image uploaded successfully",
                imagePath: relativePath
            });

        } catch (error) {
            console.error("Error inserting image:", error);
            res.status(500).json({
                message: "Error while uploading image"
            });
        }
    });

    router.post("/post-carnumber", async (req, res) => {
        const { visitorId, carnumber } = req.body;

        try {
            if (!visitorId || !carnumber) {
                return res.status(400).json({ message: "Invalid request data" });
            }

            const [result] = await db.query(
                "INSERT INTO visitor_vehicles (vis_id, license_plate) VALUES (?, ?)",
                [visitorId, carnumber]
            );

            res.status(200).json({ message: "Car number uploaded successfully" });

        } catch (error) {
            console.error("Error inserting car number:", error);
            res.status(500).json({
                message: "Error while uploading car number"
            });
        }
    });
    router.get('/current', async (req, res) => {
        try {
          const [rows] = await db.query(`
            SELECT v.*, vp.picture_url as photo_url
            FROM visitors v
            LEFT JOIN visitor_photos vp ON v.visid = vp.visid
            WHERE v.outtime IS NULL
          `);
          res.status(200).json({ visitors: rows });
        } catch (err) {
          console.error("Error fetching current visitors:", err);
          res.status(500).json({ message: "Internal server error" });
        }
      });
      
      // 2. Get Checked-out Visitors
      router.get('/checkedout', async (req, res) => {
        try {
          const [rows] = await db.query("SELECT * FROM visitors WHERE outtime IS NOT NULL");
          res.status(200).json({ visitors: rows });
        } catch (err) {
          console.error("Error fetching checked-out visitors:", err);
          res.status(500).json({ message: "Internal server error" });
        }
      });
      
      // 3. Get Scheduled Visitors (from appointments table)
      router.get('/scheduled', async (req, res) => {
        try {
          const [rows] = await db.query("SELECT * FROM appointments WHERE appointment_date >= CURDATE() AND status = 'not accepted'");
          res.status(200).json({ visitors: rows });
        } catch (err) {
          console.error("Error fetching scheduled visitors:", err);
          res.status(500).json({ message: "Internal server error" });
        }
      });


      router.post('/checkout/:id', async (req, res) => {
  const visitorId = req.params.id;
        console.log(visitorId)
  try {
    const [result] = await db.query(
      "UPDATE visitors SET outtime = CURRENT_TIMESTAMP WHERE visid = ? AND outtime IS NULL",
      [visitorId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Visitor not found or already checked out" });
    }

    res.status(200).json({ message: "Visitor checked out successfully" });
  } catch (err) {
    console.error("Error checking out visitor:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

    return router;
};

export default visitorEntry;
