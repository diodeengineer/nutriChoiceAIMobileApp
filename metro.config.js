const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Allow Metro to bundle .bin files
config.resolver.assetExts.push("bin");

module.exports = config;
