import { apiCall } from "@monorepo/api";

export default function useFetchAuthenticatedUser() {
  return apiCall("/api/auth/me", {
    immediate: true,
    method: "GET",
  });
}
