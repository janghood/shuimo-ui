/**
 * @description
 * @author 阿怪
 * @date 2024/10/9 00:27
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { Component } from 'vue';


// [base]
import MAvatar from '../../components/base/avatar/MAvatar.tsx';
import MInput from '../../components/base/input/MInput';
import MButton from '../../components/base/button/MButton.tsx';
// import MSelect from '../../components/base/select/MSelect.tsx';
import MCheckbox from '../../components/base/checkbox/MCheckbox.tsx';
import MSwitch from '../../components/base/switch/MSwitch.tsx';
// [other]
import MLoading from '../../components/other/loading/MLoading.tsx';
// [message]
// [template]
import MRicePaper from '../../components/template/ricePaper/MRicePaper.tsx';
import MBorder from '../../components/template/border/MBorder.tsx';
import MPopover from '../../components/message/popover/MPopover';


export const components: Record<string, Component> = {
  MAvatar,
  MButton,
  MCheckbox,
  MSwitch,

  MLoading,

  MRicePaper,
  MBorder,
};


export {
  MAvatar,
  MButton,
  MCheckbox,
  MSwitch,

  MLoading,

  MRicePaper,
  MBorder,
};
