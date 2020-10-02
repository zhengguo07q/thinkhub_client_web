import { createStore, Models } from '@ice/store';

import user from '/Users/gary/git_thinkhub/thinkhub_client_web/src/models/user';

interface AppModel extends Models {
  user: typeof user;
}

const appModel: AppModel = { user };
const store = createStore(appModel);

export { appModel, store, createStore };
