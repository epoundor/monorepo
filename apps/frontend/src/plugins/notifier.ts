import { computed, ref, type Ref } from "vue";

interface Notification {
  message: string;
  type: string;
  timeout?: number;
}
type Notifications = Notification & { id: number; visible: boolean };

const counter: Ref<number> = ref(0);
const notifications: Ref<Notifications[]> = ref([]);

const defaultOptions: Notification = {
  message: "",
  type: "info",
  timeout: 5000,
};
const DESTROY_TIMEOUT = 500;
export default function useNotifier() {
  const visibleNotifications = computed(() =>
    notifications.value.filter((notif) => notif.visible)
  );

  function destroyNotification(id: number) {
    const index = notifications.value.findIndex((notif) => notif.id === id);

    if (index !== 0 - 1) {
      notifications.value[index].visible = false;

      setTimeout(() => {
        notifications.value.splice(index, 1);
      }, DESTROY_TIMEOUT);
    }
  }

  function notify(notification: Notification) {
    const id = 1 + counter.value;

    notifications.value.push({
      ...notification,
      ...defaultOptions,
      id,
      visible: true,
    });

    if (notification.timeout !== 0) {
      setTimeout(() => {
        destroyNotification(id);
      }, notification.timeout);
    }
  }
  function notifySuccess(notification: Omit<Notification, "type">) {
    notify({ ...notification, type: "success" });
  }

  function notifyWarning(notification: Omit<Notification, "type">) {
    notify({ ...notification, type: "warning" });
  }

  function notifyError(notification: Omit<Notification, "type">) {
    notify({ ...notification, type: "error" });
  }

  return {
    notify,
    notifySuccess,
    notifyWarning,
    notifyError,
    destroyNotification,
    visibleNotifications,
    notifications,
  };
}
