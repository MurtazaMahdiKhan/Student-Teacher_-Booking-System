import { authService } from './auth.js';
import { logger } from './logger.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const roleSelect = document.getElementById('role');
    const teacherFields = document.getElementById('teacherFields');

    roleSelect.addEventListener('change', (e) => {
        teacherFields.style.display = e.target.value === 'teacher' ? 'block' : 'none';
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const role = roleSelect.value;
        
        const userData = {
            name,
            role
        };

        if (role === 'teacher') {
            userData.department = document.getElementById('department').value;
            userData.subjects = document.getElementById('subjects').value.split(',').map(s => s.trim());
        }

        try {
            await authService.registerUser(email, password, userData);
            window.location.href = role === 'teacher' ? 'pages/teacher/dashboard.html' : 'pages/student/dashboard.html';
        } catch (error) {
            logger.log('error', `Registration failed: ${error.message}`);
            alert('Registration failed: ' + error.message);
        }
    });
});