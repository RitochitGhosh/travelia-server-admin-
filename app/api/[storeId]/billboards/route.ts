import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth(); // This must be awaited as per latest clerk docs
    const body = await req.json();
    console.log("[Check_STORES_POST] ->", body);

    const { label, imageUrl } = body;
    const { storeId }= await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Package Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    })
    if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 403 })
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST] ->", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}


export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
  ) {
    try {
      const { storeId } = await params;
      if (!storeId) {
        return new NextResponse("Package Id is required", { status: 400 });
      }
  
      const billboards = await prismadb.billboard.findMany({
        where: {
          storeId: storeId
        },
      });
  
      return NextResponse.json(billboards);
    } catch (error) {
      console.log("[BILLBOARDS_GET] ->", error);
      return new NextResponse("Internal error", {
        status: 500,
      });
    }
  }
