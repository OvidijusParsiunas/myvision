const labelOptions = [];
// const maxLabelOptions = 8;

function sendLabelOptionToFront(id) {
  const firstObjectRef = labelOptions[id];
  for (let i = id; i > 0; i -= 1) {
    labelOptions[i] = labelOptions[i - 1];
  }
  labelOptions[0] = firstObjectRef;
}

function addToLabelOptions(text) {
  let foundAtIndex;
  for (let i = 0; i < labelOptions.length; i += 1) {
    if (labelOptions[i].text === text) {
      foundAtIndex = i;
      break;
    }
  }
  if (foundAtIndex !== undefined) {
    sendLabelOptionToFront(foundAtIndex);
  } else {
    labelOptions.unshift({ text });
    // if (labelOptions.length > maxLabelOptions) {
    //   labelOptions.pop();
    // }
  }
}

// function updateArray(elementId) {
//  let movableObject = dropdownOptions[elementId];
//   let lowerValue = dropdownOptions[0];
//    for (let i = 1; i <= elementId; i += 1) {
//     let tempValue = dropdownOptions[i];
//     dropdownOptions[i] = lowerValue;
//     lowerValue = tempValue;
//    }
//   dropdownOptions[0] = movableObject;
//   alert(dropdownOptions);
// }

function getLabelOptions() {
  return labelOptions;
}

export { addToLabelOptions, getLabelOptions, sendLabelOptionToFront };
