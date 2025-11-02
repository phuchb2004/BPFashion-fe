import React from "react";
import CategoryProductsPage from "../category-products/CategoryProductsPage";
import { filterAccessories } from "../category-products/filterHelpers";

const accessoryTabs = [
  { key: "all", label: "Tất cả phụ kiện" },
  { key: "do-lot", label: "Đồ lót" },
  { key: "tat", label: "Tất" },
  { key: "day-lung", label: "Dây lưng" },
  { key: "vi-da", label: "Ví da" },
];

export default function AccessoriesPage() {
  return (
    <CategoryProductsPage
      categoryId={3}
      categoryName="Phụ kiện"
      tabs={accessoryTabs}
      filterProducts={filterAccessories}
    />
  );
}