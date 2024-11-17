// Update route & dalete route

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request, 
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

        const body = await req.json();
        const { name } = body;

        const storeId = await params.storeId;

        if (!name) {
            return new NextResponse ("Name is required", { status: 400 })
        }
        if (!storeId) {
            return new NextResponse ("DestinationId is required", { status: 400 })
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json(store);
        
        
    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
        
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = await auth();
        const storeId = await params.storeId;
        if (!userId) return new NextResponse("Unauthenticated", {status: 401})
        if (!params.storeId) return new NextResponse("DestinationId is required", { status: 400 })
        
        await prismadb.store.deleteMany({
            where: {
                id: storeId,
            }
        })

        return new NextResponse("Package deleted successfully", { status: 200 })
    } catch (error) {
        console.log('[STOREID_DELETE] ->', error);
        return new NextResponse("Internal Error", { status: 500 })
        
    }
}