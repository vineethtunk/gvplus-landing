const axios = require("axios");
const fs = require("fs");

const BASE = "https://www.milton.in/"; // replace with Shopify site
let page = 1;
let allProducts = [];

(async () => {
  while (true) {
    console.log("Fetching page", page);

    const res = await axios.get(`${BASE}/products.json?page=${page}`);
    const products = res.data.products;

    if (!products.length) break;

    allProducts.push(...products);
    page++;
  }

  fs.writeFileSync("shopify-products.json", JSON.stringify(allProducts, null, 2));

  console.log(`Done. Total products: ${allProducts.length}`);
})();