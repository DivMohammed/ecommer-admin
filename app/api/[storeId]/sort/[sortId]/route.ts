import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: { sortId: string }}
) {
    try {

    if (!params.sortId){
    return new NextResponse("Sort id is required" , {status: 400});
    }

    const sort =await prismadb.categorySort.findUnique({
        where: {
            id: params.sortId,
        }
    })


    return NextResponse.json(sort)
    } catch (error) {
    console.log('[SORT_GET]', error);
    return new NextResponse("Internal error", {status: 500});
    }
}

// export async function PATCH (
//     req: Request,
//     { params }: {params: { storeId: string ,sizeId: string }}
// ) {
//     try {
//     const { userId } = auth();
//     const body = await req.json()

//     const { sortName } = body;

//     if (!userId){
//     return new NextResponse("Unauthenticated", {status: 401});
//     }

//     if (!sortName) {
//         return new NextResponse("Sort Name is required" , {status: 400});
//     }

//     if (!params.sizeId){
//     return new NextResponse("size id is required" , {status: 400});
//     }

//     const storeByUserId = await prismadb.store.findFirst({
//         where: {
//             id: params.storeId,
//             userId
//         }
//     });

//     if (!storeByUserId){
//         return new NextResponse("Unauthorized", {status: 403});
//     }

//     const sort = await prismadb.categorySort.updateMany({
//         data: {
//             sortName,
//         }
//     })


//     return NextResponse.json(sort)
//     } catch (error) {
//     console.log('[SORT_PATCH]', error);
//     return new NextResponse("Internal error", {status: 500});
//     }
// }

export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string ,sizeId: string }}
) {
    try {
    const { userId } = auth();


    if (!userId){
    return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!params.sizeId){
    return new NextResponse("Size id is required" , {status: 400});
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

    const size =await prismadb.size.deleteMany({
        where: {
            id: params.sizeId,
        }
    })


    return NextResponse.json(size)
    } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return new NextResponse("Internal error", {status: 500});
    }
}