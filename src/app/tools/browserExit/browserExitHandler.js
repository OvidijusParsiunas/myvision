import { getSessionDirtyState, setSessionDirtyState } from '../state';
import { initiateButtonPulseAnimation } from '../utils/buttons/pulseAnimation';

function highlightExportDatasetsButton() {
  const beginAnimationImmediately = false;
  initiateButtonPulseAnimation(document.getElementById('export-datasets-button'),
    'rgb(253 234 180)', 'white', 4, beginAnimationImmediately);
}
// rgb(253 232 174)

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
