let users = [];
let currentUser = null;
// let cart = [];

function toggleAuth() {
  const reg = document.getElementById("registerForm");
  const log = document.getElementById("loginForm");
  reg.classList.toggle("d-none");
  log.classList.toggle("d-none");
  document.getElementById("toggleAuth").innerText =
    reg.classList.contains("d-none") ? "New user? Register" : "Already have an account? Login";
}

// Register
function registerUser() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;
  if (!name || !email || !pass) return alert("Fill all fields!");
  users.push({ name, email, pass });
  alert("Registration successful! Please login.");
  toggleAuth();
}

// Login
function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;
  const user = users.find(u => u.email === email && u.pass === pass);
  if (user) {
    window.alert(`Welcome, ${user.name}!`);
    currentUser = user;
    document.getElementById("authSection").classList.add("d-none");
    document.getElementById("foodSection").classList.remove("d-none");
    document.getElementById("loginBtn").classList.add("d-none");
    document.getElementById("logoutBtn").classList.remove("d-none");
  } else alert("Invalid login!");
}

// Logout
document.getElementById("logoutBtn").onclick = () => {
  currentUser = null;
  cart = [];
  document.getElementById("authSection").classList.remove("d-none");
  document.getElementById("foodSection").classList.add("d-none");
  document.getElementById("cartSection").classList.add("d-none");
  document.getElementById("checkoutSection").classList.add("d-none");
  document.getElementById("loginBtn").classList.remove("d-none");
  document.getElementById("logoutBtn").classList.add("d-none");
  updateCartCount();
};

// Food items
const foods = [
  { id: 1, name: "Margherita Pizza", type: "pizza", price: 199, img: "https://via.placeholder.com/220" },
  { id: 2, name: "Veg Burger", type: "burger", price: 99, img: "https://via.placeholder.com/220" },
  { id: 3, name: "Coke", type: "drinks", price: 49, img: "https://via.placeholder.com/220" },
  { id: 4, name: "Cheese Pizza", type: "pizza", price: 299, img: "https://via.placeholder.com/220" },
];

// Display items
function displayItems(items) {
  const container = document.getElementById("foodItems"); // match HTML ID
  container.innerHTML = "";
  items.forEach(f => {
    container.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${f.img}" class="card-img-top" alt="${f.name}">
          <div class="card-body text-center">
            <h6 class="card-title">${f.name}</h6>
            <p class="card-text">₹${f.price}</p>
            <button class="btn btn-orange btn-sm" onclick="addToCart(${f.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
  });
}
// displayItems(foods);

// Show cart section
function showCart() {
  document.getElementById("foodSection").classList.add("d-none");
  document.getElementById("checkoutSection").classList.add("d-none");
  document.getElementById("authSection").classList.add("d-none");
  document.getElementById("cartSection").classList.remove("d-none");
  renderCart();
}

// // Show food section
// function showFood() {
//   document.getElementById("foodSection").classList.remove("d-none");
//   document.getElementById("cartSection").classList.add("d-none");
//   document.getElementById("checkoutSection").classList.add("d-none");
//   document.getElementById("authSection").classList.add("d-none");
// }


// Filter
function filterItems(category) {
  // Select all food cards
  const items = document.querySelectorAll(".food-item");
  
  items.forEach(item => {
    if (category === "all") {
      item.classList.remove("d-none"); // show all
    } else {
      if (item.dataset.category === category) {
        item.classList.remove("d-none"); // show matching category
      } else {
        item.classList.add("d-none"); // hide non-matching
      }
    }
  });
}


// Add to cart with animation
let cart = [];

let itemCounts = {};

function addToCart(name, price) {
  // Add to cart array
  cart.push({ name, price });

  // Update global cart count
  updateCartCount();
  animateCart();

  // Update item-specific count
  if (!itemCounts[name]) itemCounts[name] = 0;
  itemCounts[name]++;
  const countSpan = document.getElementById(`count-${name}`);
  if (countSpan) countSpan.innerText = itemCounts[name];

  console.log(cart); // debug
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  cartCount.innerText = cart.length;
}

function animateCart() {
  const cartCount = document.getElementById("cartCount");
  cartCount.classList.add("bump");
  setTimeout(() => cartCount.classList.remove("bump"), 300);
}


// Show cart
document.getElementById("cartIcon").onclick = () => {
  document.getElementById("foodSection").classList.add("d-none");
  document.getElementById("cartSection").classList.remove("d-none");
  renderCart();
};

// Render cart
function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = "<p class='text-muted'>Cart is empty!</p>";
    return;
  }
  cart.forEach((item, index) => {
    container.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <span>${item.name} - ₹${item.price}</span>
        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">Remove</button>
      </div>`;
  });
}

function removeItem(index) {
  const removedItem = cart.splice(index, 1)[0];
  updateCartCount();
  renderCart();

  // Decrease item-specific count
  if (removedItem && itemCounts[removedItem.name]) {
    itemCounts[removedItem.name]--;
    const countSpan = document.getElementById(`count-${removedItem.name}`);
    if (countSpan) countSpan.innerText = itemCounts[removedItem.name];
  }
}

// Checkout flow
function proceedCheckout() {
  document.getElementById("cartSection").classList.add("d-none");
  document.getElementById("checkoutSection").classList.remove("d-none");
}

function goToPayment() {
  if (!document.getElementById("address").value || !document.getElementById("contact").value) {
    return alert("Fill address & contact!");
  }
  document.getElementById("checkoutStep1").classList.add("d-none");
  document.getElementById("checkoutStep2").classList.remove("d-none");
}

function confirmOrder() {
  document.getElementById("checkoutStep2").classList.add("d-none");
  document.getElementById("orderConfirmed").classList.remove("d-none");
  window.alert("Order Placed Successfully!")
  cart = [];
  updateCartCount();
}

function backToHome() {
  document.getElementById("checkoutSection").classList.add("d-none");
  document.getElementById("foodSection").classList.remove("d-none");
}

function backToFood() {
  document.getElementById("cartSection").classList.add("d-none");
  document.getElementById("foodSection").classList.remove("d-none");
}


// Format credit card number as "1234 5678 9012 3456"
const cardInput = document.getElementById("cardNumber");
cardInput.addEventListener("input", function(e) {
  let value = e.target.value.replace(/\D/g, ""); // remove non-digits
  value = value.substring(0,16); // max 16 digits
  const formatted = value.match(/.{1,4}/g); // split every 4 digits
  e.target.value = formatted ? formatted.join(" ") : "";
});

// Format expiry date as "MM/YY"
const expiryInput = document.getElementById("expiryDate");
expiryInput.addEventListener("input", function(e) {
  let value = e.target.value.replace(/\D/g, ""); // remove non-digits
  if (value.length > 4) value = value.substring(0,4);
  if (value.length >= 3) {
    e.target.value = value.substring(0,2) + "/" + value.substring(2);
  } else {
    e.target.value = value;
  }
});

