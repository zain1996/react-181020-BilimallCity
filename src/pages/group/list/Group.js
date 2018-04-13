import React, {PureComponent} from 'react';
import {connect} from 'dva';
import { Link } from 'react-router-dom'
import {Modal, Col, Card, Form, Input, Select, Icon, Button, Menu, InputNumber, DatePicker, message} from 'antd';
import GroupListTable from './GroupListTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './Group.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const {Search} = Input;
@connect(state => ({
  group: state.group,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    formValues: {},
    searchValue:'',
    current:1
  };


  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'group/queryGroupList',
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
      search:this.state.searchValue,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'group/queryGroupList',
      payload: params,
    });
  }

  search(val){
    const {dispatch} = this.props;
    this.setState({
      searchValue:val,
      current:1
    },()=>{
      dispatch({
        type: 'group/queryGroupList',
        payload:{
          page:1,
          page_size:10,
          search:val
        },
      });
    })
  }

  render() {
    const {group: {loading, groupListData,groupListInfoData},dispatch} = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: groupListData.Count,
      current:this.state.current,
    };

    const extraContent = (
      <div className={styles.extraContent}>
        <Link to="/group/groupList&/groupAdd">
          <Button>添加组织</Button>
        </Link>
        <Search
          enterButton
          className={styles.extraContentSearch}
          placeholder="用户名/手机号"
          onSearch={(e) => {this.search(e)}}
        />
      </div>
    );

    return (
      <PageHeaderLayout>

        <Card bordered={false}
              extra={extraContent}
              title="组织列表">

          <div className={styles.tableList}>
            <GroupListTable
              paginationProps={paginationProps}
              loading={loading}
              dispatch={dispatch}
              data={groupListData}
              groupListInfoData={groupListInfoData}
              onChange={this.accountListTableChange}
            />
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
