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

    const {
      name,
      price,
      categoryId,
      durationId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    const storeId = await params.storeId;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }
    if (!durationId) {
      return new NextResponse("Duration Id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Package Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const packagee = await prismadb.package.create({ // packagee is a reserved word
      data: {
        name,
        price,
        categoryId,
        durationId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      },
    });

    return NextResponse.json(packagee);
  } catch (error) {
    console.log("[PACKAGES_POST] ->", error);
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
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const durationId = searchParams.get("durationId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    
    if (!params.storeId) {
      return new NextResponse("Package Id is required", { status: 400 });
    }

    const packages = await prismadb.package.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        durationId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        duration: true,
        size: true,
      },
      orderBy: {
        createdAt:'desc'
      }
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.log("[PACKAGES_GET] ->", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
