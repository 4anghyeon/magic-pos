import { useMutation } from '@tanstack/react-query';
import { incrementOrderNumber } from '@/server/api/supabase/store';
import useOrderStore from '@/shared/store/order';

/**
 * supabase store table CRUD hook
 */
export const useStoreQuery = () => {
  const { setOrderNumber } = useOrderStore();

  const incrementOrderNumberMutation = useMutation({
    mutationFn: incrementOrderNumber,
    onSuccess: ({ orderNumber, error }) => {
      if (!error) setOrderNumber(orderNumber ?? -1);
      else console.error(error);
    },
    onError: error => {
      console.error(error);
    },
  });

  return { incrementOrderNumber: incrementOrderNumberMutation.mutate };
};
