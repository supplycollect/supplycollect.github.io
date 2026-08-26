const products = {
    stationery: [
        { name: "Black Pen", price: 1.50, prepTime: 2, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' heigh[...]"},
        { name: "Blue Pen", price: 1.50, prepTime: 2, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height[...]"},
        { name: "Red Pen", price: 1.50, prepTime: 2, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height=[...]"},
        { name: "Eraser", price: 0.80, prepTime: 2, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='[...]"},
        { name: "Sharpener", price: 1.00, prepTime: 3, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' heigh[...]"},
        { name: "Ruler", price: 1.20, prepTime: 3, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='1[...]"},
        { name: "Whiteboard Marker", price: 2.00, prepTime: 3, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='10[...]"}
    ],
    rent: [
        { name: "Scientific Calculator (Rent)", price: 3.00, prepTime: 8, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><re[...]"},
        { name: "Chromebook Charger (Rent)", price: 2.50, prepTime: 6, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect [...]"},
        { name: "Mouse/Keyboard Set (Rent)", price: 4.00, prepTime: 10, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect[...]"}
    ],
    snacks: [
        { name: "Orange Juice Box", price: 2.20, prepTime: 4, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='10[...]"},
        { name: "Apple Juice Box", price: 2.20, prepTime: 4, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100[...]"},
        { name: "Muesli Bar", price: 1.80, prepTime: 3, image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' hei[...]"}
    ]
};

// Only rooms — no blocks
const rooms = ["PS1", "AS1", "F9"];
let selectedRoom = "";

function getUsers() {
    const users = localStorage.getItem('supplycollectUsers');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('supplycollectUsers', JSON.stringify(users));
}

function getCurrentUser() {
    const currentUser = localStorage.getItem('supplycollectCurrentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

function getCart() {
    const cart = localStorage.getItem('supplycollectCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('supplycollectCart', JSON.stringify(cart));
}

function updateNav() {
    const navButtons = document.getElementById('navButtons');
    if (!navButtons) return;

    const currentUser = getCurrentUser();

    if (currentUser) {
        const initial = currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U';
        const cart = getCart();
        const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

        navButtons.innerHTML = `
            <a href="shop.html" class="btn btn-shop">Shop</a>
            <a href="receipts.html" class="btn btn-shop">Receipts</a>
            <a href="cart.html" class="cart-btn">
                Cart
                ${itemCount > 0 ? `<span class="cart-badge">${itemCount}</span>` : ''}
            </a>
            <a href="account.html" class="user-bubble">
                <div class="account-icon">${initial}</div>
                ${currentUser.fullName}
            </a>
        `;
    } else {
        navButtons.innerHTML = `
            <a href="login.html" class="btn btn-login">Login</a>
            <a href="signup.html" class="btn btn-signup">Sign Up</a>
        `;
    }
}

function signUpAndRedirect() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const errorBox = document.getElementById('signupError');

    if (!name || !email || !password) {
        errorBox.textContent = "Please fill in all fields.";
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        errorBox.textContent = "An account with this email already exists.";
        return;
    }

    users.push({ fullName: name, email: email, password: password });
    saveUsers(users);

    localStorage.setItem('supplycollectCurrentUser', JSON.stringify({ fullName: name, email: email }));
    window.location.href = "shop.html";
}

function logInAndRedirect() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const errorBox = document.getElementById('loginError');

    if (!email || !password) {
        errorBox.textContent = "Please fill in all fields.";
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        errorBox.textContent = "No account found with this email.";
        return;
    }

    if (user.password !== password) {
        errorBox.textContent = "Incorrect password.";
        return;
    }

    localStorage.setItem('supplycollectCurrentUser', JSON.stringify({ fullName: user.fullName, email: user.email }));
    window.location.href = "shop.html";
}

function loadAccountDetails() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('accountName').value = user.fullName;
        document.getElementById('accountEmail').value = user.email;
    }
}

function updateName() {
    const newName = document.getElementById('accountName').value.trim();
    const user = getCurrentUser();
    if (!newName) return;

    const users = getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1) {
        users[index].fullName = newName;
        saveUsers(users);
        localStorage.setItem('supplycollectCurrentUser', JSON.stringify({ fullName: newName, email: user.email }));
        updateNav();
        document.getElementById('nameSuccess').textContent = "Name updated successfully!";
        setTimeout(() => document.getElementById('nameSuccess').textContent = '', 3000);
    }
}

function updatePassword() {
    const newPass = document.getElementById('accountPassword').value;
    const user = getCurrentUser();
    if (!newPass) return;

    const users = getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1) {
        users[index].password = newPass;
        saveUsers(users);
        document.getElementById('accountPassword').value = '';
        document.getElementById('passwordSuccess').textContent = "Password updated successfully!";
        setTimeout(() => document.getElementById('passwordSuccess').textContent = '', 3000);
    }
}

function signOutAndRedirect() {
    localStorage.removeItem('supplycollectCurrentUser');
    window.location.href = "index.html";
}

function openDeleteConfirm() {
    document.getElementById('deleteConfirm').classList.add('active');
}

function closeDeleteConfirm() {
    document.getElementById('deleteConfirm').classList.remove('active');
}

function deleteAccount() {
    const user = getCurrentUser();
    if (user) {
        let users = getUsers();
        users = users.filter(u => u.email !== user.email);
        saveUsers(users);
        signOutAndRedirect();
    }
}

function renderShop() {
    if (!document.getElementById('stationeryGrid')) return;
    document.getElementById('stationeryGrid').innerHTML = products.stationery.map((p, i) => productCard(p, 'stationery', i)).join('');
    document.getElementById('rentGrid').innerHTML = products.rent.map((p, i) => productCard(p, 'rent', i)).join('');
    document.getElementById('snacksGrid').innerHTML = products.snacks.map((p, i) => productCard(p, 'snacks', i)).join('');
}

function productCard(product, category, index) {
    return `
        <div class="product-card">
            <div>
                <img class="product-image" src="${product.image}" alt="${product.name}">
                <div class="product-name">${product.name}</div>
                <div class="product-time">⏱ Approx ${product.prepTime} mins</div>
            </div>
            <div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-cart-btn" onclick="addToCart('${category}', ${index})">Add to Cart</button>
            </div>
        </div>
    `;
}

function addToCart(category, index) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    const product = products[category][index];
    const cart = getCart();
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: product.name, price: product.price, prepTime: product.prepTime, image: product.image, qty: 1 });
    }

    saveCart(cart);
    updateNav();
    showToast(`${product.name} added to cart!`);
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    const cart = getCart();
    const totalContainer = document.getElementById('cartTotalContainer');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:var(--text-muted); margin:40px 0;">Your cart is empty.</div>';
        totalContainer.innerHTML = '';
        checkoutBtn.style.display = 'none';
        return;
    }

    checkoutBtn.style.display = 'block';

    container.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-prep">⏱ Prep time: ${item.prepTime} mins</div>
            </div>
            <div class="qty-controls">
                <button onclick="changeQty(${i}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${i}, 1)">+</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    totalContainer.innerHTML = `
        <div class="cart-total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function changeQty(index, change) {
    const cart = getCart();
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(cart);
    updateNav();
    renderCart();
}

function initCheckout() {
    // initialize room-only checkout
    if (!document.getElementById('checkoutForm')) return;
    selectedRoom = "";
    renderRoomGrid();
}

function renderRoomGrid() {
    const grid = document.getElementById('roomGrid');
    if (!grid) return;
    grid.innerHTML = rooms.map(r => `<button class="block-btn ${selectedRoom === r ? 'selected' : ''}" onclick="selectRoom('${r}')">${r}</button>`).join('');
    const btn = document.getElementById('confirmRoomBtn');
    if (btn) btn.disabled = !selectedRoom;
}

function selectRoom(r) {
    selectedRoom = r;
    renderRoomGrid();
}

function placeOrder() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const cart = getCart();
    if (!cart || cart.length === 0) return;

    const maxPrepTime = cart.length > 0 ? Math.max(...cart.map(item => item.prepTime), 5) : 5;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const order = {
        id: 'ord_' + Date.now(),
        userEmail: user.email,
        userName: user.fullName,
        items: cart,
        room: selectedRoom || null,
        total: Number(total.toFixed(2)),
        estimatedTime: maxPrepTime,
        createdAt: new Date().toISOString()
    };

    // Save order list in localStorage
    const orders = JSON.parse(localStorage.getItem('supplycollectOrders') || '[]');
    orders.push(order);
    localStorage.setItem('supplycollectOrders', JSON.stringify(orders));

    // Clear cart and update UI
    saveCart([]);
    updateNav();

    // Show confirmation
    const formEl = document.getElementById('checkoutForm');
    if (formEl) formEl.style.display = 'none';
    const confirmText = document.getElementById('orderConfirmText');
    if (confirmText) confirmText.textContent = `Your order will be ready for pickup in Room ${order.room}!`;
    const etaEl = document.getElementById('estimatedTimeDisplay');
    if (etaEl) etaEl.textContent = `${maxPrepTime} mins`;
    const orderConfirmBox = document.getElementById('orderConfirmBox');
    if (orderConfirmBox) orderConfirmBox.style.display = 'block';
}

let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('active');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('active');
    }, 2000);
}

// Ensure nav updates and room grid renders when appropriate
document.addEventListener("DOMContentLoaded", () => {
    updateNav();
    if (document.getElementById('roomGrid')) {
        try { renderRoomGrid(); } catch (e) { /* ignore if not available */ }
    }
});
