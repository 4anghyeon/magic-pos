import { useAuth } from '@/hooks/auth/useAuth';
import useAuthStore from '@/shared/store/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/StickBar.module.css';

const StickBar = () => {
  const { logout } = useAuth();
  const { session } = useAuthStore(session => session);
  const [isLoaded, setIsLoaded] = useState(false);
  const actualSession = session?.session;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {isLoaded && (
        <div className={styles.wrapper}>
          <Link className={styles.logo} href="/">
            Magic pos
          </Link>

          <div className={styles.tabArea}>
            {actualSession === undefined ? (
              <>
                <Link href="/auth/signup">회원가입</Link>
                <Link href="/auth/login">로그인</Link>
              </>
            ) : (
              <>
                <Link href="/" onClick={() => logout()}>
                  로그아웃
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StickBar;