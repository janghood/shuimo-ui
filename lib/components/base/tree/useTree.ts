import { TreeData, TreeNodeData, TreeProps } from './index';
import Tree from './tree';
import { Options } from '../../../compositions/common/defineCore.ts';
import { deepClone } from '../../../tools';
import { shallowRef } from 'vue';

export const useTree = (options: Options<{
  props: TreeProps,
  event: {
    triggerTree: () => void
  }
}>) => {
  const { props, event } = options;
  const treeRef = shallowRef<Tree>();
  const initTreeRef = (data = props.data) => {
    treeRef.value = new Tree({
      data: fixKey(deepClone(data), props.config.key),
      config: props.config,
      defaultExpandAll: props.defaultExpandAll,
      checkStrictly: props.checkStrictly,
    });
  };
  initTreeRef();

  const handleToggleExpand = (node: TreeNodeData, e: MouseEvent) => {
    e.stopPropagation();
    treeRef.value?.toggleExpand(node);
    event.triggerTree();
  };
  const handleToggleChecked = (node: TreeNodeData, checked: boolean) => {
    treeRef.value?.setNodeCheckbox(node, checked);
    event.triggerTree();
  };

  const getNodesByKeys = (keys: TreeNodeData['key'][]) => {
    return treeRef.value!.getTreeData(keys);
  };

  return {
    treeRef,
    getNodesByKeys,
    handleToggleExpand,
    handleToggleChecked,
    initTreeRef,
  };
};

const _fixKey = (data: TreeData[], key: string | number = 'key', prefixKey: string | number) => {
  let keyStart = 0;
  data = data.map(d => {
    if (!d[key]) {
      d[key] = `${prefixKey}${keyStart++}`;
    }
    if (d.children) {
      d.children = _fixKey(d.children, key, d[key]);
    }
    return d;
  });
  return data;
};

export const fixKey = (data: TreeData | TreeData[], key: string | number, prefixKey: string | number = '') => {
  return Array.isArray(data) ? _fixKey(data, key ?? 'key', prefixKey) : _fixKey([data], key ?? 'key', prefixKey)[0];
};
