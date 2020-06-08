import { getChangingMLGeneratedLabelNamesState } from '../../tools/stateMachine';
import { stopEditingMLGeneratedLabelNameBtnClick } from '../../tools/machineLearningModal/views/generatedLabels/changeLabels';
import closePopUps from '../../tools/utils/popups/closePopups';

function onMouseDown(event) {
  closePopUps(event);
  if (getChangingMLGeneratedLabelNamesState()) {
    stopEditingMLGeneratedLabelNameBtnClick(event.target);
  }
}

function registerMouseDownEvents() {
  window.onmousedown = onMouseDown;
}

export { registerMouseDownEvents as default };
