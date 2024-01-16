import useQRCodeDownLoad from '@/hooks/management/useQRCodeDownLoad';
import useManagementStore from '@/shared/store/management';
import { StoreWithOrderInfo, Tables } from '@/types/supabase';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import styles from './styles/QrCodeListitem.module.css';

interface propsType {
  storeTable?: Tables<'store_table'>
  orderType: string
  index: number;
}

const QrCodeListItem = ({ storeTable, orderType, index }: propsType) => {

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<StoreWithOrderInfo[]>(['management'])
  const storeId = data && data[0].id
  const tableCount = data && data[0].store_table
  const [isQrClick, setIsQrClick] = useState(false)
  const QRImage = useRef<HTMLDivElement[]>([]);
  const qrUrl = storeTable
    ? `${process.env.NEXT_PUBLIC_SUPACE_REDIRECT_TO}/${storeId}/${storeTable.id}`
    : `${process.env.NEXT_PUBLIC_SUPACE_REDIRECT_TO}/${storeId}`
  const { setQrData, qrData, reSetQrData } = useManagementStore()
  const qrDownLoad = useQRCodeDownLoad();
  const clickQrDownLoadHandler = () => {
    setIsQrClick(true)
  }
  console.log()
  useEffect(() => {
    if (tableCount) {
      if (QRImage && qrUrl && storeId && tableCount.length + 1 > qrData.length) {
        setQrData({
          qrRef: QRImage.current[index],
          qrUrl,
          orderType,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QRImage, qrUrl, storeId])
  useEffect(() => {
    console.log(qrData)
  }, [qrData])
  useEffect(() => {
    if (isQrClick) {
      qrDownLoad({
        qrRef: QRImage.current[index],
        qrUrl,
        orderType,
      });
    }
    setIsQrClick(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQrClick])

  return (
    <div className={styles['qr-code-svg-box']} ref={(el) => QRImage.current[index] = el as HTMLDivElement} onClick={clickQrDownLoadHandler}>
      <div className={clsx(styles['qr-code'],
        isQrClick && styles['active'], !storeTable && styles['order-type-togo'])} >
        {storeTable && <div className={styles['table-number']}>{storeTable.position}번 테이블</div>}
        <QRCodeSVG value={qrUrl ?? ''} />
      </div>
    </div >
  )
}

export default QrCodeListItem