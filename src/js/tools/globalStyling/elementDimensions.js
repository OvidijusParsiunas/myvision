function applyElementDimensions() {
  const defaultScreenWidth = 1920;
  const currentScreenWidth = window.screen.width;

  const stylingDelta = defaultScreenWidth / currentScreenWidth;
  const preferredLeftSideBarWidth = 57;
  const newLeftSideBarWidth = preferredLeftSideBarWidth * stylingDelta;
  document.getElementById('left-side-bar').style.width = `${newLeftSideBarWidth}px`;
}

export { applyElementDimensions as default };
