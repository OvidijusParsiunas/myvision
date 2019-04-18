function showLabelPopUp(xCoordinate, yCoordinate) {
  const labelNamePopUp = document.getElementById('labelNamePopUp');
  labelNamePopUp.style.display = 'block';
  const canvasWrapperCoordinates = document.getElementById('canvas-wrapper').getBoundingClientRect();
  const canvasY = canvasWrapperCoordinates.top;
  const canvasX = canvasWrapperCoordinates.left;
  labelNamePopUp.style.top = `${yCoordinate + canvasY}px`;
  labelNamePopUp.style.left = `${xCoordinate + canvasX}px`;
}

function getLabelPopUpText() {
  return document.getElementById('label-title').value;
}

function hideLabelPopUp() {
  document.getElementById('labelNamePopUp').style.display = 'none';
}

export { showLabelPopUp, getLabelPopUpText, hideLabelPopUp };
