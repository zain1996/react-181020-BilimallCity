import React, {PureComponent} from 'react';
import moment from 'moment';
import {Table, Divider, Switch} from 'antd';
import styles from './AccountListTable.less';
import ResetPwdDialog from '../dialog/ResetPwdDialog'

class AccountListTable extends PureComponent {
  state = {
    totalCallNo: 0,
    showResetPassword:false,
  };


  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  resetPassword = () => {
    this.setState({showResetPassword : true})
  };

  submitReset = (cancel) => {
    return () => {
      this.setState({showResetPassword: false})
    }
  };
  render() {
    const {data: {list, pagination}, loading} = this.props;

    const columns = [
      {
        title: '用户ID',
        dataIndex: 'no',
      },
      {
        title: '用户名',
        dataIndex: 'description',
      },
      {
        title: '手机号',
        dataIndex: 'callNo',
      },
      {
        title: '角色',
        dataIndex: 'no',
      },
      {
        title: '注册时间',
        dataIndex: 'updatedAt',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: () => (
          <div>
            <a onClick={this.resetPassword}>重置密码</a>
            <Divider type="vertical"/>
            <a >禁用 <Switch size={"small"}/></a>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };


    return (
      <div className={styles.standardTable}>

        <Table
          bordered
          loading={loading}
          rowKey={record => record.key}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
        <ResetPwdDialog
          visible={this.state.showResetPassword}
          onOk={this.submitReset(true)}
          onCancel={this.submitReset(false)}/>
      </div>
    );
  }
}

export default AccountListTable;
