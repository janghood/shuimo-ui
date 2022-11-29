/**
 * @description: select选择框测试用例
 * @author: 南歌子
 * @date 2021/02/23 11:11
 * @version v1.0.1
 *
 * Hello, humor
 *
 * v1.0.1 升级为vitest版本测试用例 阿怪
 * v1.0.1 select多选测试用例 jimmy
 */

import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import MSelect from '../../../lib/base/select/MSelect';
import { SelectProps } from '../../../lib/base/select';
import { h } from 'vue';
import { Slot } from '@vue/test-utils/dist/types';
import MPopover from '../../../lib/message/popover/MPopover';

describe('选择框组件', () => {
  const getWrapper = (props?: SelectProps, slots?: Record<string, Slot>) => {
    return mount(MSelect, { props, slots });
  };

  test('无参数渲染)', () => {
    const wrapper = getWrapper();
    expect(wrapper.html()).toContain('m-select');
    wrapper.unmount();
  });

  const baseProps = {
    modelValue: 1,
    options: [1, 2, 3, 4]
  };

  type OptionType = { title: string; value: number; inputParam: string; value2: number };

  const options: OptionType[] = [
    { title: 'option1', value: 1, inputParam: 'input1', value2: 4 },
    { title: 'option2', value: 2, inputParam: 'input2', value2: 5 },
    { title: 'option3', value: 3, inputParam: 'input3', value2: 6 },
    { title: 'option4', value: 4, inputParam: 'input4', value2: 7 }
  ];

  describe('参数相关测试用例', () => {
    test('仅modelValue和options参数渲染（即最佳实践）', async () => {
      const wrapper = getWrapper(baseProps);
      expect(wrapper.element.querySelector('input')!.value).toBe('1');
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
        inputParam: 'inputParam'
      });
      expect(wrapper.element.querySelector('input')!.value).toMatchInlineSnapshot('"input1"');
    });

    test('指定对象框渲染param', () => {
      const wrapper = getWrapper({
        modelValue: options[0],
        options,
        inputParam: 'inputParam',
        optionParam: 'title'
      });

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
        valueParam: 'value'
      });

      await wrapper.find('.m-option').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toMatchObject([[1]]);
    });

    test('修改参数param', async () => {
      const wrapper = getWrapper({
        modelValue: undefined,
        options,
        inputParam: 'inputParam',
        valueParam: 'value'
      });

      await wrapper.setProps({ valueParam: 'value2' });
      await wrapper.find('.m-option').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toMatchObject([[4]]);
    });

    test('开启为可输入模式', () => {
      const wrapper = getWrapper({
        ...baseProps,
        inputReadonly: false
      });
      expect(wrapper.find('input').attributes().readonly).toBeUndefined();
    });

    test('禁用模式', () => {
      const wrapper = getWrapper({
        ...baseProps,
        disabled: true
      });
      expect(wrapper.find('input').attributes().disabled).not.toBeUndefined();
    });

    test('placeholder', () => {
      const placeholder = 'here is placeholder';
      const wrapper = getWrapper({
        ...baseProps,
        placeholder
      });
      expect(wrapper.find('input').attributes().placeholder).toBe(placeholder);
    });

    test('toMatch功能测试', () => {
      const wrapper = getWrapper({
        modelValue: options[0],
        options,
        inputParam: 'value',
        optionParam: 'title',
        toMatch: (option: OptionType, value: OptionType) => {
          return value.value === option.value && value.value2 === option.value2;
        }
      });
      expect(wrapper.find('.m-option-selected').element).toMatchInlineSnapshot(`
        <div
          class="m-option m-option-selected"
        >
          option1
        </div>
      `);
    });
  });

  describe('slot测试', () => {
    test('slot覆盖optionParam', () => {
      const wrapper = getWrapper(
        {
          modelValue: options[0],
          options,
          inputParam: 'inputParam',
          optionParam: 'title'
        },
        {
          option: ({ option }) => h('span', option.value2)
        }
      );

      expect(wrapper.findAll('.m-option').map(e => e.element.innerHTML)).toMatchInlineSnapshot(`
        [
          "<span>4</span>",
          "<span>5</span>",
          "<span>6</span>",
          "<span>7</span>",
        ]
      `);
    });
  });

  describe('事件相关测试用例', () => {
    test('点击打开下拉框', async () => {
      const wrapper = getWrapper(baseProps);
      expect(wrapper.findComponent(MPopover).props('show')).toMatchInlineSnapshot('false');
      await wrapper.find('input').trigger('click');
      expect(wrapper.findComponent(MPopover).props('show')).toMatchInlineSnapshot('true');
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
        const wrapper = getWrapper({ ...baseProps, inputReadonly: false });
        await wrapper.find('input').trigger('focus');
        expect(wrapper.emitted('focus')!.length).toBe(1);
      });
    });

    test('选择冒泡', async () => {
      const wrapper = getWrapper({
        modelValue: options[1],
        options,
        inputParam: 'inputParam',
        optionParam: 'title'
      });
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
    const multiplePropsBase = {
      modelValue: ['111'],
      multiple: true,
      options: ['111', '222', '333', '444'],
    };
    const multiplePropsBaseNovalue = {
      modelValue: [],
      multiple: true,
      options: ['111', '222', '333', '444'],
    };

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
        { title: 'option4', value: 4, inputParam: 'input4', value2: 7 }
      ]
    };
    const multiplePropsObjNovalue = {
      modelValue: [],
      multiple: true,
      valueParam: 'value',
      inputParam: 'inputParam',
      optionParam: 'title',
      options: [
        { title: 'option1', value: 1, inputParam: 'input1', value2: 4 },
        { title: 'option2', value: 2, inputParam: 'input12', value2: 5 },
        { title: 'option3', value: 3, inputParam: 'input3', value2: 6 },
        { title: 'option4', value: 4, inputParam: 'input4', value2: 7 }
      ]
    };

    describe("多选基础测试", () => {
      test('多选模式,输入框placeholder', () => {
        const placeholder = '默认值'
        const wrapper = getWrapper({
          placeholder: placeholder,
          ...multiplePropsBaseNovalue
        });
        expect(wrapper.find('input').attributes().placeholder).toBe(placeholder);
      });

      test('多选模式,modelValue参数错误警告', () => {
        const infoSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        getWrapper({
          ...baseProps,
          multiple: true,
        });
        expect(infoSpy).toHaveBeenCalled();
      });
    })

    describe("多选基础事件", () => {
      test("多选模式,下拉框渲染", async () => {
        const wrapper = getWrapper(multiplePropsBase);
        expect(wrapper.findComponent(MPopover).props('show')).toMatchInlineSnapshot('false');
        await wrapper.find('.m-border').trigger('click');
        expect(wrapper.findComponent(MPopover).props('show')).toMatchInlineSnapshot('true');
      })
      test("多选模式,可输入时下拉框渲染", async () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
          inputReadonly: false
        });
        expect(wrapper.findComponent(MPopover).props('show')).toMatchInlineSnapshot('false');
        await wrapper.find('input').trigger('click');
        expect(wrapper.findComponent(MPopover).props('show')).toMatchInlineSnapshot('true');
      })
    })

    describe("多选常规值测试", () => {
      test('多选模式,常规值渲染tag', () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
        });
        expect(wrapper.html()).toContain('m-tag');
        expect(wrapper.find('.m-tag').text()).toMatchInlineSnapshot('"111"');
      });

      test('多选模式,常规值选中(点击border)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBaseNovalue,
        });
        await wrapper.find('input').trigger('click');
        await wrapper.find('.m-option').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[["111"]]]);
      });

      test('多选模式,常规值选中(点击check)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBaseNovalue,
        });
        await wrapper.find('input').trigger('click');
        await wrapper.find('.m-checkbox').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[["111"]]]);
      });


      test('多选模式,常规值取消选中(点击delete-icon)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
        });
        await wrapper.find('input').trigger('click');
        await wrapper.find('.m-delete-icon').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });

      test('多选模式,常规值取消选中(点击check)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBase,
        });
        await wrapper.find('input').trigger('click');
        await wrapper.find('.m-checkbox').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });

      test('多选模式,常规值测试模糊查询', async () => {
        const wrapper = getWrapper({
          ...multiplePropsBaseNovalue,
          inputReadonly: false
        });
        await wrapper.find('input').setValue("111");
        expect(wrapper.findAll('.m-option').map(e => e.text())).toMatchInlineSnapshot(`
        [
          "111",
        ]
        `);
      });

      test('多选模式,常规值输入冒泡', async () => {
        const wrapper = getWrapper(multiplePropsBase);
        await wrapper.find('input').setValue(2);
        expect(wrapper.emitted('input')!.length).toBe(1);
      });


      describe('多选模式,普通值focus冒泡', async () => {
        test('普通场景无冒泡', async () => {
          const wrapper = getWrapper(multiplePropsBase);
          await wrapper.find('input').trigger('focus');
          expect(wrapper.emitted('focus')).toBeUndefined();
        });

        test('可输入场景可以冒泡', async () => {
          const wrapper = getWrapper({ ...multiplePropsBase, inputReadonly: false });
          await wrapper.find('input').trigger('focus');
          expect(wrapper.emitted('focus')!.length).toBe(1);
        });
      });


    })

    describe("多选对象值测试", () => {
      test('多选模式,对象值渲染tag', () => {
        const wrapper = getWrapper({
          ...multiplePropsObj,
        });
        expect(wrapper.html()).toContain('m-tag');
        expect(wrapper.find('.m-tag').text()).toMatchInlineSnapshot('"input1"');
      });

      test('多选模式,对象值选中(点击border)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObjNovalue,
        });
        await wrapper.find('input').trigger('click');
        await wrapper.find('.m-option').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[1]]]);
      });

      test('多选模式,对象值选中(点击check)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObjNovalue,
        });
        await wrapper.find('input').trigger('click');
        await wrapper.find('.m-checkbox').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[1]]]);
      });

      test('多选模式,对象值取消选中(点击delete-icon)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObj,
        });
        await wrapper.find('input').trigger('click');
        await wrapper.find('.m-delete-icon').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });

      test('多选模式,对象值取消选中(点击check)', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObj,
        });
        await wrapper.find('input').trigger('click');
        await wrapper.find('.m-checkbox').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toMatchObject([[[]]]);
      });
      test('多选模式,对象值测试模糊查询', async () => {
        const wrapper = getWrapper({
          ...multiplePropsObjNovalue,
          inputReadonly: false
        });
        await wrapper.find('input').setValue("input1");
        expect(wrapper.findAll('.m-option').map(e => e.text())).toMatchInlineSnapshot(`
        [
          "option1",
          "option2",
        ]
        `);
      });

      test('多选模式,对象值输入冒泡', async () => {
        const wrapper = getWrapper(multiplePropsBase);
        await wrapper.find('input').setValue(2);
        expect(wrapper.emitted('input')!.length).toBe(1);
      });


      describe('多选模式,对象值focus冒泡', async () => {
        test('普通场景无冒泡', async () => {
          const wrapper = getWrapper(multiplePropsObj);
          await wrapper.find('input').trigger('focus');
          expect(wrapper.emitted('focus')).toBeUndefined();
        });

        test('可输入场景可以冒泡', async () => {
          const wrapper = getWrapper({ ...multiplePropsObj, inputReadonly: false });
          await wrapper.find('input').trigger('focus');
          expect(wrapper.emitted('focus')!.length).toBe(1);
        });
      });

    })
  })
});
