import TableUpdaterHandlerBuilder from './builders/tableUpdaterInclClassesBuilder';
import datasetObjectManager from '../datasetObjectManagers/YOLOTXTDatasetObjectManager';
import validateFormat from '../formatValidators/YOLOTXTValidator';
import removeFileHandler from '../removeFileHandlers/YOLOTXTRemoveFileHandler';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterInclClassesTable(datasetObjectManager, validateFormat, removeFileHandler);

export default tableUpdater;
