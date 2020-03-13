import { insertRowToAnnotationsTable, insertRowToImagesTable } from '../style';

function updateCOCOJSONTables(fileMetaData, validationResult) {
  const fileType = fileMetaData.type;
  const fileName = fileMetaData.name;
  if (fileType.startsWith('image/')) {
    insertRowToImagesTable(fileName, validationResult);
  }
  if (fileName.endsWith('.json')) {
    insertRowToAnnotationsTable(fileName, validationResult);
  }
}

export { updateCOCOJSONTables as default };
