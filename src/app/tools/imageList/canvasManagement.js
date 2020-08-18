import { assignCanvasForDiscardingObjects } from './panelButtons/discardActiveObject';
import { assignCanvasForRemovingImages } from './removeImages/removeImages';
import { assignCanvasForDrawingImage } from './uploadImages/drawImageOnCanvas';
import { assignCanvasToImageList } from './imageList';

function assignCanvasForImageList(canvas) {
  assignCanvasForDiscardingObjects(canvas);
  assignCanvasForRemovingImages(canvas);
  assignCanvasForDrawingImage(canvas);
  assignCanvasToImageList(canvas);
}

export { assignCanvasForImageList as default };
