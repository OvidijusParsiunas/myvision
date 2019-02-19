import fabric from 'fabric';

let displayLabelNamePopUp = false;
let targetBndBox = null;
let canvas = null;

function showLabelNamePopUp(xCoordinate, yCoordinate, bndBox, canvasObj) {
  targetBndBox = bndBox;
  canvas = canvasObj;
  const labelNamePopUp = document.getElementById('labelNamePopUp');
  labelNamePopUp.style.display = 'block';
  const canvasWrapperCoordinates = document.getElementById('canvas-wrapper').getBoundingClientRect();
  const canvasY = canvasWrapperCoordinates.top;
  const canvasX = canvasWrapperCoordinates.left;
  labelNamePopUp.style.top = `${yCoordinate + canvasY}px`;
  labelNamePopUp.style.left = `${xCoordinate + canvasX}px`;
  displayLabelNamePopUp = true;
}

function labelBndBox() {
  const text = document.getElementById('label-title').value;
  document.getElementById('labelNamePopUp').style.display = 'none';
  const textShape = new fabric.Text(text, {
    fontSize: 10,
    fill: 'yellow',
    left: targetBndBox.left,
    top: targetBndBox.top,
    width: targetBndBox.width,
    height: targetBndBox.height,
  });
  const group = new fabric.Group([targetBndBox, textShape], {
    left: targetBndBox.left,
    top: targetBndBox.top,
    width: targetBndBox.width,
    height: targetBndBox.height,
    stroke: 'rgba(255,0,0)',
    strokeWidth: 2,
    fill: 'rgba(255,0,0,0.1)',
  });
  displayLabelNamePopUp = true;
  canvas.remove(targetBndBox);
  canvas.add(group);
}


function removeBndBxIfLabelNamePending() {
  if (displayLabelNamePopUp) {
    canvas.remove(targetBndBox);
    displayLabelNamePopUp = false;
    document.getElementById('labelNamePopUp').style.display = 'none';
  }
}

window.labelBndBox = labelBndBox;
export { removeBndBxIfLabelNamePending, showLabelNamePopUp };
