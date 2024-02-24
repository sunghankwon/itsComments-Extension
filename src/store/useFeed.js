import { create } from "zustand";

const useFeedStore = create((set) => ({
  commentsList: [],
  setCommentsList: (data) => set(() => ({ commentsList: data })),
}));

export default useFeedStore;
