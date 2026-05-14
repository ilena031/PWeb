// script.js – Login page logic (Tugas 7)

document.addEventListener('DOMContentLoaded', function () {

  // ===== Toggle Password Visibility =====
  var toggleBtn = document.getElementById('togglePassword');
  var passwordInput = document.getElementById('password');

  toggleBtn.addEventListener('click', function () {
    var icon = toggleBtn.querySelector('i');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('bi-eye');
      icon.classList.add('bi-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.remove('bi-eye-slash');
      icon.classList.add('bi-eye');
    }
  });

  // ===== Form Validation =====
  var loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var emailInput = document.getElementById('email');
    var errEmail = document.getElementById('errEmail');
    var errPassword = document.getElementById('errPassword');
    var isValid = true;

    // Reset errors
    errEmail.textContent = '';
    errPassword.textContent = '';
    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');

    // Validate email
    var emailValue = emailInput.value.trim();
    if (emailValue === '') {
      errEmail.textContent = 'Email tidak boleh kosong.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailValue)) {
      errEmail.textContent = 'Format email tidak valid.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate password
    var pwdValue = passwordInput.value;
    if (pwdValue === '') {
      errPassword.textContent = 'Kata sandi tidak boleh kosong.';
      passwordInput.classList.add('is-invalid');
      isValid = false;
    } else if (pwdValue.length < 6) {
      errPassword.textContent = 'Kata sandi minimal 6 karakter.';
      passwordInput.classList.add('is-invalid');
      isValid = false;
    }

    if (isValid) {
      alert('Login berhasil! 🎉\nEmail: ' + emailValue);
      loginForm.reset();
    }
  });

  // ===== Social & Link Handlers =====
  document.getElementById('btnGoogle').addEventListener('click', function () {
    alert('Fitur login Google belum tersedia.');
  });

  document.getElementById('forgotPasswordLink').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Fitur lupa kata sandi belum tersedia.');
  });

  document.getElementById('registerLink').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Fitur registrasi ada di Tugas 6.');
  });
});
