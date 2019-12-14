import { selectLabelExportFormat, exportLabels } from './buttonEventHandlers';

function initialiseExportLabelsPopUp() {
  window.selectLabelExportFormat = selectLabelExportFormat;
  window.exportLabels = exportLabels;
}

export { initialiseExportLabelsPopUp as default };
