import useToggleState from '@/shared/store/toggle';
import { useEffect } from 'react';
import Footer from './footer/Footer';
import Header from './header/Header';
import Contents from './main/Contents';
import styles from './styles/Home.module.css';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { isChecked, resetToggle } = useToggleState();

  useEffect(() => {
    return () => {
      if (!isChecked) resetToggle();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.mainWrapper}>
        <Contents />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
