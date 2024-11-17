import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { packageId: string } }
) {
  try {
    const packageId = await params.packageId;
    if (!packageId) {
      return new NextResponse("PackageId is required", { status: 400 });
    }

    // Delete the billboard
    const packagee = await prismadb.package.findUnique({
      where: {
        id: packageId,
      },
      include: {
        images: true,
        category: true,
        duration: true,
        size: true,
      },
    });

    return NextResponse.json(packagee);
  } catch (error) {
    console.error("[BILLBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; packageId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { storeId, packageId } = await params;

    const body = await req.json();

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

    if (!packageId) {
      return new NextResponse("Package Id is required", { status: 400 });
    }

    // Check if store belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update the package, first delete previous images
    await prismadb.package.update({
      where: {
        id: packageId,
      },
      data: {
        name,
        price,
        categoryId,
        durationId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {}
        }
      },
    });
    
    const packagee = await prismadb.package.update({
      where: {
        id: packageId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      
    }})

    return NextResponse.json(packagee);
  } catch (error) {
    console.error("[PACKAGE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; packageId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { storeId, packageId } = await params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!packageId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    // Check if store belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete the billboard
    await prismadb.package.deleteMany({
      where: {
        id: packageId,
      },
    });

    return new NextResponse("Billboard deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[PACKAGE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
