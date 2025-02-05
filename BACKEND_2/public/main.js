document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const btnGetCurrent = document.getElementById('btnGetCurrent');
  const result = document.getElementById('result');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const first_name = registerForm.first_name.value;
    const last_name = registerForm.last_name.value;
    const email = registerForm.email.value;
    const age = registerForm.age.value;
    const password = registerForm.password.value;
    try {
      const res = await fetch('/api/sessions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, age, password })
      });
      const data = await res.json();
      if (res.ok) {
        result.textContent = 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.';
      } else {
        result.textContent = 'Error: ' + data.message;
      }
    } catch (error) {
      result.textContent = 'Error: ' + error.message;
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      const res = await fetch('/api/sessions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        result.textContent = 'Login exitoso. La cookie de token ha sido establecida.';
      } else {
        result.textContent = 'Error: ' + data.message;
      }
    } catch (error) {
      result.textContent = 'Error: ' + error.message;
    }
  });

  btnGetCurrent.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/sessions/current', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        result.textContent = JSON.stringify(data, null, 2);
      } else {
        result.textContent = 'Error: ' + data.message;
      }
    } catch (error) {
      result.textContent = 'Error: ' + error.message;
    }
  });
});
