import { initialiseShapeLabellerModalOptionsList } from './style';
import {
  labelShape, selectLabelOption, prepareShapeLabellerModalElements,
  inputKeyDown, pasteLabelText, cancelLabellingProcess,
} from './buttonEventHandlers';

function initialiseShapeLabellerModal() {
  prepareShapeLabellerModalElements();
  initialiseShapeLabellerModalOptionsList();
  window.labelShape = labelShape;
  window.cancelLabellingProcess = cancelLabellingProcess;
  window.shapeLabellerModalKeyDown = inputKeyDown;
  window.shapeLabellerPaste = pasteLabelText;
  window.selectLabelOption = selectLabelOption;
}

export { initialiseShapeLabellerModal as default };
