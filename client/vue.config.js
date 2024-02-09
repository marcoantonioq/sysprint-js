const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Impressoras",
    themeColor: "#4caf50",
  },
});
