import { dimWindow } from '../../../dimWindow/dimWindowService';
import { displayExportLabelsPopup } from '../../../exportLabelsPopUp/style';

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  dimWindow(0.4);
  displayExportLabelsPopup();
}

export { downloadTrainingDataEvent as default };
