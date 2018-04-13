import React, {PureComponent} from 'react';
import { Form, Input, Button, Upload, message ,Icon} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class StepForm extends PureComponent {

  state = {
    loading: false,
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;

    }
    return e && e.fileList;
  }

  render(){

    const { formItemLayout, form, data, dispatch,loading } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      validateFields((err, values) => {
        dispatch({
          type: 'group/setGroupAdd',
          payload: {
            ...data,
            ...values,
          },
        });
      });
      dispatch(routerRedux.push('/group/groupList&/groupAdd/confirm'));
    };

    const onValidateForm = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'group/uploadGroupAddDate',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      });
    };
    const uploadButton = (name)=> (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{name}</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const upload = (name)=>
       (
          <Upload
            name="avatar"
            className={styles.avatarUploader}
            listType="picture-card"
            showUploadList={false}
            action="//jsonplaceholder.typicode.com/posts/"
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton(name)}
          </Upload>
      )


    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item
          {...formItemLayout}
          label="管理人姓名"
        >
          {getFieldDecorator('ManagerName', {
            initialValue: data.ManagerName || '',
            rules: [{ required: true, message: '管理人姓名不能为空' }],
          })(
            <Input placeholder="管理员真实姓名" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="管理人手机号"
        >
          {data.ManagerMobile}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="身份证正反面照片"
        >
          {getFieldDecorator('ManagerIdCardFront', {
            initialValue: data.ManagerIdCardFront || '123',
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            upload('身份证正面照片')
          )}
          {getFieldDecorator('ManagerIdCardBack', {
            initialValue: data.ManagerIdCardBack || '123',
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            upload('身份证反面照片')
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="身份证号"
        >

          {getFieldDecorator('ManagerIdCardNumber', {
            initialValue: data.ManagerIdCardNumber || '',
            rules: [{ required: true, message: '身份证号不能为空' }],
          })(
            <Input placeholder="" />
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button onClick={onPrev} style={{ marginRight: 8 }}>
            上一步
          </Button>

          <Button type="primary" onClick={onValidateForm} loading={loading}>
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
};

export default StepForm;
