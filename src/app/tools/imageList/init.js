import { initialiseImageList } from './imageList';
import initialiseImageListButtonClickEvents from './panelButtons/buttonClickEvents';
import initialiseImageListButtonHoverEvents from './panelButtons/buttonHoverEvents';

function initialiseImageListFunctionality() {
  initialiseImageList();
  initialiseImageListButtonClickEvents();
  initialiseImageListButtonHoverEvents();
}

export { initialiseImageListFunctionality as default };
