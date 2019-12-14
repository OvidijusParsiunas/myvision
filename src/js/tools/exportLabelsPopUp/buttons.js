import { selectLabelExportFormat, exportLabels, closeExportLabelsPopUp } from './buttonEventHandlers';

function initialiseExportLabelsPopUp() {
  window.selectLabelExportFormat = selectLabelExportFormat;
  window.exportLabels = exportLabels;
  window.cancelExportLabels = closeExportLabelsPopUp;
}

export { initialiseExportLabelsPopUp as default };
