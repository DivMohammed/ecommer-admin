"use client"
import React from 'react';

import { useRef } from "react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { OrderColumn, columns } from "./columns";
import ExportButton from '@/components/exportButton';

interface OrderClientProps {
    data: OrderColumn[]
}


export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {

console.log("data", data)
    
    return (
        <>
        <div className=' flex justify-between'>
        <Heading
            title={`Orders (${data.length})`}
            description="Manage orders for your store"
        />
        <ExportButton data={data} />
        </div>
        <Separator/>
        <DataTable searchKey="products" columns={columns} data={data} />
        </>
    )
}