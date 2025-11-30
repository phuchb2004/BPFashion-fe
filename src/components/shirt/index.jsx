import React from "react";
import CategoryProductsPage from "../category-products/CategoryProductsPage";
import { filterShirts } from "../category-products/filterHelpers";
import { useTranslation } from "react-i18next";

export default function ShirtsPage() {
  const { t } = useTranslation();

  const shirtTabs = [
  { key: "all", label: t("homepage.category.title.shirts") },
  { key: "so-mi", label: t("homepage.category.childName.somi") },
  { key: "ao-phong", label: t("homepage.category.childName.tshirt") },
  { key: "ao-khoac", label: t("homepage.category.childName.jacket") },
  ];

  return (
    <CategoryProductsPage
      categoryId={1}
      categoryName="Áo"
      tabs={shirtTabs}
      filterProducts={filterShirts}
    />
  );
}