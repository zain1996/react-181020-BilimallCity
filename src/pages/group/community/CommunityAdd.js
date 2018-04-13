import React, {PureComponent} from 'react';
import { Form, Card,Input, Button, Upload, message ,Icon,Modal} from 'antd';
import { connect } from 'dva';
const QINIU_SERVER = 'http://up-z2.qiniup.com'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {getLocalStorage} from '../../../utils/utils'
const userData = getLocalStorage('userData');

function beforeUpload(file) {
  const {dispatch,OrganizationId} = this.props
  // const isJPG = file.type === 'image/jpeg';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
    return
  }
  return  dispatch({
    type: 'getToken/queryIdCardPicToken',
    payload:{
      FileNames:[file.name],
      OrganizationId:OrganizationId
    }
  })

}

@Form.create()
@connect(state=>({
  community:state.community,
  tokens:state.getToken.tokens
}))
export default class CommunityAdd extends PureComponent {

  state = {
    loading: false,
  };

  sumbit(){
    const {dispatch} = this.props;
    const {validateFields } = this.props.form;
    validateFields((err, values) => {
      // if(values.GroupPostCode===''){
      //   delete values.GroupPostCode;
      // }
      // if(values.ManagerIdCardNumber===''){
      //   delete values.ManagerIdCardNumber;
      // }
      if(!err){
        dispatch({
          type: 'community/submitCommunityAdd',
          payload: {
            ...values,
            ManagerIdCardFront:this.state.ManagerIdCardFront,
            ManagerIdCardBack:this.state.ManagerIdCardBack,
            OrganizationId:userData.id
          },
        });
      }
    })
  }
  onChange = (info,name) => {

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    const {tokens} = this.props
    if (info.file.status === 'done') {

      this.setState({
        loading: false,
        [name]: tokens.StoreUrl,
        ['temp'+name]:tokens.AccessUrl
      })
    }
  }

  checkBind(rule,val,callback){
    if(!val){
      callback('手机号为必填项')
      return
    }
    if(!/^1\d{10}$/.test(val)){
      callback('手机格式有误')
      return
    }
    callback()
  }

  render(){
    const { community:{loading},tokens} = this.props;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 9,
      },
      wrapperCol: {
        span: 5,
      },
    };
    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'社团管理',
        href:'/group/community'
      }
      ,
      {
        title:'添加社团',
      }
    ]
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}>
        <Form layout="horizontal" style={{marginTop:40}}>
          <Form.Item
            {...formItemLayout}
            label="社团名称"
          >
            {getFieldDecorator('GroupName', {
              rules: [{ required: true, message: '社团名称为必填项' }]
            })(
              <Input placeholder="请输入社团名称" />
            )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="团长姓名"
          >
            {getFieldDecorator('ManagerName', {
              rules: [{ required: true, message: '团长姓名为必填项' }]
            })(
              <Input placeholder="请输入团长姓名" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            hasFeedback
            required
            label="手机号"
          >
            {getFieldDecorator('ManagerMobile', {
              validateTrigger: 'onBlur',
              rules: [{
                validator:(rule,val,callback)=>{this.checkBind(rule,val,callback)}
              }]
            })(
              <Input placeholder="请输入手机号" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="提货地址"
          >
            {getFieldDecorator('GroupAddress', {
              rules: [{ required: true, message: '提货地址为必填项' }]
            })(
              <Input placeholder="请输入提货地址" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="邮编"
          >
            {getFieldDecorator('GroupPostCode', {
              validateTrigger:'onBlur',
              rules:[
                { len:6,message:'邮政编码输入长度为六位'}
              ]
            })(
              <Input placeholder="请输入邮编" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="身份证号"
          >
            {getFieldDecorator('ManagerIdCardNumber', {
            })(
              <Input placeholder="请输入身份证号" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="身份证正反面照片"
          >
            <div style={{display:'flex'}}>
              <Upload
                name="file"
                data={tokens}
                listType="picture-card"
                showUploadList={false}
                action={QINIU_SERVER}
                beforeUpload={beforeUpload.bind(this)}
                onChange={(e)=>{this.onChange(e,'ManagerIdCardFront')}}
              >
                {this.state.tempManagerIdCardFront ? <img src={this.state.tempManagerIdCardFront} width='100%' alt="" /> : <div>
                  <Icon type={this.state.loading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">身份证正面</div>
                </div>}
              </Upload>
              <Upload
                name="file"
                data={tokens}
                listType="picture-card"
                showUploadList={false}
                action={QINIU_SERVER}
                beforeUpload={beforeUpload.bind(this)}
                onChange={(e)=>{this.onChange(e,'ManagerIdCardBack')}}
              >
                {this.state.tempManagerIdCardBack ? <img src={this.state.tempManagerIdCardBack} width='100%' alt="" /> : <div>
                  <Icon type={this.state.loading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">身份证反面</div>
                </div>}
              </Upload>
            </div>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 5 },
              sm: { span: formItemLayout.wrapperCol.span, offset: 10 },
            }}
          >

            <Button loading={loading} onClick={this.sumbit.bind(this)} type="primary" >
              确定
            </Button>
          </Form.Item>
        </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
};

