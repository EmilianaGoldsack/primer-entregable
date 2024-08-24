const socket = io();

// Handle product updates
socket.on('productUpdate', (product) => {
  console.log('Product updated:', product);
  // Example: Update the UI with the new product data
  const productElement = document.getElementById(`product-${product._id}`);
  if (productElement) {
    productElement.querySelector('.product-price').textContent = `$${product.price}`;
    // Add more UI update logic as needed
  }
});

// Handle cart updates
socket.on('cartUpdate', (cart) => {
  console.log('Cart updated:', cart);
  // Example: Update the UI with the new cart data
  const cartElement = document.getElementById('cart');
  if (cartElement) {
    cartElement.innerHTML = ''; // Clear existing content
    cart.products.forEach(product => {
      const productItem = document.createElement('li');
      productItem.textContent = `${product.name}: ${product.quantity}`;
      cartElement.appendChild(productItem);
    });
  }
});

// Emit an event for product updates (Example)
function updateProduct(product) {
  socket.emit('productUpdate', product);
}

// Emit an event for cart updates (Example)
function updateCart(cart) {
  socket.emit('cartUpdate', cart);
}

// Functions to handle UI interactions

// Add a product to the cart
function addToCart(productId) {
  socket.emit('cartUpdate', { action: 'add', productId });
}

// View product details
function viewDetails(productId) {
  window.location.href = `/products/${productId}`;
}

// Remove a product from the cart
function removeFromCart(productId) {
  socket.emit('cartUpdate', { action: 'remove', productId });
}

// Update the quantity of a product in the cart
function updateProductQuantity(productId, quantity) {
  socket.emit('cartUpdate', { action: 'updateQuantity', productId, quantity });
}

// Clear all products from the cart
function clearCart() {
  socket.emit('cartUpdate', { action: 'clear' });
}

// Example: Call these functions when a button is clicked
// Assume you have buttons with IDs corresponding to product IDs
document.querySelectorAll('.add-to-cart-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const productId = event.target.dataset.productId;
    addToCart(productId);
  });
});

document.querySelectorAll('.remove-from-cart-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const productId = event.target.dataset.productId;
    removeFromCart(productId);
  });
});

document.querySelectorAll('.update-quantity-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const productId = event.target.dataset.productId;
    const quantity = parseInt(event.target.previousElementSibling.value, 10);
    updateProductQuantity(productId, quantity);
  });
});

document.getElementById('clear-cart-button').addEventListener('click', () => {
  clearCart();
});
