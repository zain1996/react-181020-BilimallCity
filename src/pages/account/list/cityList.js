import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {Table, Switch,Card,Input} from 'antd';
const {Search} = Input;
import {connect} from 'dva'
import moment from 'moment';

@connect(state => ({
  account:state.account
}))
export default class CityListTable extends PureComponent {

  state = {
    formValues: {},
    searchValue:'',
    current:1,
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'account/queryCityList',
      payload:{
        page:1,
        page_size:10,
      },
    });
  }

  accountListTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    this.setState({
      current:pagination.current
    })

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      search: this.state.searchValue,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'account/queryCityList',
      payload: params,
    });

  }

  goGroup(e,val){
    e.stopPropagation();
    this.props.dispatch({
      type: 'account/queryOrganizationId',
      payload:{uid:val.UserID},
    });
  }
  change(val,payload){

    // this.props.dispatch({
    //   type: 'group/uploadGroupState',
    //   payload: {
    //     OrganizationId:payload.OrganizationId,
    //     UserId:payload.ManagerUserId,
    //     IsDisable:val,
    //   },
    // });

  }

  search(val){
    const {dispatch} = this.props;
    this.setState({
      searchValue:val,
      current:1
    },()=>{
      dispatch({
        type: 'account/queryCityList',
        payload:{
          page:1,
          page_size:10,
          search:val
        },
      });
    })
  }

  formatTime(val,formatString='YYYY年MM月DD日'){
    return moment(val).utcOffset(val).format(formatString)
  }

  render() {
    const {account: {cityList:{List,Count}}, loading} = this.props;

    const columns = [
      {
        title: '用户ID', dataIndex: 'UserID',
        render: (text, record, index) => (
          <div>{text}</div>
        ),
      },
      {
        title: '用户名', dataIndex: 'Name',
        render: (text,record,index) => <div>{text}</div>
      },
      {
        title: '手机号', dataIndex: 'Mobile',
        render: (text, record, index) => (
          <div>{text}</div>
        ),
      },
      {
        title: '角色',
        render: (text, record, index) => (
          <a onClick={(event)=>{this.goGroup(event,record)}}>城市合伙人</a>
        ),
      },
      {
        title: '注册时间',dataIndex:'CreateTime',
        render: (text, record, index) => (
          <div>{this.formatTime(text)}</div>
        ),
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Switch defaultChecked={!record.IsDisableOrgStaff} checkedChildren="开启" onChange={(val)=>{this.change(val,record)}} unCheckedChildren="禁用"  />
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: this.state.current,
      total: Count,
    };
    const extraContent = (
      <div >
        <Search
          enterButton
          placeholder="用户名/手机号"
          onSearch={(e) => {this.search(e)}}
        />
      </div>
    );
    return (
        <Card
          extra={extraContent}
          title={<div style={{display:'flex',alignItems:'center',height:'100%'}}>城市合伙人列表</div>}
          bordered={false}
        >
            <Table
              rowKey="UserID"
              columns={columns}
              dataSource={List}
              loading={loading}
              pagination={paginationProps}
              onChange={this.accountListTableChange}
            />
        </Card>
    );
  }
}
