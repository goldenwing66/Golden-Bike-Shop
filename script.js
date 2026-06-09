// ===== DATA STORAGE =====
let products = [
    {
        id: 1,
        name: 'Sepeda Mountain Bike Pro',
        category: 'Sepeda',
        price: 3500000,
        weight: 12,
        description: 'Sepeda mountain bike dengan frame aluminium berkualitas tinggi, cocok untuk pemula hingga menengah',
        stock: 5,
        images: ['🚲', '🏔️']
    },
    {
        id: 2,
        name: 'Roda Sepeda 26 Inch',
        category: 'Spare Part',
        price: 450000,
        weight: 1.5,
        description: 'Roda sepeda ukuran 26 inch dengan ban berkualitas',
        stock: 15,
        images: ['🔄', '⚙️']
    },
    {
        id: 3,
        name: 'Helm Safety Premium',
        category: 'Aksesori',
        price: 250000,
        weight: 0.5,
        description: 'Helm keselamatan dengan ventilasi baik dan desain modern',
        stock: 20,
        images: ['🎖️', '⭐']
    }
];

let cart = [];
let currentProductId = null;
let chatMessages = [];
let currentImages = [];

// ===== PAGE NAVIGATION =====
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
        
        if (pageName === 'catalog') {
            displayProducts();
        } else if (pageName === 'dashboard') {
            displayProductManagement();
        } else if (pageName === 'checkout') {
            displayCart();
        }
    }
}

// ===== PRODUCT DISPLAY =====
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="" alt="${product.name}" class="product-image" style="background: linear-gradient(135deg, #81d4fa, #b3e5fc); display: flex; align-items: center; justify-content: center; font-size: 60px;">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <div class="product-stock">Stok: ${product.stock}</div>
                <button onclick="openProductModal(${product.id})">Lihat Detail</button>
            </div>
        `;
        productList.appendChild(card);
    });
}

function openProductModal(productId) {
    currentProductId = productId;
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductDesc').textContent = product.description;
        document.getElementById('modalProductPrice').textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
        document.getElementById('modalProductStock').textContent = `Stok: ${product.stock}`;
        document.getElementById('modalProductWeight').textContent = product.weight;
        document.getElementById('modalProductCategory').textContent = product.category;
        document.getElementById('quantityInput').value = 1;
        document.getElementById('quantityInput').max = product.stock;
        
        // Display images
        const mainImage = document.getElementById('mainImage');
        mainImage.style.background = 'linear-gradient(135deg, #81d4fa, #b3e5fc)';
        mainImage.style.display = 'flex';
        mainImage.style.alignItems = 'center';
        mainImage.style.justifyContent = 'center';
        mainImage.style.fontSize = '100px';
        mainImage.textContent = product.images[0] || '📦';
        
        const thumbnailContainer = document.getElementById('thumbnailContainer');
        thumbnailContainer.innerHTML = '';
        product.images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = '';
            thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumb.style.background = 'linear-gradient(135deg, #81d4fa, #b3e5fc)';
            thumb.style.display = 'flex';
            thumb.style.alignItems = 'center';
            thumb.style.justifyContent = 'center';
            thumb.style.fontSize = '30px';
            thumb.textContent = img;
            thumb.onclick = () => selectImage(index, product.images);
            thumbnailContainer.appendChild(thumb);
        });
        
        document.getElementById('productModal').classList.add('active');
    }
}

function selectImage(index, images) {
    const mainImage = document.getElementById('mainImage');
    mainImage.textContent = images[index];
    
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

function addToCart() {
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const product = products.find(p => p.id === currentProductId);
    
    if (product && quantity > 0 && quantity <= product.stock) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                weight: product.weight,
                image: product.images[0]
            });
        }
        
        updateCartCount();
        closeModal();
        alert('Produk berhasil ditambahkan ke keranjang!');
    }
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = total;
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
    );
    
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    if (filtered.length === 0) {
        productList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 2rem;">Produk tidak ditemukan</p>';
        return;
    }
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="" alt="${product.name}" class="product-image" style="background: linear-gradient(135deg, #81d4fa, #b3e5fc); display: flex; align-items: center; justify-content: center; font-size: 60px;">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <div class="product-stock">Stok: ${product.stock}</div>
                <button onclick="openProductModal(${product.id})">Lihat Detail</button>
            </div>
        `;
        productList.appendChild(card);
    });
}

