import DatasetObjectManagerBuilder from './builders/datasetObjectManagerBuilder';

const datasetObjectManager = DatasetObjectManagerBuilder
  .buildObjectManagerForMultipleAnnotationFilesInclClassesStrategy();

export default datasetObjectManager;
