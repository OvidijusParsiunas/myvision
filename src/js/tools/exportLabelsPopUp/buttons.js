import { selectLabelExportFormat, exportLabels, closeExportLabelsPopUp } from './buttonEventHandlers';
import { initialiseExportLabelsPopupElements } from './style';

function initialiseExportLabelsPopUp() {
  initialiseExportLabelsPopupElements();
  window.selectLabelExportFormat = selectLabelExportFormat;
  window.exportLabels = exportLabels;
  window.cancelExportLabels = closeExportLabelsPopUp;
}

export { initialiseExportLabelsPopUp as default };