// ===== DASHBOARD FUNCTIONS =====
function displayProductManagement() {
    const list = document.getElementById('productManagementList');
    list.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-management-card';
        card.innerHTML = `
            <div style="background: linear-gradient(135deg, #81d4fa, #b3e5fc); height: 150px; display: flex; align-items: center; justify-content: center; font-size: 60px; border-radius: 5px; margin-bottom: 1rem;">
                ${product.images[0] || '📦'}
            </div>
            <h4>${product.name}</h4>
            <p><strong>Kategori:</strong> ${product.category}</p>
            <p><strong>Stok:</strong> ${product.stock}</p>
            <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
            <div class="actions">
                <button class="btn-edit" onclick="openEditModal(${product.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Hapus</button>
            </div>
        `;
        list.appendChild(card);
    });
}

document.getElementById('addProductForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        weight: parseFloat(document.getElementById('productWeight').value),
        description: document.getElementById('productDesc').value,
        stock: parseInt(document.getElementById('productStock').value),
        images: currentImages.length > 0 ? currentImages : ['📦']
    };
    
    products.push(newProduct);
    this.reset();
    document.getElementById('imagePreviewContainer').innerHTML = '';
    currentImages = [];
    alert('Produk berhasil ditambahkan!');
    displayProductManagement();
});

function handleImageUpload() {
    const files = document.getElementById('productImages').files;
    currentImages = [];
    
    if (files.length > 10) {
        alert('Maksimal 10 foto!');
        return;
    }
    
    const container = document.getElementById('imagePreviewContainer');
    container.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImages.push(e.target.result);
            
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index}">
                <button type="button" class="image-remove-btn" onclick="removeImagePreview(${index})">×</button>
            `;
            container.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

function removeImagePreview(index) {
    currentImages.splice(index, 1);
    handleImageUpload();
}

function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductWeight').value = product.weight;
        document.getElementById('editProductDesc').value = product.description;
        document.getElementById('editProductStock').value = product.stock;
        
        const container = document.getElementById('editImagePreviewContainer');
        container.innerHTML = '';
        product.images.forEach((img, index) => {
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `
                <div style="background: linear-gradient(135deg, #81d4fa, #b3e5fc); height: 100px; display: flex; align-items: center; justify-content: center; font-size: 40px;">${img}</div>
                <button type="button" class="image-remove-btn" onclick="removeEditImagePreview(${index})">×</button>
            `;
            container.appendChild(preview);
        });
        
        document.getElementById('editProductModal').classList.add('active');
    }
}

function closeEditModal() {
    document.getElementById('editProductModal').classList.remove('active');
}

document.getElementById('editProductForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('editProductId').value);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            name: document.getElementById('editProductName').value,
            price: parseInt(document.getElementById('editProductPrice').value),
            weight: parseFloat(document.getElementById('editProductWeight').value),
            description: document.getElementById('editProductDesc').value,
            stock: parseInt(document.getElementById('editProductStock').value),
            images: currentImages.length > 0 ? currentImages : products[productIndex].images
        };
        
        alert('Produk berhasil diperbarui!');
        closeEditModal();
        displayProductManagement();
    }
});

function handleEditImageUpload() {
    const files = document.getElementById('editProductImages').files;
    
    if (files.length > 10) {
        alert('Maksimal 10 foto!');
        return;
    }
    
    const container = document.getElementById('editImagePreviewContainer');
    container.innerHTML = '';
    currentImages = [];
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImages.push(e.target.result);
            
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index}">
                <button type="button" class="image-remove-btn" onclick="removeEditImagePreview(${index})">×</button>
            `;
            container.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

