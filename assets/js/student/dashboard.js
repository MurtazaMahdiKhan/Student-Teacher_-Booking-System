import { db, COLLECTIONS } from '../../database.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../database.js';
import { logger } from '../../logger.js';

document.addEventListener('DOMContentLoaded', async () => {
    const teachersList = document.getElementById('teachersList');
    const searchInput = document.getElementById('teacherSearch');
    const logoutBtn = document.getElementById('logoutBtn');

    // Load teachers
    async function loadTeachers(searchTerm = '') {
        try {
            const teachersRef = collection(db, COLLECTIONS.USERS);
            const q = query(teachersRef, where('role', '==', 'teacher'));
            const querySnapshot = await getDocs(q);

            teachersList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const teacher = doc.data();
                if (searchTerm && !matchesSearch(teacher, searchTerm)) return;

                const teacherCard = createTeacherCard(teacher);
                teachersList.appendChild(teacherCard);
            });
        } catch (error) {
            logger.log('error', `Error loading teachers: ${error.message}`);
            alert('Error loading teachers');
        }
    }

    function matchesSearch(teacher, term) {
        const searchTerm = term.toLowerCase();
        return (
            teacher.name.toLowerCase().includes(searchTerm) ||
            teacher.department.toLowerCase().includes(searchTerm) ||
            teacher.subjects.some(subject => 
                subject.toLowerCase().includes(searchTerm)
            )
        );
    }

    function createTeacherCard(teacher) {
        const div = document.createElement('div');
        div.className = 'teacher-card';
        div.innerHTML = `
            <h3>${teacher.name}</h3>
            <p>Department: ${teacher.department}</p>
            <p>Subjects: ${teacher.subjects.join(', ')}</p>
            <button class="btn primary" onclick="bookAppointment('${teacher.uid}')">
                Book Appointment
            </button>
        `;
        return div;
    }

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        loadTeachers(e.target.value);
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            window.location.href = '../../login.html';
        } catch (error) {
            logger.log('error', `Logout error: ${error.message}`);
            alert('Error logging out');
        }
    });

    // Initial load
    loadTeachers();
});

window.bookAppointment = async (teacherId) => {
    // Implement booking modal/form
    // This function will be called from the teacher card
};