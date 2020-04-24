import { initialiseLabellerModalOptionsList } from './style';
import {
  labelShape, selectLabelOption, prepareLabellerModalElements,
  inputKeyDown, pasteLabelText, cancelLabellingProcess,
} from './buttonEventHandlers';

function initialiseLabellerModal() {
  prepareLabellerModalElements();
  initialiseLabellerModalOptionsList();
  window.labelShape = labelShape;
  window.cancelLabellingProcess = cancelLabellingProcess;
  window.labellerModalKeyDown = inputKeyDown;
  window.labellerModalInputPaste = pasteLabelText;
  window.selectLabelOption = selectLabelOption;
}

export { initialiseLabellerModal as default };
