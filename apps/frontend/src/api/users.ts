import type Collection from "@/types/apiResponses";
import type User from "@/types/entities/user";
import { apiCall } from "./index";

export function useFetchUsers() {
  return apiCall<Collection<User>>("/users", {
    method: "GET",
  });
}

export function useCreateUser() {
  return apiCall<
    User,
    { email: string; role: string; lastName: string; firstName: string }
  >("/users", {
    method: "POST",
  });
}

export function useFetchUser() {
  return apiCall<User>("/users/:id", {
    method: "GET",
  });
}

export function useEnableUser() {
  return apiCall<User>("/users/enable/:id", {
    method: "PUT",
  });
}

export function useDisableUser() {
  return apiCall<User>("/users/disable/:id", {
    method: "PUT",
  });
}
