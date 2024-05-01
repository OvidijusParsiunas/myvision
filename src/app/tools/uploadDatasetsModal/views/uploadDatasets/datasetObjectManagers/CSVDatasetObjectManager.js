// Import the DatasetObjectManagerBuilder module from './builders/datasetObjectManagerBuilder'
import DatasetObjectManagerBuilder from './builders/datasetObjectManagerBuilder';

// Create an instance of the object manager using the buildObjectManagerForOneAnnotationFileStrategy method
const datasetObjectManager = DatasetObjectManagerBuilder
  .buildObjectManagerForOneAnnotationFileStrategy();

// Export the datasetObjectManager instance as the default export
export default datasetObjectManager;

