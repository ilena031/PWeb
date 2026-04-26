// variabel buat simpan data produk dari json
let PRODUCTS = [];

// variabel global
let cart = JSON.parse(localStorage.getItem('sakiCart') || '[]');
let currentCat = 'all';
let currentProduct = null;
let currentQty = 1;
let selectedSize = '';
let selectedGender = '';
let selectedColor = '';
let currentSlide = 0;
let activeFilters = {
  subcategories: [],
  sizes: [],
  minPrice: 0,
  maxPrice: Infinity,
  minRating: 0
};

// fungsi buat format harga jadi rupiah
function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

// fungsi buat nampilin bintang rating
function tampilBintang(rating) {
  var bintangPenuh = Math.round(rating);
  var bintangKosong = 5 - bintangPenuh;
  return '★'.repeat(bintangPenuh) + '☆'.repeat(bintangKosong);
}

// fungsi buat nampilin notifikasi toast
function tampilToast(pesan) {
  var wrap = document.getElementById('toast-wrap');
  var el = document.createElement('div');
  el.className = 'toast';
  el.textContent = pesan;
  wrap.appendChild(el);
  // hilangkan toast setelah 2 detik
  setTimeout(function () {
    el.classList.add('out');
    setTimeout(function () {
      el.remove();
    }, 250);
  }, 2200);
}

// fungsi hitung total stok semua ukuran
function hitungTotalStok(produk) {
  if (produk.stockBySize) {
    var total = 0;
    var stokList = Object.values(produk.stockBySize);
    for (var i = 0; i < stokList.length; i++) {
      total += stokList[i];
    }
    return total;
  }
  return produk.stock || 0;
}

// fungsi ambil stok berdasarkan ukuran yg dipilih
function ambilStokUkuran(produk, ukuran) {
  if (produk.stockBySize && ukuran && produk.stockBySize[ukuran] !== undefined) {
    return produk.stockBySize[ukuran];
  }
  return hitungTotalStok(produk);
}

// NAVIGASI HALAMAN

function showPage(page) {
  var semuaHalaman = document.querySelectorAll('.page');
  for (var i = 0; i < semuaHalaman.length; i++) {
    semuaHalaman[i].classList.remove('active');
  }
  document.getElementById('page-' + page).classList.add('active');

  var semuaTombol = document.querySelectorAll('.nav-btn');
  for (var i = 0; i < semuaTombol.length; i++) {
    semuaTombol[i].classList.remove('active');
  }
  var btn = document.querySelector('.nav-btn[data-nav="' + page + '"]');
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// pasang event listener ke tombol navigasi
var navButtons = document.querySelectorAll('.nav-btn[data-nav]');
for (var i = 0; i < navButtons.length; i++) {
  navButtons[i].addEventListener('click', function () {
    showPage(this.dataset.nav);
  });
}

// KATEGORI

function switchCat(cat) {
  currentCat = cat;
  var links = document.querySelectorAll('.cat-link');
  for (var i = 0; i < links.length; i++) {
    if (links[i].dataset.cat === cat) {
      links[i].classList.add('active');
    } else {
      links[i].classList.remove('active');
    }
  }
  buildSubcategoryFilter();
  activeFilters.subcategories = [];
  renderProducts();
}

// pasang event listener ke link kategori
var catLinks = document.querySelectorAll('.cat-link');
for (var i = 0; i < catLinks.length; i++) {
  catLinks[i].addEventListener('click', function () {
    switchCat(this.dataset.cat);
  });
}

// SIDEBAR FILTER

// fungsi buat toggle collapse filter
function toggleFilter(el) {
  el.classList.toggle('collapsed');
  el.nextElementSibling.classList.toggle('collapsed');
}

// bikin filter sub kategori berdasarkan kategori yg aktif
function buildSubcategoryFilter() {
  var container = document.getElementById('filter-subcategory');
  var prods;

  // filter produk berdasarkan kategori
  if (currentCat === 'all') {
    prods = PRODUCTS;
  } else {
    prods = [];
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].category === currentCat) {
        prods.push(PRODUCTS[i]);
      }
    }
  }

  // ambil sub kategori unik dan hitung jumlahnya
  var subs = [];
  var counts = {};
  for (var i = 0; i < prods.length; i++) {
    var sub = prods[i].subcategory;
    if (subs.indexOf(sub) === -1) {
      subs.push(sub);
      counts[sub] = 0;
    }
    counts[sub]++;
  }

  // bikin html checkboxnya
  var html = '';
  for (var i = 0; i < subs.length; i++) {
    html += '<label class="filter-opt">';
    html += '<input type="checkbox" value="' + subs[i] + '" onchange="handleSubFilter()"> ';
    html += subs[i] + ' <span class="count">' + counts[subs[i]] + '</span>';
    html += '</label>';
  }
  container.innerHTML = html;
}

