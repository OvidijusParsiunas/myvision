import { initialiseImageList } from './imageList';
import initialiseImageListButtonClickEvents from './buttons/buttonClickEvents';
import initialiseImageListButtonHoverEvents from './buttons/buttonHoverEvents';

function initialiseImageListFunctionality() {
  initialiseImageList();
  initialiseImageListButtonClickEvents();
  initialiseImageListButtonHoverEvents();
}

export { initialiseImageListFunctionality as default };
