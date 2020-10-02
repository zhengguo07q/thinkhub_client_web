function loadRuntimeModules(runtime) {
  runtime.loadModule(
    require('/Users/gary/git_thinkhub/thinkhub_client_web/node_modules/build-plugin-app-core/lib/runtime.js')
  );

  runtime.loadModule(
    require('/Users/gary/git_thinkhub/thinkhub_client_web/node_modules/build-plugin-ice-router/lib/runtime.js')
  );

  runtime.loadModule(
    require('/Users/gary/git_thinkhub/thinkhub_client_web/node_modules/build-plugin-ice-logger/lib/runtime.js')
  );

  runtime.loadModule(
    require('/Users/gary/git_thinkhub/thinkhub_client_web/node_modules/build-plugin-ice-store/lib/runtime.js')
  );
}

export default loadRuntimeModules;
