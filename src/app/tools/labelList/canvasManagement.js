import { assignCanvasForRemovingLabels } from './removeLabels/removeLabels';

function assignCanvasForLabelList(canvas) {
  assignCanvasForRemovingLabels(canvas);
}

export { assignCanvasForLabelList as default };
