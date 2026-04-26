let PRODUCTS = [];

//GLOBALS
let cart = JSON.parse(localStorage.getItem('sakiCart') || '[]');
let currentCat = 'all';
let currentProduct = null;
let currentQty = 1;
let selectedSize = '';
let selectedGender = '';
let selectedColor = '';
let currentSlide = 0;
let activeFilters = { subcategories: [], sizes: [], minPrice: 0, maxPrice: Infinity, minRating: 0 };

//HELPERS
const fmt = n => 'Rp ' + n.toLocaleString('id-ID');
const $ = id => document.getElementById(id);
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

function toast(msg) {
  const wrap = $('toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 250); }, 2200);
}

//HELPER: total stock across all sizes
function TotalStock(p) {
  if (p.stockBySize) return Object.values(p.stockBySize).reduce((a, b) => a + b, 0);
  return p.stock || 0;
}

function StockForSize(p, size) {
  if (p.stockBySize && size && p.stockBySize[size] !== undefined) return p.stockBySize[size];
  return TotalStock(p);
}

//NAVIGATION
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-nav="${page}"]`);
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelectorAll('.nav-btn[data-nav]').forEach(b => {
  b.addEventListener('click', () => showPage(b.dataset.nav));
});

//CATEGORY NAV
function switchCat(cat) {
  currentCat = cat;
  document.querySelectorAll('.cat-link').forEach(l => l.classList.toggle('active', l.dataset.cat === cat));
  buildSubcategoryFilter();
  activeFilters.subcategories = [];
  renderProducts();
}
document.querySelectorAll('.cat-link').forEach(l => {
  l.addEventListener('click', () => switchCat(l.dataset.cat));
});

//SIDEBAR FILTERS
function toggleFilter(el) {
  el.classList.toggle('collapsed');
  el.nextElementSibling.classList.toggle('collapsed');
}

function buildSubcategoryFilter() {
  const container = $('filter-subcategory');
  const prods = currentCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentCat);
  const subs = [...new Set(prods.map(p => p.subcategory))];
  const counts = {};
  subs.forEach(s => { counts[s] = prods.filter(p => p.subcategory === s).length; });
  container.innerHTML = subs.map(s =>
    `<label class="filter-opt"><input type="checkbox" value="${s}" onchange="handleSubFilter()"> ${s} <span class="count">${counts[s]}</span></label>`
  ).join('');
}

function buildSizeFilter() {
  const container = $('filter-sizes');
  const allSizes = [...new Set(PRODUCTS.flatMap(p => p.sizes || []))];
  container.innerHTML = allSizes.map(s =>
    `<label class="filter-opt"><input type="checkbox" value="${s}" onchange="handleSizeFilter()"> ${s}</label>`
  ).join('');
}

function handleSubFilter() {
  activeFilters.subcategories = [...document.querySelectorAll('#filter-subcategory input:checked')].map(i => i.value);
  renderProducts();
}

function handleSizeFilter() {
  activeFilters.sizes = [...document.querySelectorAll('#filter-sizes input:checked')].map(i => i.value);
  renderProducts();
}

$('price-apply').addEventListener('click', () => {
  activeFilters.minPrice = Number($('price-min').value) || 0;
  activeFilters.maxPrice = Number($('price-max').value) || Infinity;
  renderProducts();
});

document.querySelectorAll('input[name="rating"]').forEach(r => {
  r.addEventListener('change', () => {
    activeFilters.minRating = Number(r.value);
    renderProducts();
  });
});

$('clear-filters').addEventListener('click', () => {
  activeFilters = { subcategories: [], sizes: [], minPrice: 0, maxPrice: Infinity, minRating: 0 };
  $('price-min').value = '';
  $('price-max').value = '';
  document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(i => i.checked = false);
  document.querySelector('input[name="rating"][value="0"]').checked = true;
  renderProducts();
});

//MOBILE FILTER
$('mobile-filter-btn').addEventListener('click', () => {
  $('sidebar-filters').classList.add('open');
  $('sidebar-backdrop').classList.add('open');
});
$('sidebar-backdrop').addEventListener('click', () => {
  $('sidebar-filters').classList.remove('open');
  $('sidebar-backdrop').classList.remove('open');
});

//SORTING
$('sort-select').addEventListener('change', () => renderProducts());

function sortProducts(prods) {
  const v = $('sort-select').value;
  const arr = [...prods];
  switch (v) {
    case 'price-asc': return arr.sort((a, b) => a.price - b.price);
    case 'price-desc': return arr.sort((a, b) => b.price - a.price);
    case 'rating': return arr.sort((a, b) => b.rating - a.rating);
    case 'sold': return arr.sort((a, b) => b.sold - a.sold);
    case 'newest': return arr.sort((a, b) => b.id - a.id);
    default: return arr;
  }
}

//SEARCH
$('nav-search').addEventListener('input', () => renderProducts());

//RENDER PRODUCTS
function renderProducts() {
  const grid = $('product-grid');
  const query = $('nav-search').value.toLowerCase();
  let prods = PRODUCTS;

  // Category
  if (currentCat !== 'all') prods = prods.filter(p => p.category === currentCat);

  // Search
  if (query) prods = prods.filter(p => p.name.toLowerCase().includes(query) || p.subcategory.toLowerCase().includes(query));

  // Sub-category filter
  if (activeFilters.subcategories.length) prods = prods.filter(p => activeFilters.subcategories.includes(p.subcategory));

  // Size filter
  if (activeFilters.sizes.length) prods = prods.filter(p => p.sizes && p.sizes.some(s => activeFilters.sizes.includes(s)));

  // Price filter
  prods = prods.filter(p => p.price >= activeFilters.minPrice && p.price <= activeFilters.maxPrice);

  // Rating filter
  if (activeFilters.minRating > 0) prods = prods.filter(p => p.rating >= activeFilters.minRating);

  // Sort
  prods = sortProducts(prods);

  $('results-count').innerHTML = `<strong>${prods.length}</strong> produk ditemukan`;

  if (!prods.length) {
    grid.innerHTML = `<div class="empty-state"><h3>Tidak ada produk ditemukan</h3><p>Coba ubah filter atau kata pencarian Anda</p></div>`;
    return;
  }

  grid.innerHTML = prods.map(p => {
    const hasMultiPrice = p.priceBySize && Object.keys(p.priceBySize).length > 1;
    const minPrice = hasMultiPrice ? Math.min(...Object.values(p.priceBySize)) : p.price;
    const maxPrice = hasMultiPrice ? Math.max(...Object.values(p.priceBySize)) : p.price;
    const imgSrc = p.images && p.images.length ? p.images[0] : '';
    const totalStock = TotalStock(p);

    return `<div class="product-card" onclick="openModal(${p.id})">
      <div class="card-img">
        <img src="${imgSrc}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
        ${totalStock <= 5 ? `<span class="card-badge" style="background:#e67e22">Stok Terbatas</span>` : ''}
        <button class="card-wishlist" onclick="event.stopPropagation()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="card-info">
        <div class="card-sub">${p.subcategory}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-price">${hasMultiPrice ? 'Mulai ' + fmt(minPrice) : fmt(p.price)}</div>
        ${hasMultiPrice && minPrice !== maxPrice ? `<div class="card-price-range">${fmt(minPrice)} — ${fmt(maxPrice)}</div>` : ''}
        <div class="card-rating"><span class="star">★</span> ${p.rating} · ${p.sold} terjual</div>
      </div>
    </div>`;
  }).join('');
}

//MODAL
function openModal(id) {
  currentProduct = PRODUCTS.find(p => p.id === id);
  if (!currentProduct) return;
  const p = currentProduct;
  currentQty = 1;
  selectedSize = p.sizes ? p.sizes[0] : '';
  selectedGender = p.genders ? p.genders[0] : '';
  selectedColor = p.colors ? p.colors[0] : '';
  currentSlide = 0;

  // Category
  $('modal-category').textContent = p.subcategory;
  $('modal-name').textContent = p.name;

  // Rating
  $('modal-rating').innerHTML = `<span class="star">${stars(p.rating)}</span> ${p.rating} · ${p.sold} terjual`;

  // Description
  $('modal-desc').textContent = p.description;

  // Image
  renderModalImage();

  // Price
  updateModalPrice();

  // Stock
  updateModalStock();

  // Original price
  $('modal-original').textContent = '';

  // Gender
  renderGenderButtons();

  // Colors
  renderColorButtons();

  // Sizes
  renderSizeButtons();

  // Qty
  $('qty-num').textContent = 1;

  // Open
  $('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
$('modal-close').addEventListener('click', closeModal);
$('modal-overlay').addEventListener('click', e => { if (e.target === $('modal-overlay')) closeModal(); });

function renderModalImage() {
  const p = currentProduct;
  const imgBox = $('modal-img');
  if (p.images && p.images.length > 1) {
    imgBox.innerHTML = `<div class="modal-slideshow">
      ${p.images.map((src, i) => `<img class="modal-slide-img${i === 0 ? ' active' : ''}" src="${src}" alt="${p.name}">`).join('')}
      <button class="slide-arrow slide-prev" onclick="changeSlide(-1)">&#8249;</button>
      <button class="slide-arrow slide-next" onclick="changeSlide(1)">&#8250;</button>
      <div class="slide-dots">${p.images.map((_, i) => `<button class="slide-dot${i === 0 ? ' active' : ''}" onclick="goSlide(${i})"></button>`).join('')}</div>
    </div>`;
  } else {
    imgBox.innerHTML = `<img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">`;
  }
}

