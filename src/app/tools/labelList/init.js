import initialiseImageListButtonClickEvents from './panelButtons/buttonClickEvents';
import { initialiseLabelList } from './labelList';

function initialiseLabelListFunctionality() {
  initialiseLabelList();
  initialiseImageListButtonClickEvents();
}

export { initialiseLabelListFunctionality as default };
