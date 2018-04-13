import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {Table, Alert,  Divider, Switch} from 'antd';
import styles from './GroupListTable.less';
import { routerRedux } from 'dva/router';

class StandardTable extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }
  getInfo(isOpen,val){
    if(isOpen){
      this.props.dispatch({
        type: 'group/queryGroupListInfo',
        payload: val.OrganizationId,
      });
    }
    return false;
  }
  stop(e){
    e.stopPropagation();
  }
  render() {
    const {data: {List, pagination , Count}, loading,dispatch,paginationProps} = this.props;
    const change = (val,payload)=>{

      this.props.dispatch({
        type: 'group/uploadGroupState',
        payload: {
          OrganizationId:payload.OrganizationId,
          UserId:payload.ManagerUserId,
          IsDisable:val,
        },
      });

    }

    const columns = [
      {
        title: '组织logo', dataIndex: 'Logo',
        render: val => <img style={{width:50}} src={val}/>
      },
      {
        title: '组织名称', dataIndex: 'Name',
        render: (text,record,index) => <Link onClick={(event)=>{this.stop(event)}} to={`/group/groupList&/groupInfo/${record.OrganizationId}`}>{text}</Link>
      },
      {
        title: '省市',
        render: (text, record, index) => (
          <div>
            {record.Province},{record.City}
          </div>
        ),
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <div onClick={(event)=>{this.stop(event)}}>
            <Link onClick={(event)=>{this.stop(event)}} to={`/group/groupList&/groupEdit/${record.OrganizationId}`}>编辑</Link>
            <Divider type="vertical"/>
            <Switch defaultChecked={!record.IsDisable} checkedChildren="开启" onChange={(val)=>{change(val,record)}} unCheckedChildren="禁用"  />
          </div>
        ),
      },
    ];

    const userInfo = ()=>{
      const {groupListInfoData} = this.props;
      const data = groupListInfoData;
      return  (
        <div>
          <div>
            <span>组织名称：</span>
            <span>{data.Name}</span>
          </div>
          <div>
            <span>组织Logo：</span>
            <span><img width={50} src={data.Logo}/></span>
          </div>
          <div>
            <span>企业名称：</span>
            <span>{data.CompanyName}</span>
          </div>
          <div>
            <span>企业开户名称：</span>
            <span>{data.BankAccountName}</span>
          </div>
          <div>
            <span>企业开户银行：</span>
            <span>{data.BankName}</span>
          </div>
          <div>
            <span>企业银行帐号：</span>
            <span>{data.BankAccount}</span>
          </div>
          <div>
            <span>所属省份：</span>
            <span>{data.Province}</span>
          </div>
          <div>
            <span>所属城市：</span>
            <span>{data.City}</span>
          </div>
          <div>
            <span>营业执照注册号：</span>
            <span>{data.LicenseNumber}</span>
          </div>
          <div>
            <span>营业执照图片：</span>
            <span><a target="_bank" href={data.LicensePicture}>查看</a></span>
          </div>
          <Divider dashed />
          <div>
            <span>管理员账号：</span>
            <span>{data.ManagerName}</span>
          </div>
          <div>
            <span>管理员姓名：</span>
            <span>{data.ManagerName}</span>
          </div>
          <div>
            <span>管理员手机：</span>
            <span>{data.ManagerMobile}</span>
          </div>
          <div>
            <span>身份证正反面照片：</span>
            <span><a target="_bank" href={data.LicensePicture}>查看</a>&nbsp;&nbsp;<a target="_bank" href={data.LicensePicture}>查看</a></span>
          </div>

        </div>
      )
    }

    return (
      <div className={styles.standardTable}>

        <Table
          rowKey="OrganizationId"
          columns={columns}
          expandedRowRender={record => userInfo(record)}
          expandRowByClick
          onExpand={(val,text)=>{this.getInfo(val,text)}}
          dataSource={List}
          loading={loading}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />

      </div>
    );
  }
}

export default StandardTable;
