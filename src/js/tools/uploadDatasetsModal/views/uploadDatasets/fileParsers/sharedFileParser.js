function parseImageData(fileMetaData, event) {
  const image = new Image();
  image.src = event.target.result;
  return { fileFormat: 'image', body: { fileMetaData, imageElement: image } };
}

function parseJSON(fileMetaData, event) {
  try {
    const JSONObject = JSON.parse(event.target.result);
    return { fileFormat: 'annotation', body: { fileMetaData, annotationData: JSONObject } };
  } catch (errorMessage) {
    return {
      fileFormat: 'annotation',
      body: { fileMetaData },
      errorObj: { error: true, message: `Invalid JSON - ${errorMessage}` },
    };
  }
}

function parseAllFiles(fileMetaData, event) {
  if (fileMetaData.type.startsWith('image/')) {
    return parseImageData(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.json')) {
    return parseJSON(fileMetaData, event);
  }
  return {};
}

export { parseAllFiles as default };
