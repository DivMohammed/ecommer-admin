import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";


export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
      const { userId } = auth();
      const body = await req.json();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
  
      if (!body || typeof body !== "object") {
        return new NextResponse("Invalid body", { status: 400 });
      }
  
      if (!params.storeId) {
        return new NextResponse("Store id is required", { status: 400 });
      }
  
      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId,
        },
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      // تحقق هل هناك CategorySort موجود لهذا المتجر
      const existingSort = await prismadb.categorySort.findFirst({
        where: {
          storeId: params.storeId,
        },
      });
  
      if (existingSort) {
        // إذا موجود → أضف العنصر الجديد إلى المصفوفة
        const updatedSort = await prismadb.categorySort.update({
          where: {
            id: existingSort.id,
          },
          data: {
            sortName: [...(existingSort.sortName as any[]), body],
          },
        });
  
        return NextResponse.json(updatedSort);
      } else {
        // إذا غير موجود → أنشئ سجل جديد
        const newSort = await prismadb.categorySort.create({
          data: {
            storeId: params.storeId,
            sortCategoryId: body.sortCategoryId,
            sortName: [body], // مصفوفة جديدة تحتوي فقط على هذا الكائن
          },
        });
  
        return NextResponse.json(newSort);
      }
    } catch (error) {
      console.log("[SORT_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
  

export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string }}
) {
    try {
    const { userId } = auth();
    const body = await req.json()

    // const { sortName } = body;

    if (!userId){
    return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!body) {
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
            sortName: body,
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