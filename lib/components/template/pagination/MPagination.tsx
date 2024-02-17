/**
 * @description vue version pagination
 * @author 阿怪
 * @date 2023/05/25 23:29
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { defineComponent, ref, watch } from 'vue';
import { props } from './api.ts';
import { usePagination } from './usePagination.ts';
import './pagination.css';
import { PaginationProps } from './index';

export default defineComponent((_props:PaginationProps, { emit }) => {
  const props = _props as Required<PaginationProps>;

  const currentValueRef = ref(props.modelValue ?? 1);
  watch(() => props.modelValue, (val) => {
    currentValueRef.value = val;
  });

  const { getPageNumList, getPageBtnLength } = usePagination({ props, value: { currentValue: currentValueRef } });

  const changePage = (page: number) => {
    currentValueRef.value = page;
    emit('update:modelValue', page);
    emit('change', page);
  };

  const toPrev = () => {
    if (currentValueRef.value === 1) return;
    changePage(currentValueRef.value - 1);
  };

  const toNext = () => {
    if (currentValueRef.value === getPageBtnLength()) return;
    changePage(currentValueRef.value + 1);
  };

  return () => {
    const pages = getPageNumList();
    const layoutKeys = props.layout.split(',').map(key => key.trim());


    const btnGetter = {
      total: () => <div class="m-page-total">共 <span>{props.total}</span> 条</div>,
      prev: () => <div class={['m-page-prev', { 'm-page-prev-disabled': currentValueRef.value === 1 }]}
                       onClick={() => toPrev()}/>,
      pager: () => pages.map(page => {
        return <div class={['m-pager', { 'm-paper-current': page.isCurrent }]}
                    onClick={() => changePage(page.jump!)}>{page.value}</div>;
      }),
      next: () => <div class={['m-page-next', { 'm-page-next-disabled': currentValueRef.value === getPageBtnLength() }]}
                       onClick={() => toNext()}/>

    };


    return <div class="m-pagination">
      {layoutKeys.map(key => btnGetter[key as keyof typeof btnGetter]?.())}
    </div>;
  };
}, {
  name: 'MPagination',
  props,
  emits: ['update:modelValue', 'change']
});
