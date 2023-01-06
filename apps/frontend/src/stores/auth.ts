import { defineStore } from "pinia";

interface User {
  name: string;
  id: number;
  roles: Array<[]>;
}

const useAuthStore = defineStore("auth", {
  state: () => ({
    /** @type {User} */
    user: null,
    accessToken: "",
  }),

  getters: {
    authenticated(state) {
      return !!state.accessToken;
    },
  },
  actions: {
    init() {
      const accessToken = localStorage.getItem("econseil.auth.access_token");

      if (accessToken) {
        this.accessToken = accessToken;
      }
    },

    logout() {
      localStorage.clear();
      this.user = null;
      this.accessToken = "";
    },

    setAccessToken(token: string) {
      this.accessToken = token;
      localStorage.setItem("econseil.auth.access_token", token);
    },

    setUser(user: User) {
      this.user = user;
    },
  },
});

export default useAuthStore;
