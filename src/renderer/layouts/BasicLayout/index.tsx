import React from 'react';
import styles from './style.scss';
import Pet from '@/modules/Pet';
console.log('styles: ', styles);

const BasicLayout = () => {
  return (
    <div>
      <Pet></Pet>
    </div>
  );
};

export default BasicLayout;
