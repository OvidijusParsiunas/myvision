import { getChangingMLGeneratedLabelNamesState } from '../../tools/state.js';
import { stopEditingMLGeneratedLabelNameBtnClick } from '../../tools/machineLearningModal/views/generatedLabels/changeLabels.js';
import closeAllPopups from '../../tools/utils/popups/closeAllPopups.js';

function onMouseDown(event) {
  closeAllPopups(event);
  if (getChangingMLGeneratedLabelNamesState()) {
    stopEditingMLGeneratedLabelNameBtnClick(event.target);
  }
}

function registerMouseDownEvents() {
  window.onmousedown = onMouseDown;
}

export { registerMouseDownEvents as default };
