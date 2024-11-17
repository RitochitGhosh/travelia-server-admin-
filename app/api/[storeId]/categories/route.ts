import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth(); // This must be awaited as per latest clerk docs
    const body = await req.json();
    console.log("[Check_STORES_POST] ->", body);

    const { name, billboardId } = body;
    const storeId = await params.storeId

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboards Id is required", { status: 400 });
    }

    if (!params.storeId) {
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST] ->", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}


export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
      if (!params.storeId) {
        return new NextResponse("Package Id is required", { status: 400 });
      }
  
      const categories = await prismadb.category.findMany({
        where: {
          storeId: params.storeId
        },
      });
  
      return NextResponse.json(categories);
    } catch (error) {
      console.log("[CATEGORIES_GET] ->", error);
      return new NextResponse("Internal error", {
        status: 500,
      });
    }
  }
