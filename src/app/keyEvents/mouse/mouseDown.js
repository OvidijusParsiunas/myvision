import { getChangingMLGeneratedLabelNamesState } from '../../tools/state';
import { stopEditingMLGeneratedLabelNameBtnClick } from '../../tools/machineLearningModal/views/generatedLabels/changeLabels';
import closeAllPopups from '../../tools/utils/popups/closeAllPopups';

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
