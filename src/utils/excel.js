export const calculateTotalPrice = (data, totalKey) => {
  const totalPriceObj = {};

  data.forEach((item) => {
    const productInfo = item["내품상품(구분값:|)"];
    const products = productInfo.split("|");

    products.forEach((product) => {
      const [productInfo, quantity] = product.trim().split("/");
      const [productName, price] = productInfo.split(" - ");

      const parsedPrice = parseInt(price.replace(/[^0-9]/g, ""));
      const totalPrice = parsedPrice * parseInt(quantity);

      if (totalPriceObj.hasOwnProperty(productName)) {
        totalPriceObj[productName] += totalPrice;
      } else {
        totalPriceObj[productName] = totalPrice;
      }
    });
  });

  const totalSum = Object.values(totalPriceObj).reduce(
    (sum, price) => sum + price,
    0
  );
  totalPriceObj[totalKey] = totalSum;

  return totalPriceObj;
};
