import { selectLabelExportFormat, exportLabels, closeExportLabelsPopUp } from './buttonEventHandlers';
import { initialiseExportLabelsPopupElements, displayCheckBoxInformationPopover, removeCheckBoxInformationPopover } from './style';

function initialiseExportLabelsPopUp() {
  initialiseExportLabelsPopupElements();
  window.selectLabelExportFormat = selectLabelExportFormat;
  window.exportLabels = exportLabels;
  window.cancelExportLabels = closeExportLabelsPopUp;
  window.displayCheckBoxInformationPopover = displayCheckBoxInformationPopover;
  window.removeCheckBoxInformationPopover = removeCheckBoxInformationPopover;
}

export { initialiseExportLabelsPopUp as default };
