const notifications = document.getElementById("notifications");

export function notify(message) {
    const notification = document.createElement("div");
    notification.innerHTML = message;
    
    notifications.appendChild(notification, notifications.firstChild);
    notifications.appendChild(document.createElement("br"));
    setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}