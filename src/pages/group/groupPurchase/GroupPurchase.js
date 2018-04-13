import React, { Component } from 'react';
import {Link} from 'dva/router';
import { connect } from 'dva';
import {Card,Button,Divider} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PurchaseDefault from './list/default';
import PurchaseMonther from './list/monther';
import style from './GroupPurchase.less';
import {getLocalStorage} from '../../../utils/utils'
import {checkRole} from "../../../utils/utilsCheckRole";

const userData = getLocalStorage('userData');


@connect()
export default class GroupPurchase extends Component {

  state = {
    operationkey: 'default',
    startValue: null,
    endValue: null,
    endOpen: false,
  }

  componentWillMount(){
    this.setState({
      OrganizationId:userData.id
    })
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {


    const contentList = {
      default: <PurchaseDefault
        OrganizationId={this.state.OrganizationId}
      />,
      mother: <PurchaseMonther
        OrganizationId={this.state.OrganizationId}
      />,
    };

    const tabList = [{
      key: 'default',
      tab: '默认',
    }, {
      key: 'mother',
      tab: '按月查看',
    }];

    let pageContent ='';

    if(!checkRole(3002)){
      pageContent = (
        <div className={style.pageContent}>
          <Button type="primary" ghost icon="plus"><Link to="/group/&groupPurchaseList&/add">发布团购任务</Link></Button>
          <Divider type="vertical" />
          <Button type="primary" ghost icon="plus"><Link to="/group/groupPurchase/&distributionList&/distributionAdd">创建送货单</Link></Button>
          <Divider type="vertical" />
          <Button type="primary" ghost icon="plus"><Link to="/group/groupPurchase/&orderForm&/orderFormAdd">创建销售概况单</Link></Button>
        </div>
      )
    }
    return (
      <PageHeaderLayout
        title="团购任务管理"
        tabList={tabList}
        onTabChange={this.onOperationTabChange}
        activeTabKey={this.state.operationkey}
      >
        <Card>
        {pageContent}
        {contentList[this.state.operationkey]}
        </Card>
      </PageHeaderLayout>
    );
  }
}
