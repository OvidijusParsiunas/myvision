import TableUpdaterHandlerBuilder from './builders/tableUpdaterGenericBuilder.js';
import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager.js';
import validateFormat from '../formatValidators/VOCXMLValidator.js';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterForMultipleAnnotationFilesStrategy(datasetObjectManager, validateFormat);

export default tableUpdater;
