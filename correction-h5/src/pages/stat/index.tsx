import React, { useEffect } from 'react';
import { history } from 'umi';

import styles from './index.less';
import { faChevronLeft, faSync } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '@/components/PageHeader';

const StatPage = (props: any) => {
  return (
    <>
      <PageHeader
        title={'统计'}
        leftIcon={faChevronLeft}
        onClickLeft={() => history.goBack()}
        rightIcon={faSync}
        onClickRight={() => console.log('resync')}
      />
    </>
  );
};

export default StatPage;
