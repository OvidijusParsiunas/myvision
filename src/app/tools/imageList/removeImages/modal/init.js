import { initialiseRemoveImagesModalStyling } from './style.js';
import assignRemoveImagesModalButtonEventHandlers from './buttons/buttonClickEvents.js';
import { removeImage } from '../removeImages.js';

function initialiseRemoveImagesModal() {
  initialiseRemoveImagesModalStyling();
  assignRemoveImagesModalButtonEventHandlers(removeImage);
}

export { initialiseRemoveImagesModal as default };
