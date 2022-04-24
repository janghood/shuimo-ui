/**
 * @description list component
 * @author 阿怪
 * @date 2022/4/24 21:57
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { defineComponent, h } from "vue";
import { props } from "./api";


export default defineComponent({
  name: 'WList',
  props,
  setup(props, { slots }) {
    return () => {
      const icon = h('div', { class: 'w-list-icon' });
      const listItems = props.data?.map(item => h('div', {
        class: ['w-list-item', props.autoActive || item.active ? 'w-active' : ''],
      },  [
        icon,
        h(
          'div',
          { class: 'w-list-item-main' },
          slots.default ? slots.default.call(this, item) : JSON.stringify(item)
        )
      ]));

      return h('div', { class: 'w-list' }, listItems);
    }
  }
})
