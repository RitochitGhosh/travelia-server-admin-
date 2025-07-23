import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ durationId: string }> }
) {
  try {
    const { durationId } = await params;

    if (!durationId) {
      return new NextResponse("Duration ID is required", { status: 400 });
    }

    const duration = await prismadb.duration.findUnique({
      where: {
        id: durationId,
      },
    });

    return NextResponse.json(duration);
  } catch (error) {
    console.error("[DURATION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; durationId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { storeId, durationId } = await params;

    const body = await req.json();
    const { name, days} = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!days) {
      return new NextResponse("Number of days is required", { status: 400 });
    }
    if (!durationId) {
      return new NextResponse("Duration ID is required", { status: 400 });
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

    const duration = await prismadb.duration.update({
      where: {
        id: durationId,
      },
      data: {
        name,
        days,
      },
    });

    return NextResponse.json(duration);
  } catch (error) {
    console.error("[DURATION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; durationId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const { storeId, durationId } = await params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!durationId) {
      return new NextResponse("Duration ID is required", { status: 400 });
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

    await prismadb.duration.delete({
      where: {
        id: durationId,
      },
    });

    return new NextResponse("Duration deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[DURATION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
