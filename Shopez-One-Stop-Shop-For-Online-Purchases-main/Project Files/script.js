function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountSpan = document.getElementById("cart-count");
  if (cartCountSpan) cartCountSpan.textContent = totalItems;
}

function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.name.toLowerCase() === name.toLowerCase());

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
  updateCartCount();
}

function removeItem(productName) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.name !== productName);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems(); // Refresh content
  updateCartCount();
}

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsDiv || !cartTotal) return;

  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <p><strong>${item.name}</strong> - ₹${item.price} × ${item.quantity}
        <button onclick="removeItem('${item.name}')">Remove</button></p>
      `;
      cartItemsDiv.appendChild(itemDiv);
      total += item.price * item.quantity;
    });
  }

  cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
}

function clearCart() {
  localStorage.removeItem("cart");
  loadCartItems();
  updateCartCount();
}

// ==========================
// ✅ Backend Integration Examples
// ==========================

// Fetch and log all products
function fetchProductsFromBackend() {
  fetch('http://127.0.0.1:8080/api/products')
    .then(res => res.json())
    .then(data => console.log("Products fetched:", data))
    .catch(err => console.error("Error fetching products:", err));
}

// Add a sample product (admin/debug purpose)
function addSampleProduct() {
  fetch('http://127.0.0.1:8080/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "Sample Product",
      price: 99.99,
      description: "This is a sample product.",
      imageUrl: "https://example.com/sample.jpg"
    })
  })
  .then(res => res.json())
  .then(data => console.log('Product added:', data))
  .catch(err => console.error("Error adding product:", err));
}

// Delete a product by ID (admin/debug purpose)
function deleteProductById(productId) {
  fetch(`http://127.0.0.1:8080/api/products/${productId}`, {
    method: 'DELETE'
  })
  .then(() => console.log('Product deleted'))
  .catch(err => console.error("Error deleting product:", err));
}

// ==========================
// ✅ Initialize On Load
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadCartItems();
});
function displayProducts() {
  fetch('http://127.0.0.1:8080/api/products')
    .then(res => res.json())
    .then(products => {
      const productList = document.getElementById("product-list");
      if (!productList) return;

      productList.innerHTML = "";

      products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p><strong>₹${product.price}</strong></p>
          <button class="add-to-cart" data-product='${JSON.stringify(product)}'>Add to Cart</button>
          <button class="edit-product" data-product='${JSON.stringify(product)}'>Edit</button>
          <div class="edit-form" style="display:none; margin-top: 10px;">
            <input type="text" class="edit-name" placeholder="Name" value="${product.name}" />
            <input type="number" class="edit-price" placeholder="Price" value="${product.price}" />
            <input type="text" class="edit-description" placeholder="Description" value="${product.description}" />
            <input type="text" class="edit-image" placeholder="Image URL" value="${product.imageUrl}" />
            <button class="save-edit">Save</button>
            <button class="cancel-edit">Cancel</button>
          </div>
        `;

        // Add-to-Cart Logic
        card.querySelector(".add-to-cart").addEventListener("click", function () {
          const productData = JSON.parse(this.getAttribute("data-product"));
          addToCart(productData.name, productData.price);
        });

        // Toggle Edit Form
        card.querySelector(".edit-product").addEventListener("click", function () {
          const form = card.querySelector(".edit-form");
          form.style.display = form.style.display === "none" ? "block" : "none";
        });

        // Cancel Edit
        card.querySelector(".cancel-edit").addEventListener("click", function () {
          card.querySelector(".edit-form").style.display = "none";
        });

        // Save Edit (PUT Request)
        card.querySelector(".save-edit").addEventListener("click", function () {
          const id = product._id;
          const updatedProduct = {
            name: card.querySelector(".edit-name").value,
            price: parseFloat(card.querySelector(".edit-price").value),
            description: card.querySelector(".edit-description").value,
            imageUrl: card.querySelector(".edit-image").value
          };

          fetch(`http://127.0.0.1:8080/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
          })
            .then(res => {
              if (!res.ok) throw new Error("Failed to update product");
              return res.json();
            })
            .then(() => {
              alert("Product updated successfully!");
              displayProducts(); // reload updated products
            })
            .catch(err => {
              console.error("Error updating product:", err);
              alert("Update failed!");
            });
        });

        productList.appendChild(card);
      });
    })
    .catch(err => console.error("Error loading products:", err));
}
function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Cart is empty. Add items before placing an order.");
    return;
  }

  fetch("http://127.0.0.1:8080/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: cart })
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to place order");
      return response.json();
    })
    .then(data => {
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      loadCartItems(); // Refresh cart
      updateCartCount();
      console.log("Order Response:", data);
    })
    .catch(error => {
      console.error("Order Error:", error);
      alert("Failed to place order. Try again.");
    });
}
