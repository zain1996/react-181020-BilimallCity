import React, {PureComponent} from 'react';
import {Card} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UserListTable from './components/UserListTable'
import RoleListTable from './components/RoleListTable'

import {getLocalStorage} from '../../../utils/utils'
import {checkRole} from "../../../utils/utilsCheckRole";

const userData = getLocalStorage('userData');
export default class User extends PureComponent {

  state = {
    operationkey: '',
    title:'',
    OrganizationId:'',
  }

  componentWillMount(){
    this.setState({
      title:userData.Staff.OrganizationName,
      OrganizationId:userData.id
    })

    if(!checkRole(1003)){
      this.setState({
        operationkey:'2'
      })
    }

    if(!checkRole(1001)){
      this.setState({
        operationkey:'1'
      })
    }

  }
  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {
    const contentList = {
      1: <UserListTable title={this.state.title} OrganizationId={this.state.OrganizationId}/>,
      2: <RoleListTable OrganizationId={this.state.OrganizationId}/>,
    };

    const tabList = [ ];

    if(!checkRole(1001)){

      tabList.push({
        key: '1',
        tab: '成员列表',
      })
    }

    if(!checkRole(1003)){

      tabList.push({
        key: '2',
        tab: '角色管理',
      })
    }



    return (
      <PageHeaderLayout
        tabList={tabList}
        onTabChange={this.onOperationTabChange}
        activeTabKey={this.state.operationkey}
      >
        <Card>
          {contentList[this.state.operationkey]}
        </Card>
      </PageHeaderLayout>
    );
  }
}
