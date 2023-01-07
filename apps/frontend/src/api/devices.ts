import type Collection from "@/types/apiResponses";
import type Device from "@/types/apiResponses/devices";
import { apiCall } from "@monorepo/api";

export function useFetchDevices() {
  return apiCall("/api/devices", {
    method: "get",
    immediate: true,
  });
}

export function useFetchDevice() {
  return apiCall("/devices/:deviceId", {
    method: "GET",
    immediate: true,
  });
}

export function useCreateDevice() {
  return apiCall("/devices", {
    method: "POST",
  });
}
