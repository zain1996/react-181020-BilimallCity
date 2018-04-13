import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Steps, Form } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import styles from './style.less';

const { Step } = Steps;

@Form.create()
class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'step-form': return 0;
      case 'confirm': return 1;
      case 'result': return 2;
      default: return 0;
    }
  }
  getCurrentComponent() {
    const componentMap = {
      0: Step1,
      1: Step2,
      2: Step3,
    };
    return componentMap[this.getCurrentStep()];
  }
  render() {
    const { form, stepFormData, submitting, dispatch,loading } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 9,
      },
      wrapperCol: {
        span: 15,
      },
    };
    const CurrentComponent = this.getCurrentComponent();
    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'团购组织管理',
        href:'/group/groupList'
      }
      ,
      {
        title:'添加组织',
      }
    ]
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}>
          <div>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="创建管理员账号" />
              <Step title="填写组织信息" />
              <Step title="填写管理员信息" />
            </Steps>
            <CurrentComponent
              formItemLayout={formItemLayout}
              form={form}
              loading={loading}
              dispatch={dispatch}
              data={stepFormData}
              submitting={submitting}
              props={this.props}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(state => ({
  stepFormData: state.group.groupAddFromData.data,
  submitting: state.group.groupAddFromData.stepFormSubmitting,
  loading: state.group.loading,
}))(StepForm);
