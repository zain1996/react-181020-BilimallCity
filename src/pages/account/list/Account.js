import React, {PureComponent} from 'react';
import {Input,Card} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CityListTable from './cityList';
import CommunityTable from './communityList';
import OrganizationTable from './organizationList';


const {Search} = Input;
export default class User extends PureComponent {
  state = {
    operationkey: '1',
    title:'',
    OrganizationId:'',
  }
  componentWillMount(){
    const {match:{params}} = this.props;

    this.setState({
      title:params.title,
      OrganizationId:params.OrganizationId
    })
  }
  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {
    const contentList = {
      1: <CityListTable/>,
      2: <CommunityTable/>,
      3: <OrganizationTable/>,
    };

    const tabList =
      [
        {
          key: '1',
          tab: '城市合伙人',
        },
        {
          key: '2',
          tab: '社区合伙人',
        },
        {
          key: '3',
          tab: '组织成员',
        }
    ];

    return (
      <PageHeaderLayout
        tabList={tabList}
        onTabChange={this.onOperationTabChange}
        activeTabKey={this.state.operationkey}
      >
        {contentList[this.state.operationkey]}
      </PageHeaderLayout>
    );
  }
}
