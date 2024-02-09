import { create } from "zustand";

const useAuthTokenStore = create((set) => ({
  authToken: null,
  setAuthToken: (data) => set(() => ({ authToken: data })),
}));

export default useAuthTokenStore;
