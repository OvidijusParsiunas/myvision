function parseImageData(fileMetaData, event) {
  const image = new Image();
  image.src = event.target.result;
  return { fileFormat: 'image', body: { fileMetaData, imageElement: image } };
}

function parseJSON(fileMetaData, event) {
  const JSONObject = JSON.parse(event.target.result);
  return { fileFormat: 'annotations', body: { fileMetaData, annotationData: JSONObject } };
}

function parseCOCOJSONFiles(fileMetaData, event) {
  if (fileMetaData.type.startsWith('image/')) {
    return parseImageData(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.json')) {
    return parseJSON(fileMetaData, event);
  }
  return {};
}

export { parseCOCOJSONFiles as default };
