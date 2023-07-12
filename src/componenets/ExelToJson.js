import React, { useState } from "react";
import * as XLSX from "xlsx";
function findCommonValues(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}

const ExcelToJson = () => {
  const [clList, setclList] = useState(null);
  const [withYouList, setWithYouList] = useState(null);
  const [reviewPlaceList, setReviewPlaceList] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  // 위드유 핸들러
  const handleWithYouFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: "A",
        raw: false,
      });
      const singleColumnArray = jsonData.map((row) => row["A"]);
      setWithYouList(singleColumnArray);
      console.log(singleColumnArray);
    };
    reader.readAsArrayBuffer(file);
  };

  //리뷰플레이스 헨들러
  const handleReviewPlaceFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: "A",
        raw: false,
      });
      const singleColumnArray = jsonData.map((row) => row["A"]);
      setReviewPlaceList(singleColumnArray);
      console.log(singleColumnArray);
    };
    reader.readAsArrayBuffer(file);
  };
  //cl핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0];
      const convertedData = jsonData.slice(1).map((row) =>
        headers.reduce((obj, header, index) => {
          if (
            header === "주문인" ||
            header === "주문인 휴대폰" ||
            header === "주문인 휴대폰" ||
            header === "금액"
          ) {
            obj[header] = row[index];
          }

          return obj;
        }, {})
      );

      setclList(convertedData);
      //중복제외
      console.log(clList);
      const duplicates = findCommonValues(withYouList, reviewPlaceList);

      const filteredData = convertedData.map((item) => {
        const orderName = item["주문인"];
        if (duplicates.includes(orderName)) {
          item["주문인"] = `!${orderName}`;
        }
        return item;
      });
      console.log(duplicates);

      console.log("filterd 1 : ", filteredData);

      const finalData = filteredData.filter((item) => {
        const orderName = item["주문인"];
        const isInWithYouList = withYouList.includes(orderName);
        const isInReviewPlaceList = reviewPlaceList.includes(orderName);
        return !(isInWithYouList || isInReviewPlaceList);
      });
      //출력
      console.log("필터링완료: ", finalData);
      setFilteredList(finalData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `rahab_salse_report.xlsx`);
  };

  return (
    <div className="justify-center">
      <div className="my-10">
        <label
          htmlFor="file-input"
          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
        >
          3PL발송리스트
        </label>
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="withyou-file-input" // 고유한 ID로 변경
          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
        >
          위드유
        </label>
        <input
          id="withyou-file-input" // 고유한 ID
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleWithYouFileChange}
        />
        <label
          htmlFor="reviewPlace-file-input" // 고유한 ID로 변경
          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
        >
          리뷰플레이스
        </label>
        <input
          id="reviewPlace-file-input" // 고유한 ID
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleReviewPlaceFileChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
      {clList && (
        <div className="mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {Object.keys(clList[0]).map((header) => (
                  <th
                    key={header}
                    className="py-2 px-4 border border-gray-300 bg-gray-100 font-bold text-sm text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clList.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  {Object.values(row).map((value, idx) => (
                    <td
                      key={idx}
                      className="py-2 px-4 border border-gray-300 text-sm text-gray-700"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelToJson;
