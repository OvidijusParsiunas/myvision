import { switchImage } from '../imageList';
import { doNothingIfNotLeftMouseButtonPress, removeButtonPopoverIfActive } from '../../utils/buttons/clickMiddleware';
import uploadImages from '../uploadImages/uploadImages';
import { resetCanvasEventsToDefault } from '../../toolkit/buttonClickEvents/facade';
import {
  interruptAllCanvasEventsBeforeFuncWInputs, replaceExistingCanvas,
} from './buttonMiddleWare';
import { discardActiveObject } from './discardActiveObject';
import { triggerRemoveImage } from '../removeImages/removeImages';

function triggeUploadImagesButton() {
  document.getElementById('uploadImages').click();
}

function uploadImageFiles(uploadData) {
  discardActiveObject();
  uploadImages(uploadData);
}

function initialiseImageListButtonClickEvents() {
  window.switchImage = replaceExistingCanvas.bind(this, switchImage,
    resetCanvasEventsToDefault);
  window.triggerImageUpload = removeButtonPopoverIfActive.bind(this, triggeUploadImagesButton);
  window.uploadImages = interruptAllCanvasEventsBeforeFuncWInputs.bind(this, this,
    { uploadImageFiles, resetCanvasEventsToDefault });
  window.removeImage = doNothingIfNotLeftMouseButtonPress.bind(this, triggerRemoveImage);
}

export { initialiseImageListButtonClickEvents as default };
