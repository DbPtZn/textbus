import { ButtonConfig, HandlerType } from '../help';
import { ListCommander } from '../../commands/list-commander';

export const ulHandler: ButtonConfig = {
  type: HandlerType.Button,
  classes: ['tanbo-editor-icon-list'],
  tooltip: '无序列表',
  match: {
    tags: ['ul']
  },
  execCommand: new ListCommander('ul')
};