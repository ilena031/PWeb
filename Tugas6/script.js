// script.js - Registration + Postal Code Lookup (All 34 Provinces)

// ===== TAB SWITCHING =====
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(el) { el.classList.remove('active'); });
  if (tab === 'register') {
    document.getElementById('tabRegister').classList.add('active');
    document.getElementById('tabBtnRegister').classList.add('active');
  } else {
    document.getElementById('tabPostal').classList.add('active');
    document.getElementById('tabBtnPostal').classList.add('active');
  }
}

// ===== VALIDATION HELPERS =====
function setError(id, msg) { document.getElementById(id).textContent = msg; }
function clearErrors() {
  ['errFullName','errEmail','errPhone','errGender','errPassword','errConfirmPassword'].forEach(function(id) {
    document.getElementById(id).textContent = '';
  });
}

// ===== REGISTRATION =====
function validateRegistration(e) {
  e.preventDefault();
  clearErrors();
  var f = e.target, ok = true;
  if (!/^[A-Za-z\s]{3,}$/.test(f.fullName.value.trim())) { setError('errFullName','Minimal 3 huruf, hanya huruf & spasi'); ok=false; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim())) { setError('errEmail','Format email tidak valid'); ok=false; }
  if (!/^08\d{8,12}$/.test(f.phone.value.trim())) { setError('errPhone','Format: 08xxxxxxxxxx (10-14 digit)'); ok=false; }
  if (!f.gender.value) { setError('errGender','Pilih jenis kelamin'); ok=false; }
  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(f.password.value)) { setError('errPassword','Min 8 karakter, huruf besar, angka, simbol'); ok=false; }
  if (f.confirmPassword.value !== f.password.value) { setError('errConfirmPassword','Password tidak cocok'); ok=false; }
  if (ok) { alert('Pendaftaran berhasil! 🎉'); f.reset(); }
}

