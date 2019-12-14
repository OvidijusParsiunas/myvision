// import { downloadXML } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';
import { dimWindow } from '../../../dimWindow/dimWindowService';
import { displayExportLabelsPopup } from '../../../exportLabelsPopUp/style';
// function showLabelPopUp() {
// popupLabelParentElement = document.getElementById('popup-label-parent');
// popupLabelParentElement.style.display = 'block';
// validateFullPopUpVisibile();
// }

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  dimWindow(0.4);
  displayExportLabelsPopup();
}

export { downloadTrainingDataEvent as default };
