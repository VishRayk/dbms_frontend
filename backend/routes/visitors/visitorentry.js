import { Router } from "express";
import { middleware } from '../../middleware/islogin.js';
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

    return router;
};

export default visitorEntry;
