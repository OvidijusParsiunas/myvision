import { getExportDatasetsPopupOpenState } from '../state';
import IS_FIREFOX from '../utils/browserType';

// The `refreshExportDatasetsPopover` function checks if the export datasets popup is open.
// If it's not open, it hides and displays the popup parent element with a delay,
// then hides it again if the popup is still not open.
function refreshExportDatasetsPopover() {
  if (!getExportDatasetsPopupOpenState()) {
    const exportDatasetsPopupParentElement = document.getElementById('export-datasets-popup-parent');
    exportDatasetsPopupParentElement.style.visibility = 'hidden'; // Hide the element
    exportDatasetsPopupParentElement.style.display = 'block'; // Show the element
    setTimeout(() => {
      if (!getExportDatasetsPopupOpenState()) {
        exportDatasetsPopupParentElement.style.display = 'none'; // Hide the element
      }
      exportDatasetsPopupParentElement.style.visibility = ''; // Reset the visibility
    }, 0);
  }
}

// The `loadSuccess` function is called when the custom fonts are loaded successfully.
// It refreshes the export datasets popover.
function loadSuccess() {
  refreshExportDatasetsPopover();
}

// The `loadFailed` function is called when there is an error loading the custom fonts.
// It logs an error message to the console.
function loadFailed() {
  console.error('Failed to load custom fonts');
}

// The `firefoxBugFix` function is a workaround for a bug in Firefox where the loading of a script
// can prevent elements from being dynamic and the browser from rendering them when screen dimensions change.
// It creates a new div, sets its innerHTML to a link element with the given URL and relationship,
// and appends it to the document head.
function firefoxBugFix(document, url, relationship) {
  const div = document.createElement('div');
  div.innerHTML = `<link rel="${relationship}" href="${url}">`;
  document.head.appendChild(div);
}

// The `downloadFonts` function downloads custom fonts from a Google Fonts URL.
// It creates a new link element with the given URL and relationship, sets its onload and onerror functions,
// and appends it to the document head. If the browser is Firefox, it also calls the `firefoxBugFix` function.
export function downloadFonts() {
  const url = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap';
  const relationship = 'stylesheet';
  const link = document.createElement('link');
  link.onload = loadSuccess;
  link.onerror = loadFailed;
  link.rel = relationship;
  link.href = url;
  document.head.appendChild(link);
  if (IS_FIREFOX) firefoxBugFix(document, url, relationship);
}

// Export the `downloadFonts` function as the default export.
export { downloadFonts as default };
