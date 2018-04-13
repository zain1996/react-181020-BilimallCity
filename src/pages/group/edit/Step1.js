import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import styles from './style.less';

class Step1 extends PureComponent {
  render(){
    const {formItemLayout,form,dispatch,data,next} = this.props
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'editGroup/setEditDate',
            payload: {
              ...data,
              ...values,
            },
          });
          next();
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
      </div>
    );
  }
}
export default Step1
