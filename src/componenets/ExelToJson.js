import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelToJson = () => {
  const [jsonResult, setJsonResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setJsonResult(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex items-center">
      <label
        htmlFor="file-input"
        className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
      >
        엑셀 파일 선택
      </label>
      <input
        id="file-input"
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
      {jsonResult && <pre>{JSON.stringify(jsonResult, null, 2)}</pre>}
    </div>
  );
};

export default ExcelToJson;
