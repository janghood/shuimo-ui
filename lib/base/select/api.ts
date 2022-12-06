/**
 * @description select api
 * @author Jimmy
 * @date 2022/12/06 17:46
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { WCOPO, WPropType } from '../../dependents/_types';
import { SelectProps } from './index';

export const props: WCOPO<SelectProps> = {
  modelValue: { type: undefined, default: '' },
  options: { type: Array, default: () => [] },
  inputParam: { type: String, default: undefined },
  optionParam: { type: String, default: undefined },
  valueParam: { type: String, default: undefined },
  inputReadonly: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '请选择...' },
  toMatch: { type: Function as WPropType<(option: any, value: any) => boolean>, default: undefined },
  multiple: { type: Boolean, default: false },
  filter: { type: Function as WPropType<(option: any, inputValue: string) => boolean>, default: undefined },
};
