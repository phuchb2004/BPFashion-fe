import React from "react";
import CategoryProductsPage from "../category-products/CategoryProductsPage";
import { filterAccessories } from "../category-products/filterHelpers";
import { useTranslation } from "react-i18next";

export default function AccessoriesPage() {
  const { t } = useTranslation();

  const accessoryTabs = [
    { key: "all", label: t("homepage.category.title.accessories") },
    { key: "do-lot", label: t("homepage.category.childName.underwear") },
    { key: "tat", label: t("homepage.category.childName.socks") },
    { key: "day-lung", label: t("homepage.category.childName.belt") },
    { key: "vi-da", label: t("homepage.category.childName.wallet") },
  ];

  return (
    <CategoryProductsPage
      categoryId={3}
      categoryName="Phụ kiện"
      tabs={accessoryTabs}
      filterProducts={filterAccessories}
    />
  );
}