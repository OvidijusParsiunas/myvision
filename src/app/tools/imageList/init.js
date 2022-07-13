import initialiseImageListButtonClickEvents from './panelButtons/buttonClickEvents';
import initialiseImageListButtonHoverEvents from './panelButtons/buttonHoverEvents';

function initialiseImageListFunctionality() {
  initialiseImageListButtonClickEvents();
  initialiseImageListButtonHoverEvents();
}

export { initialiseImageListFunctionality as default };
