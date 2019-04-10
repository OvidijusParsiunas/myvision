import { uploadImage } from '../buttonEvents/eventWorkersUtils/uploadFile/uploadImage';
import { isLabelling } from '../../labellerPopUp/labellingProcess';
import interruptAllCanvasEvents from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';

function interruptAllCanvasEventsBeforeFunc(func) {
  interruptAllCanvasEvents();
  if (func) func();
}

function interruptAllCanvasEventsBeforeImageUpload(input) {
  interruptAllCanvasEvents();
  uploadImage(input);
}

function doNothingIfLabellingInProgress(func) {
  if (!isLabelling()) {
    if (func) func();
  }
}

function interruptAllCanvasEventsIfLabellingInProgress(func) {
  if (isLabelling()) {
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
