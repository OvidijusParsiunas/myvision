import fabric from 'fabric';
import { getLabelPopUpText, hideLabelPopUp } from '../../labelPopUp/manipulateLabelPopUp';
import { getFinalBndBoxProps } from '../boundingBox/boundingBoxProperties';
import getLabelProps from '../label/labelProperties';
import polygonProperties from '../polygon/polygonProperties';

const labellingState = { inProgress: false };
let targetShape = null;
let targetPolygonPoints = [];
let canvas = null;

function prepareLabelAndShapeGroup(shape, canvasObj, polygonPoints) {
  targetShape = shape;
  targetPolygonPoints = polygonPoints;
  canvas = canvasObj;
  labellingState.inProgress = true;
}

function removeTargetShape() {
  canvas.remove(targetShape);
  labellingState.inProgress = false;
}

function createLabelAndShapeGroup() {
  const text = getLabelPopUpText();
  hideLabelPopUp();
  const textShape = new fabric.Text(text, getLabelProps(targetShape));
  if (targetShape.shapeName === 'polygon') {
    targetPolygonPoints.forEach((point) => { point.visible = false; point.stroke = null; point.fill = 'blue'; point.shapeName = 'point'; });
    const group = new fabric.Group([targetShape, textShape, ...targetPolygonPoints],
      polygonProperties.newFinalPolygon);
    canvas.add(group);
  } else if (targetShape.shapeName === 'bndBoxTemp') {
    const group = new fabric.Group([targetShape, textShape], getFinalBndBoxProps(targetShape));
    canvas.add(group);
  }
  removeTargetShape();
}

export {
  prepareLabelAndShapeGroup, createLabelAndShapeGroup, removeTargetShape, labellingState,
};
