export function requestNotificationPermission() {
  if (Notification.permission !== "granted") {
    return Notification.requestPermission();
  }
}

export function showNotification(title: string, options: any) {
  if (Notification.permission === "granted") {
    return new Notification(title, options);
  }
}
