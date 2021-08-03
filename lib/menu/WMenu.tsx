/**
 * @Description: 菜单组件
 * @Author: 菩萨蛮
 * @Date: 2021/7/19 2:46 下午
 * @Version v1.0.0
 *
 * 公司的业务千篇一律，复杂的代码好几百行。
 */
import { h, defineComponent, VNode, PropType, reactive } from 'vue';

type keyType = any;

type MenuType = {
  title: string,
  key: keyType,
  isActive: boolean,
  index?: number[],
  children?: MenuTypeArr
}

type MenuTypeArr = Array<MenuType>;


const setMenuIndex = (menu: MenuTypeArr) => {
  menu.forEach((m, i) => {
    m.index = [i];
    m.children?.forEach((cm, j) => {
      cm.index = [i, j];
    })
  });
}


export default defineComponent({
  name: 'WMenu',
  props: {
    menu: { type: Array as PropType<MenuTypeArr>, default: () => [] }
  },
  emits: ['click'],
  render(ctx: any) {
    const propsMenu: MenuTypeArr = ctx.$props.menu;
    setMenuIndex(propsMenu);
    // 左边的灰色条
    const leftLine = h('div', { class: 'w-menu-left-line' });

    const divClick = (index: number[]) => {
      if (index.length === 1) {
        propsMenu.forEach(m => {
          m.isActive = m.index === index;
          m.children?.forEach(cm => {
            cm.isActive = false;
          })
        });
      } else {
        const pIndex = [index[0]];
        propsMenu.forEach(m => {
          m.isActive = m.index![0] === pIndex[0];
          m.children?.forEach(cm => {
            cm.isActive = cm.index === index;
          })
        });
      }
      this.$emit('click', index);
    }


    /**
     * 二级菜单列表
     * @param list
     */
    const initChildItems: (list: MenuTypeArr) => VNode = list => {
      const items = list.map(menu => {
        const titleSpan = h('span', {}, menu.title);
        return h('div', {
          class: ['w-menu-item-child', menu.isActive ? 'active' : ''],
          onClick: (event: Event) => {
            event.stopPropagation();
            divClick(menu.index!);
          }
        }, [
          titleSpan
        ])
      });
      return h('div', { class: ['w-menu-item-children'] }, items);
    }


    const itemList = propsMenu.map(menu => {
      const titleSpan = h('span', {}, menu.title);
      // 先只有二级吧
      const childItems = menu.children && menu.isActive ? initChildItems(menu.children) : [];
      const icon = h('div', { class: 'w-menu-item-icon' });
      return h('div',
        {
          class: ['w-menu-item', menu.isActive ? 'active' : ''],
          onClick: (event: Event) => {
            event.stopPropagation();
            divClick(menu.index!);
          }
        },
        [
          icon,
          titleSpan,
          childItems
        ])
    });

    const WMenuItems = h('div', { class: ['w-menu-items'] }, itemList);


    return h('div', { class: 'w-menu' }, [
      leftLine,
      WMenuItems
    ]);
  }
})