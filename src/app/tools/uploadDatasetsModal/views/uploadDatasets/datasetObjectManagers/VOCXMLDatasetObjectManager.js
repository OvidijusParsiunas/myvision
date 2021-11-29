import DatasetObjectManagerBuilder from './builders/datasetObjectManagerBuilder.js';

const datasetObjectManager = DatasetObjectManagerBuilder
  .buildObjectManagerForMultipleAnnotationFilesStrategy();

export default datasetObjectManager;
