import { React, useState } from "react";

const useProductTotalCalculator = () => {
  const productPrices = {
    마스크: 107000,
    오일: 169000,
    클렌저: 59000,
    베이스: 72000,
    세럼: 149000,
  };
  const calculateTotalAmount = (data) => {
    const result = data.map((item) => {
      console.log("item.product:", item.product); // 로그 추가

      // product 값이 없거나 undefined인 경우에 대한 처리 추가
      if (!item.product) {
        return item;
      }

      const productsStr = item.product.replace(/\(\d+\)\s+/g, ""); // 괄호안 숫자와 공백 제거
      const products = productsStr.split(","); // ,로 제품들을 분리
      let orderTotal = 0;

      products.forEach((productStr) => {
        const productMatch = productStr.match(/(\S+)\s*\/\s*(.+)\s+(\d+)건/);
        if (productMatch) {
          const [, productName, restOfProduct, quantity] = productMatch;
          const price = productPrices[productName] || 0;
          orderTotal += price * parseInt(quantity);
        }
      });

      return {
        ...item,
        orderTotal,
      };
    });

    return result;
  };

  return { calculateTotalAmount };
};

export default useProductTotalCalculator;
