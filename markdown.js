// Basic idea from https://github.com/vancanhuit/simple-markdown-parser/blob/master/scripts/parser.js
// Regexes copied from https://gist.github.com/Xeoncross/3361311
// A little more added using Markdown specification here: https://www.markdownguide.org/basic-syntax/#emphasis

// Not Implemented:
// Escaping backticks https://www.markdownguide.org/basic-syntax/#escaping-backticks
// Escaping characters: https://www.markdownguide.org/basic-syntax/#characters-you-can-escape
// There are a few goofy things with the paragraphs, but I think they look ok if you put in an extra space.

// Extras:
// Strikeout: surround characters with ~~.  eg: My favorite color is ~~not~~ red!
// You can also make a Horizontal Rule with ===========

export const render = function(text, rulesToUse) {
  if (!rulesToUse) rulesToUse = rules;
  text = '\n' + text + '\n';

  rulesToUse.forEach(function(rule) {
      text = text.replace(rule.regex, rule.replacement);
  });
  return text.trim();
}
export const rules = [
  // Standardize end of lines and tabs
  {regex:/(\r\n|\r)/gm, replacement:'\n'},
  {regex:/(\t)/gm, replacement:'    '},
  {regex:/(\f)/gm, replacement:''},

  // Headers
  {regex:/^# (.*)$/gm, replacement:'<h1>$1</h1>'},
  {regex:/^## (.*)$/gm, replacement:'<h2>$1</h2>'},
  {regex:/^### (.*)$/gm, replacement:'<h3>$1</h3>'},
  {regex:/^#### (.*)$/gm, replacement:'<h4>$1</h4>'},
  {regex:/^##### (.*)$/gm, replacement:'<h5>$1</h5>'},
  {regex:/^###### (.*)$/gm, replacement:'<h6>$1</h6>'},

  // Images: https://www.markdownguide.org/basic-syntax/#images-1
  {regex:/!\[([^\[]+)\]\(([^\)]+)( "(.*)")\)/gm, replacement:'<img src="$2" alt="$1!" title="$3">'}, // Images with titles first

  // Links: https://www.markdownguide.org/basic-syntax/#links
  {regex:/\[([^\[]+)\]\(([^\)]+)( "(.*)")\)/gm, replacement:'<a href="$2" title="$3">$1</a>'}, // Links with titles first
  {regex:/\[([^\[]+)\]\(([^\)]+)\)/gm, replacement:'<a href="$2">$1</a>'}, // Links without titles
  
  
  // Horizontal Rules: https://www.markdownguide.org/basic-syntax/#horizontal-rules
  // This rule needs to be before bold and italics
  {regex:/^[-=*]{3,}$/gm, replacement:'<hr/>'},

  // Bold and Italics
  {regex:/[*_]{3}(.*)[*_]{3}/gm, replacement:'<strong><em>$1</em></strong>'},

  // // Bold
  {regex:/[*_]{2}(.*)[*_]{2}/gm, replacement:'<strong>$1</strong>'},

  // // Italics
  {regex:/[*_]{1}(.*)[*_]{1}/gm, replacement:'<em>$1</em>'},

  // Strikeout
  {regex:/\~\~(.*)\~\~/gm, replacement:'<del>$1</del>'},

  // Unordered lists (bullets)
  {regex:/\* (.*)/gm, replacement:'<ul>\n\t<li>$1</li>\n</ul>'},
  {regex:/\+ (.*)/gm, replacement:'<ul>\n\t<li>$1</li>\n</ul>'},
  {regex:/\- (.*)/gm, replacement:'<ul>\n\t<li>$1</li>\n</ul>'},
  {regex:/\n<\/ul>\n<ul>/gm, replacement:''}, // Remove extra <ul>'s

  // Ordered Lists (this is a litle tricky because they could be nested one level)
  // Indented ol
  {regex:/    \d\. (.*)/gm, replacement:'    <ol>\n\t<li>$1</li>\n    </ol>'}, // First step
  {regex:/\n    <\/ol>\n    <ol>/gm, replacement:''}, // Remove extra <ul>'s

  // Normal ol
  {regex:/\d\. (.*)/gm, replacement:'<ol>\n\t<li>$1</li>\n</ol>'}, // First step
  {regex:/\n<\/ol>\n<ol>/gm, replacement:''}, // Remove extra <ul>'s

  // Fixing transitions between indentation
  {regex:/\n<\/ol>\n    <ol>/gm, replacement:'\n<ol>'}, // Remove extra <ul> entering indentation
  {regex:/\n    <\/ol>\n<ol>/gm, replacement:'\n<\/ol>'}, // Remove extra <ul> leaving indentation

  // Block quotes https://www.markdownguide.org/basic-syntax/#blockquotes-1
  {regex:/^\> (.*)$/gm, replacement:'<blockquote>$1</blockquote>'},
  {regex:/\n<\/blockquote><blockquote>/gm, replacement:''},

  // Line Breaks https://www.markdownguide.org/basic-syntax/#line-breaks
  {regex:/^(.*)  $/gm, replacement:'$1<br/>'},

  // Code https://www.markdownguide.org/basic-syntax/#code
  // I didnt implement escaping backticks
  {regex:/\`(.*)\`/gm, replacement:'<code>$1</code>'},  // insert code tags
  
  // Code Blocks: https://www.markdownguide.org/basic-syntax/#code-blocks
  {regex:/^    (.*)$/gm, replacement:'<code>$1</code>'},  // insert code tags
  {regex:/<\/code>\n<code>/gm, replacement:'\n'},  // remove extra code tags

  // Paragraphs
  {regex:/\n\n([^<])(.+)/g, replacement:"\n\n<p>$1$2"},
  {regex:/(.+)([^>])\n\n/g, replacement:"$1$2<\p>\n\n"},
];
export default renderMarkdown;