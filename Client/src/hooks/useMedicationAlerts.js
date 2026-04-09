// Client/src/hooks/useMedicationAlerts.js
import { useEffect } from 'react';
import { medicationService } from '../services/medicationService';
import { showNativeNotification, playAlertSound, requestNotificationPermission } from '../utils/alertHandler';

export const useMedicationAlerts = () => {
    useEffect(() => {
        requestNotificationPermission();

        const pollForReminders = async () => {
            const token = localStorage.getItem('access_token'); 
            
            // DEBUG LOG: This will tell us if the interval is running and if you have a token
            console.log("Polling for notifications... Token status:", token ? "Found!" : "Missing!");

            // If there is no token, it silently stops here and makes no network request
            if (!token) return; 

            try {
                const response = await medicationService.getUnalertedNotifications();
                const newNotifications = response.data;
                
                console.log("Found unalerted notifications:", newNotifications);

                if (newNotifications.length > 0) {
                    newNotifications.forEach(async (note) => {
                        showNativeNotification(note.title, note.message);
                        playAlertSound();
                        await medicationService.markAsAlerted(note.id);
                    });
                }
            } catch (error) {
                console.error("Error checking for reminders:", error);
            }
        };

        // TEMPORARY FOR TESTING: Check every 10 seconds instead of 60
        const interval = setInterval(pollForReminders, 10000); 
        return () => clearInterval(interval);
    }, []);
};