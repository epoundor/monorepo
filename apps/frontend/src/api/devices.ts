import type Collection from "@/types/apiResponses";
import type Device from "@/types/apiResponses/devices";
import { apiCall } from "./index";

export function useFetchDevices() {
  return apiCall<Collection<Device>>("/devices", {
    method: "GET",
    immediate: true,
    params: {
      take: 10,
    },
  });
}

export function useFetchDevice() {
  return apiCall<Device>("/devices/:deviceId", {
    method: "GET",
    immediate: true,
  });
}

export function useCreateDevice() {
  return apiCall<Device, { reference: string }>("/devices", {
    method: "POST",
  });
}
