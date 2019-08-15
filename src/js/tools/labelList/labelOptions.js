const defaultLabelOptions = [
  { text: 'dog' },
  { text: 'cat' },
  { text: 'chicken' },
  { text: 'dolphin' },
  { text: 'panda' },
];

const labelOptions = defaultLabelOptions;

let limitLabelOptions = true;
let numberOfRemovedOptions = 0;
const maxLabelOptions = 6;

function terminateLimitIfUsingDefault(id) {
  const selectedOption = labelOptions[id];
  let contains = false;
  for (let i = 0; i < labelOptions.length; i += 1) {
    if (selectedOption.text === labelOptions[i].text) {
      contains = true;
      break;
    }
  }
  if (contains) {
    limitLabelOptions = false;
  }
}

function sendLabelOptionToFront(id) {
  terminateLimitIfUsingDefault(id);
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
    if (limitLabelOptions && (labelOptions.length > maxLabelOptions)) {
      labelOptions.pop();
      numberOfRemovedOptions += 1;
      if (numberOfRemovedOptions === 5) {
        limitLabelOptions = false;
      }
    }
  }
}

function getLabelOptions() {
  return labelOptions;
}

export { addToLabelOptions, getLabelOptions, sendLabelOptionToFront };
