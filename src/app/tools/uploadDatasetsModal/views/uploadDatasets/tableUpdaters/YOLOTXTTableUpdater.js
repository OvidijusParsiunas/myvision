import TableUpdaterHandlerBuilder from './builders/tableUpdaterInclClassesBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/YOLOTXTDatasetObjectManager.js';
import validateFormat from '../formatValidators/YOLOTXTValidator.js';
import removeFileHandler from '../removeFileHandlers/YOLOTXTRemoveFileHandler.js';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterInclClassesTable(datasetObjectManager, validateFormat, removeFileHandler);

export default tableUpdater;
