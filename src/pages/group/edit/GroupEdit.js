import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Steps, Form} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
const { Step } = Steps;

@Form.create()
class StepForm extends PureComponent {

  state = {
    current: 0,
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  componentWillMount(){
    const {dispatch,match:{params:{OrganizationId}}} = this.props;
    dispatch({
      type: 'editGroup/queryGroupEdit',
      payload: OrganizationId,
    });
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

    const steps = [{
      title: '创建管理员账号',
      content: <Step1
        formItemLayout={formItemLayout}
        form={form}
        next={this.next.bind(this)}
        loading={loading}
        dispatch={dispatch}
        data={stepFormData}
        submitting={submitting}
        props={this.props}
      />,
    }, {
      title: '填写组织信息',
      content: <Step2
        formItemLayout={formItemLayout}
        form={form}
        next={this.next.bind(this)}
        prev={this.prev.bind(this)}
        loading={loading}
        dispatch={dispatch}
        data={stepFormData}
        submitting={submitting}
        props={this.props}
      />
    }, {
      title: '填写管理员信息',
      content: <Step3
        formItemLayout={formItemLayout}
        form={form}
        next={this.next.bind(this)}
        prev={this.prev.bind(this)}
        loading={loading}
        dispatch={dispatch}
        data={stepFormData}
        submitting={submitting}
        props={this.props}
      />
    }];

    const { current } = this.state;

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
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[this.state.current].content}</div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(state => ({
  stepFormData: state.editGroup.data,
  submitting: state.editGroup.stepFormSubmitting,
  loading: state.editGroup.loading,
}))(StepForm);
