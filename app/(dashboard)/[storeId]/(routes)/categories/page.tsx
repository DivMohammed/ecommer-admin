import { format } from "date-fns"

import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
    params 
    } : {
    params: { storeId: string }
    }) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    const categorySort = await prismadb.categorySort.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc',
        }
    });


    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    const formattedCategorySort = categorySort.map((item) => ({
        id: item.id,
        name: item.sortName,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-4 pt-6">
                <CategoryClient data={formattedCategories} sort={formattedCategorySort}/>
            </div>
        </div>
    )
}

export default CategoriesPage;