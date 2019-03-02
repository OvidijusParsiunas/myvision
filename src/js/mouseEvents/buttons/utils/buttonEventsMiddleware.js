import { uploadImage } from '../../../uploadFile/uploadImage';
import interruptAllCanvasEvents from '../../../canvas/canvasObjects/utils/interruptAllCanvasEvents';

function interruptAllCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptAllCanvasEventsBeforeImageUpload(input) {
  interruptAllCanvasEvents();
  uploadImage(input);
}

export { interruptAllCanvasEventsBeforeFunc, interruptAllCanvasEventsBeforeImageUpload };
