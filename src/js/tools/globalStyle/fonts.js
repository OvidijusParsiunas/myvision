import { getExportDatasetsPopUpOpenState } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';

function refreshExportLabelsPopover() {
  if (!getExportDatasetsPopUpOpenState()) {
    const exportLabelsPopupParentElement = document.getElementById('export-labels-popup-parent');
    exportLabelsPopupParentElement.style.visibility = 'hidden';
    exportLabelsPopupParentElement.style.display = 'block';
    setTimeout(() => {
      if (!getExportDatasetsPopUpOpenState()) {
        exportLabelsPopupParentElement.style.display = 'none';
      }
      exportLabelsPopupParentElement.style.visibility = '';
    }, 0);
  }
}

function loadSuccess() {
  refreshExportLabelsPopover();
}

function loadFailed() {
  console.log('Failed to load custom fonts');
}

function downloadFonts() {
  // potential alternative
  // <link href="https://fonts.googleapis.com/css?family=Alef|Archivo|Average|Barlow+Semi+Condensed|Basic|Cantarell|Chivo|Hind+Madurai|IBM+Plex+Serif|K2D|M+PLUS+1p|Mada|Palanquin|Pavanam|Source+Sans+Pro|Yantramanav&display=swap" rel="stylesheet">
  const url = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap';
  const link = document.createElement('link');
  link.onload = loadSuccess;
  link.onerror = loadFailed;
  link.href = url;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

export { downloadFonts as default };
