import React, { useEffect } from 'react';
import { useSales } from '@/hooks/sales/useSales';
import useOrderStore from '@/shared/store/order';
import { groupByKey } from '@/shared/helper';
import { Tables } from '@/types/supabase';

const SuccessContainer = ({ payment }: { payment?: Payment }) => {
  const { orderList, storeId, menuData } = useOrderStore();
  const { addSales } = useSales();

  useEffect(() => {
    if (payment?.status === 'DONE') {
      const group = groupByKey<Tables<'menu_item'>>(orderList, 'id');
      const insertDataList = [...group].map(([, value]) => ({
        store_id: storeId,
        sales_date: payment.approvedAt,
        product_name: value[0].name,
        product_ea: value.length,
        product_category: menuData?.find(menu => menu.id === value[0].category_id)!.name,
        product_price: value[0].price,
      })) as Omit<Tables<'sales'>, 'id'>[];

      addSales(insertDataList);
    }
  }, [orderList]);

  return <div>주문 성공</div>;
};

export default SuccessContainer;
