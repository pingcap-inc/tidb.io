import React from 'react';

import BasicModal from './modal.component';

const Modal = (props) => (
  <BasicModal {...props} title="设置密码">
    <span>Modal Content</span>
  </BasicModal>
);

export default Modal;
