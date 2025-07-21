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


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }

) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Sort Name is required", { status: 400 });
    }

    // if (!params.categoryId) {
    //   return new NextResponse("Category ID is required", { status: 400 });
    // }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.findFirst({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const categorySort = await prismadb.categorySort.findFirst({
      where: {
        // sortCategoryId: category.sortCategoryId,
        storeId: params.storeId,
      },
    });

    if (!categorySort) {
      return new NextResponse("CategorySort not found", { status: 404 });
    }

    // استخدم مصفوفة فارغة إذا كانت null أو undefined
const updatedSortNames = (categorySort.sortName ?? []).map((item: any) => {
  if (item.sortCategoryId === category.sortCategoryId) {
    return {
      ...item,
      name: name, // تحديث الاسم فقط
    };
  }
  return item;
});

    const updated = await prismadb.categorySort.update({
      where: {
        id: categorySort.id,
      },
      data: {
        sortName: updatedSortNames,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.log("[SORT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


// export async function DELETE (
//     req: Request,
//     { params }: {params: { storeId: string ,sizeId: string }}
// ) {
//     try {
//     const { userId } = auth();


//     if (!userId){
//     return new NextResponse("Unauthenticated", {status: 401});
//     }

//     if (!params.sizeId){
//     return new NextResponse("Size id is required" , {status: 400});
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

//     const size =await prismadb.size.deleteMany({
//         where: {
//             id: params.sizeId,
//         }
//     })


//     return NextResponse.json(size)
//     } catch (error) {
//     console.log('[SIZE_DELETE]', error);
//     return new NextResponse("Internal error", {status: 500});
//     }
// }



export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // if (!params.storeId?.trim() || !params.categoryId?.trim()) {
    //   return new NextResponse("Store ID and Category ID are required", { status: 400 });
    // }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.findFirst({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const categorySort = await prismadb.categorySort.findFirst({
      where: {
        storeId: params.storeId,
      },
    });

    if (!categorySort) {
      return new NextResponse("CategorySort not found", { status: 404 });
    }

    const updatedSortNames = (categorySort.sortName ?? []).filter(
      (item: any) => item.sortCategoryId !== category.sortCategoryId
    );

    const updated = await prismadb.categorySort.update({
      where: {
        id: categorySort.id,
      },
      data: {
        sortName: updatedSortNames,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.log("[SORT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
