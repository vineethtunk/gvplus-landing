const fs = require("fs");
const XLSX = require("xlsx");

// Read your Shopify export file
const products = JSON.parse(
  fs.readFileSync("shopify-products.json", "utf8")
);

// Remove HTML tags
function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const rows = [];

products.forEach(product => {
  const description = stripHtml(product.body_html);

  product.variants.forEach(variant => {
    rows.push({
      Product_ID: product.id,
      Product_Name: product.title,
      Vendor: product.vendor,
      Handle: product.handle,

      SKU: variant.sku,
      Variant: variant.title,

      Capacity: variant.option1 || "",
      Color: variant.option2 || "",

      Price: variant.price,
      MRP: variant.compare_at_price,

      Available: variant.available ? "Yes" : "No",

      Variant_Image:
        variant.featured_image?.src || "",

      All_Product_Images:
        product.images.map(img => img.src).join(" | "),

      Description: description,

      Tags: product.tags.join(", "),

      Created_At: product.created_at,
      Updated_At: product.updated_at,
      Published_At: product.published_at
    });
  });
});

// Create workbook
const worksheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
  workbook,
  worksheet,
  "Products"
);

// Auto column widths
worksheet["!cols"] = [
  { wch: 15 },
  { wch: 40 },
  { wch: 15 },
  { wch: 40 },
  { wch: 25 },
  { wch: 25 },
  { wch: 15 },
  { wch: 15 },
  { wch: 12 },
  { wch: 12 },
  { wch: 10 },
  { wch: 50 },
  { wch: 100 },
  { wch: 100 },
  { wch: 30 },
  { wch: 20 },
  { wch: 20 },
  { wch: 20 }
];

XLSX.writeFile(workbook, "GVPLUS_PRODUCTS.xlsx");

console.log(`Exported ${rows.length} rows`);