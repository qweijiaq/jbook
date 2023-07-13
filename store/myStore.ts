import { defineStore } from "pinia";

export const useMyStore = defineStore("myStore", {
  state: () => ({
    counter: 1,
  }),
  getters: {
    doubleCounter: (state) => state.counter * 2,
  },
  actions: {
    add() {
      this.counter++;
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
