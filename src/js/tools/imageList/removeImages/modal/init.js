import { initialiseRemoveImagesModalStyling } from './style';
import assignRemoveImagesModalButtonEventHandlers from './buttons/buttonClickEvents';
import { removeImageCallback } from '../removeImages';

function initialiseRemoveImagesModal() {
  initialiseRemoveImagesModalStyling();
  assignRemoveImagesModalButtonEventHandlers(removeImageCallback);
}

export { initialiseRemoveImagesModal as default };
