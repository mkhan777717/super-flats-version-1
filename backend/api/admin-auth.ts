import { Router, Request, Response } from "express";
import { AdminDB } from "./mysql";

const router = Router();

// POST /api/admin/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminDB.validateAdmin(email, password);

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
