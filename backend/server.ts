import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import propertyRoutes from "./api/property-api";
import adminAuthRoutes from "./api/admin-auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

app.use("/api/property", propertyRoutes);

app.use("/api/admin", adminAuthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
