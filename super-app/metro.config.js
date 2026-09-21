const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Lấy config mặc định của Expo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Cho phép Metro theo dõi cả projectRoot và thư mục packages chứa các Mini App
config.watchFolders = [
  projectRoot,
  path.resolve(workspaceRoot, 'packages'),
];

// 2. Định tuyến node_modules để module resolution luôn tìm thấy dependencies
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// 3. Đảm bảo các packages con luôn resolve đúng các thư viện singleton (react, react-native, expo...)
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => path.resolve(projectRoot, 'node_modules', name),
  }
);

config.resolver.disableHierarchicalLookup = false;

module.exports = config;

