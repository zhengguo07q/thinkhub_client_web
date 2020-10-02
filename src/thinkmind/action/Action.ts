import { NodeLayer } from '../layer/NodeLayer'
import { AppHistory } from '../scene/AppHistory';

export abstract class Action {
  abstract next(state: NodeLayer): NodeLayer
  abstract prev(state: NodeLayer): NodeLayer

  prepare(appHistory: AppHistory): AppHistory {
    return appHistory
  }

  getMessage() {
    return this.constructor.name
  }
}
