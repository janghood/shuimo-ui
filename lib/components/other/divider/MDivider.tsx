/**
 * @description 分割线
 * @author 阿怪
 * @date 2021/2/23 3:57 下午
 * @version v1.1.0
 *
 * 公司的业务千篇一律，复杂的代码好几百行。
 * v1.1.0  优化分割线素材，并新增分割线类型，暂时去除strong类型
 */
import { defineComponent } from 'vue';
import { props } from './api.ts';
import { DividerProps } from './index';
import './divider.css';

export default defineComponent((props: DividerProps) => {
  return () => <div class={{
    'm-divider': true,
    'm-divider-vertical': props.vertical
    // 'm-divider-strong': this.type === 'strong',
  }}/>;
}, {
  name: 'MDivider',
  props
});
