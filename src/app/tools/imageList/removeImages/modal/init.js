import { initialiseRemoveImagesModalStyling } from './style';
import assignRemoveImagesModalButtonEventHandlers from './buttons/buttonClickEvents';
import { removeImage } from '../removeImages';

function initialiseRemoveImagesModal() {
  initialiseRemoveImagesModalStyling();
  assignRemoveImagesModalButtonEventHandlers(removeImage);
}

export { initialiseRemoveImagesModal as default };
