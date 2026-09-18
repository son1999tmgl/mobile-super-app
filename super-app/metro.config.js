const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Lấy config mặc định của Expo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Cho phép Metro theo dõi (watch) thư mục packages chứa các Mini App
config.watchFolders = [
  path.resolve(workspaceRoot, 'packages'),
];

// 2. Định tuyến node_modules để tránh duplicate React/React-Native instance
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Đảm bảo resolver ưu tiên đúng module
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
