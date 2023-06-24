/**
 * @description core tooltip hook
 * @author 阿怪
 * @date 2023/06/05 01:31
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { TooltipProps } from './index';
import usePopover from '../../../composition/common/usePopover';
import { Options } from '../../../composition/common/defineCore';

export function useTooltip(options: Options<{
  props: TooltipProps
}>) {


  const { popoverOptions } = usePopover({
    placement: 'bottom'
  }, {
    offset: 5
  });

  return {
    popoverOptions
  };

}
