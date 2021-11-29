import DatasetObjectManagerBuilder from './builders/datasetObjectManagerBuilder.js';

const datasetObjectManager = DatasetObjectManagerBuilder
  .buildObjectManagerForMultipleAnnotationFilesInclClassesStrategy();

export default datasetObjectManager;
