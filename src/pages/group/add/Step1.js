import React from 'react';
import { Form, Input, Button, Select, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;

export default ({ formItemLayout, form, dispatch, data }) => {
  const { getFieldDecorator, validateFields } = form;
  const onValidateForm = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'group/setGroupAdd',
          payload: {
            ...data,
            ...values,
          },
        });
        dispatch(routerRedux.push('/group/groupList&/groupAdd/confirm'));
      }
    });
  };
  return (
    <div>
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Form.Item
          {...formItemLayout}
          label="创建管理员账号"
        >
          {getFieldDecorator('ManagerMobile', {
            initialValue: data.ManagerMobile || '',
            rules: [{ required: true, message: '创建管理员账号不能为空' }],
          })(
            <Input placeholder="手机号" />
          )}

        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('ManagerNickname', {
            initialValue: data.ManagerNickname || '',
            rules: [{ required: true, message: '用户名不能为空' }],
          })(
            <Input placeholder="昵称/真实姓名" />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
      {/*<Divider style={{ margin: '40px 0 24px' }} />*/}
      {/*<div className={styles.desc}>*/}
        {/*<h3>说明</h3>*/}
        {/*<h4>转账到支付宝账户</h4>*/}
        {/*<p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>*/}
        {/*<h4>转账到银行卡</h4>*/}
        {/*<p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>*/}
      {/*</div>*/}
    </div>
  );
};