// ===== POSTAL DATA: All 34 Provinces =====
// Structure: { "Provinsi": { "Kota": { "Kecamatan": "KodePos" } } }
var POSTAL = {
  "Aceh": {
    "Banda Aceh": {"Kuta Alam":"23123","Baiturrahman":"23116","Meuraxa":"23232","Syiah Kuala":"23111"},
    "Lhokseumawe": {"Banda Sakti":"24351","Muara Dua":"24352","Blang Mangat":"24353"},
    "Langsa": {"Langsa Kota":"24412","Langsa Barat":"24414","Langsa Lama":"24413"}
  },
  "Sumatera Utara": {
    "Medan": {"Medan Kota":"20212","Medan Baru":"20153","Medan Timur":"20231","Medan Polonia":"20157"},
    "Binjai": {"Binjai Kota":"20714","Binjai Utara":"20742","Binjai Timur":"20734"},
    "Pematang Siantar": {"Siantar Barat":"21118","Siantar Timur":"21122","Siantar Utara":"21131"}
  },
  "Sumatera Barat": {
    "Padang": {"Padang Barat":"25118","Padang Timur":"25121","Padang Utara":"25132","Koto Tangah":"25171"},
    "Bukittinggi": {"Guguk Panjang":"26115","Mandiangin":"26122","Aur Birugo":"26117"},
    "Payakumbuh": {"Payakumbuh Barat":"26224","Payakumbuh Timur":"26227","Payakumbuh Utara":"26229"}
  },
  "Riau": {
    "Pekanbaru": {"Pekanbaru Kota":"28112","Senapelan":"28154","Tampan":"28292","Sukajadi":"28121"},
    "Dumai": {"Dumai Kota":"28811","Dumai Barat":"28812","Dumai Timur":"28813"},
    "Bengkalis": {"Bengkalis":"28712","Mandau":"28784","Pinggir":"28785"}
  },
  "Jambi": {
    "Kota Jambi": {"Telanaipura":"36122","Jambi Timur":"36143","Pasar Jambi":"36112","Kota Baru":"36126"},
    "Sungai Penuh": {"Sungai Penuh":"37112","Tanah Kampung":"37113","Pesisir Bukit":"37114"},
    "Muaro Jambi": {"Sekernan":"36381","Jambi Luar Kota":"36381","Mestong":"36382"}
  },
  "Sumatera Selatan": {
    "Palembang": {"Ilir Barat I":"30128","Ilir Timur I":"30111","Seberang Ulu I":"30252","Bukit Kecil":"30113"},
    "Lubuklinggau": {"Lubuklinggau Barat I":"31614","Lubuklinggau Timur I":"31611","Lubuklinggau Utara":"31613"},
    "Prabumulih": {"Prabumulih Barat":"31121","Prabumulih Timur":"31122","Prabumulih Utara":"31123"}
  },
  "Bengkulu": {
    "Kota Bengkulu": {"Ratu Samban":"38222","Ratu Agung":"38224","Teluk Segara":"38212","Gading Cempaka":"38225"},
    "Rejang Lebong": {"Curup":"39119","Curup Utara":"39118","Curup Selatan":"39117"},
    "Kepahiang": {"Kepahiang":"39172","Bermani Ilir":"39173","Tebat Karai":"39174"}
  },
  "Lampung": {
    "Bandar Lampung": {"Tanjung Karang Pusat":"35111","Teluk Betung Utara":"35212","Kedaton":"35142","Sukarame":"35131"},
    "Metro": {"Metro Pusat":"34111","Metro Timur":"34112","Metro Barat":"34114"},
    "Pringsewu": {"Pringsewu":"35373","Gadingrejo":"35372","Ambarawa":"35376"}
  },
  "Kepulauan Bangka Belitung": {
    "Pangkal Pinang": {"Rangkui":"33111","Bukit Intan":"33149","Taman Sari":"33121","Girimaya":"33417"},
    "Sungailiat": {"Sungailiat":"33211","Belinyu":"33252","Riau Silip":"33253"},
    "Manggar": {"Manggar":"33512","Gantung":"33513","Kelapa Kampit":"33514"}
  },
  "Kepulauan Riau": {
    "Batam": {"Batam Kota":"29432","Lubuk Baja":"29441","Sekupang":"29422","Batu Aji":"29424"},
    "Tanjung Pinang": {"Tanjung Pinang Kota":"29111","Tanjung Pinang Barat":"29112","Bukit Bestari":"29122"},
    "Karimun": {"Karimun":"29611","Meral":"29612","Kundur":"29613"}
  },
  "DKI Jakarta": {
    "Jakarta Pusat": {"Gambir":"10110","Menteng":"10310","Tanah Abang":"10220","Senen":"10410"},
    "Jakarta Selatan": {"Kebayoran Baru":"12110","Mampang Prapatan":"12790","Pancoran":"12750","Tebet":"12810"},
    "Jakarta Barat": {"Grogol Petamburan":"11440","Kebon Jeruk":"11530","Palmerah":"11410","Cengkareng":"11710"},
    "Jakarta Timur": {"Matraman":"13140","Jatinegara":"13310","Cakung":"13910","Duren Sawit":"13440"},
    "Jakarta Utara": {"Penjaringan":"14440","Kelapa Gading":"14240","Tanjung Priok":"14310","Koja":"14210"}
  },
  "Jawa Barat": {
    "Bandung": {"Coblong":"40132","Sumur Bandung":"40111","Cicendo":"40171","Bandung Wetan":"40112"},
    "Bogor": {"Bogor Tengah":"16124","Bogor Utara":"16152","Tanah Sareal":"16161","Bogor Selatan":"16132"},
    "Bekasi": {"Bekasi Timur":"17111","Bekasi Barat":"17133","Bekasi Utara":"17124","Medan Satria":"17132"},
    "Depok": {"Pancoran Mas":"16431","Cimanggis":"16451","Beji":"16421","Sukmajaya":"16412"}
  },
  "Jawa Tengah": {
    "Semarang": {"Semarang Tengah":"50132","Semarang Barat":"50149","Semarang Timur":"50121","Banyumanik":"50268"},
    "Solo": {"Laweyan":"57141","Banjarsari":"57131","Jebres":"57126","Pasar Kliwon":"57118"},
    "Magelang": {"Magelang Tengah":"56117","Magelang Utara":"56116","Magelang Selatan":"56123"},
    "Pekalongan": {"Pekalongan Barat":"51111","Pekalongan Timur":"51122","Pekalongan Utara":"51141"}
  },
  "DI Yogyakarta": {
    "Kota Yogyakarta": {"Gedongtengen":"55272","Gondokusuman":"55221","Kraton":"55132","Mergangsan":"55152"},
    "Sleman": {"Depok":"55281","Gamping":"55294","Mlati":"55284","Ngaglik":"55581"},
    "Bantul": {"Bantul":"55711","Kasihan":"55181","Sewon":"55185","Banguntapan":"55198"}
  },
  "Jawa Timur": {
    "Surabaya": {"Genteng":"60275","Gubeng":"60281","Tegalsari":"60262","Wonokromo":"60243"},
    "Malang": {"Klojen":"65111","Lowokwaru":"65141","Blimbing":"65126","Sukun":"65147"},
    "Sidoarjo": {"Sidoarjo":"61212","Waru":"61256","Candi":"61271","Taman":"61257"},
    "Kediri": {"Kediri Kota":"64121","Pesantren":"64131","Mojoroto":"64112"}
  },
  "Banten": {
    "Serang": {"Serang":"42111","Cipocok Jaya":"42121","Kasemen":"42191","Taktakan":"42161"},
    "Tangerang": {"Tangerang":"15111","Cipondoh":"15148","Karawaci":"15810","Ciledug":"15151"},
    "Tangerang Selatan": {"Serpong":"15310","Pamulang":"15417","Ciputat":"15411","Pondok Aren":"15224"},
    "Cilegon": {"Cilegon":"42411","Cibeber":"42423","Pulomerak":"42438","Jombang":"42414"}
  },
  "Bali": {
    "Denpasar": {"Denpasar Barat":"80111","Denpasar Timur":"80232","Denpasar Selatan":"80228","Denpasar Utara":"80116"},
    "Badung": {"Kuta":"80361","Kuta Utara":"80361","Mengwi":"80351","Abiansemal":"80352"},
    "Gianyar": {"Gianyar":"80511","Ubud":"80571","Sukawati":"80582","Tegallalang":"80561"},
    "Tabanan": {"Tabanan":"82114","Kediri":"82121","Kerambitan":"82161"}
  },
  "Nusa Tenggara Barat": {
    "Mataram": {"Mataram":"83114","Cakranegara":"83239","Ampenan":"83511","Selaparang":"83123"},
    "Lombok Barat": {"Gerung":"83363","Narmada":"83371","Gunung Sari":"83351"},
    "Bima": {"Rasanae Barat":"84111","Rasanae Timur":"84115","Asakota":"84117"}
  },
  "Nusa Tenggara Timur": {
    "Kupang": {"Kota Lama":"85111","Kelapa Lima":"85228","Oebobo":"85115","Alak":"85351"},
    "Ende": {"Ende Selatan":"86318","Ende Tengah":"86312","Ende Timur":"86316"},
    "Maumere": {"Alok":"86112","Alok Barat":"86111","Alok Timur":"86113"}
  },
  "Kalimantan Barat": {
    "Pontianak": {"Pontianak Kota":"78116","Pontianak Barat":"78113","Pontianak Utara":"78241","Pontianak Timur":"78121"},
    "Singkawang": {"Singkawang Barat":"79111","Singkawang Timur":"79123","Singkawang Utara":"79151"},
    "Ketapang": {"Delta Pawan":"78811","Muara Pawan":"78815","Benua Kayong":"78813"}
  },
  "Kalimantan Tengah": {
    "Palangka Raya": {"Pahandut":"73111","Jekan Raya":"73112","Bukit Batu":"73113","Sabangau":"73114"},
    "Sampit": {"Baamang":"74311","Mentawa Baru":"74312","Seranau":"74314"},
    "Pangkalan Bun": {"Arut Selatan":"74112","Arut Utara":"74115","Kumai":"74181"}
  },
  "Kalimantan Selatan": {
    "Banjarmasin": {"Banjarmasin Tengah":"70111","Banjarmasin Barat":"70113","Banjarmasin Timur":"70236","Banjarmasin Utara":"70121"},
    "Banjarbaru": {"Banjarbaru Utara":"70714","Banjarbaru Selatan":"70712","Landasan Ulin":"70724"},
    "Barabai": {"Barabai":"71313","Haruyan":"71315","Batang Alai Selatan":"71364"}
  },
  "Kalimantan Timur": {
    "Samarinda": {"Samarinda Kota":"75112","Samarinda Ulu":"75123","Samarinda Ilir":"75111","Sungai Kunjang":"75126"},
    "Balikpapan": {"Balikpapan Kota":"76111","Balikpapan Selatan":"76114","Balikpapan Utara":"76124","Balikpapan Timur":"76116"},
    "Bontang": {"Bontang Utara":"75311","Bontang Selatan":"75312","Bontang Barat":"75313"}
  },
  "Kalimantan Utara": {
    "Tarakan": {"Tarakan Tengah":"77121","Tarakan Barat":"77111","Tarakan Timur":"77131","Tarakan Utara":"77151"},
    "Nunukan": {"Nunukan":"77411","Nunukan Selatan":"77413","Sebatik":"77414"},
    "Malinau": {"Malinau Kota":"77511","Malinau Utara":"77514","Malinau Selatan":"77512"}
  },
  "Sulawesi Utara": {
    "Manado": {"Wenang":"95111","Sario":"95124","Malalayang":"95163","Tikala":"95124"},
    "Bitung": {"Maesa":"95511","Madidir":"95512","Girian":"95521"},
    "Tomohon": {"Tomohon Tengah":"95362","Tomohon Utara":"95363","Tomohon Selatan":"95364"}
  },
  "Sulawesi Tengah": {
    "Palu": {"Palu Barat":"94111","Palu Timur":"94118","Palu Selatan":"94231","Palu Utara":"94148"},
    "Poso": {"Poso Kota":"94611","Poso Kota Utara":"94612","Poso Kota Selatan":"94613"},
    "Luwuk": {"Luwuk":"94711","Luwuk Utara":"94713","Luwuk Timur":"94714"}
  },
  "Sulawesi Selatan": {
    "Makassar": {"Makassar":"90111","Ujung Pandang":"90112","Tamalate":"90221","Panakkukang":"90231"},
    "Parepare": {"Bacukiki":"91122","Ujung":"91113","Soreang":"91131"},
    "Palopo": {"Wara":"91911","Wara Utara":"91914","Wara Selatan":"91915","Wara Timur":"91912"}
  },
  "Sulawesi Tenggara": {
    "Kendari": {"Kendari":"93111","Kendari Barat":"93121","Mandonga":"93111","Kadia":"93117"},
    "Bau-Bau": {"Murhum":"93711","Betoambari":"93721","Batupoaro":"93712"},
    "Kolaka": {"Kolaka":"93511","Latambaga":"93514","Wundulako":"93515"}
  },
  "Gorontalo": {
    "Kota Gorontalo": {"Kota Tengah":"96128","Kota Selatan":"96115","Kota Utara":"96118","Kota Barat":"96132"},
    "Gorontalo": {"Limboto":"96211","Limboto Barat":"96212","Telaga":"96213"},
    "Pohuwato": {"Marisa":"96266","Paguat":"96267","Randangan":"96268"}
  },
  "Sulawesi Barat": {
    "Mamuju": {"Mamuju":"91511","Simboro":"91512","Mamuju Utara":"91571"},
    "Majene": {"Banggae":"91411","Banggae Timur":"91412","Pamboang":"91413"},
    "Polewali Mandar": {"Polewali":"91314","Wonomulyo":"91352","Campalagian":"91353"}
  },
  "Maluku": {
    "Ambon": {"Nusaniwe":"97116","Sirimau":"97124","Baguala":"97234","Teluk Ambon":"97233"},
    "Tual": {"Pulau Dullah Utara":"97611","Pulau Dullah Selatan":"97612","Tayando Tam":"97615"},
    "Masohi": {"Kota Masohi":"97511","Amahai":"97514","Teluk Elpaputih":"97519"}
  },
  "Maluku Utara": {
    "Ternate": {"Kota Ternate Tengah":"97714","Kota Ternate Utara":"97712","Kota Ternate Selatan":"97716","Pulau Ternate":"97721"},
    "Tidore": {"Tidore":"97811","Tidore Utara":"97813","Tidore Selatan":"97815"},
    "Sofifi": {"Oba":"97812","Oba Utara":"97815","Oba Selatan":"97816"}
  },
  "Papua": {
    "Jayapura": {"Jayapura Utara":"99111","Jayapura Selatan":"99224","Abepura":"99225","Muara Tami":"99354"},
    "Merauke": {"Merauke":"99611","Sota":"99617","Naukenjerai":"99618"},
    "Timika": {"Mimika Baru":"99962","Kwamki Narama":"99963","Wania":"99964"}
  },
  "Papua Barat": {
    "Manokwari": {"Manokwari Barat":"98312","Manokwari Timur":"98315","Manokwari Utara":"98311","Manokwari Selatan":"98314"},
    "Sorong": {"Sorong":"98411","Sorong Utara":"98413","Sorong Timur":"98414"},
    "Fakfak": {"Fakfak":"98611","Fakfak Barat":"98614","Fakfak Timur":"98615"}
  },
  "Papua Selatan": {
    "Merauke": {"Merauke":"99611","Semangga":"99614","Tanah Miring":"99616"},
    "Boven Digoel": {"Tanah Merah":"99662","Mandobo":"99664","Jair":"99665"}
  },
  "Papua Tengah": {
    "Nabire": {"Nabire":"98801","Nabire Barat":"98802","Teluk Kimi":"98803"},
    "Dogiyai": {"Kamu":"98851","Kamu Utara":"98852","Sukikai Selatan":"98853"}
  },
  "Papua Pegunungan": {
    "Wamena": {"Wamena":"99511","Assologaima":"99513","Hubikosi":"99514"},
    "Tolikara": {"Karubaga":"99542","Bokondini":"99544","Kanggime":"99543"}
  },
  "Papua Barat Daya": {
    "Sorong": {"Sorong":"98411","Sorong Kepulauan":"98415","Sorong Manoi":"98416"},
    "Raja Ampat": {"Waisai":"98482","Teluk Mayalibit":"98483","Waigeo Selatan":"98484"}
  }
};