// bikin filter ukuran dari semua produk
function buildSizeFilter() {
  var container = document.getElementById('filter-sizes');

  // kumpulkan semua ukuran yg ada
  var allSizes = [];
  for (var i = 0; i < PRODUCTS.length; i++) {
    var sizes = PRODUCTS[i].sizes || [];
    for (var j = 0; j < sizes.length; j++) {
      if (allSizes.indexOf(sizes[j]) === -1) {
        allSizes.push(sizes[j]);
      }
    }
  }

  // bikin html checkboxnya
  var html = '';
  for (var i = 0; i < allSizes.length; i++) {
    html += '<label class="filter-opt">';
    html += '<input type="checkbox" value="' + allSizes[i] + '" onchange="handleSizeFilter()"> ';
    html += allSizes[i];
    html += '</label>';
  }
  container.innerHTML = html;
}

// handle perubahan filter sub kategori
function handleSubFilter() {
  var checked = document.querySelectorAll('#filter-subcategory input:checked');
  activeFilters.subcategories = [];
  for (var i = 0; i < checked.length; i++) {
    activeFilters.subcategories.push(checked[i].value);
  }
  renderProducts();
}

// handle perubahan filter ukuran
function handleSizeFilter() {
  var checked = document.querySelectorAll('#filter-sizes input:checked');
  activeFilters.sizes = [];
  for (var i = 0; i < checked.length; i++) {
    activeFilters.sizes.push(checked[i].value);
  }
  renderProducts();
}

// tombol apply harga
document.getElementById('price-apply').addEventListener('click', function () {
  activeFilters.minPrice = Number(document.getElementById('price-min').value) || 0;
  activeFilters.maxPrice = Number(document.getElementById('price-max').value) || Infinity;
  renderProducts();
});

// filter rating
var ratingInputs = document.querySelectorAll('input[name="rating"]');
for (var i = 0; i < ratingInputs.length; i++) {
  ratingInputs[i].addEventListener('change', function () {
    activeFilters.minRating = Number(this.value);
    renderProducts();
  });
}

