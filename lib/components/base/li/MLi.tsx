/**
 * @description vue version li
 * @author 阿怪
 * @date 2023/05/04 17:32
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { defineComponent } from 'vue';
import { props } from './api.ts';
import MSvgIcon from '../../other/svg/MSvgIcon.tsx';
import { LiProps } from './index';
import './li.css';

export default defineComponent((props: LiProps, { slots }) => {
  return () => {
    return <li class={['m-li', { 'm-li-active': props.active }]}>
      {props.icon ? <div class="m-marker">
        <MSvgIcon wrapper={props.active} class="m-marker"/>
      </div> : null}
      <div class="m-li-inner">
        {slots.default?.()}
      </div>
    </li>;
  };
}, {
  name: 'MLi',
  props,
});
