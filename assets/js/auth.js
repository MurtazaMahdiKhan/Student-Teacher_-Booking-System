import { auth } from './database.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { logger } from './logger.js';
import { dbOperations } from './database.js';

export const authService = {
    async registerUser(email, password, userData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await dbOperations.createUser({
                uid: user.uid,
                email: email,
                role: userData.role,
                name: userData.name,
                department: userData.department || null,
                subjects: userData.subjects || []
            });

            logger.log('info', `User registered successfully: ${user.uid}`);
            return user;
        } catch (error) {
            logger.log('error', `Registration error: ${error.message}`);
            throw error;
        }
    },

    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            logger.log('info', `User logged in: ${userCredential.user.uid}`);
            return userCredential.user;
        } catch (error) {
            logger.log('error', `Login error: ${error.message}`);
            throw error;
        }
    },

    async logoutUser() {
        try {
            await signOut(auth);
            logger.log('info', 'User logged out');
            return true;
        } catch (error) {
            logger.log('error', `Logout error: ${error.message}`);
            throw error;
        }
    }
};