// clear semua filter
document.getElementById('clear-filters').addEventListener('click', function () {
  activeFilters = { subcategories: [], sizes: [], minPrice: 0, maxPrice: Infinity, minRating: 0 };
  document.getElementById('price-min').value = '';
  document.getElementById('price-max').value = '';

  var checkboxes = document.querySelectorAll('.sidebar input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  document.querySelector('input[name="rating"][value="0"]').checked = true;
  renderProducts();
});

// FILTER MOBILE

document.getElementById('mobile-filter-btn').addEventListener('click', function () {
  document.getElementById('sidebar-filters').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('open');
});
document.getElementById('sidebar-backdrop').addEventListener('click', function () {
  document.getElementById('sidebar-filters').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('open');
});

// SORTING

document.getElementById('sort-select').addEventListener('change', function () {
  renderProducts();
});

function sortProducts(prods) {
  var pilihan = document.getElementById('sort-select').value;
  // copy arraynya dulu biar ga ngubah yg asli
  var arr = prods.slice();

  if (pilihan === 'price-asc') {
    arr.sort(function (a, b) { return a.price - b.price; });
  } else if (pilihan === 'price-desc') {
    arr.sort(function (a, b) { return b.price - a.price; });
  } else if (pilihan === 'rating') {
    arr.sort(function (a, b) { return b.rating - a.rating; });
  } else if (pilihan === 'sold') {
    arr.sort(function (a, b) { return b.sold - a.sold; });
  } else if (pilihan === 'newest') {
    arr.sort(function (a, b) { return b.id - a.id; });
  }
  return arr;
}

// PENCARIAN

document.getElementById('nav-search').addEventListener('input', function () {
  renderProducts();
});

// RENDER PRODUK KE GRID

function renderProducts() {
  var grid = document.getElementById('product-grid');
  var query = document.getElementById('nav-search').value.toLowerCase();
  var prods = PRODUCTS;

  // filter berdasarkan kategori
  if (currentCat !== 'all') {
    var filtered = [];
    for (var i = 0; i < prods.length; i++) {
      if (prods[i].category === currentCat) {
        filtered.push(prods[i]);
      }
    }
    prods = filtered;
  }

  // filter berdasarkan pencarian
  if (query) {
    var hasil = [];
    for (var i = 0; i < prods.length; i++) {
      var nama = prods[i].name.toLowerCase();
      var subkat = prods[i].subcategory.toLowerCase();
      if (nama.indexOf(query) !== -1 || subkat.indexOf(query) !== -1) {
        hasil.push(prods[i]);
      }
    }
    prods = hasil;
  }

  // filter sub kategori
  if (activeFilters.subcategories.length > 0) {
    var hasil2 = [];
    for (var i = 0; i < prods.length; i++) {
      if (activeFilters.subcategories.indexOf(prods[i].subcategory) !== -1) {
        hasil2.push(prods[i]);
      }
    }
    prods = hasil2;
  }

  // filter ukuran
  if (activeFilters.sizes.length > 0) {
    var hasil3 = [];
    for (var i = 0; i < prods.length; i++) {
      if (prods[i].sizes) {
        var cocok = false;
        for (var j = 0; j < prods[i].sizes.length; j++) {
          if (activeFilters.sizes.indexOf(prods[i].sizes[j]) !== -1) {
            cocok = true;
            break;
          }
        }
        if (cocok) hasil3.push(prods[i]);
      }
    }
    prods = hasil3;
  }

  // filter harga
  var hasil4 = [];
  for (var i = 0; i < prods.length; i++) {
    if (prods[i].price >= activeFilters.minPrice && prods[i].price <= activeFilters.maxPrice) {
      hasil4.push(prods[i]);
    }
  }
  prods = hasil4;

  // filter rating
  if (activeFilters.minRating > 0) {
    var hasil5 = [];
    for (var i = 0; i < prods.length; i++) {
      if (prods[i].rating >= activeFilters.minRating) {
        hasil5.push(prods[i]);
      }
    }
    prods = hasil5;
  }

  // sorting
  prods = sortProducts(prods);

  // update jumlah produk yg ditemukan
  document.getElementById('results-count').innerHTML = '<strong>' + prods.length + '</strong> produk ditemukan';

  // kalo gaada produk tampilin pesan kosong
  if (prods.length === 0) {
    grid.innerHTML = '<div class="empty-state"><h3>Tidak ada produk ditemukan</h3><p>Coba ubah filter atau kata pencarian Anda</p></div>';
    return;
  }

  // generate html untuk setiap produk
  var html = '';
  for (var i = 0; i < prods.length; i++) {
    var p = prods[i];
    var hargaKeys = Object.keys(p.priceBySize || {});
    var hasMultiPrice = hargaKeys.length > 1;
    var imgSrc = (p.images && p.images.length) ? p.images[0] : '';
    var totalStock = hitungTotalStok(p);

    // cari harga terendah dan tertinggi
    var minPrice = p.price;
    var maxPrice = p.price;
    if (hasMultiPrice) {
      var hargaList = Object.values(p.priceBySize);
      minPrice = hargaList[0];
      maxPrice = hargaList[0];
      for (var j = 0; j < hargaList.length; j++) {
        if (hargaList[j] < minPrice) minPrice = hargaList[j];
        if (hargaList[j] > maxPrice) maxPrice = hargaList[j];
      }
    }

    html += '<div class="product-card" onclick="openModal(' + p.id + ')">';
    html += '  <div class="card-img">';
    html += '    <img src="' + imgSrc + '" alt="' + p.name + '" loading="lazy">';

    // badge terlaris/baru
    if (p.badge) {
      html += '    <span class="card-badge">' + p.badge + '</span>';
    }
    // badge stok terbatas
    if (totalStock <= 5) {
      html += '    <span class="card-badge" style="background:#e67e22">Stok Terbatas</span>';
    }

    html += '    <button class="card-wishlist" onclick="event.stopPropagation()">';
    html += '      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    html += '    </button>';
    html += '  </div>';

    html += '  <div class="card-info">';
    html += '    <div class="card-sub">' + p.subcategory + '</div>';
    html += '    <div class="card-name">' + p.name + '</div>';

    // harga - kalo multi ukuran tampilin "Mulai dari"
    if (hasMultiPrice) {
      html += '    <div class="card-price">Mulai ' + formatRupiah(minPrice) + '</div>';
    } else {
      html += '    <div class="card-price">' + formatRupiah(p.price) + '</div>';
    }

    // range harga kalo beda-beda
    if (hasMultiPrice && minPrice !== maxPrice) {
      html += '    <div class="card-price-range">' + formatRupiah(minPrice) + ' — ' + formatRupiah(maxPrice) + '</div>';
    }

    html += '    <div class="card-rating"><span class="star">★</span> ' + p.rating + ' · ' + p.sold + ' terjual</div>';
    html += '  </div>';
    html += '</div>';
  }

  grid.innerHTML = html;
}

// MODAL DETAIL PRODUK

function openModal(id) {
  // cari produk berdasarkan id
  currentProduct = null;
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) {
      currentProduct = PRODUCTS[i];
      break;
    }
  }
  if (!currentProduct) return;

  var p = currentProduct;
  console.log("buka detail produk: " + p.name); // buat debug

  // reset pilihan
  currentQty = 1;
  selectedSize = p.sizes ? p.sizes[0] : '';
  selectedGender = p.genders ? p.genders[0] : '';
  selectedColor = p.colors ? p.colors[0] : '';
  currentSlide = 0;

  // isi data ke modal
  document.getElementById('modal-category').textContent = p.subcategory;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-rating').innerHTML = '<span class="star">' + tampilBintang(p.rating) + '</span> ' + p.rating + ' · ' + p.sold + ' terjual';
  document.getElementById('modal-desc').textContent = p.description;

  // render gambar
  renderModalImage();

  // update harga dan stok
  updateModalPrice();
  updateModalStock();

  document.getElementById('modal-original').textContent = '';

  // render tombol pilihan
  renderGenderButtons();
  renderColorButtons();
  renderSizeButtons();

  // reset qty
  document.getElementById('qty-num').textContent = 1;

  // tampilin modal
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// event listener tutup modal
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === document.getElementById('modal-overlay')) {
    closeModal();
  }
});

