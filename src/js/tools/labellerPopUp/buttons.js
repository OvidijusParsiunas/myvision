import { labelShape, selectLabelOption, prepareLabelPopupTextInput } from './buttonsEvents';
import { initialiseLabelPopupOptionsList } from './style';

function initialiseLabellerPopUp() {
  prepareLabelPopupTextInput();
  initialiseLabelPopupOptionsList();
  window.labelShape = labelShape;
  window.selectLabelOption = selectLabelOption;
}

export { initialiseLabellerPopUp as default };
