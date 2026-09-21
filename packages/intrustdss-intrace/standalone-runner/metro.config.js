const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const packageRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Theo dõi projectRoot và mã nguồn src của mini app
config.watchFolders = [
  projectRoot,
  path.resolve(packageRoot, 'src'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => path.resolve(projectRoot, 'node_modules', name),
  }
);

module.exports = config;

