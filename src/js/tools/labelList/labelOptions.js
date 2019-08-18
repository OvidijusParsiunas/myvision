const defaultLabelOptions = [
  { text: 'dog', color: { highlight: 'red', default: 'yellow' } },
  { text: 'cat', color: { highlight: 'black', default: 'grey' } },
  { text: 'chicken', color: { highlight: 'blue', default: 'purple' } },
  { text: 'dolphin', color: 'yellow' },
  { text: 'panda', color: 'purple' },
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

function generateLabelColor() {
  return { default: 'blue', highlight: 'green' };
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
    const color = generateLabelColor();
    labelOptions.unshift({ text, color });
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

function getLabelColor(text) {
  for (let i = 0; i < labelOptions.length; i += 1) {
    if (labelOptions[i].text === text) {
      return labelOptions[i].color;
    }
  }
  return { highlight: 'rgba(255,0,0,0.2)', default: 'rgba(255,0,0,0.01)' };
}

export {
  addToLabelOptions, getLabelOptions,
  sendLabelOptionToFront, getLabelColor,
};
