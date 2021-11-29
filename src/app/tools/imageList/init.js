import { initialiseImageList } from './imageList.js';
import initialiseImageListButtonClickEvents from './panelButtons/buttonClickEvents.js';
import initialiseImageListButtonHoverEvents from './panelButtons/buttonHoverEvents.js';

function initialiseImageListFunctionality() {
  initialiseImageList();
  initialiseImageListButtonClickEvents();
  initialiseImageListButtonHoverEvents();
}

export { initialiseImageListFunctionality as default };
