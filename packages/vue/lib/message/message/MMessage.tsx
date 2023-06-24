/**
 * @description message插件式组件
 * @author: qunbotop
 * @date 2022/5/16 4:37 下午
 * @version v3.0.0
 *
 * v2.0.1 message handler 提供返回
 * v3.0.0 refactor 阿怪
 */
import { MessageIns } from '@shuimo-design/core/lib/message/message';
import { ComponentPublicInstance, createApp, nextTick } from 'vue';
import { useMessage } from '@shuimo-design/core/lib/message/message/useMessage';
import MMessageList from './MMessageList';
import MMessageItem from './MMessageItem';

type VueMessageIns = MessageIns<InstanceType<typeof MMessageItem>> & ComponentPublicInstance;

let { initMessage } = useMessage<InstanceType<typeof MMessageItem>>();

const MMessage = initMessage({
  getIns: direction => {
    const wrapper = document.createElement('div');
    return createApp(MMessageList, { direction }).mount(wrapper) as VueMessageIns;
  },
  nextTick: async (resolve, messageListIns) => {
    await nextTick(() => {
      const { domList } = messageListIns;
      const dom = domList[domList.length - 1];
      resolve(dom);
    });
  }
});

export default MMessage;
