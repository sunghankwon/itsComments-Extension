import { create } from "zustand";

const useTokenStore = create((set) => ({
  authToken: null,
  setAuthToken: (data) => set(() => ({ authToken: data })),
}));

export default useTokenStore;
