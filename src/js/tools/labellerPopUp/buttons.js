import { initialiseLabelPopupOptionsList } from './style';
import {
  labelShape, selectLabelOption, prepareLabelPopupElements, inputKeyDown, pasteLabelText,
} from './buttonEventHandlers';

function initialiseLabellerPopUp() {
  prepareLabelPopupElements();
  initialiseLabelPopupOptionsList();
  window.labelShape = labelShape;
  window.popupInputKeyDown = inputKeyDown;
  window.popupPaste = pasteLabelText;
  window.selectLabelOption = selectLabelOption;
}

export { initialiseLabellerPopUp as default };
