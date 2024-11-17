import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const { name, days } = body;
    const { storeId } = params;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!days) {
      return new NextResponse("Numbeer of days is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
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

    const duration = await prismadb.duration.create({
      data: {
        name,
        days,
        storeId,
      },
    });

    return NextResponse.json(duration);
  } catch (error) {
    console.error("[DURATION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const durations = await prismadb.duration.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(durations);
  } catch (error) {
    console.error("[SIZES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
