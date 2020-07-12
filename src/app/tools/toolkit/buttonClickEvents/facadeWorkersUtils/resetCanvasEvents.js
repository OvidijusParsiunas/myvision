import { setResetCanvasEventsToDefaultFunc } from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasEventsFacade';
import { resetCanvasEventsToDefault } from '../facade';

function assignResetCanvasEventsFuncToMouseEvents(canvas) {
  setResetCanvasEventsToDefaultFunc(resetCanvasEventsToDefault, canvas);
}

export { assignResetCanvasEventsFuncToMouseEvents as default };
