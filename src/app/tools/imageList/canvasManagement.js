import { assignCanvasForDiscardingObjects } from './panelButtons/discardActiveObject.js';
import { assignCanvasForRemovingImages } from './removeImages/removeImages.js';
import { assignCanvasForDrawingImage } from './uploadImages/drawImageOnCanvas.js';
import { assignCanvasToImageList } from './imageList.js';

function assignCanvasForImageList(canvas) {
  assignCanvasForDiscardingObjects(canvas);
  assignCanvasForRemovingImages(canvas);
  assignCanvasForDrawingImage(canvas);
  assignCanvasToImageList(canvas);
}

export { assignCanvasForImageList as default };
