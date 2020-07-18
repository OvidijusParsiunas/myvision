import TableUpdaterHandlerBuilder from './builders/tableUpdaterGenericBuilder';
import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager';
import validateFormat from '../formatValidators/VOCXMLValidator';

const tableUpdater = TableUpdaterHandlerBuilder
  .buildTableUpdaterForMultipleAnnotationFilesStrategy(datasetObjectManager, validateFormat);

export default tableUpdater;
