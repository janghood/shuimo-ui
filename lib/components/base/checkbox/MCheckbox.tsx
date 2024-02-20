/**
 * @description MCheckbox
 * @author youus
 * @date 2022/4/7 00:01
 * @version v1.0.1
 *
 * Hello, humor
 *
 * v1.0.1 修复checkbox的slot支持
 * v2.0.0 阿怪 upgrade to core version
 * v2.0.1 阿怪 support dark-mode
 */
import { defineComponent, ref, watch } from 'vue';
import { notEmpty } from '../../../tools';
import { props } from './api.ts';
import { getNewModelValue, initChecked } from './useCheckbox.ts';
import { CheckboxProps } from './index';
import './checkbox.css';

export default defineComponent((_props: CheckboxProps, { emit, slots }) => {
  const props = _props as Required<CheckboxProps>; // props in setup is Required

  const checked = ref(initChecked(props));

  watch(() => [props.modelValue, props.checked, props.value], () => {
    checked.value = initChecked(props);
  });

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (props.disabled) {
      return;
    }
    checked.value = !checked.value;
    const newVal = getNewModelValue(props, checked.value);
    emit('change', newVal);
    emit('update:modelValue', newVal);
  };

  return () => {
    const label = <label class="m-checkbox-slot">
      {notEmpty(props.label) ? <span>{props.label}</span> : slots.default?.()}
    </label>;

    return <div class={['m-checkbox', { 'm-disabled': props.disabled }]} onClick={onClick}>
      <input type="checkbox" checked={checked.value}/>
      <div class="m-checkbox-checkbox"/>
      {
        props.indeterminate ? <div class="m-checkbox-checkbox-indeterminate"/> :
          checked.value ? <div class="m-checkbox-checkbox-inner "/> : null
      }
      {label}
    </div>;
  };
}, {
  name: 'MCheckbox',
  props,
  emits: ['change', 'update:modelValue'],
});
