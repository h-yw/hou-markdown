<template>
  <div class="markdown-body" v-html="parseMarkdown"></div>
</template>

<script>
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import Anchor from "markdown-it-anchor";
import Container from "markdown-it-container";
import Emoji from "markdown-it-emoji";
import Twemoji from "twemoji";
import Sup from "markdown-it-sup";
import Mark from "markdown-it-mark";
import TaskLists from "markdown-it-task-lists";
import Deflist from "markdown-it-deflist";
import Ins from "markdown-it-ins";
import Abbr from "markdown-it-abbr";

export default {
  name: "HouMarkdown",
  props: {
    source: {
      type: String,
      default: null,
    },
    parseType: {
      type: String,
      default: "default",
      validator: (value) => {
        return ["commonmark", "default", "zero"].indexOf(value) !== -1;
      },
    },
    imgSize: {
      type: String,
      default: "25%",
    },
    lineNumCode: {
      type: Boolean,
      default: true,
    },
    anchor: {
      type: Boolean,
      default: true,
    },
    anchorSymbol: {
      type: String,
      default: "¶",
    },
    taskEnabled: {
      type: Boolean,
      default: true,
    },
  },
  // mixins: [mixin],
  data() {
    return {
      data: this.source,
    };
  },
  computed: {
    parseMarkdown() {
      return this.markdown();
    },
  },
  methods: {
    markdown() {
      let markdownIt = new MarkdownIt(this.parseType, {
        html: false,
        xhtmlOut: false,
        linkify: true,
        typographer: true,
        quotes: "“”‘’",
        highlight: (str, lang) => this.highLightCode(str, lang),
      });
      markdownIt.enable(["link", "image"]);
      if (this.anchor) this.addAnchor(markdownIt);
      // this.addContainer(markdownIt);
      this.addEmaoji(markdownIt);
      this.setImage(markdownIt);
      this.setEmoji(markdownIt);
      this.addSup(markdownIt);
      this.addMarker(markdownIt);
      this.addTaskLists(markdownIt);
      this.addDeflist(markdownIt);
      this.addIns(markdownIt);
      this.addAbbr(markdownIt);
      let res = markdownIt.render(this.source);
      return res;
    },
    // 代码高亮
    highLightCode(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        let preCode = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
        if (this.lineNumCode) {
          return this.lineNumber(preCode, lang);
        } else {
          return `<pre class="hljs"><code>${preCode}</code></pre>`;
        }
      }
      return `<pre class="hljs"><code>${str}</code></pre>`;
    },
    lineNumber(str, lang) {
      const lines = str.split(/\n/).slice(0, -1);
      let html = lines
        .map((item, index) => {
          return `<li><span class="line-num" data-line="${
            index + 1
          }"></span>${item}</li>`;
        })
        .join("");
      html = "<ol>" + html + "</ol>";
      if (lines.length) {
        html += `<b class="name">${lang}</b>`;
      }
      return `<pre class="hljs"><code>${html}</code></pre>`;
    },
    //  Anchor
    addAnchor(markdownit) {
      markdownit.use(Anchor, {
        level: 1,
        uniqueSlugStartIndex: 1,
        permalink: true,
        permalinkClass: "anchor",
        permalinkSymbol: this.anchorSymbol,
        permalinkBefore: "true",
      });
    },
    // container 不能工作
    addContainer(markdownit) {
      markdownit.use(Container, "waring", {
        validate: function (params) {
          return params.trim().match(/^spoiler\s+(.*)$/);
        },
        render: function (tokens, idx) {
          var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
          if (tokens[idx].nesting === 1) {
            // opening tag
            return (
              "<details><summary>" +
              markdownit.utils.escapeHtml(m[1]) +
              "</summary>\n"
            );
          } else {
            // closing tag
            return "</details>\n";
          }
        },
      });
    },
    //  上标 2^2^
    addSup(markdownit) {
      markdownit.use(Sup);
    },
    // marker
    addMarker(markdownit) {
      markdownit.use(Mark);
    },
    // 任务列表
    addTaskLists(markdownit) {
      markdownit.use(TaskLists, {
        enabled: this.taskEnabled,
        label: true,
        labelAfter: true,
      });
    },
    // dl
    addDeflist(markdownit) {
      markdownit.use(Deflist);
    },
    //  ins
    addIns(markdownit) {
      markdownit.use(Ins);
    },
    // abbr
    addAbbr(markdownit) {
      markdownit.use(Abbr);
    },
    //  解析表情
    addEmaoji(markdownit) {
      markdownit.use(Emoji);
    },
    setEmoji(markdownit) {
      markdownit.renderer.rules.emoji = (token, idx) => {
        return Twemoji.parse(token[idx].content, {});
      };
    },
    setImage(markdownIt) {
      markdownIt.renderer.rules.image = (tokens, idx, options, env, slf) => {
        let token = tokens[idx];
        token.attrPush(["style", `width:${this.imgSize}`]);
        // console.log(token, idx, options, env, slf);
        return slf.renderToken(tokens, idx, options);
      };
    },
  },
  mounted() {},
  beforeUnmount() {},
  unmounted() {},
};
</script>

<style scoped lang="scss">
@import "~highlight.js/styles/atom-one-dark-reasonable.css";
</style>
