import { initialiseImageList } from './imageList';
import initialiseImageListButtonEvents from './buttons/buttonEvents';

function initialiseImageListFunctionality() {
  initialiseImageList();
  initialiseImageListButtonEvents();
}

export { initialiseImageListFunctionality as default };
