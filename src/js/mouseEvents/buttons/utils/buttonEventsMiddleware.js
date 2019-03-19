import { uploadImage } from '../../../uploadFile/uploadImage';
import { labellingState } from '../../../canvas/labelPopUp/labelShape';
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
  if (!labellingState.inProgress) {
    if (func) func();
  }
}

function interruptAllCanvasEventsIfLabellingInProgress(func) {
  if (labellingState.inProgress) {
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
