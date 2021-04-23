import HouMarkdown from "./src/main.vue";
HouMarkdown.install = function (Vue) {
  Vue.component(HouMarkdown.name, HouMarkdown);
};

export default HouMarkdown;
