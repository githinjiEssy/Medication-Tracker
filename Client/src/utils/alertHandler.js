// 1. Import the logo from its original folder
import logo from '../assets/images/logo.png'; 


export const requestNotificationPermission = async () => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await Notification.requestPermission();
    }
};

export const playAlertSound = () => {
    
    const audio = new Audio('/sounds/medication-reminder.mp3');
    audio.play().catch(error => console.error("Audio playback failed:", error));
};

export const showNativeNotification = (title, message) => {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: logo 
        });
    }
};