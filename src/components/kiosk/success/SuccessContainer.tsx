import { useNumberOrderSetQuery } from '@/hooks/order/useNumberOrderSetQuery';
import { useStoreOrderSetQuery } from '@/hooks/order/useStoreOrderSetQuery';
import { useStoreSetQuery } from '@/hooks/query/store/useStoreSetQuery';
import { useSalesQuery } from '@/hooks/sales/useSalesQuery';
import { decrementRemainEaByMenuId } from '@/server/api/supabase/menu-item';
import { groupByKey } from '@/shared/helper';
import useKioskState, { ORDER_STEP, addOrderId, getTotalPrice, setOrderNumber, setStep } from '@/shared/store/kiosk';
import { Tables, TablesInsert } from '@/types/supabase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoBagCheckOutline } from 'react-icons/io5';
import MenuHeader from '../common/MenuHeader';
import styles from './styles/SuccessContainer.module.css';
import { useTranslation } from 'react-i18next';

const SuccessContainer = ({ payment }: { payment?: Payment }) => {
  const orderList = useKioskState(state => state.orderList);
  const storeId = useKioskState(state => state.storeId);
  const tableId = useKioskState(state => state.tableId);
  const menuData = useKioskState(state => state.menuData);
  const orderNumber = useKioskState(state => state.orderNumber);
  const orderType = useKioskState(state => state.orderType);
  const selectedLanguage = useKioskState(state => state.selectedLanguage);

  const { addSales } = useSalesQuery();
  const { addStoreOrder } = useStoreOrderSetQuery();
  const { addNumberOrder } = useNumberOrderSetQuery();
  const { incrementOrderNumber, newOrderNumber } = useStoreSetQuery();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const clickCheckOrderHandler = () => {
    router.push('/kiosk/receipt');
  };

  useEffect(() => {
    if (payment?.status === 'DONE') {
      if (!orderType) {
        console.error('주문 타입이 없습니다.');
        return;
      }

      if (!storeId) {
        console.error('가게 정보가 없습니다.');
        return;
      }

      // 결제 승인시 sales테이블에 담아놓은 orderList 데이터를 insert 한다.
      const group = groupByKey<Tables<'menu_item'>>(orderList, 'id');
      const salesData: TablesInsert<'sales'>[] = [...group].map(([, value]) => ({
        store_id: storeId,
        sales_date: payment.approvedAt,
        product_name: value[0].name,
        product_ea: value.length,
        product_category: menuData?.find(menu => menu.id === value[0].category_id)?.name,
        product_price: value[0].price,
      }));

      addSales(salesData);
      incrementOrderNumber(storeId);
      addOrderId(payment.orderId);
    }
  }, [orderList]);

  // sales 테이블에 데이터 업로드시 orderIdList가 바뀐다. orderIdList가 바뀌면
  // 주문내역 테이블 (order_store, order_number)에 insert 한다.
  useEffect(() => {
    if (payment?.status === 'DONE' && storeId && newOrderNumber && newOrderNumber > 0) {
      const orderData = {
        order_number: newOrderNumber,
        store_id: storeId,
        menu_list: orderList.map(order => JSON.parse(JSON.stringify(order))),
        order_time: payment.approvedAt,
        order_id: payment.orderId,
        total_price: getTotalPrice(orderList),
        is_done: false,
        payment_method: payment.method,
      };

      if (orderType.type == 'togo') {
        // 포장 주문 insert !!
        addNumberOrder({ ...orderData, is_togo: true });
      } else if (orderType.type === 'store') {
        // 매장 주문 insert!
        if (tableId) {
          addStoreOrder({ ...orderData, table_id: tableId });
        } else {
          addNumberOrder({ ...orderData, is_togo: false });
        }
      }

      // 주문한 메뉴의 남은 수량 감소 시키기
      orderList.forEach(menu => {
        decrementRemainEaByMenuId(menu.id);
      });
      setStep(ORDER_STEP.SUCCESS);
      setOrderNumber(newOrderNumber);
    }
  }, [newOrderNumber]);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage.split('-')[1]);
    setIsPageLoading(false);
  }, []);

  return (
    <>
      {!isPageLoading && (
        <div className={styles.container}>
          <MenuHeader />
          <div className={styles.wrapper}>
            <div className={styles.content}>
              <h1>{t('order-success')}</h1>
              <div>
                <IoBagCheckOutline size={100} />
              </div>
              <div className={styles.orderNumber}>
                {t('order-number')} <strong>{orderNumber}</strong>
              </div>
              <div className={styles.checkOrder} onClick={clickCheckOrderHandler}>
                {t('footer.check-order')}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessContainer;
