export const filterShirts = (products, activeTab) => {
  if (activeTab === "all") return products;
  
  return products.filter(product => {
    const name = (product.productName || '').toLowerCase();
    switch (activeTab) {
      case "so-mi":
        return name.includes('sơ mi') || name.includes('somi') || name.includes('áo sơ mi');
      case "ao-phong":
        return name.includes('phông') || name.includes('phong') || name.includes('t-shirt') || name.includes('tshirt');
      case "ao-khoac":
        return name.includes('khoác') || name.includes('jacket');
      default:
        return name.includes(activeTab.toLowerCase());
    }
  });
};

export const filterPants = (products, activeTab) => {
  if (activeTab === "all") return products;
  
  return products.filter(product => {
    const name = (product.productName || '').toLowerCase();
    switch (activeTab) {
      case "quan-tay":
        return name.includes('tây') || name.includes('trouser') || name.includes('kaki');
      case "quan-short":
        return name.includes('short') || name.includes('soóc');
      case "quan-jeans":
        return name.includes('jean') || name.includes('bò');
      default:
        return name.includes(activeTab.toLowerCase());
    }
  });
};

export const filterAccessories = (products, activeTab) => {
  if (activeTab === "all") return products;
  
  return products.filter(product => {
    const name = (product.productName || '').toLowerCase();
    switch (activeTab) {
      case "do-lot":
        return name.includes('đồ lót') || name.includes('underwear') || name.includes('quần lót');
      case "tat":
        return name.includes('tất') || name.includes('sock') || name.includes('vớ');
      case "day-lung":
        return name.includes('dây lưng') || name.includes('belt') || name.includes('thắt lưng');
      case "vi-da":
        return name.includes('ví') || name.includes('wallet') || name.includes('bóp');
      default:
        return name.includes(activeTab.toLowerCase());
    }
  });
};