function removeEditImagePreview(index) {
    currentImages.splice(index, 1);
    handleEditImageUpload();
}

function deleteProduct(productId) {
    if (confirm('Yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== productId);
        alert('Produk berhasil dihapus!');
        displayProductManagement();
    }
}

// ===== CHAT FUNCTIONS =====
function sendChat() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        // User message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `<p>${escapeHtml(message)}</p>`;
        document.getElementById('chatMessages').appendChild(userMsg);
        
        input.value = '';
        document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        
        // Simulated seller response
        setTimeout(() => {
            const sellerMsg = document.createElement('div');
            sellerMsg.className = 'chat-message seller';
            sellerMsg.innerHTML = `<p>Terima kasih atas pertanyaan Anda. Kami akan merespon dengan cepat!</p>`;
            document.getElementById('chatMessages').appendChild(sellerMsg);
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        }, 1000);
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChat();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== CART & CHECKOUT =====
function displayCart() {
    const cartList = document.getElementById('cartItemsList');
    cartList.innerHTML = '';
    
    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align: center; color: #999;">Keranjang Anda kosong</p>';
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image" style="background: linear-gradient(135deg, #81d4fa, #b3e5fc); display: flex; align-items: center; justify-content: center; font-size: 40px;">
                ${item.image}
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Jumlah: ${item.quantity}</p>
                <p>Berat: ${item.weight * item.quantity} kg</p>
            </div>
            <div class="cart-item-price">
                <div class="price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
                <button onclick="removeFromCart(${index})" style="background: #d32f2f; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 0.8rem; margin-top: 0.5rem;">Hapus</button>
            </div>
        `;
        cartList.appendChild(cartItem);
    });
    
    calculateTotal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCart();
}

function calculateShipping() {
    const courier = document.querySelector('input[name="courier"]:checked');
    
    if (courier) {
        const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
        let shippingCost = 0;
        let estimatedDays = 0;
        
        if (courier.value === 'pos-indonesia') {
            shippingCost = 5000 + (totalWeight * 2000);
            estimatedDays = '3-5 hari kerja';
        } else if (courier.value === 'jne') {
            shippingCost = 8000 + (totalWeight * 2500);
            estimatedDays = '1-3 hari kerja';
        }
        
        document.getElementById('shippingCost').textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
        document.getElementById('shippingEstimate').style.display = 'block';
        document.getElementById('shippingInfo').innerHTML = `
            <strong>Jasa Kirim:</strong> ${courier.value === 'pos-indonesia' ? 'Pos Indonesia' : 'JnE'}<br>
            <strong>Berat Total:</strong> ${totalWeight} kg<br>
            <strong>Estimasi Tiba:</strong> ${estimatedDays}
        `;
        
        calculateTotal();
    }
}

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCostText = document.getElementById('shippingCost').textContent;
    const shippingCost = parseInt(shippingCostText.replace(/[^0-9]/g, '')) || 0;
    const total = subtotal + shippingCost;
    
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('totalPrice').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function checkout() {
    const courier = document.querySelector('input[name="courier"]:checked');
    
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    
    if (!courier) {
        alert('Pilih jasa pengiriman terlebih dahulu!');
        return;
    }
    
    alert('Pesanan Anda akan segera diproses. Silakan lakukan transfer ke rekening bank kami. Link pembayaran akan dikirim ke chat atau WhatsApp.');
    cart = [];
    updateCartCount();
    showPage('home');
}

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
});

// ===== MODAL CLOSE ON ESCAPE =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('productModal').classList.remove('active');
        document.getElementById('editProductModal').classList.remove('active');
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const productModal = document.getElementById('productModal');
    const editModal = document.getElementById('editProductModal');
    
    if (event.target == productModal) {
        productModal.classList.remove('active');
    }
    if (event.target == editModal) {
        editModal.classList.remove('active');
    }
}