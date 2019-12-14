// import { downloadXML } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';
import { dimWindow } from '../../../labellerPopUp/style';
import { displayExportLabelsPopup } from '../../../exportLabelsPopUp/style';
// function showLabelPopUp() {
// popupLabelParentElement = document.getElementById('popup-label-parent');
// popupLabelParentElement.style.display = 'block';
// validateFullPopUpVisibile();
// }

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  dimWindow();
  displayExportLabelsPopup();
  // downloadYOLOTXT();
  // nothing to download message
}

export { downloadTrainingDataEvent as default };
