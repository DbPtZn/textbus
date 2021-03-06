import {
  BranchComponent,
  EventType,
  Fragment,
  ComponentReader,
  VElement,
  ViewData, SlotRendererFn,
} from '../core/_api';
import { BlockComponent, breakingLine, BrComponent } from '../components/_api';
import { ComponentExample } from '../workbench/component-stage';
import { Subscription } from 'rxjs';

class TodoListFragment extends Fragment {
  constructor(public active: boolean, public disabled: boolean) {
    super();
  }
}

export class TodoListComponentReader implements ComponentReader {
  match(element: HTMLElement): boolean {
    return element.nodeName.toLowerCase() === 'tb-todo-list';
  }

  read(element: HTMLElement): ViewData {
    const listConfig = Array.from(element.children).map(child => {
      const stateElement = child.querySelector('span.tb-todo-list-state');
      return {
        childSlot: child.querySelector('.tb-todo-list-content') as HTMLElement,
        slot: new TodoListFragment(
          stateElement?.classList.contains('tb-todo-list-state-active'),
          stateElement?.classList.contains('tb-todo-list-state-disabled'))
      }
    })
    const component = new TodoListComponent(listConfig.map(i => i.slot));
    return {
      component: component,
      slotsMap: listConfig.map(i => {
        return {
          toSlot: i.slot,
          from: i.childSlot
        }
      })
    };
  }
}

export class TodoListComponent extends BranchComponent<TodoListFragment> {
  private subs: Subscription[] = [];
  private stateCollection = [{
    active: false,
    disabled: false
  }, {
    active: true,
    disabled: false
  }, {
    active: false,
    disabled: true
  }, {
    active: true,
    disabled: true
  }]

  constructor(public listConfigs: TodoListFragment[]) {
    super('tb-todo-list');
    this.slots.push(...listConfigs);
  }

  render(isOutputMode: boolean, slotRendererFn: SlotRendererFn): VElement {
    const list = new VElement('tb-todo-list');

    this.slots.forEach(slot => {

      const item = new VElement('div', {
        classes: ['tb-todo-list-item']
      });
      const btn = new VElement('div', {
        classes: ['tb-todo-list-btn']
      })
      const state = new VElement('span', {
        classes: ['tb-todo-list-state']
      });
      if (slot.active) {
        state.classes.push('tb-todo-list-state-active');
      }
      if (slot.disabled) {
        state.classes.push('tb-todo-list-state-disabled');
      }
      btn.appendChild(state);
      item.appendChild(btn);
      const content = new VElement('div', {
        classes: ['tb-todo-list-content']
      });
      item.appendChild(slotRendererFn(slot, content));

      list.appendChild(item);
      if (!isOutputMode) {
        this.handleEnter();
        state.onRendered = element => {
          element.addEventListener('click', () => {
            const i = (this.getStateIndex(slot.active, slot.disabled) + 1) % 4;
            const newState = this.stateCollection[i];
            slot.active = newState.active;
            slot.disabled = newState.disabled;
            slot.active ?
              element.classList.add('tb-todo-list-state-active') :
              element.classList.remove('tb-todo-list-state-active');
            slot.disabled ?
              element.classList.add('tb-todo-list-state-disabled') :
              element.classList.remove('tb-todo-list-state-disabled');
          })
        }
      }
    })
    return list;
  }

  clone(): TodoListComponent {
    const configs = this.slots.map(i => {
      return i.clone()
    });
    return new TodoListComponent(configs as TodoListFragment[]);
  }

  private handleEnter() {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = this.slots.map((slot, index) => {
      return slot.events.subscribe(event => {
        if (event.type === EventType.onEnter) {
          event.stopPropagation();

          const firstRange = event.selection.firstRange;

          if (slot === this.slots[this.slots.length - 1]) {
            const lastContent = slot.getContentAtIndex(slot.contentLength - 1);
            if (slot.contentLength === 0 ||
              slot.contentLength === 1 && lastContent instanceof BrComponent) {
              this.slots.pop();
              const parentFragment = this.parentFragment;
              const p = new BlockComponent('p');
              p.slot.append(new BrComponent());
              parentFragment.insertAfter(p, this);
              firstRange.setStart(p.slot, 0);
              firstRange.collapse();
              return;
            }
          }

          const next = new TodoListFragment(slot.active, slot.disabled);
          next.from(breakingLine(slot, firstRange.startIndex));

          this.slots.splice(index + 1, 0, next);
          firstRange.startFragment = firstRange.endFragment = next;
          firstRange.startIndex = firstRange.endIndex = 0;
        }
      })
    })

  }

  private getStateIndex(active: boolean, disabled: boolean) {
    for (let i = 0; i < 4; i++) {
      const item = this.stateCollection[i];
      if (item.active === active && item.disabled === disabled) {
        return i;
      }
    }
    return -1;
  }
}

export const todoListComponentExample: ComponentExample = {
  name: '待办事项列表',
  example: `<img alt="默认图片" src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg width="100" height="70" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ><g><rect fill="#fff" height="100%" width="100%"/></g><defs><g id="item"><rect fill="#fff" stroke="#1296db" height="8" width="8" rx="2" x="15" y="12"/><text font-family="Helvetica, Arial, sans-serif" font-size="8" x="28" y="19"  stroke-width="0" stroke="#000" fill="#000000">待办事项...</text></g></defs><use xlink:href="#item"></use><use xlink:href="#item" transform="translate(0, 12)"></use><use xlink:href="#item" transform="translate(0, 24)"></use><use xlink:href="#item" transform="translate(0, 36)"></use></svg>')}">`,
  componentFactory() {
    const fragment = new TodoListFragment(false, false);
    fragment.append('待办事项...');
    return new TodoListComponent([fragment]);
  }
}

export const todoListStyleSheet = `
tb-todo-list {
  display: block;
  margin-top: 1em;
  margin-bottom: 1em;
}
.tb-todo-list-item {
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  display: flex;
}
.tb-todo-list-btn {
  margin-right: 0.6em;
}
.tb-todo-list-state {
  display: inline-block;
  margin-top: 3px;
  width: 12px;
  height: 12px;
  border: 2px solid #1296db;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
}
.tb-todo-list-state:after {
  content: "";
  position: absolute;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  left: 3px;
  top: 1px;
  width: 4px;
  height: 6px;
  transform: rotateZ(45deg);
}
.tb-todo-list-state-active:after {
  border-color: #1296db;
}
.tb-todo-list-state-disabled {
  opacity: 0.5;
}
.tb-todo-list-content {
  flex: 1;
}
`;
