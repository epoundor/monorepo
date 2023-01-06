import type Collection from "@/types/apiResponses/index";
import type Proof from "@/types/apiResponses/proofs";
import type Stats from "@/types/apiResponses/stats";

import { apiCall } from "./index";

export function useFetchLastProofs() {
  return apiCall<{ items: Proof[]; totalItems: number }>(
    "/proofs-of-life/last",
    {
      method: "GET",
      immediate: true,
      params: { take: 8 },
    }
  );
}

export function useFetchProofs() {
  return apiCall<Collection<Proof>>("/proofs-of-life", {
    method: "GET",
    params: {
      take: 10,
    },
  });
}

export function useFetchProof(id: string) {
  return apiCall<Proof>("/proofs-of-life/" + id, {
    method: "GET",
    immediate: true,
  });
}

export function useFetchProofsByDevice() {
  return apiCall<Collection<Proof>>(
    "/proofs-of-life/proofs-by-device/:deviceId",
    {
      method: "GET",
    }
  );
}

export function useProofVerify() {
  return apiCall<Proof>("proofs-of-life/verify/:id", {
    method: "PUT",
  });
}

export function useFetchStats() {
  return apiCall<Stats>("/proofs-of-life/stats", {
    method: "GET",
    immediate: true,
  });
}
