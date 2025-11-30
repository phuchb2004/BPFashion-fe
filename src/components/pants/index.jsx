import React from "react";
import CategoryProductsPage from "../category-products/CategoryProductsPage";
import { filterPants } from "../category-products/filterHelpers";
import { useTranslation } from "react-i18next";

export default function PantsPage() {
  const { t } = useTranslation();

  const pantTabs = [
    { key: "all", label: t("homepage.category.title.pants") },
    { key: "quan-tay", label: t("homepage.category.childName.dress-pant") },
    { key: "quan-short", label: t("homepage.category.childName.shorts") },
    { key: "quan-jeans", label: t("homepage.category.childName.jeans") },
  ];

  return (
    <CategoryProductsPage
      categoryId={2}
      categoryName="Quần"
      tabs={pantTabs}
      filterProducts={filterPants}
    />
  );
}