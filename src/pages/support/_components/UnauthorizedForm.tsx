import { withVerifyCode } from '@tidb-community/ui';
import { Button, Checkbox, Col, Input, Row } from 'antd';
import { Formik } from 'formik';
import { FormItem } from 'formik-antd';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { SupportForm, SupportFormDescription, SupportFormRequiredLabel } from '~/pages/support/_components/SupportForm';

type UnauthorizedFormValues = {
  name: string;
  company: string;
  details: string;
  phone: string;
  vcode: string;
};

const INITIAL_VALUES: UnauthorizedFormValues = { name: '', company: '', details: '', phone: '', vcode: '' };

const fields = {
  name: {
    placeholder: '输入您的姓名',
    name: 'name',
  },
  company: {
    placeholder: '请输入您的公司名',
    name: 'company',
  },
  details: {
    placeholder: '请添加描述',
    name: 'details',
  },
  phone: {
    placeholder: '请输入手机号',
    name: 'phone',
  },
  vcode: {
    placeholder: '验证码',
    name: 'vcode',
  },
};

const schema = Yup.object({
  phone: Yup.string().required('请输入手机号'),
  vcode: Yup.string().required('请输入验证码'),
  name: Yup.string().min(2, '请输入有效姓名').required('未填写姓名'),
  company: Yup.string().min(2, '请输入有效公司名').required('未填写公司'),
  details: Yup.string(),
});

const VerifyCodeInput = withVerifyCode(Input);

export function UnauthorizedForm() {
  const [agree, setAgree] = useState(false);

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={schema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {(formik) => (
        <SupportForm onSubmit={formik.handleSubmit}>
          <SupportFormDescription>
            为了更好地为您提供商业支持和个性化服务，请填写以下信息。我们承诺保护您的隐私，并仅将信息用于提供服务，我们将在
            1 个工作日内和您联系。
          </SupportFormDescription>
          <Row gutter={8}>
            <Col xs={24}>
              <Row gutter={16}>
                <Col xs={18}>
                  <FormItem
                    name="phone"
                    colon={false}
                    label={<SupportFormRequiredLabel>手机号</SupportFormRequiredLabel>}
                    labelCol={{ xs: 24 }}
                    labelAlign={'left'}
                  >
                    <Input id="phone" {...fields.phone} onChange={formik.handleChange} />
                  </FormItem>
                </Col>
                <Col xs={6}>
                  <FormItem name="vcode" label={<>&nbsp;</>} colon={false} labelCol={{ xs: 24 }} labelAlign={'left'}>
                    <VerifyCodeInput
                      id="vcode"
                      {...fields.vcode}
                      onChange={formik.handleChange}
                      sendVerifyCode={async () => {}}
                      limitSeconds={60}
                      buttonDisabled
                      sendVerifyCodeBtnText="发送"
                      initialLimited={false}
                      countDownFormatter={(a) => `${a}`}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <FormItem
                name="name"
                colon={false}
                label={<SupportFormRequiredLabel>姓名</SupportFormRequiredLabel>}
                labelCol={{ xs: 24 }}
                labelAlign={'left'}
              >
                <Input id="name" {...fields.name} onChange={formik.handleChange} />
              </FormItem>
            </Col>
            <Col xs={24} md={12}>
              <FormItem
                name="company"
                colon={false}
                labelCol={{ xs: 24 }}
                label={<SupportFormRequiredLabel>公司</SupportFormRequiredLabel>}
                labelAlign={'left'}
              >
                <Input id="company" {...fields.company} onChange={formik.handleChange} />
              </FormItem>
            </Col>
            <Col xs={24}>
              <FormItem
                name="details"
                colon={false}
                labelCol={{ xs: 24 }}
                label={<SupportFormRequiredLabel>咨询事宜（非必填）</SupportFormRequiredLabel>}
                labelAlign={'left'}
              >
                <Input.TextArea id="details" {...fields.details} onChange={formik.handleChange} />
              </FormItem>
            </Col>
          </Row>
          <Button disabled={!agree || !formik.isValid} style={{ marginTop: 16 }} type="primary" htmlType="submit" block>
            确认
          </Button>
          <Checkbox style={{ marginTop: 8 }} checked={agree} onChange={(ev) => setAgree(ev.target.checked)}>
            我已阅读并同意{' '}
            <a
              style={{ textDecoration: 'underline' }}
              href="https://www.pingcap.cn/privacy-policy"
              target="_blank"
              rel="noopener"
            >
              《隐私协议》
            </a>
          </Checkbox>
        </SupportForm>
      )}
    </Formik>
  );
}
