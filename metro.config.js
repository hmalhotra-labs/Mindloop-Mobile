module.exports = {
  resolver: {
    assetExts: ["bin", "txt", "jpg", "png", "json", "gif", "webp", "svg"],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