// render gambar di modal (kalo banyak bikin slideshow)
function renderModalImage() {
  var p = currentProduct;
  var imgBox = document.getElementById('modal-img');

  if (p.images && p.images.length > 1) {
    // bikin slideshow kalo gambarnya lebih dari 1
    var slidesHtml = '';
    var dotsHtml = '';
    for (var i = 0; i < p.images.length; i++) {
      var activeClass = (i === 0) ? ' active' : '';
      slidesHtml += '<img class="modal-slide-img' + activeClass + '" src="' + p.images[i] + '" alt="' + p.name + '">';
      dotsHtml += '<button class="slide-dot' + activeClass + '" onclick="goSlide(' + i + ')"></button>';
    }

    imgBox.innerHTML = '<div class="modal-slideshow">'
      + slidesHtml
      + '<button class="slide-arrow slide-prev" onclick="changeSlide(-1)">&#8249;</button>'
      + '<button class="slide-arrow slide-next" onclick="changeSlide(1)">&#8250;</button>'
      + '<div class="slide-dots">' + dotsHtml + '</div>'
      + '</div>';
  } else {
    imgBox.innerHTML = '<img src="' + p.images[0] + '" alt="' + p.name + '" style="width:100%;height:100%;object-fit:cover">';
  }
}

// fungsi ganti slide gambar
function changeSlide(dir) {
  var imgs = document.querySelectorAll('.modal-slide-img');
  var dots = document.querySelectorAll('.slide-dot');
  imgs[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  // hitung index berikutnya (biar bisa loop dari akhir ke awal)
  currentSlide = currentSlide + dir;
  if (currentSlide < 0) currentSlide = imgs.length - 1;
  if (currentSlide >= imgs.length) currentSlide = 0;

  imgs[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

// fungsi langsung ke slide tertentu
function goSlide(index) {
  var imgs = document.querySelectorAll('.modal-slide-img');
  var dots = document.querySelectorAll('.slide-dot');
  imgs[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  imgs[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

// update harga di modal sesuai ukuran yg dipilih
function updateModalPrice() {
  var p = currentProduct;
  var price = p.price;
  if (p.priceBySize && selectedSize && p.priceBySize[selectedSize]) {
    price = p.priceBySize[selectedSize];
  }
  document.getElementById('modal-price').textContent = formatRupiah(price);
}

// update stok di modal
function updateModalStock() {
  var p = currentProduct;
  var stock = ambilStokUkuran(p, selectedSize);
  document.getElementById('modal-stock').textContent = ' · Stok: ' + stock;
}

// render tombol gender
function renderGenderButtons() {
  var p = currentProduct;
  var box = document.getElementById('modal-genders');
  if (!p.genders || p.genders.length === 0) {
    box.innerHTML = '';
    return;
  }

  var btnsHtml = '';
  for (var i = 0; i < p.genders.length; i++) {
    var g = p.genders[i];
    var activeClass = (g === selectedGender) ? ' active' : '';
    btnsHtml += '<button class="opt-btn' + activeClass + '" onclick="selectGender(\'' + g + '\')">' + g + '</button>';
  }

  box.innerHTML = '<div class="option-label">Gender</div><div class="option-btns">' + btnsHtml + '</div>';
}

function selectGender(g) {
  selectedGender = g;
  var btns = document.querySelectorAll('#modal-genders .opt-btn');
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].textContent === g) {
      btns[i].classList.add('active');
    } else {
      btns[i].classList.remove('active');
    }
  }
}

// render tombol warna
function renderColorButtons() {
  var p = currentProduct;
  var box = document.getElementById('modal-colors');
  if (!p.colors || p.colors.length === 0) {
    box.innerHTML = '';
    return;
  }

  var btnsHtml = '';
  for (var i = 0; i < p.colors.length; i++) {
    var c = p.colors[i];
    var activeClass = (c === selectedColor) ? ' active' : '';
    btnsHtml += '<button class="opt-btn' + activeClass + '" onclick="selectColor(\'' + c + '\')">' + c + '</button>';
  }

  box.innerHTML = '<div class="option-label">Warna</div><div class="option-btns">' + btnsHtml + '</div>';
}

function selectColor(c) {
  selectedColor = c;
  var btns = document.querySelectorAll('#modal-colors .opt-btn');
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].textContent === c) {
      btns[i].classList.add('active');
    } else {
      btns[i].classList.remove('active');
    }
  }
}

