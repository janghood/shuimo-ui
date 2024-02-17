/**
 * @description core datePicker hook
 * @author 阿怪
 * @date 2023/05/18 23:44
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { DatePickerProps } from './index';
import dayjs from 'dayjs';
import usePopover from '../../../compositions/common/usePopover.ts';
import { Ref, ref } from 'vue';
import { isEmpty } from '../../../tools';
import type { Options } from '../../../compositions/common/defineCore.ts';

// 基础星期名
export const BASE_WEEK_NAME: DisplayCalendarType[] = [
  { day: '日', isCurrentMonth: true },
  { day: '壹', isCurrentMonth: true },
  { day: '贰', isCurrentMonth: true },
  { day: '叁', isCurrentMonth: true },
  { day: '肆', isCurrentMonth: true },
  { day: '伍', isCurrentMonth: true },
  { day: '陆', isCurrentMonth: true }
];
export const BASE_MONTH_NAME = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
export type CALENDAR_TYPE = 'date' | 'month' | 'year';
export type DateRefType = {
  year: number,
  month: number,
  day: number,
}
export type DisplayCalendarType = {
  day: number | string,
  isCurrentMonth: boolean,
  isCurrent?: boolean,
}
export type CalendarItem = DisplayCalendarType & {
  month: number,
  year: number,
}

export const toDayjs = (value: string | Date) => {
  return dayjs(value);
};

export function useDatePicker(options: Options<{
  props: DatePickerProps
}>) {
  const { popoverOptions } = usePopover();
  const dateRef = ref<DateRefType>();
  const displayValue = ref('');
  const spanClass = ref<Array<string | undefined>>([]);
  const currentRef = ref(toDayjs(options.props.modelValue));
  const calendarTypeRef = ref<CALENDAR_TYPE>(options.props.type ?? 'date');
  const yearsRef = ref<Array<number>>([]);
  let needPlaceholder = false;

  const format = options.props.format ?? 'YYYY-MM-DD';


  const updateDateRef = (value: string | Date) => {
    if (isEmpty(value)) {
      displayValue.value = options.props.placeholder;
      needPlaceholder = true;
    } else {
      const dayJsValue = dayjs(value);
      const validateResult = dayJsValue.isValid();
      if (validateResult) {
        displayValue.value = dayJsValue.format(format).toString();
        dateRef.value = {
          year: dayJsValue.year(),
          month: dayJsValue.month() + 1,
          day: dayJsValue.date()
        };
      } else {
        // todo print error
      }
    }
    spanClass.value = ['m-date-picker-span', needPlaceholder ? 'm-date-picker-placeholder' : undefined];
  };
  // date
  updateDateRef(options.props.modelValue);

  const getCalendar = (MDateRefValue: Ref<DateRefType | undefined>) => {
    const dateRefValue = ref(MDateRefValue);
    if (!dateRefValue.value) {
      const today = dayjs();
      dateRefValue.value = { year: today.year(), month: today.month() + 1, day: today.date() };
    }
    const dateRef = dateRefValue.value;
    // thx to copilot :)
    const monthDayjs = dayjs().set('year', dateRef.year).set('month', dateRef.month - 1);
    const dateDayjs = monthDayjs.set('date', dateRef.day);
    // 获取当月的第一天是星期几
    const firstDayWeek = dateDayjs.startOf('month');
    const firstDayWeekDay = firstDayWeek.day();
    // 往前填充到周日，形成[...,firstDayWeek,...] 数组
    const prevDaysYear = dateRef.month === 1 ? dateRef.year - 1 : dateRef.year;
    const lastMonthDayjs = dateDayjs.subtract(1, 'month');
    const lastMonth = lastMonthDayjs.month() + 1;
    const prevDays = Array.from({ length: firstDayWeekDay }, (_, i) => {
      const day = firstDayWeek.subtract(firstDayWeekDay - i, 'day').date();
      return { day, isCurrentMonth: false, month: lastMonth, year: prevDaysYear };
    });

    const isCurrent = (info: number) => {
      if (dateRef.year !== currentRef.value.year()) return false;
      if (dateRef.month !== currentRef.value.month() + 1) return false;
      return info === currentRef.value.date();

    };
    // 完善整个日历数组
    const currentDays = Array.from({ length: monthDayjs.daysInMonth() }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      isCurrent: isCurrent(i + 1),
      month: dateRef.month,
      year: dateRef.year
    }));
    // 往后填充到周六
    const nextDaysYear = dateRef.month === 12 ? dateRef.year + 1 : dateRef.year;
    const nextDays = Array.from({ length: 6 - dayjs(`${dateRef.year}-${dateRef.month}-${dayjs(`${dateRef.year}-${dateRef.month}`).daysInMonth()}`).day() }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: false,
      month: dateRef.month + 1,
      year: nextDaysYear
    }));
    // 如果长度不够的话再补7天
    if (prevDays.length + currentDays.length + nextDays.length < 42) {
      // 如果第一天是周日，补前一个月的后7天
      if (firstDayWeekDay === 0) {

        const lastMonthDays = lastMonthDayjs.daysInMonth();
        prevDays.unshift(...Array.from({ length: 7 }, (_, i) => ({
          day: lastMonthDays - 6 + i,
          isCurrentMonth: false,
          month: lastMonth,
          year: prevDaysYear
        })));
      } else {

        const nextMonth = dateDayjs.add(1, 'month');
        const nextMonthFirstDayWeek = nextMonth.set('day', 1).day();
        const baseDay = nextMonthFirstDayWeek === 0 ? 0 : (6 - nextMonthFirstDayWeek);
        nextDays.push(...Array.from({ length: 7 }, (_, i) => ({
          day: i + baseDay + 1,
          isCurrentMonth: false,
          month: dateRef.month + 1,
          year: nextDaysYear
        })));
      }
    }

    // 分割为7天一组
    const split = (arr: Array<{ day: number, isCurrentMonth: boolean }>) => {
      const result = [];
      for (let i = 0; i < arr.length; i += 7) {
        result.push(arr.slice(i, i + 7));
      }
      return result;
    };

    return split(prevDays.concat(currentDays, nextDays));
  };

  const toPrevMonth = () => {
    if(!dateRef.value)return;
    dateRef.value.month -= 1;
    if (dateRef.value.month === 0) {
      dateRef.value.month = 12;
      dateRef.value.year -= 1;
    }
  };

  const toNextMonth = () => {
    if(!dateRef.value)return;
    dateRef.value.month += 1;
    if (dateRef.value.month === 13) {
      dateRef.value.month = 1;
      dateRef.value.year += 1;
    }
  };

  const toNextYear = () => {
    if(!dateRef.value)return;
    dateRef.value.year += 1;

    if (calendarTypeRef.value === 'year') {
      if (!yearsRef.value.includes(dateRef.value.year)) {
        const startYear = dateRef.value.year;
        yearsRef.value = Array.from({ length: 12 }, (_, i) => startYear + i);
      }
    }

  };

  const toPrevYear = () => {
    if(!dateRef.value)return;
    dateRef.value.year -= 1;

    if (calendarTypeRef.value === 'year') {
      if (!yearsRef.value.includes(dateRef.value.year)) {
        const startYear = dateRef.value.year - 11;
        yearsRef.value = Array.from({ length: 12 }, (_, i) => startYear + i);
      }
    }
  };

  const getValue = (item: CalendarItem) => {
    return dayjs().set('year', item.year).set('month', item.month - 1).set('date', Number(item.day)).format(format);
  };

  const clickCurrentYear = (year: number) => {
    calendarTypeRef.value = 'year';
    // 前后共12年
    const startYear = year - 6;
    const endYear = year + 5;
    yearsRef.value = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  };

  const clickYearItem = (year: number) => {
    if(!dateRef.value)return;
    dateRef.value.year = year;
    calendarTypeRef.value = 'date';
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const clickCurrentMonth = (month: number) => {
    calendarTypeRef.value = 'month';
  };

  const clickMonthItem = (month: number) => {
    if(!dateRef.value)return;
    dateRef.value.month = month;
    calendarTypeRef.value = 'date';
  };

  return {
    updateDateRef,
    popoverOptions,
    getCalendar,
    toPrevMonth, toNextMonth, toNextYear, toPrevYear,
    getValue,
    clickCurrentYear, clickYearItem, clickCurrentMonth, clickMonthItem,
    dateRef, spanClass, displayValue, calendarTypeRef, currentRef, yearsRef
  };

}
