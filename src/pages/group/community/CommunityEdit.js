import React, {PureComponent} from 'react';
import { Form, Card,Input, Button, Upload, message ,Icon,Modal} from 'antd';
import { connect } from 'dva';
const QINIU_SERVER = 'https://up-z2.qiniup.com'
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
export default class CommunityEdit extends PureComponent {

  state = {
    OrganizationId:'',
    GroupId:'',
    loading: false,
  };

  componentWillMount(){
    const {dispatch,match:{params}} = this.props
    this.setState({
      OrganizationId:userData.id,
      GroupId:params.GroupId,
    },()=>{
      dispatch({
        type: 'community/queryCommunityInfo',
        payload: {
          GroupId:this.state.GroupId,
          OrganizationId:this.state.OrganizationId
        },
      })
    })
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

  sumbit(){
    const {dispatch,community:{communityInfo}} = this.props;
    const {validateFields } = this.props.form;
    validateFields((err, values) => {
      if(!err){

        let data = {
          ...communityInfo,
          ...values
        }

        Object.keys(data).map((v,k)=>{
          if(data[v]===''){
            delete data[v]
          }

        })

        dispatch({
          type: 'community/submitCommunityEdit',
          payload: {
            ...data,
            OrganizationId:this.state.OrganizationId,
            GroupId:this.state.GroupId
          },
        });
      }
    })
  }
  onChange = (info,name) => {

    const {dispatch,community:{communityInfo},tokens} = this.props;

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }

    if (info.file.status === 'done') {

      dispatch({
        type: 'community/setCommunityInfo',
        payload: {
          ...communityInfo,
          [name]: tokens.StoreUrl,
          ['temp'+name]:tokens.AccessUrl
        },
      });

      this.setState({
        loading: false,
      })
    }
  }

  render(){
    const { community:{communityInfo,loading},tokens} = this.props;

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
        title:'编辑社团',
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
            label="组织名称"
          >
            {communityInfo.OrganizationName}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="社团名称"
          >
            {getFieldDecorator('GroupName', {
              initialValue: communityInfo.Name || '',
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
              initialValue: communityInfo.ManagerName || '',
              rules: [{ required: true, message: '团长姓名必填项' }]
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
              initialValue: communityInfo.ManagerMobile || '',
              rules: [{
                validator:(rule,val,callback)=>{this.checkBind(rule,val,callback)}
              }]
            })(
              <Input placeholder="请输入手机号" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="用户名"
          >
            {communityInfo.ManagerWxNickname}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="提货地址"
          >
            {getFieldDecorator('GroupAddress', {
              initialValue: communityInfo.Address || '',
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
              initialValue: communityInfo.PostCode || '',
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
              initialValue: communityInfo.ManagerIdCardNumber || '',
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
                {communityInfo.tempManagerIdCardFront ? <img src={communityInfo.tempManagerIdCardFront} width='100%' alt="" /> : <div>
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
                {communityInfo.tempManagerIdCardBack ? <img src={communityInfo.tempManagerIdCardBack} width='100%' alt="" /> : <div>
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

