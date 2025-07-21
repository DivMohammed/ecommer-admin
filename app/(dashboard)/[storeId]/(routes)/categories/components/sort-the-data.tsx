"use client";

import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface SortDataProps {
  data: any;
}

const SortTheData: React.FC<SortDataProps> = ({ data }) => {
  const params = useParams();
  const [sortedItems, setSortedItems] = useState<any[]>([]);
  const [dragged, setDragged] = useState(false);

  const dragPerson = useRef<number>(0);
  const draggedOverPerson = useRef<number>(0);

  // ترتيب البيانات بناءً على sortCategoryId عند أول تحميل
  useEffect(() => {
    if (Array.isArray(data)) {
      const sorted = [...data].sort((a, b) => a.sortCategoryId - b.sortCategoryId);
      setSortedItems(sorted);
    }
  }, [data]);


  const handleSort = async () => {
    const clone = [...sortedItems];

    // تبادل العناصر
    const temp = clone[dragPerson.current];
    clone[dragPerson.current] = clone[draggedOverPerson.current];
    clone[draggedOverPerson.current] = temp;

    // إعادة تعيين sortCategoryId حسب الترتيب الجديد
    const updatedItems = clone.map((item, index) => ({
      ...item,
      sortCategoryId: index + 1,
    }));

    setSortedItems(updatedItems);
    setDragged(false);

    try {
      await axios.patch(`/api/${params.storeId}/categories`, updatedItems);
      toast.success("تم حفظ الترتيب بنجاح.");
    } catch (error) {
      console.log(updatedItems)
      console.error(error);
      toast.error("حدث خطأ أثناء حفظ الترتيب.");
    }
  };

  return (
    <div className="flex flex-row flex-wrap gap-2 items-center justify-center rounded-md border-2 p-3">
      <h1 className="text-xl font-bold px-2 w-full text-center">ترتيب الأصناف</h1>
      {sortedItems.map((item: any, index: number) => (
        <div
          key={item.id || item.name}
          className={cn(
            "relative flex space-x-3 border rounded p-2 bg-gray-100",
            dragged ? "cursor-grabbing" : "cursor-grab"
          )}
          draggable
          onDragStart={() => {
            dragPerson.current = index;
            setDragged(true);
          }}
          onDragEnter={() => {
            draggedOverPerson.current = index;
          }}
          onDragEnd={handleSort}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-slate-950">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default SortTheData;
