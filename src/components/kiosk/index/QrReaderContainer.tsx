import React, { useEffect, useState } from 'react';
import styles from './styles/QrReaderContainer.module.css';
import { useRouter } from 'next/router';
import { QrScanner } from '@yudiel/react-qr-scanner';
import useToast from '@/hooks/service/ui/useToast';
import QrReaderViewBox from '@/components/kiosk/index/QrReaderViewBox';

const QrReaderContainer = () => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  return (
    <>
      {!isPageLoading && (
        <div className={styles.container}>
          <QrScanner
            onResult={result => {
              if (result) {
                const url = result.getText();
                if (
                  url.startsWith('https://magic-pos.vercel.app') ||
                  url.startsWith('https://magic-pos.com') ||
                  url.startsWith('http://localhost:3000')
                ) {
                  router.push(url);
                }
              }
            }}
            viewFinder={() => <QrReaderViewBox />}
            onError={error => {
              console.error(error);
              toast(error.name, {
                type: 'warn',
                position: 'bottom-right',
                autoClose: 3000,
              });
            }}
            viewFinderBorder={120}
            constraints={{ facingMode: 'environment' }}
          />
        </div>
      )}
    </>
  );
};

export default QrReaderContainer;
