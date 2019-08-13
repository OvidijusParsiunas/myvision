import { labelShape, selectLabelOption, prepareLabelPopupTextInput } from './buttonsEvents';

function assignLabellerPopUpButtonEvents() {
  prepareLabelPopupTextInput();
  window.labelShape = labelShape;
  window.selectLabelOption = selectLabelOption;
}

export { assignLabellerPopUpButtonEvents as default };