function changeSlide(dir) {
  const imgs = document.querySelectorAll('.modal-slide-img');
  const dots = document.querySelectorAll('.slide-dot');
  imgs[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + dir + imgs.length) % imgs.length;
  imgs[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function goSlide(i) {
  const imgs = document.querySelectorAll('.modal-slide-img');
  const dots = document.querySelectorAll('.slide-dot');
  imgs[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = i;
  imgs[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function updateModalPrice() {
  const p = currentProduct;
  let price = p.price;
  if (p.priceBySize && selectedSize && p.priceBySize[selectedSize]) {
    price = p.priceBySize[selectedSize];
  }
  $('modal-price').textContent = fmt(price);
}

function updateModalStock() {
  const p = currentProduct;
  const stock = StockForSize(p, selectedSize);
  $('modal-stock').textContent = ` · Stok: ${stock}`;
}

function renderGenderButtons() {
  const p = currentProduct;
  const box = $('modal-genders');
  if (!p.genders || !p.genders.length) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="option-label">Gender</div>
    <div class="option-btns">${p.genders.map(g =>
    `<button class="opt-btn${g === selectedGender ? ' active' : ''}" onclick="selectGender('${g}')">${g}</button>`
  ).join('')}</div>`;
}

function selectGender(g) {
  selectedGender = g;
  document.querySelectorAll('#modal-genders .opt-btn').forEach(b => b.classList.toggle('active', b.textContent === g));
}

function renderColorButtons() {
  const p = currentProduct;
  const box = $('modal-colors');
  if (!p.colors || !p.colors.length) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="option-label">Warna</div>
    <div class="option-btns">${p.colors.map(c =>
    `<button class="opt-btn${c === selectedColor ? ' active' : ''}" onclick="selectColor('${c}')">${c}</button>`
  ).join('')}</div>`;
}

function selectColor(c) {
  selectedColor = c;
  document.querySelectorAll('#modal-colors .opt-btn').forEach(b => b.classList.toggle('active', b.textContent === c));
}

function renderSizeButtons() {
  const p = currentProduct;
  const box = $('modal-sizes');
  if (!p.sizes || !p.sizes.length) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="option-label">Ukuran</div>
    <div class="option-btns">${p.sizes.map(s => {
    const sizeStock = StockForSize(p, s);
    const outOfStock = sizeStock <= 0;
    return `<button class="opt-btn${s === selectedSize ? ' active' : ''}${outOfStock ? ' disabled' : ''}" onclick="${outOfStock ? '' : `selectSize('${s}')`}" ${outOfStock ? 'disabled' : ''}>${s}${sizeStock <= 5 && sizeStock > 0 ? ` <small>(${sizeStock})</small>` : ''}</button>`;
  }).join('')}</div>`;
}

function selectSize(s) {
  selectedSize = s;
  document.querySelectorAll('#modal-sizes .opt-btn').forEach(b => b.classList.toggle('active', b.textContent.trim().startsWith(s)));
  updateModalPrice();
  updateModalStock();
}

//QTY
$('qty-minus').addEventListener('click', () => { if (currentQty > 1) { currentQty--; $('qty-num').textContent = currentQty; } });
$('qty-plus').addEventListener('click', () => {
  const maxStock = StockForSize(currentProduct, selectedSize);
  if (currentQty < maxStock) {
    currentQty++;
    $('qty-num').textContent = currentQty;
  } else {
    toast('Jumlah melebihi stok tersedia');
  }
});

//ADD TO CART
$('modal-add-cart').addEventListener('click', () => {
  const p = currentProduct;
  if (!p) return;
  let price = p.price;
  if (p.priceBySize && selectedSize) price = p.priceBySize[selectedSize] || price;

  const item = {
    id: p.id,
    name: p.name,
    size: selectedSize,
    gender: selectedGender,
    color: selectedColor,
    price,
    qty: currentQty,
    img: p.images ? p.images[0] : ''
  };

  // Check if same config exists
  const idx = cart.findIndex(c => c.id === item.id && c.size === item.size && c.gender === item.gender && c.color === item.color);
  if (idx >= 0) {
    cart[idx].qty += currentQty;
  } else {
    cart.push(item);
  }

  saveCart();
  closeModal();
  toast(`${p.name} ditambahkan ke keranjang`);
});

//CART
function saveCart() {
  localStorage.setItem('sakiCart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = $('cart-badge');
  const count = cart.reduce((s, i) => s + i.qty, 0);
  if (count > 0) {
    badge.style.display = 'flex';
    badge.textContent = count;
  } else {
    badge.style.display = 'none';
  }
}

function openCart() {
  renderCart();
  $('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

$('nav-cart').addEventListener('click', openCart);
$('cart-overlay').addEventListener('click', e => { if (e.target === $('cart-overlay')) closeCart(); });

function renderCart() {
  const box = $('cart-items');
  const foot = $('cart-footer');

  if (!cart.length) {
    box.innerHTML = `<div class="cart-empty-state"><p>Keranjang belanja kosong</p></div>`;
    foot.style.display = 'none';
    return;
  }

  foot.style.display = 'block';
  let total = 0;

  box.innerHTML = cart.map((item, i) => {
    const sub = item.price * item.qty;
    total += sub;
    const details = [item.size, item.gender, item.color].filter(Boolean).join(' · ');
    return `<div class="cart-item">
      <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-sub">${details} · ${item.qty}x</div>
        <div class="cart-item-price">${fmt(sub)}</div>
      </div>
      <button class="cart-item-del" onclick="removeCart(${i})">&#10005;</button>
    </div>`;
  }).join('');

  $('cart-total').textContent = fmt(total);
}

function removeCart(i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
  toast('Produk dihapus dari keranjang');
}

function handleCheckout() {
  if (!cart.length) return;
  let msg = 'Assalamualaikum, saya ingin memesan:\n\n';
  let total = 0;
  cart.forEach((item, i) => {
    const sub = item.price * item.qty;
    total += sub;
    const details = [item.size, item.gender, item.color].filter(Boolean).join(', ');
    msg += `${i + 1}. ${item.name}${details ? ' (' + details + ')' : ''}\n   ${item.qty}x @ ${fmt(item.price)} = ${fmt(sub)}\n`;
  });
  msg += `\nTotal: ${fmt(total)}\n\nMohon dikonfirmasi ketersediaan dan ongkos kirimnya. Terima kasih.`;
  const phone = '6281373741040';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

//LOAD DATA & INIT
async function init() {
  try {
    const res = await fetch('data/products.json');
    PRODUCTS = await res.json();
  } catch (e) {
    console.error('Gagal memuat data produk:', e);
    $('product-grid').innerHTML = `<div class="empty-state"><h3>Gagal memuat produk</h3><p>Pastikan file data/products.json tersedia.</p></div>`;
    return;
  }

  buildSubcategoryFilter();
  buildSizeFilter();
  renderProducts();
  updateCartBadge();
}

init();
