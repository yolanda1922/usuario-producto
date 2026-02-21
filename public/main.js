const API_URL = 'http://localhost:3000/api/v1';

// Estados
let isLoggedIn = false;
let isRegistering = false;

// Elementos del DOM
const messageDiv = document.getElementById('message');
const authSection = document.getElementById('authSection');
const userSection = document.getElementById('userSection');
const userInfo = document.getElementById('userInfo');

const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const paisInput = document.getElementById('pais');
const direccionInput = document.getElementById('direccion');
const codigoPostalInput = document.getElementById('codigoPostal');

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const verifyBtn = document.getElementById('verifyBtn');
const toggleRegisterBtn = document.getElementById('toggleRegisterBtn');
const registerFields = document.getElementById('registerFields');

// Mostrar mensaje
function showMessage(message, type = 'success') {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

// Cambiar entre login y registro
toggleRegisterBtn.addEventListener('click', () => {
    isRegistering = !isRegistering;
    
    if (isRegistering) {
        nombreInput.style.display = 'block';
        registerFields.style.display = 'block';
        loginBtn.textContent = 'Registrarse';
        toggleRegisterBtn.textContent = 'Ir a Login';
    } else {
        nombreInput.style.display = 'none';
        registerFields.style.display = 'none';
        loginBtn.textContent = 'Iniciar Sesión';
        toggleRegisterBtn.textContent = 'Ir a Registro';
    }
});

// LOGIN
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        if (isRegistering) {
            // REGISTRO
            const nombre = nombreInput.value.trim();
            const pais = paisInput.value.trim();
            const direccion = direccionInput.value.trim();
            const codigoPostal = codigoPostalInput.value.trim();
            
            if (!nombre) {
                showMessage('El nombre es requerido', 'error');
                return;
            }
            
            const response = await fetch(`${API_URL}/usuarios/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    nombre,
                    email,
                    password,
                    pais,
                    direccion,
                    codigoPostal
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                showMessage(data.message || 'Error al registrarse', 'error');
                return;
            }
            
            showMessage('✅ Registro exitoso. Inicia sesión', 'success');
            isRegistering = false;
            nombreInput.style.display = 'none';
            registerFields.style.display = 'none';
            loginBtn.textContent = 'Iniciar Sesión';
            toggleRegisterBtn.textContent = 'Ir a Registro';
            
        } else {
            // LOGIN
            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // IMPORTANTE: permite recibir la cookie
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                showMessage(data.message || 'Error al iniciar sesión', 'error');
                return;
            }
            
            // Sesión iniciada con éxito
            isLoggedIn = true;
            showMessage('✅ Sesión iniciada correctamente', 'success');
            displayUserInfo(data.usuario);
            updateUI();
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
    
    // Limpiar inputs
    emailInput.value = '';
    passwordInput.value = '';
    nombreInput.value = '';
    paisInput.value = '';
    direccionInput.value = '';
    codigoPostalInput.value = '';
});

// LOGOUT - CÓDIGO PRINCIPAL
logoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/logout`, {
            method: 'POST',
            credentials: 'include' // IMPORTANTE: envía automáticamente la cookie
        });
        
        if (!response.ok) {
            showMessage('Error al cerrar sesión', 'error');
            return;
        }
        
        // Sesión cerrada correctamente
        isLoggedIn = false;
        showMessage('✅ Sesión cerrada correctamente', 'success');
        updateUI();
        
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

// VERIFICAR SESIÓN
verifyBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/verificar`, {
            method: 'GET',
            credentials: 'include' // Envía la cookie automáticamente
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showMessage('Sesión expirada o no válida', 'error');
            isLoggedIn = false;
            updateUI();
            return;
        }
        
        showMessage('✅ Sesión activa y válida', 'success');
        displayUserInfo(data.usuario);
        
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

// Mostrar información del usuario
function displayUserInfo(usuario) {
    document.getElementById('userName').textContent = usuario.nombre || '-';
    document.getElementById('userEmail').textContent = usuario.email || '-';
    document.getElementById('userId').textContent = usuario.id || usuario._id || '-';
    userInfo.classList.add('active');
}

// Actualizar interfaz
function updateUI() {
    if (isLoggedIn) {
        authSection.classList.remove('active');
        userSection.classList.add('active');
    } else {
        authSection.classList.add('active');
        userSection.classList.remove('active');
        userInfo.classList.remove('active');
    }
}

// Verificar sesión al cargar la página
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios/verificar`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            isLoggedIn = true;
            displayUserInfo(data.usuario);
            updateUI();
        }
    } catch (error) {
        console.log('No hay sesión activa');
    }
});
