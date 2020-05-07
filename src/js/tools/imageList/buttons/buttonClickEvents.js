import { switchImage } from '../imageList';
import uploadImages from '../uploadImages/uploadImages';
import { resetCanvasEventsToDefault } from '../../toolkit/buttonClickEvents/facade';
import { interruptAllCanvasEventsBeforeFuncWInputs, removeButtonPopoverIfActive, replaceExistingCanvas } from './buttonMiddleWare';
import { discardActiveObject } from './discardActiveObject';
import { removeImage } from '../removeImages/removeImages';

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
  window.removeImage = removeImage;
}

export { initialiseImageListButtonClickEvents as default };
