import { initialiseLabellerModalOptionsList } from './style.js';
import {
  labelShape, selectLabelOption, initialiseLabellerModalLocalVariables,
  inputKeyDown, pasteLabelText, cancelLabellingProcess,
} from './buttonEventHandlers.js';

function initialiseLabellerModal() {
  initialiseLabellerModalLocalVariables();
  initialiseLabellerModalOptionsList();
  window.labelShape = labelShape;
  window.cancelLabellingProcess = cancelLabellingProcess;
  window.labellerModalKeyDown = inputKeyDown;
  window.labellerModalInputPaste = pasteLabelText;
  window.selectLabelOption = selectLabelOption;
}

export { initialiseLabellerModal as default };
