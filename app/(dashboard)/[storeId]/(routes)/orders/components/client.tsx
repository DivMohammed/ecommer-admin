"use client"
import React from 'react';

import { useRef } from "react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { useReactToPrint } from "react-to-print"

import { Printer } from 'lucide-react';

import { OrderColumn, columns } from "./columns";
import PrintContent from "./print";

interface OrderClientProps {
    data: OrderColumn[]
}


export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {

    const componentRef = useRef<any>(null);

    
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    
    return (
        <>
        <div className=' flex justify-between'>
        <Heading
            title={`Orders (${data.length})`}
            description="Manage orders for your store"
        />
        <Printer onClick={handlePrint} className='cursor-pointer rounded-md p-1 w-10 h-10 border-2 bg-border'>Print Page</Printer>
        </div>
        <Separator/>
        <PrintContent ref={componentRef} >
        <DataTable searchKey="products" columns={columns} data={data} />
        </PrintContent>
        </>
    )
}