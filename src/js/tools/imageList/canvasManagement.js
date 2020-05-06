import { assignCanvasForDiscardingObjects } from './buttons/discardActiveObject';
import { assignCanvasForRemovingImages } from './removeImages/removeImages';

function assignCanvasForImageList(canvas) {
  assignCanvasForDiscardingObjects(canvas);
  assignCanvasForRemovingImages(canvas);
}

export { assignCanvasForImageList as default };
