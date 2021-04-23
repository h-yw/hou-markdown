module.exports = {
  pages: {
    index: {
      entry: "example/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
  },
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugins.delete("html");
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
  },
};
