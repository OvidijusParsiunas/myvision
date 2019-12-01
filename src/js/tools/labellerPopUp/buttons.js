import { initialiseLabelPopupOptionsList } from './style';
import {
  labelShape, selectLabelOption, prepareLabelPopupElements,
  inputKeyDown, pasteLabelText, cancelLabellingProcess,
} from './buttonEventHandlers';

function initialiseLabellerPopUp() {
  prepareLabelPopupElements();
  initialiseLabelPopupOptionsList();
  window.labelShape = labelShape;
  window.cancelLabellingProcess = cancelLabellingProcess;
  window.popupInputKeyDown = inputKeyDown;
  window.popupPaste = pasteLabelText;
  window.selectLabelOption = selectLabelOption;
}

export { initialiseLabellerPopUp as default };
