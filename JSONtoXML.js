function convertJSONToXML(JSONObject){
  let XMLObject = "";
  return iterateObjectProperties(JSONObject);
}

function iterateObjectProperties(JSONObject){
  let tagString = "";
  for(let key in JSONObject){
    if(typeof(JSONObject[key]) === 'object'){
      tagString += "<" + key + ">" + iterateObjectProperties(JSONObject[key]) + "</" + key + ">";
    }
    else{
      tagString += "<" + key + ">" + JSONObject[key] + "</" + key + ">";
    }
  }
  return tagString;
}
