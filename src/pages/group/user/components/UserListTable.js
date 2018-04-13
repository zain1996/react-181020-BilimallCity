import React, {PureComponent} from 'react';
import {Table, Divider, Switch,Button} from 'antd';
import EditDialog from './dialog/EditUserInfoDialog';
import AddDialog from './dialog/AddUserDialog';
import styles from './UserListTable.less';
import {connect} from 'dva'
import {checkRole} from "../../../../utils/utilsCheckRole"

@connect(state => ({
  groupUser: state.groupUser,
}))
class UserListTable extends PureComponent {
  state = {
    totalCallNo: 0,
    showEditUserInfo: {
      visible:false,
      data:{}
    },
    showAddUserInfo: false,
  };


  componentDidMount() {
    this.getData();
  }

  getData(){
    const {OrganizationId} = this.props;

    const {dispatch} = this.props;
    dispatch({
      type: 'groupUser/queryUserList',
      payload:{
        page:1,
        id:OrganizationId,
        page_size:10
      }
    });
  }

  tableChange = (pagination, filtersArg, sorter) => {
    const {dispatch,OrganizationId} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
      ...filters,
      id:OrganizationId,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'groupUser/queryUserList',
      payload: params,
    });
  }

  closeEditDialog = () => {
      this.setState( {
        showEditUserInfo: {visible: false, data: {}},
      })
  };


  showEditDialog = (row) => {
      this.setState( {
        showEditUserInfo: {visible: true,data:row},
      })
  };

  submitEditDialog = ()=>{
    const data = this.childEditCp.getUserData();
    if(data===false){
      return
    }

    this.props.dispatch({
      type: 'groupUser/uploadGroupEditUser',
      payload: {
        ...data,
        OrganizationId: this.props.OrganizationId
      }
    }).then(() => {
      this.getData();
      this.setState({showEditUserInfo:{visible:false,data:{}} })
    })
  }

  submitAddDialog = ()=>{
    const data = this.childCp.getUserData();

    if(data===false){
      return
    }

    this.props.dispatch({
      type: 'groupUser/uploadGroupAddUser',
      payload: {
        ...data,
        OrganizationId: this.props.OrganizationId
      }
    }).then(() => {
      this.getData();
      this.setState({showAddUserInfo: false})
    })
  }

  showAddDialog = () => {
    this.setState({showAddUserInfo: true})
  };

  closeAddDialog = () => {
    this.setState({showAddUserInfo: false})
  };

  render() {
    const change = (val,payload)=>{
      this.props.dispatch({
        type: 'groupUser/uploadGroupUserState',
        payload: {
          OrganizationId:payload.OrganizationId,
          UserId:payload.UserId,
          IsDisable:!val,
        },
      }).then(()=>{
        this.getData();
      });

    }
    const {groupUser: {data:{List ,pagination,Count}, loading}} = this.props;

    let columns = [
      {
        title: '成员ID', dataIndex: 'UserId',
      },
      {
        title: '组织名称',
        dataIndex: 'OrganizationName',
      },
      {
        title: '成员账号',
        dataIndex: 'Mobile',
      },
      {
        title: '姓名',
        dataIndex: 'Name',
      },
      {
        title: '角色',
        dataIndex: 'RoleName',
      },

    ];

    if(!checkRole(1002)){
      columns.push({
        title: '操作',
        render: (row) => {
          if(row.RoleName==="超级管理员"){
            return ''
          }
          return (
            <div>
                <a onClick={()=>{this.showEditDialog(row)}}>编辑</a>
                <Divider type="vertical"/>
              <Switch checkedChildren="开启" defaultChecked={!row.IsDisable} onChange={(val)=>{change(val,row)}} unCheckedChildren="禁用"  />
            </div>
          )},
      },)
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: Count,
      ...pagination,
    };
    let isDitDialog = '';
    if(this.state.showEditUserInfo.visible){
      isDitDialog = <EditDialog onOk={this.submitEditDialog}
                                OrganizationId={this.props.OrganizationId}
                                title={this.props.title}
                                getInstance={(childCp) => { this.childEditCp = childCp; }}
                                onCancel={this.closeEditDialog} showEditUserInfo={this.state.showEditUserInfo}/>
    }else{
      isDitDialog = <div></div>
    }
    return (

      <div className={styles.container}>
        {!checkRole(1002)?<Button type="primary" ghost  icon="plus" onClick={this.showAddDialog} >
          添加成员
        </Button>:''}

        <Table
          bordered
          className={styles.table}
          loading={loading}
          rowKey='UserId'
          dataSource={List}
          columns={columns}
          pagination={paginationProps}
          onChange={this.tableChange}
        />
        {isDitDialog}

        {this.state.showAddUserInfo?
          <AddDialog onOk={this.submitAddDialog}
           title={this.props.title}
           getInstance={(childCp) => { this.childCp = childCp; }}
           OrganizationId={this.props.OrganizationId}
           onCancel={this.closeAddDialog} visible={this.state.showAddUserInfo}/>:''}

      </div>
    );
  }
}

export default UserListTable;
