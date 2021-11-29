import initialiseLabelListButtonClickEvents from './panelButtons/buttonClickEvents.js';
import { initialiseLabelList } from './labelList.js';

function initialiseLabelListFunctionality() {
  initialiseLabelList();
  initialiseLabelListButtonClickEvents();
}

export { initialiseLabelListFunctionality as default };