// render tombol ukuran
function renderSizeButtons() {
  var p = currentProduct;
  var box = document.getElementById('modal-sizes');
  if (!p.sizes || p.sizes.length === 0) {
    box.innerHTML = '';
    return;
  }

  var btnsHtml = '';
  for (var i = 0; i < p.sizes.length; i++) {
    var s = p.sizes[i];
    var sizeStock = ambilStokUkuran(p, s);
    var outOfStock = sizeStock <= 0;
    var activeClass = (s === selectedSize) ? ' active' : '';

    if (outOfStock) {
      // kalo stok habis tombolnya di-disable
      btnsHtml += '<button class="opt-btn disabled" disabled>' + s + '</button>';
    } else {
      btnsHtml += '<button class="opt-btn' + activeClass + '" onclick="selectSize(\'' + s + '\')">';
      btnsHtml += s;
      // tampilin sisa stok kalo tinggal dikit (dibawah 5)
      if (sizeStock <= 5) {
        btnsHtml += ' <small>(' + sizeStock + ')</small>';
      }
      btnsHtml += '</button>';
    }
  }

  box.innerHTML = '<div class="option-label">Ukuran</div><div class="option-btns">' + btnsHtml + '</div>';
}

function selectSize(s) {
  selectedSize = s;
  var btns = document.querySelectorAll('#modal-sizes .opt-btn');
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].textContent.trim().indexOf(s) === 0) {
      btns[i].classList.add('active');
    } else {
      btns[i].classList.remove('active');
    }
  }
  updateModalPrice();
  updateModalStock();
}

// PENGATURAN JUMLAH (QTY)

document.getElementById('qty-minus').addEventListener('click', function () {
  if (currentQty > 1) {
    currentQty--;
    document.getElementById('qty-num').textContent = currentQty;
  }
});

document.getElementById('qty-plus').addEventListener('click', function () {
  var maxStock = ambilStokUkuran(currentProduct, selectedSize);
  if (currentQty < maxStock) {
    currentQty++;
    document.getElementById('qty-num').textContent = currentQty;
  } else {
    tampilToast('Jumlah melebihi stok tersedia');
  }
});

// TAMBAH KE KERANJANG

