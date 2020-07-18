import DatasetObjectManagerBuilder from './builders/datasetObjectManagerBuilder';

const datasetObjectManager = DatasetObjectManagerBuilder
  .buildObjectManagerForMultipleAnnotationFilesStrategy();

export default datasetObjectManager;
