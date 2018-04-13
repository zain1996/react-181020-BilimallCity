import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, Input} from 'antd';
import AccountListTable from './components/AccountListTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Account.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const {Search} = Input;
@connect(state => ({
  rule: state.rule,
}))

export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    formValues: {},
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  accountListTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  }


  render() {
    const {rule: {loading: ruleLoading, data}} = this.props;
    const extraContent = (
      <div className={styles.extraContent}>
        <Search
          enterButton
          className={styles.extraContentSearch}
          placeholder="用户名/手机号"
          onSearch={() => ({})}
        />
      </div>
    );

    return (
      <PageHeaderLayout>
        <Card bordered={false}
              extra={extraContent}
              title="用户管理">

          <div className={styles.tableList}>
            <AccountListTable
              loading={ruleLoading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.accountListTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
