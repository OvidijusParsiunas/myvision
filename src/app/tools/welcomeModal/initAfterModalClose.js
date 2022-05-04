import { initialiseMachineLearningModal } from '../machineLearningModal/views/viewManager';
import { initialiseUploadDatasetsModal } from '../uploadDatasetsModal/views/viewManager';
import { setLanguageFontDelta } from '../globalStyling/customCssProperties';

// components that contain text initialisation logic which is determnined by the language
function initialiseLanguageBoundComponents() {
  initialiseUploadDatasetsModal();
  initialiseMachineLearningModal();
  setLanguageFontDelta();
}

export { initialiseLanguageBoundComponents as default };
