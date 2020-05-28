import 'core-js';
// import { createEditor } from './lib/create';
import {
  AudioTemplateTranslator,
  audioTool,
  blockBackgroundTool, BlockFormatter, BlockStyleFormatter,
  BlockTemplateTranslator,
  boldFormatter,
  boldTool,
  cleanTool,
  CodeTemplateTranslator,
  codeTool,
  colorFormatter,
  colorTool,
  DefaultHook,
  defaultStyleSheets,
  Editor,
  emojiTool,
  fontFamilyFormatter,
  fontFamilyTool,
  fontSizeFormatter,
  fontSizeTool,
  FormatAbstractData,
  FormatDelta,
  FormatEffect,
  headingTool,
  historyBackTool,
  historyForwardTool,
  ImageTemplateTranslator,
  imageTool,
  InlineFormatter,
  italicFormatter,
  italicTool,
  letterSpacingFormatter,
  letterSpacingTool,
  lineHeightFormatter,
  lineHeightTool,
  linkTool,
  ListTemplateTranslator,
  olTool,
  SingleTemplateTranslator,
  strikeThroughFormatter,
  strikeThroughTool, StyleFormatter,
  subscriptFormatter,
  subscriptTool,
  superscriptFormatter,
  superscriptTool,
  tableEditTool,
  TableTemplateTranslator,
  tableTool,
  textAlignTool,
  textBackgroundTool,
  textIndentFormatter,
  textIndentTool,
  ulTool,
  underlineFormatter,
  underlineTool,
  VideoTemplateTranslator,
  videoTool
} from './lib/public-api';

import './lib/assets/index.scss';
// import { Observable } from 'rxjs';

const a: FormatDelta = {
  abstractData: new FormatAbstractData(),
  state: FormatEffect.Invalid,
  renderer: new BlockStyleFormatter('a', {}),
  // startIndex: 0,
  // endIndex: 9
}

const editor = new Editor('#editor', {
  theme: 'dark',
  styleSheets: defaultStyleSheets,
  hooks: [
    new DefaultHook()
  ],
  templateTranslators: [
    new ListTemplateTranslator('ul'),
    new ListTemplateTranslator('ol'),
    new BlockTemplateTranslator('div'),
    new BlockTemplateTranslator('p'),
    new SingleTemplateTranslator('br'),
    new CodeTemplateTranslator(),
    new AudioTemplateTranslator(),
    new VideoTemplateTranslator(),
    new ImageTemplateTranslator(),
    new TableTemplateTranslator()
  ],
  formatters: [
    fontFamilyFormatter,
    boldFormatter,
    italicFormatter,
    strikeThroughFormatter,
    underlineFormatter,
    fontSizeFormatter,
    lineHeightFormatter,
    letterSpacingFormatter,
    textIndentFormatter,
    colorFormatter,
    subscriptFormatter,
    superscriptFormatter,
  ],
  toolbar: [
    [historyBackTool, historyForwardTool],
    [headingTool],
    [boldTool, italicTool, strikeThroughTool, underlineTool],
    [codeTool],
    [olTool, ulTool],
    [fontSizeTool, lineHeightTool, letterSpacingTool, textIndentTool],
    [subscriptTool, superscriptTool],
    [colorTool, textBackgroundTool, blockBackgroundTool, emojiTool],
    [fontFamilyTool],
    [linkTool, imageTool, audioTool, videoTool],
    [textAlignTool],
    [tableTool, tableEditTool],
    [cleanTool]
  ]
});

editor.setContents(`
<pre lang="Typescript" style="font-size: 15px;"><strong style="color: rgb(51, 51, 51);">import</strong>&nbsp;{ createEditor }&nbsp;<strong style="color: rgb(51, 51, 51);">from</strong>&nbsp;<span style="color: rgb(221, 17, 68);">'@tanbo/tbus'</span>;<br><br><strong style="color: rgb(51, 51, 51);">const</strong>&nbsp;editor = createEditor(<span style="color: rgb(0, 134, 179);">document</span>.getElementById(<span style="color: rgb(221, 17, 68);">'editor'</span>));<br>editor.onChange.subscribe(result =&gt; {<br>&nbsp;&nbsp;<span style="color: rgb(0, 134, 179);">console</span>.log(result);<br>})<br></pre>
`);

// const editor = createEditor('#editor', {
//   theme: 'dark',
//   usePaperModel: true,
//   uploader(type: string): string | Promise<string> | Observable<string> {
//     const fileInput = document.createElement('input');
//     fileInput.setAttribute('type', 'file');
//     fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
//     fileInput.style.cssText = 'position: absolute; left: -9999px; top: -9999px; opacity: 0';
//     document.body.appendChild(fileInput);
//     fileInput.click();
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve('/test')
//       }, 3000)
//     })
//   },
//   content: ``
// });

// editor.updateContentHTML('<p>p1<span>p-span</span></p><span>span3</span><span>span4</span><p>p2</p><span>span1</span><span>span2</span>')
//
// const box = document.getElementById('box');
// editor.onChange.subscribe(result => {
//   console.log(result);
//   box.innerText = result;
// });

// setTimeout(() => {
//   editor.setContents(`<html><body><div>测试</div></body></html>`)
// }, 3000);
