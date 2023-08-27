async function fetchJSON(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async function fetchProducts() {
    return fetchJSON('https://fakestoreapi.com/products');
  }

  async function fetchUsers() {
    return fetchJSON('https://fakestoreapi.com/users');
  }

  async function getProductsWithAboveAvgPrice() {
    const products = await fetchProducts();
    const prices = products.map(product => product.price);
    const averagePrice = prices.reduce((total, price) => total + price, 0) / prices.length;
    const aboveAvgProducts = products.filter(product => product.price > averagePrice);
    return aboveAvgProducts;
  }

  async function getTopRatedProducts() {
    const products = await fetchProducts();
    products.sort((a, b) => b.rating - a.rating);
    return products.slice(0, 5);
  }

  async function getAllCategories() {
    const products = await fetchProducts();
    const categories = [...new Set(products.map(product => product.category))];
    return categories;
  }

  async function getAveragePriceAndRating() {
    const products = await fetchProducts();
    const prices = products.map(product => product.price);
    const ratings = products.map(product => product.rating);
    const averagePrice = prices.reduce((total, price) => total + price, 0) / prices.length;
    const averageRating = ratings.reduce((total, rating) => total + rating, 0) / ratings.length;
    return { averagePrice, averageRating };
  }

  async function getTopRatedAndLowestPricedProducts() {
    const products = await fetchProducts();
    products.sort((a, b) => b.rating - a.rating || a.price - b.price);
    return products.slice(0, 5);
  }

  async function getUserProductInfo() {
    const [products, users] = await Promise.all([fetchProducts(), fetchUsers()]);

    const userProductInfo = users.map(user => {
      const userProducts = products.filter(product => product.userId === user.id);
      const totalBill = userProducts.reduce((total, product) => total + product.price, 0);

      return {
        name: user.name,
        email: user.email,
        city: user.address.city,
        products: userProducts.map(product => product.title),
        prices: userProducts.map(product => product.price),
        totalBill,
      };
    });

    return userProductInfo;
  }

  async function displayProductsAboveAvgPrice() {
    const aboveAvgProducts = await getProductsWithAboveAvgPrice();

    const productInfoDiv = document.getElementById('productInfo');
    const productHtml = aboveAvgProducts.map(product => `<div class="card mb-3">${product.title} - $${product.price}</div>`).join('');
    productInfoDiv.innerHTML = productHtml;
  }


  async function displayTopRatedProducts() {
    const topRatedProducts = await getTopRatedProducts();

    const productInfoDiv = document.getElementById('productInfo');
    const productHtml = topRatedProducts.map(product => `<div class="card mb-3">${product.title} - Rating: ${product.rating}</div>`).join('');
    productInfoDiv.innerHTML = productHtml;
  }

  async function displayCategories() {
    const categories = await getAllCategories();

    const productInfoDiv = document.getElementById('productInfo');
    const categoryHtml = categories.map(category => `<div class="card mb-3">${category}</div>`).join('');
    productInfoDiv.innerHTML = categoryHtml;
  }

  async function displayAveragePriceAndRating() {
    const { averagePrice, averageRating } = await getAveragePriceAndRating();

    const productInfoDiv = document.getElementById('productInfo');
    const infoHtml = `
      <div class="card mb-3">Average Price: $${averagePrice.toFixed(2)}</div>
      <div class="card mb-3">Average Rating: ${averageRating.toFixed(2)}</div>
    `;
    productInfoDiv.innerHTML = infoHtml;
  }

  async function displayTopRatedAndLowestPricedProducts() {
    const topRatedAndLowestPricedProducts = await getTopRatedAndLowestPricedProducts();

    const productInfoDiv = document.getElementById('productInfo');
    const productHtml = topRatedAndLowestPricedProducts.map(product => `<div class="card mb-3">${product.title} - Rating: ${product.rating} - Price: $${product.price}</div>`).join('');
    productInfoDiv.innerHTML = productHtml;
  }

  async function displayUserProductInfo() {
    const userProductInfo = await getUserProductInfo();
    const userInfoDiv = document.getElementById('productInfo');

    const userInfoHtml = userProductInfo.map(user => `
      <div class="card mb-3">
        <div class="card-header">${user.name}</div>
        <div class="card-body">
          <p class="card-text">Email: ${user.email}</p>
          <p class="card-text">City: ${user.city}</p>
          <ul class="list-group">
            ${user.products.map((product, index) => `<li class="list-group-item">${product} - $${user.prices[index]}</li>`).join('')}
          </ul>
          <p class="card-text">Total Bill: $${user.totalBill}</p>
        </div>
      </div>
    `).join('');

    userInfoDiv.innerHTML = userInfoHtml;
  }
