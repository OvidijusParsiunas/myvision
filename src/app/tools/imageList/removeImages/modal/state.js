const imageModalState = {
  doNotShowRemoveImageModalAgain: false,
  get doNotShowRemoveImageModalAgainState() {
    return this.doNotShowRemoveImageModalAgain;
  },
  set doNotShowRemoveImageModalAgainState(state) {
    this.doNotShowRemoveImageModalAgain = state;
  }
};

export { imageModalState };
