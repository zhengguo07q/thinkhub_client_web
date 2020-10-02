import * as React from 'react';

import PageThinkMind from '/Users/gary/git_thinkhub/thinkhub_client_web/src/pages/ThinkMind';

import store from './store';

const PageComponentName = PageThinkMind;

const PageProvider = store.Provider;
const StoreWrapperedPage = (props) => {
  return (
    <PageProvider>
      <PageComponentName {...props} />
    </PageProvider>
  );
};
(StoreWrapperedPage as any).pageConfig =
  (PageComponentName as any).pageConfig || ({} as any);
export default StoreWrapperedPage;
export { store };
