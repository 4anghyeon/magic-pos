import { create } from 'zustand';

/**
 * 일반고객의 주문과 관련된 전역 상태를 관리하는 store 입니다.
 */

interface OrderState {
  step: number;
  readonly maxStep: number;
  goNextStep: () => void;
  goPrevStep: () => void;
}

const useOrderStore = create<OrderState>()(set => ({
  //  현재 주문 단계를 나타냅니다.
  step: 0,
  maxStep: 4,
  goNextStep: () => set(state => ({ step: Math.min(state.step + 1, state.maxStep) })),
  goPrevStep: () => set(state => ({ step: Math.max(state.step - 1, 0) })),
}));

export default useOrderStore;