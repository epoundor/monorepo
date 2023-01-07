import { apiCall } from "@monorepo/api";

export type ToDo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type Post = {
  body: string;
  id: number;
  title: string;
  userId: number;
};

export type CreatePost = Omit<Post, "id">;

export function useFetchTodo() {
  return apiCall("/api/devices", {
    method: "get",
  });
}

export function useCreateTodo() {
  return apiCall("/api/devices/{id}", {
    method: "get",
  });
}
