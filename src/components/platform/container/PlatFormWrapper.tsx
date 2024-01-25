import {
  downloadPlatFormImageUrl,
  fetchPlatForm,
  removePlatFormData,
  removePlatFormImage,
  updatePlatFormData,
  uploadPlatFormImage,
} from '@/server/api/supabase/platform';
import { isEmptyObject } from '@/shared/helper';
import usePlatFormStore, {
  resetEditPlatForm,
  setAddPlatFormStoreId,
  setEditPlatForm,
  setFetchPlatFormData,
} from '@/shared/store/platform';
import useAuthState from '@/shared/store/session';
import { TablesInsert } from '@/types/supabase';
import clsx from 'clsx';
import moment from 'moment';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Card from './card/Card';
import Form from './form/Form';
import AddButton from './form/button/Button';
import styles from './styles/container.module.css';
import EditButton from '/public/icons/pencil.svg';
import Logo from '/public/logo.svg';
export interface AddFormType {
  file?: File | null;
  image_url?: string;
  name: string;
  store_id: string;
  createdAt?: string;
  link_url: string;
  id?: string | null;
}

export interface EditFormType {
  id: string;
  name: string;
  link_url: string;
  store_id: string | null;
  image_url?: string | null;
  file?: File | null;
  createdAt?: string;
}

const PlatFormWrapper = () => {
  const storeId = useAuthState(state => state.storeId);
  setAddPlatFormStoreId(storeId!);

  const isRegist = usePlatFormStore(state => state.isRegist);

  /**
   * 수정기능 Start
   */
  const [isEdit, setIsEdit] = useState(false);
  const [isShowEditForm, setIsShowEditForm] = useState(false);
  const [preImage, setPreImage] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<EditFormType>({
    id: '',
    name: '',
    link_url: '',
    store_id: storeId!,
    image_url: preImage ?? null,
  });
  const editRef = useRef<EditFormType | null>();

  const clickEditCancel = () => {
    setEditTarget(pre => ({
      ...pre,
      id: '',
      name: '',
      link_url: '',
      image_url: preImage ?? null,
      file: null,
    }));

    resetEditPlatForm();
    setIsShowEditForm(false);
    setClickedTab('');
  };

  const changePreview = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files || [];
    if (fileList?.length !== 0) {
      const file = fileList[0];
      const currentImgUrl = URL.createObjectURL(file);

      setPreImage(currentImgUrl);
      setEditTarget(pre => ({
        ...pre,
        file,
      }));
    }
  };

  const removeImage = () => {
    setPreImage(null);
    resetEditPlatForm();
  };
  const updatePlatForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const editData: EditFormType = {
      ...editTarget,
    };

    // object의 각 value 값을 비교해서 틀린 값만을 추출하기
    let comparedData = Object.entries(editData).reduce((acc, [key, value]) => {
      if (editRef.current![key as keyof EditFormType] !== value) {
        acc[key as keyof EditFormType] = value;
      }
      if (editRef.current!['image_url']) {
        acc['image_url'] = editRef.current!['image_url'];
      }

      return acc;
    }, new Object() as EditFormType);

    if (isEmptyObject(comparedData) && editRef.current?.image_url === preImage) return;
    // 나중에 refactoring하기
    comparedData.id = editData.id;
    comparedData.store_id = editData.store_id;
    comparedData.createdAt;

    // 기존이미지가 있고 이미지 변경 했을 때
    if (editRef.current?.image_url && comparedData.file) {
      comparedData.createdAt = moment().toISOString();
      // 기존 이미지 삭제
      await removePlatFormImage(editRef.current);
      // 새로운 이미지 업로드
      await uploadPlatFormImage(comparedData);
      const { publicUrl: image_url } = downloadPlatFormImageUrl(comparedData);
      comparedData = {
        ...comparedData,
        image_url,
      };
      const { file, createdAt, ...updateTarget } = comparedData;
      await updatePlatFormData(updateTarget as TablesInsert<'platform'>);
    }

    // 기존데이터에 이미지가 없을 때 이미지 등록을 할 때
    if (!editRef.current?.image_url && comparedData.file) {
      comparedData.createdAt = moment().toISOString();

      await uploadPlatFormImage(comparedData);
      const { publicUrl: image_url } = downloadPlatFormImageUrl(comparedData);
      comparedData = {
        ...comparedData,
        image_url,
      };
      const { file, createdAt, ...updateTarget } = comparedData;
      await updatePlatFormData(updateTarget as TablesInsert<'platform'>);
    }

    // 수정 할 때 이미지만 삭제 할 때 실행 되는 조건문
    if (!preImage && !comparedData.link_url && !comparedData.name) {
      await removePlatFormImage(comparedData);
      const { file, createdAt, ...updateTarget } = comparedData;
      await updatePlatFormData({ ...updateTarget, image_url: null } as TablesInsert<'platform'>);
      const { platform, error } = await fetchPlatForm(storeId!);
      setFetchPlatFormData(platform);
      setIsShowEditForm(false);
      return;
    }
    const { file, createdAt, ...updateTarget } = comparedData;
    await updatePlatFormData(updateTarget as TablesInsert<'platform'>);
    const { platform, error } = await fetchPlatForm(storeId!);
    setFetchPlatFormData(platform);
    setIsShowEditForm(false);
  };

  // 수정 할 카드의 정보를 담는 useEffect입니다.
  useEffect(() => {
    if (editRef.current) return;
    editRef.current = { ...editTarget };
    return () => {
      editRef.current = null;
    };
  }, [isShowEditForm]);

  const [clikcedTab, setClickedTab] = useState('');
  /**
   * 수정 기능 End
   */

  /**
   * 삭제 기능
   */
  const onClickRemoveData = async () => {
    await removePlatFormData(editTarget.id);
    await removePlatFormImage(editTarget);
    const { platform } = await fetchPlatForm(editTarget.store_id!);
    setFetchPlatFormData(platform);
    setIsShowEditForm(false);
  };

  return (
    <div className={styles.container}>
      <AddButton />

      <Card
        isEdit={isEdit}
        setEditTarget={setEditTarget}
        setIsShowEditForm={setIsShowEditForm}
        setPreImage={setPreImage}
      />

      {isRegist && <Form />}

      {isShowEditForm && (
        <form onSubmit={updatePlatForm} className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <div className={styles.imgWrapper}>
              <label htmlFor="file" className={styles.imgLabel}>
                <button
                  className={clsx(styles.defaultDeleteButton, preImage && styles.hasDeleteButton)}
                  type="button"
                  name="delete-img"
                  onClick={removeImage}
                >
                  X
                </button>

                {preImage ? (
                  <Image className={styles.img} src={preImage} alt={editTarget.name} width={200} height={200} />
                ) : (
                  <Logo />
                )}
              </label>

              <label htmlFor="file" className={styles.btnWrap}>
                <span>
                  <EditButton width={27} height={27} />
                </span>
              </label>

              <input type="file" id="file" className={styles.file} onChange={changePreview} />
            </div>

            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type="text"
                value={editTarget.link_url}
                placeholder="link를 넣어주세요"
                name="link_url"
                onChange={setEditPlatForm}
              />
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="어디사이트인가여"
                value={editTarget.name}
                onChange={setEditPlatForm}
              />
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              <p>수정</p>
            </button>
            <button onClick={onClickRemoveData} type="button" className={styles.button}>
              <p>삭제</p>
            </button>
            <button onClick={clickEditCancel} type="button" className={styles.button}>
              <p>취소</p>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PlatFormWrapper;
