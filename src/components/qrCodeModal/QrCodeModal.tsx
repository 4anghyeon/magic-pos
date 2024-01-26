import useFetchManagement from '@/hooks/management/useFetchManagement';
import { useModal } from '@/hooks/service/ui/useModal';
import useAuthState from '@/shared/store/session';
import { useState } from 'react';
import QrCodeButtonBox from './QrCodeButtonBox';
import QrCodeTabButton from './QrCodeTabButton';
import PackagingQrCodeContainer from './packagingQrCodeContainer/PackagingQrCodeContainer';
import ShopQrCodeContainer from './shopQrCodeContainer/ShopQrCodeContainer';
import styles from './styles/QrCodeModal.module.css';
import CloseButton from '/public/icons/x.svg';

type QrCodeModalProps = 'shop' | 'packaging' | null;

const QrCodeModal = ({ modalId }: { modalId?: string }) => {
  const { session } = useAuthState();
  const userId = session?.user.id;
  const { data } = useFetchManagement(userId);
  const { MagicModal } = useModal();
  const [selectedComponent, setSelectedComponent] = useState<QrCodeModalProps>(
    data?.[0]?.use_table ? 'shop' : 'packaging',
  );

  const clickComponentHandler = (component: 'shop' | 'packaging') => {
    if (component === selectedComponent) return;
    setSelectedComponent(prevComponent => (prevComponent === component ? null : component));
  };

  const clickModalCloseHandler = () => {
    MagicModal.hide(modalId ?? '');
  };
  return (
    <div className={styles.qrCodeModalBox}>
      {/* QR코드 타이틀 */}
      <div className={styles.qrTitleContainer}>
        <div className={styles.qrCodeTitle}>QR코드 출력하기</div>
        <span onClick={clickModalCloseHandler}>
          <CloseButton className={styles.closeButton} width={20} height={20} />
        </span>
      </div>

      {/* QR코드 텝매뉴 */}
      {data?.[0]?.use_table && (
        <QrCodeTabButton selectedComponent={selectedComponent} clickComponentHandler={clickComponentHandler} />
      )}

      {/* QR코드 컨테이너 */}
      <div className={styles.qrCodeShowBox}>
        {data?.[0]?.use_table && selectedComponent === 'shop' && <ShopQrCodeContainer data={data} />}
        {selectedComponent === 'packaging' && <PackagingQrCodeContainer />}
      </div>

      {/* QR코드 버튼박스 */}
      <QrCodeButtonBox modalId={modalId} />
    </div>
  );
};

export default QrCodeModal;