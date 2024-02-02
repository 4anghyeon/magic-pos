import Button from '@/components/common/Button';
import { useAuthSetQuery } from '@/hooks/query/auth/useAuthSetQuery';
import useToggleState, { defaultCheckBox } from '@/shared/store/toggle';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { loginInput } from '../../../data/input-props';
import Input from '../element/Input';
import SignCaption from '../element/SignCaption';
import styles from '../styles/Auth.module.css';

const Login = () => {
  const { getValues, setValue, register, handleSubmit, watch } = useForm<Inputs>();
  const { login } = useAuthSetQuery();
  const isCheckbox = useToggleState(state => state.isCheckbox);
  const value = getValues();
  const email = watch('email');
  const router = useRouter();
  const path = router.pathname;

  const clickLoginHandler: SubmitHandler<Inputs> = data => {
    login(data);
  };

  const keyDownLoginHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      login(value);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email && path === '/auth/login') {
      setValue('email', email);
      defaultCheckBox();
    }
  }, [path]);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(clickLoginHandler)}>
        <div className={styles.titleWrapper} onClick={() => router.push('/')}>
          <h1 className={styles.title}>편리함의 시작</h1>
        </div>
        <div className={styles.fieldContainer}>
          {loginInput.map(field => {
            return (
              <Fragment key={field.id}>
                <div className={styles.inputContanier} id={field.name}>
                  <Input
                    type={field.type}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    register={register}
                    name={field.name}
                    validation={field.validation}
                    keyDownLoginHandler={keyDownLoginHandler}
                  />
                </div>
              </Fragment>
            );
          })}
          <SignCaption email={email} isCheckbox={isCheckbox} />
          <div className={styles.buttonBox}>
            <Button type="submit" className={styles.submitButton}>
              로그인
            </Button>
            <Button type="button" className={styles.pushButton} onClick={() => router.push('/auth/signup')}>
              회원가입
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;