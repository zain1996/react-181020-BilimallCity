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

class Step2 extends PureComponent {

  state = {
    loading: false,
    imageUrl: 'https://gitee.com/assets/gitee_stars/5_float_left_people-6eb87a1b8cc1a38db68048bf62b7bf3a.png',
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

  const { formItemLayout, form, data,dispatch,prev,next} = this.props;

  const { getFieldDecorator, validateFields } = form;

  const onPrev = () => {
    validateFields((err, values) => {
        dispatch({
          type: 'editGroup/setEditDate',
          payload: {
            ...data,
            ...values,
          },
        });
        prev()
    });
  };

  const onNext = () => {
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

  const uploadButton = (
    <div>
      <Icon type={this.state.loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const imageUrl = this.state.imageUrl;
  const upload = (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="//jsonplaceholder.typicode.com/posts/"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
      </Upload>
  )

  return (
    <Form layout="horizontal" className={styles.stepForm}>
      <Form.Item
        {...formItemLayout}
        label="组织名称"
      >
        {getFieldDecorator('Name', {
          initialValue: data.Name || '',
          rules: [{ required: true, message: '组织名称不能为空' }]
        })(
          <Input placeholder="" />
        )}
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label='组织logo'
      >
        {getFieldDecorator('Logo', {
          initialValue: data.Logo || this.state.imageUrl,
          valuePropName: 'fileList',
          getValueFromEvent: this.normFile,
          rules: [{ required: true, message: '组织logo不能为空' }]
        })(
          upload
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="企业名称"
      >
        {getFieldDecorator('CompanyName', {
          initialValue: data.CompanyName || '',
          rules: [{ required: true, message: '企业名称不能为空' }]
        })(
          <Input placeholder="请填写工商营业执照上的企业全称" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="企业开户名称"
      >
        {getFieldDecorator('BankAccountName', {
          initialValue: data.BankAccountName || '',
          rules: [{ required: true, message: '企业开户名称不能为空' }]
        })(
          <Input placeholder="请填写企业开户名称" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="企业开户银行"
      >
        {getFieldDecorator('BankName', {
          initialValue: data.BankName || '',
          rules: [{ required: true, message: '企业开户银行不能为空' }]
        })(
          <Input placeholder="如：招商银行" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="企业银行账户"
      >
        {getFieldDecorator('BankAccount', {
          initialValue: data.BankAccount || '',
          rules: [{ required: true, message: '企业银行账户不能为空' }]
        })(
          <Input placeholder="请输入所属企业银行账户" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="所在省份"
      >
        {getFieldDecorator('Province', {
          initialValue: data.Province || '',
          rules: [{ required: true, message: '所在省份不能为空' }]
        })(
          <Input placeholder="如：广东省" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="所在城市"
      >
        {getFieldDecorator('City', {
          initialValue: data.City || '',
          rules: [{ required: true, message: '所在城市不能为空' }]
        })(
          <Input placeholder="如：深圳市" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="营业执照注册号"
      >
        {getFieldDecorator('LicenseNumber', {
          initialValue: data.LicenseNumber || '',
          rules: [{ required: true, message: '营业执照注册号不能为空' }]
        })(
          <Input placeholder="" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="营业执照片"
      >
        {getFieldDecorator('LicensePicture', {
          initialValue: data.LicensePicture || this.state.imageUrl,
          valuePropName: 'fileList',
          getValueFromEvent: this.normFile,
          rules: [{ required: true, message: '营业执照片不能为空' }]
        })(
          upload
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="联系地址"
      >
        {getFieldDecorator('Address', {
          initialValue: data.Address || '',
          rules: [{ required: true, message: '联系地址不能为空' }]
        })(
          <Input placeholder="企业所在地址" />
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

        <Button type="primary" onClick={onNext}>
          下一步
        </Button>
      </Form.Item>
    </Form>
  );
  }
};

export default Step2;
