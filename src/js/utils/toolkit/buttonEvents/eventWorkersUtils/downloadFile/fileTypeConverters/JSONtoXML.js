function iterateObjectProperties(JSONObject) {
  let tagString = '';
  Object.keys(JSONObject).forEach((key) => {
    if (typeof (JSONObject[key]) === 'object') {
      tagString += `<${key}>${iterateObjectProperties(JSONObject[key])}</${key}>`;
    } else {
      tagString += `<${key}>${JSONObject[key]}</${key}>`;
    }
  });
  return tagString;
}

function convertJSONToXML(JSONObject) {
  return iterateObjectProperties(JSONObject);
}

export { convertJSONToXML as default };
