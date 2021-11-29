import { assignCanvasForRemovingLabels } from './removeLabels/removeLabels.js';

function assignCanvasForLabelList(canvas) {
  assignCanvasForRemovingLabels(canvas);
}

export { assignCanvasForLabelList as default };
