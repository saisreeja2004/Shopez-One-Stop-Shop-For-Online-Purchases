// Fetch and display products
function fetchProducts() {
  fetch("http://localhost:8080/api/products")
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById("admin-products");
      container.innerHTML = "";
      products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
          <strong>${p.name}</strong><br>
          ₹${p.price} - ${p.description}<br>
          <button onclick="deleteProduct('${p.id}')">Delete</button>
        `;
        container.appendChild(div);
      });
    });
}

// Fetch and display orders
function fetchOrders() {
  fetch("http://localhost:8080/api/orders")
    .then(res => res.json())
    .then(orders => {
      const container = document.getElementById("admin-orders");
      container.innerHTML = "";
      orders.forEach(order => {
        const div = document.createElement("div");
        div.className = "order";
        div.innerHTML = `
          <strong>Order ID:</strong> ${order.id || order._id}<br>
          <strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}<br>
          <strong>Items:</strong>
          <ul>
            ${order.items.map(item => `<li>${item.name} × ${item.quantity}</li>`).join("")}
          </ul>
        `;
        container.appendChild(div);
      });
    });
}

// Delete a product
function deleteProduct(id) {
  fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      alert("Product deleted");
      fetchProducts(); // Refresh
    })
    .catch(err => console.error("Delete failed:", err));
}

window.onload = function () {
  fetchProducts();
  fetchOrders();
};
