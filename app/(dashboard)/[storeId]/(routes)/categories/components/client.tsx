"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import  SortTheData  from "./sort-the-data"

import { CategoryColumn, columns } from "./columns";
import Link from "next/link";

interface CategoryClientProps {
    data: CategoryColumn[];
    sort: any;
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
    data,
    sort
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
        <div className="flex items-center justify-between">
            <Heading
                title={`Categories (${data.length})`}
                description="Manage categories for your store"
            />
            <Link href={`/${params.storeId}/categories/new`}>
            <Button>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
            </Link>
        </div>
        <Separator/>
        <DataTable searchKey="name" columns={columns} data={data} />
        <SortTheData data={data} sort={sort}/>
        <Heading title="API" description="API calls for Categories" />
        <Separator />
        <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    )
}