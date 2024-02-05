import { formatData } from '@/components/sales/calendarUtility/formatData';
import { formattedDatabyExcel } from '@/components/sales/csv/utility/formatExcel';
import { getAllSales, getDaySales, getMonthsSales, getWeekSales } from '@/server/api/supabase/sales';
import { setCalendarCurrentDate } from '@/shared/store/sales/salesCalendar';
import { setChartData } from '@/shared/store/sales/salesChart';
import useDayState, { setSelectedDate } from '@/shared/store/sales/salesDay';
import { setRecordData } from '@/shared/store/sales/salesRecord';
import { setIsShow } from '@/shared/store/sales/salesToggle';
import useAuthState from '@/shared/store/session';
import { DateFormatType, EnOrderType, FormatType } from '@/types/sales';
import { Tables } from '@/types/supabase';
import { Dayjs } from 'dayjs';

export const useDataHandler = () => {
  const storeId = useAuthState(state => state.storeId);
  const { utcStandardDate, today } = useDayState();

  const handleSalesData = (
    salesData: Tables<'sales'>[],
    dateType: DateFormatType,
    formatType: FormatType,
    day: Dayjs,
  ) => {
    if (salesData.length !== 0) {
      const { result, recordData } = formatData(salesData, dateType, day, formatType);
      setChartData(result);
      setRecordData(recordData);
    } else {
      setChartData([]);
      setRecordData({
        currentSales: 0,
        dateType: 'day',
      });
    }
    setCalendarCurrentDate(day);
    setSelectedDate(day);
  };

  const clickMoveTodayHandler = async () => {
    const { sales, dateType, formatType } = await getDaySales(utcStandardDate, storeId!);
    handleSalesData(sales, dateType, formatType!, today);
  };
  //sales/status에 있는 calendar에서 날짜를 클릭하면 그 날 기준 7일 데이터를 받아옵니다.
  /**
   *
   * @param day 날짜가 들어오면 그 날짜 기준으로 1주일치 매출을 가져옵니다.
   * @returns salesStore의 state값 변경으로 void 입니다.
   */
  const clickShowDataOfDateHandler = (day: Dayjs) => async () => {
    const { sales, dateType, formatType } = await getDaySales(day.hour(0).subtract(9, 'hour'), storeId!);
    handleSalesData(sales, dateType, formatType!, day);
    setIsShow(false);
  };

  const clickWeeksChartHandler = async () => {
    const { sales, dateType, formatType } = await getWeekSales(utcStandardDate, storeId!);
    handleSalesData(sales, dateType, formatType!, today);
  };

  const clickMonthsChartHandler = async () => {
    const { sales, dateType, formatType } = await getMonthsSales(utcStandardDate, storeId!);
    handleSalesData(sales, dateType, formatType!, today);
  };

  /**
   *
   * @param order_type 'togo' || 'store'
   */
  const clickGetAllDataHandler = async (order_type: EnOrderType) => {
    try {
      const { sales, orderType } = await getAllSales(today, storeId!, order_type);
      const formattedExcelData = formattedDatabyExcel(sales, orderType);
      return formattedExcelData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return {
    clickMoveTodayHandler,
    clickShowDataOfDateHandler,
    clickWeeksChartHandler,
    clickMonthsChartHandler,
    clickGetAllDataHandler,
  };
};
