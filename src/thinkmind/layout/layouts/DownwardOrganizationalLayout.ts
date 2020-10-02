import { BaseLayout } from './BaseLayout';
import { nonLayeredTidyTreeAlgorithms } from '../algorithms/NonLayeredTidyTreeAlgorithms';

export class DownwardOrganizationalLayout extends BaseLayout {
  doLayout () {
    return nonLayeredTidyTreeAlgorithms(this.root, false);
  }
}

