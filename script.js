const products = [
  {
    id: 1,
    name: "Classic Lechon Manok",
    desc: "Original na lasa, malinamnam at juicy.",
    price: 220,
    tag: "BEST SELLER",
    img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Lava Chicken",
    desc: "Sweet and spicy para sa mahilig sa anghang.",
    price: 250,
    tag: "SPICY",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Honey Garlic Roast",
    desc: "Matamis at mabangong garlic flavor.",
    price: 250,
    tag: "SIGNATURE",
    img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Calamansi Zing",
    desc: "Maasim-asim at mabango.",
    price: 250,
    tag: "NEW",
    img: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Solo Chicken Rice Bowl",
    desc: "Hiniwang manok at kanin na may sauce.",
    price: 99,
    tag: "BUDGET MEAL",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
  }
];

const feastBox = {
  id: 5,
  name: "Barkada Feast Box",
  price: 699
};

let cart = {};

function getProduct(id) {
  if (Number(id) === feastBox.id) {
    return feastBox;
  }
  return products.find(p => p.id === Number(id));
}

function renderProducts() {
  document.getElementById("products").innerHTML =
    products.map(p => `
      <div class="card">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="card-body">
          <span class="tag">${p.tag}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
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
  document.getElementById("status").textContent =
    "Naidagdag sa cart ang " + getProduct(id).name + ".";
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

  if (entries.length === 0) {
    container.textContent = "Wala pang laman ang iyong cart.";
  } else {
    container.innerHTML = entries.map(([id, qty]) => {
      const p = getProduct(id);
      return `
        <div class="cart-row">
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
  }

  const total = entries.reduce((sum, [id, qty]) => {
    return sum + getProduct(id).price * qty;
  }, 0);

  document.getElementById("total").textContent =
    "₱" + total.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}

document.getElementById("order-form").addEventListener("submit", function(e) {
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
    return sum + getProduct(id).price * qty;
  }, 0);

  document.getElementById("status").textContent =
    "ORDER SUMMARY\n" +
    "Pangalan: " + name +
    "\nContact: " + phone +
    "\nAddress/Pickup: " + address +
    "\n\n" + lines.join("\n") +
    "\n\nTOTAL: ₱" + total.toFixed(2) +
    "\n\nHindi pa naipapadala ang order na ito sa tindahan.";
});

renderProducts();
renderCart();