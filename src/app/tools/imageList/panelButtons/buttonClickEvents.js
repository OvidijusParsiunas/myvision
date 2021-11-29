import { switchImage } from '../imageList.js';
import { doNothingIfNotLeftMouseButtonPress, removeButtonPopoverIfActive } from '../../utils/buttons/clickMiddleware.js';
import uploadImages from '../uploadImages/uploadImages.js';
import { resetCanvasEventsToDefault } from '../../toolkit/buttonClickEvents/facade.js';
import {
  interruptAllCanvasEventsBeforeFuncWInputs, replaceExistingCanvas,
} from './buttonMiddleWare.js';
import { discardActiveObject } from './discardActiveObject.js';
import { triggerRemoveImage } from '../removeImages/removeImages.js';

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
