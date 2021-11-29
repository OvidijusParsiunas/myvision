import { interruptAllCanvasEvents } from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState.js';
import { getPolygonDrawingInProgressState, getContinuousDrawingState } from '../../state.js';
import { removeActiveButtonPopover } from '../../globalStyling/buttons/popovers.js';
import isLeftMouseButtonClick from '../../utils/buttons/clickEvents.js';
import { isLabelling } from '../../labellerModal/labellingProcess.js';
import isElement from '../../utils/elementType.js';

function interruptNewShapeDrawingWthFunc1OrExecFunc2(func1, func2, element, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  if (isElement(element) && element.classList.contains('toolkit-button-disabled')) return;
  removeActiveButtonPopover();
  if ((getPolygonDrawingInProgressState() || isLabelling()) && !getContinuousDrawingState()) {
    interruptAllCanvasEvents();
    func1();
  } else if (func2) {
    func2();
  }
}

export { interruptNewShapeDrawingWthFunc1OrExecFunc2 as default };
