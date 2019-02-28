import fabric from 'fabric';
import getLabelProps from '../canvasObjects/label/labelProperties';
import { getFinalBndBoxProps } from '../canvasObjects/boundingBox/boundingBoxProperties';
import polygonProperties from '../canvasObjects/polygon/polygonProperties';

let displayLabelNamePopUp = false;
let targetShape = null;
let canvas = null;

function showLabelNamePopUp(xCoordinate, yCoordinate, shape, canvasObj) {
  targetShape = shape;
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

function labelShape() {
  const text = document.getElementById('label-title').value;
  document.getElementById('labelNamePopUp').style.display = 'none';
  const textShape = new fabric.Text(text, getLabelProps(targetShape));
  if (targetShape.shapeName === 'bndBoxTemp') {
    const group = new fabric.Group([targetShape, textShape], getFinalBndBoxProps(targetShape));
    canvas.add(group);
  } else if (targetShape.shapeName === 'polygon') {
    const group = new fabric.Group([targetShape, textShape], polygonProperties.newPolygonOverride);
    canvas.add(group);
  }
  displayLabelNamePopUp = true;
  canvas.remove(targetShape);
}

function removeActiveObjectsOnButtonClick() {
  if (displayLabelNamePopUp) {
    canvas.remove(targetShape);
    displayLabelNamePopUp = false;
    document.getElementById('labelNamePopUp').style.display = 'none';
  }
}

window.labelShape = labelShape;
export { removeActiveObjectsOnButtonClick, showLabelNamePopUp };
