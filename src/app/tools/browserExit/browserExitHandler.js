import { getSessionDirtyState, setSessionDirtyState } from '../state';
import initiateButtonPulseAnimation from '../utils/buttons/pulseAnimation';

function highlightExportDatasetsButton() {
  const beginAnimationImmediately = false;
  initiateButtonPulseAnimation(document.getElementById('export-datasets-button'),
    '#fff2b2', 'white', 3, beginAnimationImmediately);
}

function displayModal(event) {
  event.preventDefault();
  event.returnValue = '';
}

function initialiseBrowserExitHandler() {
  window.onbeforeunload = (event) => {
    if (getSessionDirtyState()) {
      displayModal(event);
      highlightExportDatasetsButton();
      setSessionDirtyState(false);
    }
  };
}

export { initialiseBrowserExitHandler as default };
