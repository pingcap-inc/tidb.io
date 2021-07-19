import * as R from 'ramda';
import React, { useState } from 'react';
import { Button, Col, Row, message } from 'antd';
import { Checkbox, Form } from 'formik-antd';
import { Formik } from 'formik';
import { Link } from '@tidb-community/ui';
import { useTranslation } from 'next-i18next';

import { form as formUtils } from '~/utils';
import { getCommonFields, getSchema, getInitialValues } from './commonForm.fields';

const FormComponent = ({ children, submitApi, formFields, formLocalePath }) => {
  const { t } = useTranslation('page-contact-us', 'common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lang = {
    ...t(formLocalePath, { returnObjects: true }),
    ...t('common:form', { returnObjects: true }),
  };
  const { agreement: agreementLang } = lang;

  const fields = {
    ...getCommonFields({ lang }),
    ...formFields,
  };
  const validationSchema = getSchema(fields);
  const initialValues = getInitialValues(fields);
  const { agreement } = fields;

  const onSubmit = formUtils.wrapFormikSubmitFunction(({ agreement, ...values }) => {
    setIsSubmitting(true);

    return submitApi(values)
      .then(() => {
        message.success(lang.submitSuccessful);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  });

  const formikProps = {
    initialValues,
    onSubmit,
    validationSchema,
  };

  return (
    <Formik {...formikProps}>
      {({ errors }) => (
        <Form layout="vertical">
          <Row gutter={[32, 16]}>
            {children}

            <Col span={24}>
              <Form.Item name={agreement.name}>
                <Checkbox {...agreement}>
                  {agreementLang.text}
                  <Link href={agreementLang.privacy.link}>{agreementLang.privacy.title}</Link>
                </Checkbox>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Button
                type="primary"
                htmlType="submit"
                size="small"
                disabled={!R.isEmpty(errors)}
                loading={isSubmitting}
              >
                {lang.submit}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default FormComponent;
