import { authService } from './auth.js';
import { logger } from './logger.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const user = await authService.loginUser(email, password);
            // Redirect based on user role (you'll need to fetch user role from database)
            window.location.href = 'pages/student/dashboard.html';
        } catch (error) {
            logger.log('error', `Login failed: ${error.message}`);
            alert('Login failed: ' + error.message);
        }
    });
});