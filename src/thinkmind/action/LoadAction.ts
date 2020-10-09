import { OrderedSet } from 'immutable'
import { Action } from './Action'
import { NodeLayer } from '../scene/NodeLayer'
import { AppHistory } from '../scene/AppHistory';

export default class LoadAction extends Action {
  prevState: NodeLayer;

  constructor(readonly newState: NodeLayer) {
    super()
  }

  prepare(h: AppHistory): AppHistory {
    this.prevState = h.state;
    return h;
  }

  next(state: NodeLayer) {
    return state.merge(this.newState).set('selIdSet', OrderedSet());
  }

  prev(state: NodeLayer) {
    return this.prevState;
  }

  getMessage() {
    return 'Load.';
  }
}
