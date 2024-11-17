import prismadb from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { storeId } = req.query;
    
    if (!storeId || typeof storeId !== "string") {
      return res.status(400).json({ message: "Invalid storeId" });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json(store);
  } catch (error) {
    console.error("Error fetching store:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
