import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = await params.categoryId;

    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    // Delete the billboard
    const Category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        billboard: true
      }
    });

    return NextResponse.json(Category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { storeId, categoryId } = params;

    const body = await req.json();
    const { name, billboardId } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
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

    // Update the category
    const category = await prismadb.category.update({
      where: {
        id: categoryId, // Corrected to categoryId
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error); // Updated log identifier
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { storeId, categoryId } = await params;

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
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
    await prismadb.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return new NextResponse("Catgory deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
