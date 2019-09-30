import { FormItem, AttrType, AttrState, AttrConfig } from './help';
import { FormTextField } from './form-text-field';
import { FormOptions } from './form-options';
import { FormSwitch } from './form-switch';
import { DropdownHandlerView } from '../../toolbar/help';
import { FormHidden } from './form-hidden';
import { EventDelegate } from '../../help';

export class Form implements DropdownHandlerView {
  onSubmit: (attrs: AttrState[]) => void;
  readonly host = document.createElement('form');
  private items: FormItem[] = [];
  private delegator: EventDelegate;

  constructor(forms: Array<AttrConfig>) {
    this.host.classList.add('tanbo-editor-form');
    forms.forEach(attr => {
      switch (attr.type) {
        case AttrType.TextField:
          this.items.push(new FormTextField(attr, (type: string) => {
            return this.delegator.dispatchEvent(type);
          }));
          break;
        case AttrType.Options:
          this.items.push(new FormOptions(attr));
          break;
        case AttrType.Switch:
          this.items.push(new FormSwitch(attr));
          break;
        case AttrType.Hidden:
          this.items.push(new FormHidden(attr));
          break
      }
    });
    this.items.forEach(item => {
      this.host.appendChild(item.host);
    });

    this.host.setAttribute('novalidate', 'novalidate');

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('tanbo-editor-form-btn-wrap');
    btnWrap.innerHTML = '<button class="tanbo-editor-form-submit" type="submit">确定</button>';

    this.host.appendChild(btnWrap);

    this.host.addEventListener('submit', (ev: Event) => {
      if (typeof this.onSubmit === 'function') {
        this.onSubmit(this.items.map(item => {
          return item.getAttr();
        }));
      }
      ev.preventDefault();
    });
  }

  reset(): void {
    this.items.forEach(item => {
      if(item instanceof FormTextField) {
        item.update('');
      } else if(item instanceof FormOptions){
        item.update(Number.NaN);
      } else if(item instanceof FormSwitch) {
        item.update();
      }
    });
  }

  setEventDelegator(delegate: EventDelegate): void {
    this.delegator = delegate;
  }

  updateStateByElement(el: HTMLElement): void {
    this.items.forEach(item => {
      item.update(el.getAttribute(item.name));
    });
  }
}