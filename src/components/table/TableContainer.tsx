import useClickCUDHandler from '@/hooks/table/useClickCUDHandler';
import { StoreWithStoreTable, Tables } from '@/types/supabase';
import TableListItem from './TableListItem';
import styles from './styles/TableContainer.module.css';
import PlusButton from '/public/icons/plus.svg';

const TableContainer = ({ storeData }: { storeData: StoreWithStoreTable[] }) => {
  const { clickAddStoreTableHandler } = useClickCUDHandler();

  return (
    <div className={styles['table-container']}>
      {storeData?.[0]?.store_table
        .sort((a, b) => {
          if (a.position && b.position) {
            return a.position < b.position ? -1 : 1;
          }
          return 0;
        })
        .map((item: Tables<'store_table'>) => {
          return <TableListItem key={item.id} storeTableData={item} />;
        })}
      <div className={styles['table-list-button']} onClick={clickAddStoreTableHandler}>
        <PlusButton width="41" height="41" />
      </div>
    </div>
  );
};

export default TableContainer;
