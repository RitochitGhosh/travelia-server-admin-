import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // This must be awaited as per latest clerk docs
    const body = await req.json();
    console.log("[Check_STORES_POST] ->", body); 

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
    
  } catch (error) {
    console.log("[STORES_POST] ->", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
