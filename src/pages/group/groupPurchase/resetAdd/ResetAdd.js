import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form,Button,message} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import {getLocalStorage} from '../../../../utils/utils'
import FooterToolbar from '../../../../components/FooterToolbar';
const userData = getLocalStorage('userData');

@Form.create()
class StepForm extends PureComponent {

  state = {
    TaskId:''
  };

  componentWillMount(){
    const {dispatch,match:{params}} = this.props;
    this.setState({
      TaskId:params.TaskId
    },()=>{
      dispatch({
        type:'purchaseEdit/queryPurchaseEdit',
        payload:{
          TaskId:this.state.TaskId
        }
      })
    })
  }
  sumbit(){
    const {stepFormData,dispatch,form} = this.props;
    let Info = this.childCp.childInfoCp.handleSubmit();
    let IsShow = false;
    form.validateFields((err, values) => {
      if(err){
        return
      }

      stepFormData.Combination.map((v,k)=>{
        if(!v.IsShow){
          v.IsShow = false;
        }
        if(v.IsShow){
          IsShow = true;
        }
      })
      stepFormData.Sku.map((v,k)=>{
        if(!v.IsShow){
          v.IsShow = false;
        }
        if(v.IsShow){
          IsShow = true;
        }
      })
      let data = {
        ...stepFormData,
        ...values,
        Info:Info
      }

      let checkData = true;

      for (let v of data.Sku) {
        if(!v.MarketPrice){
          checkData = false
          message.warning('单品规格市场价填写有误');
          break;
        }

        if(!v.GroupBuyingPrice){
          checkData = false
          message.warning('单品规格团购价填写有误');
          break;
        }

        if(!v.SettlementPrice){
          checkData = false
          message.warning('单品规格结算价填写有误');
          break;
        }

        if(!v.CostPrice){
          checkData = false
          message.warning('单品规格成本价填写有误');
          break;
        }

        if(!v.InventoryCount && userData.Staff.GroupBuyingMode===2){
          checkData = false
          message.warning('单品规格库存填写有误');
          break;
        }
      }

      if(!checkData){
        return false
      }

      if(!data.CoverPicture){
        message.warning('封面图必填项');
        return false
      }

      if(!IsShow && userData.Staff.GroupBuyingMode===2){
        message.warning('规格至少有一个要显示');
        return false
      }

      if(!data.WxSellText){
        message.warning('接龙单产品信息不能为空');
        return false
      }


      dispatch({
        type: 'purchaseAdd/uploadPurchaseAdd',
        payload: {
          ...data,
          OrganizationId:userData.id
        },
      });
    })


  }

  render() {
    const { form, stepFormData, tokens,submitting, dispatch,loading } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'团购任务列表',
        href:'/group/groupPurchase'
      }
      ,
      {
        title:'编辑团购任务',
      }
    ]

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}>
          <Step1
            formItemLayout={formItemLayout}
            form={form}
            loading={loading}
            dispatch={dispatch}
            data={stepFormData}
            GroupBuyingMode={userData.Staff.GroupBuyingMode}
            GroupState={0}
            submitting={submitting}
          />
          <Step2
            formItemLayout={formItemLayout}
            form={form}
            GroupBuyingMode={userData.Staff.GroupBuyingMode}
            getInstance={(childCp) => { this.childCp = childCp;}}
            loading={loading}
            dispatch={dispatch}
            data={stepFormData}
            tokens={tokens}
            GroupState={0}
            OrganizationId={userData.id}
            submitting={submitting}
          />
          <Step3
            formItemLayout={formItemLayout}
            GroupState={0}
            form={form}
            loading={loading}
            dispatch={dispatch}
            data={stepFormData}
            submitting={submitting}
            OrganizationId={userData.id}
          />
          <FooterToolbar style={{ width: '100%' }}>
            <Button type="primary" loading={loading} onClick={()=>{this.sumbit()}}>
              提交
            </Button>
          </FooterToolbar>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(state => ({
  stepFormData: state.purchaseEdit.data,
  tokens: state.purchaseEdit.Tokens,
  submitting: state.purchaseEdit.stepFormSubmitting,
  loading: state.purchaseEdit.loading,
}))(StepForm);
