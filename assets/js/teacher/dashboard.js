import { db, COLLECTIONS } from '../../database.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../database.js';
import { logger } from '../../logger.js';

document.addEventListener('DOMContentLoaded', async () => {
    const pendingCount = document.getElementById('pendingCount');
    const todayCount = document.getElementById('todayCount');
    const studentCount = document.getElementById('studentCount');
    const upcomingAppointments = document.getElementById('upcomingAppointments');
    const logoutBtn = document.getElementById('logoutBtn');

    async function loadDashboardStats() {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS);
            const q = query(appointmentsRef, where('teacherId', '==', user.uid));
            const querySnapshot = await getDocs(q);

            let pending = 0;
            let today = 0;
            const currentDate = new Date();

            querySnapshot.forEach((doc) => {
                const appointment = doc.data();
                if (appointment.status === 'pending') pending++;
                if (isSameDay(appointment.date.toDate(), currentDate)) today++;
            });

            pendingCount.textContent = pending;
            todayCount.textContent = today;
            
            // Load upcoming appointments
            loadUpcomingAppointments(querySnapshot);

        } catch (error) {
            logger.log('error', `Error loading dashboard stats: ${error.message}`);
            alert('Error loading dashboard information');
        }
    }

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    function loadUpcomingAppointments(querySnapshot) {
        upcomingAppointments.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            const appointmentEl = createAppointmentElement(appointment);
            upcomingAppointments.appendChild(appointmentEl);
        });
    }

    function createAppointmentElement(appointment) {
        const div = document.createElement('div');
        div.className = 'appointment-card';
        div.innerHTML = `
            <h4>${appointment.studentName}</h4>
            <p>Date: ${appointment.date.toDate().toLocaleDateString()}</p>
            <p>Time: ${appointment.date.toDate().toLocaleTimeString()}</p>
            <p>Status: ${appointment.status}</p>
            <div class="appointment-actions">
                <button onclick="updateStatus('${appointment.id}', 'approved')" 
                        class="btn primary">Approve</button>
                <button onclick="updateStatus('${appointment.id}', 'rejected')" 
                        class="btn secondary">Reject</button>
            </div>
        `;
        return div;
    }

    // Event Listeners
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
    loadDashboardStats();
});

window.updateStatus = async (appointmentId, status) => {
    try {
        const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
        await updateDoc(appointmentRef, {
            status: status,
            updatedAt: serverTimestamp()
        });
        
        logger.log('info', `Appointment ${appointmentId} status updated to ${status}`);
        loadDashboardStats(); // Reload the dashboard
    } catch (error) {
        logger.log('error', `Error updating appointment status: ${error.message}`);
        alert('Error updating appointment status');
    }
};