import { getDatasetObject } from '../datasetObjectManagers/COCOJSONDatasetObjectManager';

function assembleFinalObjectFromCOCOJSON() {
  return getDatasetObject();
}

export { assembleFinalObjectFromCOCOJSON as default };
