import { useRouter } from 'next/router';
import { Fragment } from 'react';
import styles from './styles/Auth.module.css';

interface InputProps {
  value: Record<string, string>;
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDownHandler?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface InputType {
  id: number;
  name: string;
  type: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input = ({ value, onChangeHandler, onKeyDownHandler }: InputProps) => {
  const path = useRouter().pathname;

  const emailInput = {
    id: 1,
    name: 'email',
    type: 'text',
    label: '이메일',
    placeholder: '이메일',
  };

  const passwordInput = {
    id: 2,
    name: 'password',
    type: 'password',
    label: '비밀번호',
    placeholder: '비밀번호',
  };

  const passwordSignUpInput = {
    id: 3,
    name: 'password',
    type: 'password',
    label: '비밀번호',
    placeholder: '비밀번호: 최소 8자리 이상 25자리 이하 (알파벳, 특수문자 포함)',
  };

  const passwordConfirmInput = {
    id: 4,
    name: 'passwordConfirm',
    type: 'password',
    label: '비밀번호 확인',
    placeholder: '비밀번호 확인',
  };

  const businessNameInput = {
    id: 5,
    name: 'businessName',
    type: 'text',
    placeholder: '상호명',
  };

  const businessNumberInput = {
    id: 6,
    name: 'businessNumber',
    type: 'text',
    label: '사업자등록번호',
    placeholder: '사업자등록번호 (10자리)',
    minLength: 10,
    maxLength: 10,
    onKeyDown: onKeyDownHandler,
  };

  const storeEmailInput = {
    id: 7,
    name: 'storeEmail',
    type: 'text',
    label: '이메일',
    disabled: true,
  };

  const bnoNumberInput = {
    id: 8,
    name: 'bnoNumber',
    type: 'text',
    label: '사업자등록번호',
    disabled: true,
  };

  const storeBusineesNameInput = {
    id: 9,
    name: 'storeName',
    type: 'text',
    label: '상호명',
    placeholder: '가게 이름',
    disabled: true,
  };

  const inputOptions: Record<string, InputType[]> = {
    '/auth/login': [emailInput, passwordInput],
    '/auth/signup': [emailInput, passwordSignUpInput, passwordConfirmInput, businessNameInput, businessNumberInput],
    '/auth/findPassword': [emailInput],
    '/auth/reset': [passwordInput, passwordConfirmInput],
    '/admin/store': [storeEmailInput, bnoNumberInput, storeBusineesNameInput],
  };

  const inputs = inputOptions[path];

  return (
    <>
      {inputs.map((input: InputType) => {
        const key = input.name as keyof typeof value;
        if (input) {
          return (
            <Fragment key={input.id}>
              {path === '/admin/store' && <label htmlFor={input.name}>{input.label}</label>}
              <input
                id={input.name}
                className={styles['input']}
                name={input.name}
                value={value[key]}
                onChange={onChangeHandler}
                type={input.type}
                placeholder={input.placeholder}
                minLength={input.minLength}
                maxLength={input.maxLength}
                onKeyDown={input.onKeyDown}
                disabled={input.disabled}
                required
              />
            </Fragment>
          );
        }
      })}
    </>
  );
};

export default Input;
