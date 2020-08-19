import initialiseLabelListButtonClickEvents from './panelButtons/buttonClickEvents';
import { initialiseLabelList } from './labelList';

function initialiseLabelListFunctionality() {
  initialiseLabelList();
  initialiseLabelListButtonClickEvents();
}

export { initialiseLabelListFunctionality as default };
