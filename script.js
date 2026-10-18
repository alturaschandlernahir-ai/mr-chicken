const products = [
  {
    id: 1,
    name: "Classic Lechon Manok",
    desc: "Original na lasa, malinamnam at juicy.",
    price: 320,
    tag: "BEST SELLER",
    image: "Image/Classic letchon manok.jpg"
  },
  {
    id: 2,
    name: "Sweet and Spicy Lechon Manok",
    desc: "Glazed with our special sweet and chili blend for an extra kick.",
    price: 340,
    tag: "SPICY",
    image: "Image/Sweet and spicy letchon manok.jpg"
  },
  {
    id: 3,
    name: "Lechon Manok and BBQ",
    desc: "Perfect combo of savory Lechon Manok and smoky grilled BBQ skewers.",
    price: 380,
    tag: "SIGNATURE",
    image: "Image/letchon Manok and BBQ.jpg"
  },
  {
    id: 4,
    name: "Family Combo",
    desc: "2 Lechon Manok, 4 Rice, 4 Drinks, and Special Sauce.",
    price: 699,
    tag: "FAMILY FAVORITE",
    image: "Image/Family combo.jpg"
  }
];

let cart = {};

function getProduct(id) {
  return products.find(p => p.id === Number(id));
}

function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = products.map(p => `
    <div class="card product-card">
      <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
      <div class="card-body">
        <span class="tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="price">₱${p.price.toFixed(2)}</div>
        <button class="btn" onclick="addToCart(${p.id})">
          + Add to Cart
        </button>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  const product = getProduct(id);
  if (product) {
    document.getElementById("status").textContent =
      "Naidagdag sa cart ang " + product.name + ".";
  }
}

function changeQty(id, amount) {
  cart[id] = (cart[id] || 0) + amount;
  if (cart[id] <= 0) {
    delete cart[id];
  }
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const container = document.getElementById("cart-items");
  const totalContainer = document.getElementById("total");

  if (!container || !totalContainer) return;

  if (entries.length === 0) {
    container.innerHTML = "Wala pang laman ang iyong cart.";
    totalContainer.innerText = "₱0.00";
    return;
  }

  container.innerHTML = entries.map(([id, qty]) => {
    const p = getProduct(id);
    if (!p) return '';
    return `
      <div class="cart-row cart-item">
        <div>
          <strong>${p.name}</strong><br>
          <span style="color:#ffb43b">
            ₱${(p.price * qty).toFixed(2)}
          </span>
        </div>
        <div>
          <button type="button" onclick="changeQty(${id}, -1)">−</button>
          ${qty}
          <button type="button" onclick="changeQty(${id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  const total = entries.reduce((sum, [id, qty]) => {
    const p = getProduct(id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  totalContainer.innerText = "₱" + total.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", function(e) {
      e.preventDefault();

      if (Object.keys(cart).length === 0) {
        document.getElementById("status").textContent =
          "Magdagdag muna ng produkto sa cart.";
        return;
      }

      const name = document.getElementById("customer").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();

      const lines = Object.entries(cart).map(([id, qty]) => {
        const p = getProduct(id);
        return p.name + " x " + qty + " = ₱" + (p.price * qty).toFixed(2);
      });

      const total = Object.entries(cart).reduce((sum, [id, qty]) => {
        const p = getProduct(id);
        return sum + (p ? p.price * qty : 0);
      }, 0);

      document.getElementById("status").innerText =
        "ORDER SUMMARY\n" +
        "Pangalan: " + name +
        "\nContact: " + phone +
        "\nAddress/Pickup: " + address +
        "\n\n" + lines.join("\n") +
        "\n\nTOTAL: ₱" + total.toFixed(2) +
        "\n\nHindi pa naipapadala ang order na ito sa tindahan.";
    });
  }
});