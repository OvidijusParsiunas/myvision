import { getSessionDirtyState, setSessionDirtyState } from '../state';

function initialiseBrowserExitHandler() {
  window.onbeforeunload = (event) => {
    if (getSessionDirtyState()) {
      event.preventDefault();
      event.returnValue = '';
      setSessionDirtyState(false);
    }
  };
}

export { initialiseBrowserExitHandler as default };
