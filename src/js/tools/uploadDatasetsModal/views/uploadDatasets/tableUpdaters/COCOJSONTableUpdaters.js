import { insertRowToAnnotationsTable, insertRowToImagesTable } from '../style';

function updateCOCOJSONTables(fileMetaData) {
  const fileType = fileMetaData.type;
  const fileName = fileMetaData.name;
  if (fileType.startsWith('image/')) {
    insertRowToImagesTable(fileName);
  }
  if (fileName.endsWith('.json')) {
    insertRowToAnnotationsTable(fileName);
  }
}

export { updateCOCOJSONTables as default };
