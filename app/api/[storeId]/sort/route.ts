import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";



export async function POST(
    req: Request,
    { params }: { params: {storeId: string}}
) {
    try {
        const {userId} = auth();
        // const session = await auth();
        // const userId = session?.user?.id;

        const body = await req.json();

        const { sortName } = body

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!sortName){
            return new NextResponse("Sorted is required", { status: 400 })
        }

        if (!params.storeId){
            return new NextResponse("Store id is required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403});
        }

        const sort = await prismadb.categorySort.create({
            data: {
                sortName,
                storeId: params.storeId
            }
        });

        return NextResponse.json(sort)
    } catch (error){
    console.log('[SORT_POST]', error)
    return new NextResponse("interal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string }}
) {
    try {
    const { userId } = auth();
    const body = await req.json()

    const { sortName } = body;

    if (!userId){
    return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!sortName) {
        return new NextResponse("Sort Name is required" , {status: 400});
    }


    const storeByUserId = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    if (!storeByUserId){
        return new NextResponse("Unauthorized", {status: 403});
    }

    const sort = await prismadb.categorySort.updateMany({
        data: {
            sortName,
        }
    })


    return NextResponse.json(sort)
    } catch (error) {
    console.log('[SORT_PATCH]', error);
    return new NextResponse("Internal error", {status: 500});
    }
}

export async function GET(
    req: Request,
    { params }: { params: {storeId: string}}
) {
    try {

        if (!params.storeId){
            return new NextResponse("Store id is required", { status: 400 })
        }

        const sizes = await prismadb.categorySort.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(sizes)
    } catch (error){
    console.log('[SORT_GET]', error)
    return new NextResponse("interal error", { status: 500 });
    }
}