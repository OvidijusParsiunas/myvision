import { uploadImage } from '../../../uploadFile/uploadImage';
import { getLabellingState } from '../../../canvas/labelPopUp/labelShape';
import interruptAllCanvasEvents from '../../../canvas/canvasObjects/utils/interruptAllCanvasEvents';

function interruptAllCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptAllCanvasEventsBeforeImageUpload(input) {
  interruptAllCanvasEvents();
  uploadImage(input);
}

function doNothingIfLabellingInProgress(func) {
  if (!getLabellingState()) {
    if (func) func();
  }
}

function interruptAllCanvasEventsIfLabellingInProgress(func) {
  if (getLabellingState()) {
    interruptAllCanvasEvents();
  }
  if (func) func();
}

export {
  interruptAllCanvasEventsBeforeFunc,
  interruptAllCanvasEventsBeforeImageUpload,
  interruptAllCanvasEventsIfLabellingInProgress,
  doNothingIfLabellingInProgress,
};
