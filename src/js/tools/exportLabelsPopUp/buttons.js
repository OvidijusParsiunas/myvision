import selectLabelExportFormat from './buttonEventHandlers';

function initialiseExportLabelsPopUp() {
  window.selectLabelExportFormat = selectLabelExportFormat;
}

export { initialiseExportLabelsPopUp as default };
