import { ButtonConfig, HandlerType } from '../help';
import { ToggleBlockCommander } from '../../commands/toggle-block-commander';

export const codeHandler: ButtonConfig = {
  type: HandlerType.Button,
  classes: ['tanbo-editor-icon-code'],
  tooltip: '代码',
  match: {
    tags: ['pre']
  },
  execCommand: new ToggleBlockCommander('pre')
};