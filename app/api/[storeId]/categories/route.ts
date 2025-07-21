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
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id URL is required", { status: 400 });
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

    // Get the current highest sortCategoryId for this store
    const highestCategory = await prismadb.category.findFirst({
      where: {
        storeId: params.storeId,
      },
      orderBy: {
        sortCategoryId: 'desc',
      },
    });

    const newSortCategoryId = highestCategory?.sortCategoryId
      ? highestCategory.sortCategoryId + 1
      : 1;

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        sortCategoryId: newSortCategoryId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // مصفوفة من العناصر المحدثة

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
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

    // تأكد من أن البيانات مصفوفة
    if (!Array.isArray(body)) {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    // تحديث كل عنصر في قاعدة البيانات
    const updatePromises = body.map((item) => {
      return prismadb.category.update({
        where: {
          id: item.id,
        },
        data: {
          sortCategoryId: item.sortCategoryId,
        },
      });
    });

    await Promise.all(updatePromises);

    return new NextResponse("Categories updated", { status: 200 });
  } catch (error) {
    console.error("[CATEGORIES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
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

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(categories)
    } catch (error){
    console.log('[CATEGORIES_GET]', error)
    return new NextResponse("interal error", { status: 500 });
    }
}