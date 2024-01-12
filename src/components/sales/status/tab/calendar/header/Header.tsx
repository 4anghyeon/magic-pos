import useManagementState from '@/shared/store/management';
import styles from './styles/header.module.css';
const Header = () => {
  const {
    date: { currentDate },
    setCurrentDate,
  } = useManagementState();
  const clickPreMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };
  const clickNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  return (
    <div className={styles['header']}>
      <div className="wrapper">
        <span className={styles['header-text']}>
          <span className="text-year">{currentDate.clone().format('YYYY년')}</span>
          {currentDate.clone().format('MM월')}
        </span>
      </div>
      <div className={styles['btn-group']}>
        <span onClick={clickPreMonth}>이전</span>
        <span onClick={clickNextMonth}>다음</span>
      </div>
    </div>
  );
};

export default Header;
