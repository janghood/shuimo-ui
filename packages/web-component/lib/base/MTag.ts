/**
 * @description web-component version tag
 * @author 阿怪
 * @date 2023/3/1 01:07
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */


import { createMElement, MElement } from '@shuimo-design/lit';
import { useTag, TagProps } from '@shuimo-design/core';

@createMElement({
  name: 'tag',
  hookFunc: useTag
})
export default class MTag extends MElement implements TagProps {
  type?: string;
}
