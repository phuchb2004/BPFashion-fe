import React from "react";
import CategoryProductsPage from "../category-products/CategoryProductsPage";
import { filterPants } from "../category-products/filterHelpers";

const pantTabs = [
  { key: "all", label: "Tất cả quần" },
  { key: "quan-tay", label: "Quần tây" },
  { key: "quan-short", label: "Quần short" },
  { key: "quan-jeans", label: "Quần jeans" },
];

export default function PantsPage() {
  return (
    <CategoryProductsPage
      categoryId={2}
      categoryName="Quần"
      tabs={pantTabs}
      filterProducts={filterPants}
    />
  );
}