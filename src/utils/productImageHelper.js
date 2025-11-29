const getProductImageUrl = (product) => {
if (typeof product === 'string') {
    return product.startsWith('http') || product.startsWith('/') ? product : '/assets/logo2.png';
  }
  
  if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '') {
    return product.imageUrl;
  }

  const categoryName = product.categoryName?.toLowerCase() || '';
  const productName = product.productName?.toLowerCase() || '';
  
  let basePath = '/assets/';
  
  if (categoryName.includes('áo') || categoryName.includes('shirt') || product.categoryId === 1) {
    basePath += 'shirts/';
    
    if (productName.includes('sơ mi') || productName.includes('somi') || productName.includes('áo sơ mi')) {
      basePath += 'somi/';
    } else if (productName.includes('phông') || productName.includes('phong') || productName.includes('tshirt') || productName.includes('t-shirt')) {
      basePath += 'tshirt/';
    } else if (productName.includes('khoác') || productName.includes('jacket')) {
      basePath += 'jacket/';
    } else if (productName.includes('len') || productName.includes('sweater') || productName.includes('áo len')) {
      basePath += 'sweater/';
    } else {
      basePath += 'tshirt/';
    }
    
    const color = getColorFromProduct(product);
    basePath += `${color}.jpg`;
    
  } else if (categoryName.includes('quần') || categoryName.includes('pant') || product.categoryId === 2) {
    basePath += 'pants/';
    
    if (productName.includes('jean') || productName.includes('bò')) {
      basePath += 'jeans/';
      const color = getColorFromProduct(product);
      basePath += `${color}.jpg`;
    } else if (productName.includes('short') || productName.includes('soóc')) {
      basePath += 'short/';
      const color = getColorFromProduct(product);
      basePath += `${color}.jpg`;
    } else if (productName.includes('tây') || productName.includes('trouser') || productName.includes('kaki')) {
      basePath += 'trouser/';
      const color = getColorFromProduct(product);
      basePath += `${color}.jpg`;
    } else if (productName.includes('felt') || productName.includes('nỉ')) {
      basePath += 'felt/';
      const color = getColorFromProduct(product);
      basePath += `${color}.jpg`;
    } else {
      basePath += 'jeans/';
      const color = getColorFromProduct(product);
      basePath += `${color}.jpg`;
    }
    
  } else if (categoryName.includes('phụ kiện') || categoryName.includes('accessor') || product.categoryId === 3) {
    basePath += 'accessories/';
    
    if (productName.includes('dây lưng') || productName.includes('belt') || productName.includes('thắt lưng')) {
      basePath += 'belt/';
      const beltIndex = (product.productId % 5) + 1;
      basePath += `belt${beltIndex}.jpg`;
    } else if (productName.includes('ví') || productName.includes('wallet') || productName.includes('bóp')) {
      basePath += 'wallet/';
      const color = getColorFromProduct(product);
      basePath += `${color}.jpg`;
    } else if (productName.includes('tất') || productName.includes('sock') || productName.includes('vớ')) {
      basePath += 'socks/';
      const color = getColorFromProduct(product);
      basePath += `${color}.jpg`;
    } else if (productName.includes('đồ lót') || productName.includes('underwear') || productName.includes('quần lót')) {
      basePath += 'underwear/';
      const color = getColorFromProduct(product);
      basePath += `${color}-coolmate.jpg`;
    } else {
      basePath += 'belt/';
      const beltIndex = (product.productId % 5) + 1;
      basePath += `belt${beltIndex}.jpg`;
    }
    
  } else {
    return '/assets/logo2.png';
  }
  
  return basePath;
};

const getColorFromProduct = (product) => {
  const productName = product.productName?.toLowerCase() || '';
  const colorField = product.color?.toLowerCase() || '';
  
  if (productName.includes('đen') || productName.includes('black')) {
    return 'black';
  } else if (productName.includes('trắng') || productName.includes('white')) {
    return 'white';
  } else if (productName.includes('xanh') || productName.includes('blue')) {
    if (productName.includes('đậm') || productName.includes('dark')) {
      return 'dark-blue';
    } else if (productName.includes('nhạt') || productName.includes('light')) {
      return 'light-blue';
    }
    return 'blue';
  } else if (productName.includes('đỏ') || productName.includes('red')) {
    return 'red';
  } else if (productName.includes('hồng') || productName.includes('pink')) {
    return 'pink';
  } else if (productName.includes('xám') || productName.includes('gray') || productName.includes('grey')) {
    return 'gray';
  } else if (productName.includes('nâu') || productName.includes('brown')) {
    return 'brown';
  }
  
  if (colorField.includes('đen') || colorField.includes('black')) {
    return 'black';
  } else if (colorField.includes('trắng') || colorField.includes('white')) {
    return 'white';
  } else if (colorField.includes('xanh') || colorField.includes('blue')) {
    if (colorField.includes('đậm') || colorField.includes('dark')) {
      return 'dark-blue';
    } else if (colorField.includes('nhạt') || colorField.includes('light')) {
      return 'light-blue';
    }
    return 'blue';
  } else if (colorField.includes('đỏ') || colorField.includes('red')) {
    return 'red';
  } else if (colorField.includes('hồng') || colorField.includes('pink')) {
    return 'pink';
  } else if (colorField.includes('xám') || colorField.includes('gray') || colorField.includes('grey')) {
    return 'gray';
  } else if (colorField.includes('nâu') || colorField.includes('brown')) {
    return 'brown';
  }
  
  const colors = ['black', 'white', 'blue', 'gray', 'red'];
  return colors[product.productId % colors.length];
};

export default getProductImageUrl;

