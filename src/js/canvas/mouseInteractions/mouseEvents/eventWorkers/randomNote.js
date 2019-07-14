let action = null;

function assignAction(actionArg) {
  action = actionArg;
}

// gets repeated multiple times
function doSomething() {
  if (action === 'walk') {
    walk();
  } else if (action === 'drive') {
    drive();
  } else if (action === 'fly') {
    fly();
  }
}

function doSomething

let actionFunc = null;

function assignActionFunc(actionFuncArg) {
  actionFunc = actionFuncArg;
}

// gets repeated multiple times
function doSomething() {
  actionFunc();
}