document.getElementById('modal-add-cart').addEventListener('click', function () {
  var p = currentProduct;
  if (!p) return;

  var price = p.price;
  if (p.priceBySize && selectedSize) {
    price = p.priceBySize[selectedSize] || price;
  }

  var item = {
    id: p.id,
    name: p.name,
    size: selectedSize,
    gender: selectedGender,
    color: selectedColor,
    price: price,
    qty: currentQty,
    img: p.images ? p.images[0] : ''
  };

  // cek apakah item yg sama udah ada di cart
  var idx = -1;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === item.id && cart[i].size === item.size && cart[i].gender === item.gender && cart[i].color === item.color) {
      idx = i;
      break;
    }
  }

  if (idx >= 0) {
    // kalo udah ada tambahin qty nya aja
    cart[idx].qty += currentQty;
  } else {
    cart.push(item);
  }

  console.log("ditambah ke keranjang: " + p.name); // debug
  saveCart();
  closeModal();
  tampilToast(p.name + ' ditambahkan ke keranjang');
});

// KERANJANG BELANJA

function saveCart() {
  localStorage.setItem('sakiCart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  var badge = document.getElementById('cart-badge');
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count += cart[i].qty;
  }

  if (count > 0) {
    badge.style.display = 'flex';
    badge.textContent = count;
  } else {
    badge.style.display = 'none';
  }
}

function openCart() {
  renderCart();
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('nav-cart').addEventListener('click', openCart);
document.getElementById('cart-overlay').addEventListener('click', function (e) {
  if (e.target === document.getElementById('cart-overlay')) {
    closeCart();
  }
});

function renderCart() {
  var box = document.getElementById('cart-items');
  var foot = document.getElementById('cart-footer');

  if (cart.length === 0) {
    box.innerHTML = '<div class="cart-empty-state"><p>Keranjang belanja kosong</p></div>';
    foot.style.display = 'none';
    return;
  }

  foot.style.display = 'block';
  var total = 0;
  var html = '';

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var sub = item.price * item.qty;
    total += sub;

    // gabungin detail item (ukuran, gender, warna)
    var detailArr = [];
    if (item.size) detailArr.push(item.size);
    if (item.gender) detailArr.push(item.gender);
    if (item.color) detailArr.push(item.color);
    var details = detailArr.join(' · ');

    html += '<div class="cart-item">';
    html += '  <div class="cart-item-img"><img src="' + item.img + '" alt="' + item.name + '"></div>';
    html += '  <div>';
    html += '    <div class="cart-item-name">' + item.name + '</div>';
    html += '    <div class="cart-item-sub">' + details + ' · ' + item.qty + 'x</div>';
    html += '    <div class="cart-item-price">' + formatRupiah(sub) + '</div>';
    html += '  </div>';
    html += '  <button class="cart-item-del" onclick="removeCart(' + i + ')">&#10005;</button>';
    html += '</div>';
  }

  box.innerHTML = html;
  document.getElementById('cart-total').textContent = formatRupiah(total);
}

function removeCart(i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
  tampilToast('Produk dihapus dari keranjang');
}

// CHECKOUT VIA WHATSAPP

function handleCheckout() {
  if (cart.length === 0) return;

  var msg = 'Assalamualaikum, saya ingin memesan:\n\n';
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var sub = item.price * item.qty;
    total += sub;

    var detailArr = [];
    if (item.size) detailArr.push(item.size);
    if (item.gender) detailArr.push(item.gender);
    if (item.color) detailArr.push(item.color);
    var details = detailArr.join(', ');

    msg += (i + 1) + '. ' + item.name;
    if (details) msg += ' (' + details + ')';
    msg += '\n   ' + item.qty + 'x @ ' + formatRupiah(item.price) + ' = ' + formatRupiah(sub) + '\n';
  }

  msg += '\nTotal: ' + formatRupiah(total);
  msg += '\n\nMohon dikonfirmasi ketersediaan dan ongkos kirimnya. Terima kasih.';

  var phone = '6281373741040';
  window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
}

// LOAD DATA & INISIALISASI

// fungsi utama untuk load data produk dan mulai aplikasi
async function init() {
  console.log("loading data produk..."); // debug

  try {
    var res = await fetch('data/products.json');
    PRODUCTS = await res.json();
    console.log("berhasil load " + PRODUCTS.length + " produk"); // debug
  } catch (e) {
    console.error('Gagal load data produk:', e);
    document.getElementById('product-grid').innerHTML = '<div class="empty-state"><h3>Gagal memuat produk</h3><p>Pastikan file data/products.json tersedia.</p></div>';
    return;
  }

  // jalankan semuanya
  buildSubcategoryFilter();
  buildSizeFilter();
  renderProducts();
  updateCartBadge();
}

// jalankan
init();
