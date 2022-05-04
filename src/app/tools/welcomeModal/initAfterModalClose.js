import { initialiseMachineLearningModal } from '../machineLearningModal/views/viewManager';
import { initialiseUploadDatasetsModal } from '../uploadDatasetsModal/views/viewManager';

// components that contain text initialisation logic which is determnined by the language
function initialiseLanguageBoundComponents() {
  initialiseUploadDatasetsModal();
  initialiseMachineLearningModal();
}

export { initialiseLanguageBoundComponents as default };
