import React from "react";
import { exportToExcel } from "@/lib/exportToExcel";
import { FolderDown } from "lucide-react";

const ExportButton = ({ data }: { data: any[] }) => {
  const handleExport = () => {
    exportToExcel(data, "my-data");
  };

  return (
    <button
    disabled={data.length === 0}
      onClick={handleExport}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-[12px]"
    >
    <FolderDown/>
    XL
    </button>
  );
};

export default ExportButton;
