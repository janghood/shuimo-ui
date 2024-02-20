/**
 * @description: select选择框测试用例
 * @author: 南歌子
 * @date 2021/02/23 11:11
 * @version v1.0.1
 *
 * Hello, humor
 *
 * v1.0.1 升级为vitest版本测试用例 阿怪
 * v1.0.1 select多选测试用例 Jimmy
 */

import { mount, VueWrapper } from '@vue/test-utils';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { h, ref } from 'vue';
import { Slot } from '@vue/test-utils/dist/types';
import { SelectProps } from '../../../components/base/select';
import { MSelect } from '../../../index.ts';


beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
  };
});
describe('select', () => {
  const getWrapper = (props?: SelectProps, slots?: Record<string, Slot>) => {
    return mount(MSelect, { props, slots });
  };

  test('无参数渲染', () => {
    const wrapper = getWrapper();
    expect(wrapper.html()).toContain('m-select');
    wrapper.unmount();
  });

  const baseProps = {
    modelValue: 1,
    options: [1, 2, 3, 4],
  };

  type OptionType = { title: string; value: number; inputParam: string; value2: number };

  const options: OptionType[] = [
    { title: 'option1', value: 1, inputParam: 'input1', value2: 4 },
    { title: 'option2', value: 2, inputParam: 'input2', value2: 5 },
    { title: 'option3', value: 3, inputParam: 'input3', value2: 6 },
    { title: 'option4', value: 4, inputParam: 'input4', value2: 7 },
  ];
  /**
   * @desc 自定义查询方法
   * @param options
   * @param inputValue
   * @returns
   */
  const customFilter = (options: any, inputValue: any) => {
    return String(options) === String(inputValue);
  };

  const showOptions = async (wrapper: VueWrapper) => {
    vi.useFakeTimers();
    await wrapper.find('.m-select-input').trigger('click');
    await vi.runOnlyPendingTimersAsync();
  };

  const showMultipleOptions = async (wrapper: VueWrapper) => {
    vi.useFakeTimers();
    await wrapper.find('.m-select-multiple-inner').trigger('click');
    await vi.runOnlyPendingTimersAsync();
  };


  describe('props', () => {
    test('仅modelValue和options参数渲染（即最佳实践）', async () => {
      const wrapper = getWrapper(baseProps);
      expect(wrapper.element.querySelector('input')!.value).toBe('1');
    });

    test('options为空', async () => {
      const wrapper = getWrapper({
        ...baseProps,
        options: [],
      });
      await showOptions(wrapper);
      expect(wrapper.findAll('.m-select-empty').length).toBe(1);
    });

    test('options为空,传入empty插槽', async () => {
      const wrapper = getWrapper({
        ...baseProps,
        options: [],
      }, {
        empty: () => h('div', { class: 'empty' }, 'empty'),
      });
      await showOptions(wrapper);
      expect(wrapper.findAll('.empty').length).toBe(1);
    });

    test('修改modelValue', async () => {
      const wrapper = getWrapper(baseProps);
      expect(wrapper.element.querySelector('input')!.value).toBe('1');
      await wrapper.setProps({ modelValue: 2 });
      expect(wrapper.element.querySelector('input')!.value).toBe('2');
    });

    test('指定输入框渲染param', () => {
      const wrapper = getWrapper({
        modelValue: options[0],
        options,
        inputParam: 'inputParam',
      });
      expect(wrapper.element.querySelector('input')!.value).toMatchInlineSnapshot('"input1"');
    });

    test('指定对象框渲染param', async () => {
      const wrapper = getWrapper({
        modelValue: options[0],
        options,
        inputParam: 'inputParam',
        optionParam: 'title',
      });
      await showOptions(wrapper);
      expect(wrapper.findAll('.m-option').map(e => e.element.innerHTML)).toMatchInlineSnapshot(`
        [
          "option1",
          "option2",
          "option3",
          "option4",
        ]
      `);
    });

    test('指定参数param', async () => {
      const wrapper = getWrapper({
        modelValue: undefined,
        options,
        inputParam: 'inputParam',
        valueParam: 'value',
      });
      await showOptions(wrapper);
      await wrapper.find('.m-option').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toMatchObject([[1]]);
    });

    test('修改参数param', async () => {
      const wrapper = getWrapper({
        modelValue: undefined,
        options,
        inputParam: 'inputParam',
        valueParam: 'value',
      });
      await showOptions(wrapper);
      await wrapper.setProps({ valueParam: 'value2' });
      await wrapper.find('.m-option').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toMatchObject([[4]]);
    });

    test('开启为可输入模式', () => {
      const wrapper = getWrapper({
        ...baseProps,
        readonly: false,
      });
      expect(wrapper.find('input').attributes().readonly).toBeUndefined();
    });

    test('禁用模式', () => {
      const wrapper = getWrapper({
        ...baseProps,
        disabled: true,
      });
      expect(wrapper.find('input').attributes().disabled).not.toBeUndefined();
    });

    test('placeholder', () => {
      const placeholder = 'here is placeholder';
      const wrapper = getWrapper({
        ...baseProps,
        modelValue: undefined,
        placeholder,
      });
      expect(wrapper.find('input').attributes().placeholder).toBe(placeholder);
    });

    test('toMatch功能测试', async () => {
      const wrapper = getWrapper({
        modelValue: options[0],
        options,
        inputParam: 'value',
        optionParam: 'title',
        toMatch: (option: OptionType, value: OptionType) => {
          return value.value === option.value && value.value2 === option.value2;
        },
      });
      await showOptions(wrapper);
      expect(wrapper.find('.m-option-selected').element.textContent!.trim()).toMatchInlineSnapshot('"option1"');
    });

    describe('filter方法测试', () => {
      test('不可输入时显示所有', async () => {
        const wrapper = getWrapper({
          ...baseProps,
          filter: customFilter,
        });
        await showOptions(wrapper);
        expect(wrapper.findAll('.m-option').length).toBe(baseProps.options.length);
      });

      test.skip('可输入时筛选', async () => {
        const wrapper = getWrapper({
          ...baseProps,
          readonly: false,
          filter: customFilter,
        });
        await showOptions(wrapper);
        // todo actually first render all options looks like better
        expect(wrapper.findAll('.m-option').length).toBe(1);
      });
    });

  });

  describe('slot', () => {
    test('slot覆盖optionParam', async () => {
      const wrapper = getWrapper(
        {
          modelValue: options[0],
          options,
          inputParam: 'inputParam',
          optionParam: 'title',
        },
        {
          option: ({ option }) => h('span', option.value2),
        },
      );
      await showOptions(wrapper);
      expect(wrapper.findAll('.m-option').map(e => e.element.innerHTML)).toMatchInlineSnapshot(`
        [
          "<span>4</span>",
          "<span>5</span>",
          "<span>6</span>",
          "<span>7</span>",
        ]
      `);
    });

    test('renders empty content slot when no options are available', async () => {
      const wrapper = mount(MSelect, {
        props: {
          options: [],
        },
        slots: {
          empty: '<div class="empty-slot">No options available</div>',
        },
      });
      await showOptions(wrapper);
      expect(wrapper.find('.empty-slot').exists()).toBe(true);
    });

  });

  describe('事件相关测试用例', () => {
    test('点击打开下拉框', async () => {
      const wrapper = getWrapper(baseProps);
      expect(wrapper.find('.m-popover-content').element.children.length).toBe(0);
      await showOptions(wrapper);
      expect(wrapper.find('.m-popover-content').element.children.length).not.toBe(0);
    });

    test('输入冒泡', async () => {
      const wrapper = getWrapper(baseProps);
      await wrapper.find('input').setValue(2);
      expect(wrapper.emitted('input')!.length).toBe(1);
    });

    describe('focus冒泡', async () => {
      test('普通场景无冒泡', async () => {
        const wrapper = getWrapper(baseProps);
        await wrapper.find('input').trigger('focus');
        expect(wrapper.emitted('focus')).toBeUndefined();
      });

      test('可输入场景可以冒泡', async () => {
        const wrapper = getWrapper({ ...baseProps, readonly: false });
        await wrapper.find('input').trigger('focus');
        expect(wrapper.emitted('focus')!.length).toBe(1);
      });
    });
    describe('blur冒泡', async () => {
      test('普通场景无冒泡', async () => {
        const wrapper = getWrapper(baseProps);
        await wrapper.find('input').trigger('blur');
        expect(wrapper.emitted('blur')).toBeUndefined();
      });

      test('可输入场景可以冒泡,update:modelValue', async () => {
        const wrapper = getWrapper({ ...baseProps, readonly: false });
        await wrapper.find('input').setValue('');
        await wrapper.find('input').trigger('blur');
        expect(wrapper.emitted('update:modelValue')!.length).toBe(1);
      });
    });

    test('选择冒泡', async () => {
      const wrapper = getWrapper({
        modelValue: options[1],
        options,
        inputParam: 'inputParam',
        optionParam: 'title',
      });
      await showOptions(wrapper);
      await wrapper.find('.m-option').trigger('click');
      expect(wrapper.emitted()['select'][0]).toMatchInlineSnapshot(`
        [
          {
            "inputParam": "input1",
            "title": "option1",
            "value": 1,
            "value2": 4,
          },
        ]
      `);
    });

    test.skip('查询用冒泡');
  });

  describe('多选测试相关代码', () => {
    /**
     * @desc 基础数据
     */
    const multiplePropsBase = {
      modelValue: ['111'],
      multiple: true,
      options: ['111', '222', '333', '444'],
    };
    /**
     * @desc 基础数据，`modelValue`为空
     */
    const multiplePropsBaseNoValue = {
      modelValue: [],
      multiple: true,
      options: ['111', '222', '333', '444'],
    };
    /**
     * @desc 对象数据
     */
    const multiplePropsObj = {
      modelValue: [1],
      multiple: true,
      valueParam: 'value',
      inputParam: 'inputParam',
      optionParam: 'title',
      options: [
        { title: 'option1', value: 1, inputParam: 'input1', value2: 4 },
        { title: 'option2', value: 2, inputParam: 'input2', value2: 5 },
        { title: 'option3', value: 3, inputParam: 'input3', value2: 6 },
        { title: 'option4', value: 4, inputParam: 'input4', value2: 7 },
      ],
    };
    /**
     * @desc 对象数据，`modelValue`为空
     */
    const multiplePropsObjNoValue = {
      modelValue: [],
      multiple: true,
      valueParam: 'value',
      inputParam: 'inputParam',
      optionParam: 'title',
      options: [
        { title: 'option1', value: 1, inputParam: 'input1', value2: 4 },
        { title: 'option2', value: 2, inputParam: 'input12', value2: 5 },
        { title: 'option3', value: 3, inputParam: 'input3', value2: 6 },
        { title: 'option4', value: 4, inputParam: 'input4', value2: 7 },
      ],
    };


    describe('多选基础测试', () => {
      test('输入框placeholder', () => {
        const placeholder = '默认值';
        const wrapper = getWrapper({
          placeholder: placeholder,
          ...multiplePropsBaseNoValue,
        });
        expect(wrapper.find('.m-select-multiple-placeholder').text()).toBe(placeholder);
      });

      // modelValue maybe can be any , we should not check it
      test.skip('modelValue为undefined时参数变为空数组', () => {
        const modelValue = ref(undefined);
        const wrapper = getWrapper({
          ...baseProps,
          modelValue,
          multiple: true,
        });
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });

      test.skip('modelValue参数错误警告', () => {
        const infoSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        getWrapper({
          ...baseProps,
          modelValue: false,
          multiple: true,
        });
        expect(infoSpy).toHaveBeenCalled();
      });

      test('filter方法测试,常规值渲染', async () => {
        const wrapper = getWrapper({
          modelValue: [1],
          options: [1, 2, 3, 4],
          multiple: true,
          filter: customFilter,
        });
        await showMultipleOptions(wrapper);
        expect(wrapper.findAll('.m-option').map(e => e.text())).toMatchInlineSnapshot(`
          [
            "1",
            "2",
            "3",
            "4",
          ]
        `);
      });
      test('filter方法测试,常规值查询', async () => {

        const wrapper = getWrapper({
          modelValue: [1],
          options: [1, 2, 3, 4],
          multiple: true,
          readonly: false,
          filter: customFilter,
        });
        await wrapper.find('input').setValue(1);
        await showMultipleOptions(wrapper);
        expect(wrapper.findAll('.m-option').map(e => e.text())).toMatchInlineSnapshot(`
          [
            "1",
          ]
        `);
      });
    });

    describe('多选基础事件', () => {
      test('下拉框渲染', async () => {
        const wrapper = getWrapper(multiplePropsBase);
        expect(wrapper.find('.m-popover-content').element.children.length).toBe(0);
        await showMultipleOptions(wrapper);
        expect(wrapper.find('.m-popover-content').element.children.length).not.toBe(0);
      });
      test('下拉框渲染，插槽渲染', async () => {
        const wrapper = getWrapper(
          { ...multiplePropsBase },
          { option: ({ option }) => h('span', option) },
        );
        expect(wrapper.find('.m-popover-content').element.children.length).toBe(0);
        await showMultipleOptions(wrapper);
        expect(wrapper.find('.m-popover-content').element.children.length).not.toBe(0);
        expect(wrapper.findAll('.m-option').map(e => e.text())).toMatchInlineSnapshot(`
          [
            "111",
            "222",
            "333",
            "444",
          ]
        `,
        );
      });

      // actually when active popover active, content always render
      test.skip('可输入时下拉框渲染', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
          readonly: false,
        });
        expect(wrapper.find('.m-popover-content').element.children.length).toBe(0);
        await wrapper.find('input').trigger('click');
        expect(wrapper.find('.m-popover-content').element.children.length).not.toBe(0);

      });
    });

    describe('多选常规值测试', () => {
      test('常规值渲染tag', () => {
        const wrapper = getWrapper(multiplePropsBase);
        expect(wrapper.html()).toContain('m-tag');
        expect(wrapper.find('.m-tag').text()).toMatchInlineSnapshot('"111"');
      });

      test('常规值选中(点击border)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBaseNoValue,
        });
        await showMultipleOptions(wrapper);
        await wrapper.find('.m-option').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[['111']]]);
      });


      // todo support checkbox and group ,not only a component
      test.skip('常规值选中(点击check)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBaseNoValue,
        });
        await showMultipleOptions(wrapper);
        await wrapper.find('.m-checkbox').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[['111']]]);
      });

      test.skip('常规值取消选中(点击check)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
        });
        await showMultipleOptions(wrapper);
        await wrapper.find('.m-checkbox').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });

      test('常规值取消选中(点击delete-icon)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
        });
        await showMultipleOptions(wrapper);
        await wrapper.find('.m-delete-icon').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });

      test('常规值测试查询匹配', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBaseNoValue,
          readonly: false,
        });
        await wrapper.find('input').setValue('111');
        await showMultipleOptions(wrapper);
        expect(wrapper.findAll('.m-option').map(e => e.text())).toMatchInlineSnapshot(`
          [
            "111",
          ]
        `);
      });

      test('常规值输入冒泡', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
          readonly: false,
        });
        await wrapper.find('input').setValue(2);
        expect(wrapper.emitted('input')!.length).toBe(1);
      });

      test('readonly false,no input', async () => {
        const wrapper = getWrapper(multiplePropsBase);
        expect(wrapper.html()).not.includes('input');
      });


      describe('普通值focus冒泡', async () => {
        test('可输入场景可以冒泡', async () => {
          const wrapper = getWrapper({ ...multiplePropsBase, readonly: false });
          await wrapper.find('input').trigger('focus');
          expect(wrapper.emitted('focus')!.length).toBe(1);
        });
      });
    });

    describe('多选对象值测试', () => {
      test('对象值渲染tag', () => {
        const wrapper = getWrapper({
          ...multiplePropsObj,
        });
        expect(wrapper.html()).toContain('m-tag');
        expect(wrapper.find('.m-tag').text()).toMatchInlineSnapshot('"option1"');
      });

      test('对象值选中(点击border)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObjNoValue,
        });
        await showMultipleOptions(wrapper);
        await wrapper.find('.m-option').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[1]]]);
      });

      test('对象值选中(点击check)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObjNoValue,
        });
        await showMultipleOptions(wrapper);
        await wrapper.find('.m-option').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[1]]]);
      });

      test('对象值取消选中(点击delete-icon)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObj,
        });
        await showMultipleOptions(wrapper);
        await wrapper.find('.m-delete-icon').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });

      test.skip('对象值取消选中(点击check)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObj,
        });
        await showMultipleOptions(wrapper);
        await wrapper.find('.m-checkbox').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });

      test('对象值测试查询匹配', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObjNoValue,
          readonly: false,
        });
        await wrapper.find('input').setValue('input1');
        await showMultipleOptions(wrapper);
        expect(wrapper.findAll('.m-option').map(e => e.text())).toMatchInlineSnapshot(`
          [
            "option1",
          ]
        `);
      });

      test('对象值输入冒泡', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
          readonly: false,
        });
        await wrapper.find('input').setValue(2);
        expect(wrapper.emitted('input')!.length).toBe(1);
      });


      describe('对象值focus冒泡', () => {

        test('可输入场景可以冒泡', async () => {
          const wrapper = getWrapper({ ...multiplePropsObj, readonly: false });
          await wrapper.find('input').trigger('focus');
          expect(wrapper.emitted('focus')!.length).toBe(1);
        });
      });


      describe.skip('checkbox', () => {
        test('默认开启checkbox', () => {
          const wrapper = getWrapper(multiplePropsObj);
          expect(wrapper.find('.m-checkbox').exists()).toBe(true);
        });
        test('关闭checkbox', () => {
          const wrapper = getWrapper({
            ...multiplePropsObj,
            checkbox: false,
          });
          expect(wrapper.find('.m-checkbox').exists()).toBe(false);
        });
      });


      describe('重复数据问题', () => {
        /**
         * @desc 对象数据，重复数据
         */
        const multiplePropsObjRepeat = {
          modelValue: [1],
          multiple: true,
          valueParam: 'value',
          inputParam: 'inputParam',
          optionParam: 'title',
          options: [
            { title: 'option1', value: 1, inputParam: 'input1', value2: 4 },
            { title: 'option1', value: 1, inputParam: 'input1', value2: 4 },
            { title: 'option2', value: 2, inputParam: 'input2', value2: 5 },
            { title: 'option2', value: 2, inputParam: 'input2', value2: 5 },
          ],
        };

        test('重复数据渲染问题', async () => {
          const wrapper = getWrapper(multiplePropsObjRepeat);
          await showMultipleOptions(wrapper);
          expect(wrapper.findAll('.m-option-selected').length).toBe(2);
        });
        test('重复数据选择问题', async () => {
          const wrapper = getWrapper(multiplePropsObjRepeat);
          await showMultipleOptions(wrapper);
          await wrapper.find('.m-option').trigger('click');
          expect(wrapper.emitted('update:modelValue')).toMatchObject([[[1]]]);
        });
      });
    });
  });
});