// ===== POPULATE PROVINCE DROPDOWN =====
function populateProvinces() {
  var sel = document.getElementById('province');
  var provinces = Object.keys(POSTAL).sort();
  for (var i = 0; i < provinces.length; i++) {
    var opt = document.createElement('option');
    opt.value = provinces[i];
    opt.textContent = provinces[i];
    sel.appendChild(opt);
  }
}

// ===== POPULATE CITY DROPDOWN =====
function populateCities() {
  var prov = document.getElementById('province').value;
  var citySel = document.getElementById('city');
  var distSel = document.getElementById('district');
  citySel.innerHTML = '<option value="" disabled selected>-- Pilih Kota --</option>';
  distSel.innerHTML = '<option value="" disabled selected>-- Pilih Kecamatan --</option>';
  citySel.disabled = true;
  distSel.disabled = true;
  document.getElementById('postalResult').classList.add('hidden');
  if (prov && POSTAL[prov]) {
    var cities = Object.keys(POSTAL[prov]).sort();
    for (var i = 0; i < cities.length; i++) {
      var opt = document.createElement('option');
      opt.value = cities[i];
      opt.textContent = cities[i];
      citySel.appendChild(opt);
    }
    citySel.disabled = false;
  }
}

// ===== POPULATE DISTRICT DROPDOWN =====
function populateDistricts() {
  var prov = document.getElementById('province').value;
  var city = document.getElementById('city').value;
  var distSel = document.getElementById('district');
  distSel.innerHTML = '<option value="" disabled selected>-- Pilih Kecamatan --</option>';
  distSel.disabled = true;
  document.getElementById('postalResult').classList.add('hidden');
  if (prov && city && POSTAL[prov][city]) {
    var districts = Object.keys(POSTAL[prov][city]).sort();
    for (var i = 0; i < districts.length; i++) {
      var opt = document.createElement('option');
      opt.value = districts[i];
      opt.textContent = districts[i];
      distSel.appendChild(opt);
    }
    distSel.disabled = false;
  }
}

// ===== FIND POSTAL CODE =====
function findPostalCode(e) {
  e.preventDefault();
  var prov = document.getElementById('province').value;
  var city = document.getElementById('city').value;
  var dist = document.getElementById('district').value;
  var box = document.getElementById('postalResult');

  if (!prov || !city || !dist) {
    box.className = 'result error';
    box.innerHTML = 'Silakan lengkapi semua pilihan terlebih dahulu.';
    return;
  }
  var code = POSTAL[prov][city][dist];
  if (code) {
    box.className = 'result';
    box.innerHTML = 'Kode Pos untuk ' + dist + ', ' + city + ', ' + prov + ':<span class="postcode-number">' + code + '</span>';
  } else {
    box.className = 'result error';
    box.innerHTML = 'Data tidak ditemukan.';
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  populateProvinces();
  document.getElementById('province').addEventListener('change', populateCities);
  document.getElementById('city').addEventListener('change', populateDistricts);
  document.getElementById('registrationForm').addEventListener('submit', validateRegistration);
  document.getElementById('postalForm').addEventListener('submit', findPostalCode);
});
