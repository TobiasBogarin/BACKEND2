document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const productsContainer = document.createElement('div'); 
    productsContainer.classList.add('products-section');
    cartItemsContainer.appendChild(productsContainer);
  
    const cartContainer = document.createElement('div'); 
    cartContainer.classList.add('cart-section');
    cartContainer.innerHTML = '<h3>Carrito Actual:</h3>';
    cartItemsContainer.appendChild(cartContainer);
  
    const totalElement = document.getElementById('total');
    const confirmButton = document.getElementById('confirmPurchase');
    const result = document.getElementById('result');
  
    let cart = []; 
  

    async function loadProducts() {
      try {
        const res = await fetch('/api/cart/products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const products = await res.json();
        if (res.ok) {
          displayProducts(products);
        } else {
          Toastify({
            text: `Error al cargar productos: ${products.message}`,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#dc3545'
          }).showToast();
        }
      } catch (error) {
        Toastify({
          text: `Error: ${error.message}`,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#dc3545'
        }).showToast();
      }
    }
  
    function displayProducts(products) {
      productsContainer.innerHTML = '';
      products.forEach(product => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
          <span>${product.name} - $${product.price} (Stock: ${product.stock})</span>
          <input type="number" min="1" max="${product.stock}" value="0" id="qty-${product._id}">
          <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, ${product.stock})">Agregar</button>
        `;
        productsContainer.appendChild(itemElement);
      });
    }
  
    window.addToCart = (productId, name, price, stock) => {
      const quantity = parseInt(document.getElementById(`qty-${productId}`).value, 10);
      if (quantity === 0) {
        Toastify({
          text: 'La cantidad debe ser mayor a 0',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#dc3545'
        }).showToast();
        return;
      }
      if (quantity > stock) {
        Toastify({
          text: `Stock insuficiente para ${name} (máximo ${stock})`,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#dc3545'
        }).showToast();
        return;
      }
      const existingItem = cart.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ productId, name, price, quantity });
      }
      Toastify({
        text: `${quantity} ${name}(s) agregado(s) al carrito`,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#28a745'
      }).showToast();
      document.getElementById(`qty-${productId}`).value = 0; 
      updateCartDisplay();
    };
  

    function updateCartDisplay() {
      const cartSection = cartContainer; 
      cartSection.innerHTML = '<h3>Carrito Actual:</h3><ul></ul>';
      const cartList = cartSection.querySelector('ul');
      let total = 0;
  
      cart.forEach(item => {
        const cost = item.price * item.quantity;
        const listItem = document.createElement('li');
        listItem.classList.add('cart-item');
        listItem.innerHTML = `
          ${item.name} - Cantidad: ${item.quantity} - Subtotal: $${cost.toFixed(2)}
        `;
        cartList.appendChild(listItem);
        total += cost;
      });
  
      totalElement.textContent = `$${total.toFixed(2)}`;
    }
  
    confirmButton.addEventListener('click', async () => {
      if (cart.length === 0) {
        Toastify({
          text: 'El carrito está vacío',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#dc3545'
        }).showToast();
        return;
      }
      try {
        const res = await fetch('/api/cart/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ cart })
        });
        const data = await res.json();
        if (res.ok) {
          Toastify({
            text: 'Compra realizada con éxito',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#28a745'
          }).showToast();
          cart = []; 
          updateCartDisplay();
        } else {
          Toastify({
            text: `Error: ${data.message}`,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#dc3545'
          }).showToast();
        }
      } catch (error) {
        Toastify({
          text: `Error al procesar la compra: ${error.message}`,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#dc3545'
        }).showToast();
      }
    });
  
    loadProducts();
  });