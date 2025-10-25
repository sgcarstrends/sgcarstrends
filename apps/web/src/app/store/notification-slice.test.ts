import { create } from "zustand";
import {
  createNotificationSlice,
  type NotificationAction,
  type NotificationState,
} from "./notification-slice";

describe("Notification Slice", () => {
  let originalNotification: any;

  const createNotificationStore = () =>
    create<NotificationState & NotificationAction>()(createNotificationSlice);

  beforeAll(() => {
    originalNotification = global.Notification;

    // Mock Notification API
    global.Notification = {
      permission: "default",
    } as any;
  });

  afterAll(() => {
    global.Notification = originalNotification;
  });

  it("should initialize with undefined notification status", () => {
    const store = createNotificationStore();
    const state = store.getState();

    expect(state.notificationStatus).toBeUndefined();
  });

  it("should set notification status to 'default'", () => {
    const store = createNotificationStore();
    const { setNotificationStatus } = store.getState();

    setNotificationStatus("default");
    expect(store.getState().notificationStatus).toBe("default");
  });

  it("should set notification status to 'granted'", () => {
    const store = createNotificationStore();
    const { setNotificationStatus } = store.getState();

    setNotificationStatus("granted");
    expect(store.getState().notificationStatus).toBe("granted");
  });

  it("should set notification status to 'denied'", () => {
    const store = createNotificationStore();
    const { setNotificationStatus } = store.getState();

    setNotificationStatus("denied");
    expect(store.getState().notificationStatus).toBe("denied");
  });

  it("should update notification status multiple times", () => {
    const store = createNotificationStore();
    const { setNotificationStatus } = store.getState();

    // Start with default
    setNotificationStatus("default");
    expect(store.getState().notificationStatus).toBe("default");

    // Change to granted
    setNotificationStatus("granted");
    expect(store.getState().notificationStatus).toBe("granted");

    // Change to denied
    setNotificationStatus("denied");
    expect(store.getState().notificationStatus).toBe("denied");

    // Back to default
    setNotificationStatus("default");
    expect(store.getState().notificationStatus).toBe("default");
  });
});
