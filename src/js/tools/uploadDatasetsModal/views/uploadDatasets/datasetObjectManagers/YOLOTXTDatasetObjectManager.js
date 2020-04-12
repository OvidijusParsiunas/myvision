import DatasetObjectManagerBuilder from './datasetObjectManagerBuilder';

const datasetObjectManager = DatasetObjectManagerBuilder
  .buildObjectManagerForMultipleAnnotationFilesInclClassesStrategy();

export default datasetObjectManager;
