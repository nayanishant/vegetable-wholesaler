import type { NextApiRequest, NextApiResponse } from "next";
import { adminOnly } from "@/lib/middleware/adminOnly";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await adminOnly(req, res, async () => {
    // Your admin-only logic here
    res.status(200).json({ message: "Welcome, Admin!" });
  });
}
