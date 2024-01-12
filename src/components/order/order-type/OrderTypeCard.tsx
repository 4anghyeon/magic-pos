import React from 'react';
import { useSwiper } from 'swiper/react';
import useOrderStore from '@/shared/store/order';
import styles from './styles/OrderTypeButton.module.css';
import Image from 'next/image';

const OrderTypeCard = ({ order }: { order: OrderType }) => {
  const { goNextStep, setOrderType } = useOrderStore.getState();
  const swiper = useSwiper();

  const clickButtonHandler = () => {
    setOrderType(order);
    swiper.slideNext(600);
    goNextStep();
  };

  return (
    <div className={styles.wrapper} onClick={clickButtonHandler}>
      <div>
        <Image src={'/images/image-success.png'} alt={'test'} width={100} height={100} />
      </div>
      <span>{order.type === 'togo' ? '포장' : '매장'}</span>
    </div>
  );
};

export default OrderTypeCard;
