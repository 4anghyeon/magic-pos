import { supabase } from '@/shared/supabase';
import { OrderConfirmType } from '@/types/common';

export const fetchManagement = async (id?: string) => {
  if (id) {
    const { data: store, error } = await supabase.from('store')
      .select('*, store_table(*),order_store(*),order_number(*)')
      .eq('business_id', id)
      .eq('order_store.is_done', false)
      .eq('order_number.is_done', false);

    const storeData = store?.map(store => ({
      ...store,
      order_store: store.order_store.sort((a, b) => (a.order_number > b.order_number ? -1 : 1)),
    }));
    if (error) throw new Error(error.message);
    return storeData;
  }
};

export const updateIsDone = async (orderData: OrderConfirmType[]) => {
  for (let i = 0; i < orderData.length; i++) {
    const { error } = await supabase
      .from(`${orderData[i].isTogo ? 'order_number' : 'order_store'}`)
      .update({ is_done: true })
      .eq('id', orderData[i].id)
      .select()
    if (error) throw new Error(error.message);
  }
}