"use client"
import { useEffect, useRef, useState } from 'react'

import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { cn } from "@/lib/utils"

import { CategoryColumn } from "./columns";



interface SortDataProps {
    data: CategoryColumn[]
    sort: any;
}


const SortTheData: React.FC<SortDataProps> = ({
    data,
    sort
}) => {

    const params = useParams();
    const router = useRouter();


    const [sortData, setSortData] = useState([...data])
    const [draged, setDraged] = useState(false)


    ////put in array and into object
    const structuredArray: { name: string }[] = [];

    const items = sort[0].name.split(",")

    items.forEach((item: any) => {
        structuredArray.push({
            name: item
        });
    })
    /////////////////////////////

    const [afterSortData, setAfterSortData] = useState(structuredArray)

    console.log(structuredArray.map((s) => s.name))
    console.log(sortData)


    const dragPerson = useRef<number>(0)
    const draggedOverPerson = useRef<number>(0)

    const  handleSort = async () => {
        const peopleClone = sortData
        const temp = peopleClone[dragPerson.current]
        peopleClone[dragPerson.current] = peopleClone[draggedOverPerson.current]
        peopleClone[draggedOverPerson.current] = temp
        setSortData([...peopleClone])
        setDraged(false)

        const after = afterSortData
        const element = after[dragPerson.current]
        after[dragPerson.current] = after[draggedOverPerson.current]
        after[draggedOverPerson.current] = element
        setAfterSortData([...sortData])
        setDraged(false)

        const sortName = sortData.map((m)=>(m.name))

        try {
            if(!sort){
                await axios.post(`/api/${params.storeId}/sort`, {sortName: `${sortName}`});
            } else{
                await axios.patch(`/api/${params.storeId}/sort`, {sortName: `${sortName}`});
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong.")
        } finally {
            toast.success("ok")
        }

    }

    useEffect(()=>{
        const fetchData = async () => {
        await axios.patch(`/api/${params.storeId}/sort`, {sortName: `${sortData.map((m)=>(m.name))}`})
        }
        fetchData()
    })

  return (
    <>
    <div className="flex flex-row items-center justify-center rounded-md border-2 p-3">
        <h1 className="text-xl font-bold px-2">Arrange Items</h1>
        {
        !sort ? 
        sortData.map((person, index) => (
            <div key={person.id} className={cn(
                "relative flex space-x-3 border rounded p-2 bg-gray-100 cursor-grab",
                draged ? "cursor-grabbing" : "cursor-grab"
            )}
            draggable
            onDragStart={() => (dragPerson.current = index, setDraged(true))}
            onDragEnter={() => (draggedOverPerson.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            >
            <p className=' text-slate-950'>{person.name}</p>
            </div>
        )) 
        : 
        afterSortData.map((person, index) => (
            <div key={person.name} className={cn(
                "relative flex space-x-3 border rounded p-2 bg-gray-100 cursor-grab",
                draged ? "cursor-grabbing" : "cursor-grab"
            )}
            draggable
            onDragStart={() => (dragPerson.current = index, setDraged(true))}
            onDragEnter={() => (draggedOverPerson.current = index )}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            >
            <p className=' text-slate-950'>{person.name}</p>
            </div>
        ))
        }
    </div>
    </>
  )
}

export default SortTheData