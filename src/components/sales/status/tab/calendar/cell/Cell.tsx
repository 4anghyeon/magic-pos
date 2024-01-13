import useManagementState from '@/shared/store/management';
import styles from '../styles/calendar.module.css';
import CellItem from './CellItem';

const Cell = () => {
  const {
    date: { currentDate },
  } = useManagementState();

  const startDay = currentDate.clone().startOf('month').startOf('week'); // monthStart가 속한 주의 시작 주
  const endDay = currentDate.clone().endOf('month').endOf('week'); // monthStart가 속한 마지막 주

  const row = [];
  let days = [];
  let day = startDay;

  while (day <= endDay) {
    for (let i = 0; i < 7; i++) {
      days.push(<CellItem key={day.clone().format('YY MM DD')} day={day} />);
      day = day.clone().add(1, 'day');
    }
    row.push(
      <div key={days[0].key} className={styles['calendar-row']}>
        {days}
      </div>,
    );
    days = [];
  }
  return <div className={styles['calendar-body']}>{row}</div>;
};

export default Cell;
