const fs = require('fs');

//place 'parts.json' and 'categories.json' in input, then run, (Must rename/convert XML first)

// Read the parts.json and categories.json files
const partsFilePath = './input/parts.json';
const categoriesFilePath = './input/categories.json';

fs.readFile(partsFilePath, 'utf8', (err, partsData) => {
  if (err) {
    console.error("Error reading parts.json:", err);
    return;
  }

  fs.readFile(categoriesFilePath, 'utf8', (err, categoriesData) => {
    if (err) {
      console.error("Error reading categories.json:", err);
      return;
    }

    try {
      // Parse the JSON data
      const parts = JSON.parse(partsData);
      const categories = JSON.parse(categoriesData);

      // Create a mapping of category ID to category name
      const categoryMap = {};
      categories.CATALOG.ITEM.forEach(item => {
        categoryMap[item.CATEGORY] = item.CATEGORYNAME;
      });

      // Iterate over parts and replace CATEGORY ID with CATEGORYNAME
      parts.CATALOG.ITEM.forEach(item => {
        const categoryId = item.CATEGORY;
        if (categoryMap[categoryId]) {
          item.CATEGORY = categoryMap[categoryId]; // Replace with category name
        } else {
          console.warn(`Category ID ${categoryId} not found in categories.json`);
        }
      });

      // Output the combined data (could be written to a new file or console)
      const result = JSON.stringify(parts, null, 2); // Pretty-print the result
      fs.writeFile('./output/combined_parts.json', result, 'utf8', (err) => {
        if (err) {
          console.error("Error writing combined JSON:", err);
        } else {
          console.log("Combined JSON saved to ./output/combined_parts.json");
        }
      });

    } catch (parseErr) {
      console.error("Error parsing JSON data:", parseErr);
    }
  });
});
