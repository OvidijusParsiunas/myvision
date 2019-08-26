import { initialiseLabelPopupOptionsList } from './style';
import {
  labelShape, selectLabelOption, prepareLabelPopupElements, inputKeyDown,
} from './buttonEventHandlers';

function initialiseLabellerPopUp() {
  prepareLabelPopupElements();
  initialiseLabelPopupOptionsList();
  window.labelShape = labelShape;
  window.popupInputKeyDown = inputKeyDown;
  window.selectLabelOption = selectLabelOption;
}

export { initialiseLabellerPopUp as default };
