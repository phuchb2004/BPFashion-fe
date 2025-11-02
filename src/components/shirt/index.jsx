import React from "react";
import CategoryProductsPage from "../category-products/CategoryProductsPage";
import { filterShirts } from "../category-products/filterHelpers";

const shirtTabs = [
  { key: "all", label: "Tất cả áo" },
  { key: "so-mi", label: "Áo sơ mi" },
  { key: "ao-phong", label: "Áo phông" },
  { key: "ao-khoac", label: "Áo khoác" },
];

export default function ShirtsPage() {
  return (
    <CategoryProductsPage
      categoryId={1}
      categoryName="Áo"
      tabs={shirtTabs}
      filterProducts={filterShirts}
    />
  );
}