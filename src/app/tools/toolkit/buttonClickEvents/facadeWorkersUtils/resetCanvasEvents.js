import { setResetCanvasEventsToDefaultFunc } from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasEventsFacade.js';
import { resetCanvasEventsToDefault } from '../facade.js';

function assignResetCanvasEventsFuncToMouseEvents(canvas) {
  setResetCanvasEventsToDefaultFunc(resetCanvasEventsToDefault, canvas);
}

export { assignResetCanvasEventsFuncToMouseEvents as default };
