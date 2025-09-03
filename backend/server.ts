import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import propertyRoutes from "./api/property-api";
import adminAuthRoutes from "./api/admin-auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(
    "✅ SuperFlats Backend is running. Use /api/properties or /api/health"
  );
});

// ✅ Health check with typed req/res
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "Backend is running 🚀" });
});

// ✅ Routes
app.use("/api/property", propertyRoutes);
app.use("/api/admin", adminAuthRoutes);

// ✅ Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
