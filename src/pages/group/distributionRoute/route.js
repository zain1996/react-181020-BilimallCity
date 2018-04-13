import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import {Table,Card,Button,Tabs,Modal,Form,Input,Divider} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
const TabPane = Tabs.TabPane;
import {getLocalStorage} from '../../../utils/utils'

const userData = getLocalStorage('userData');

@Form.create()
@connect(state => ({
  distributionRoute: state.distributionRoute,
}))
export default class distributionRoute extends PureComponent {

  state = {
    title:0,
    OrganizationId:0,
    visible:false,
    editVisible:false,
    LineId:null,
    current:1,
  };

  componentDidMount() {

    const {match:{params},dispatch} = this.props;

    this.setState({
      OrganizationId:userData.id
    },()=>{
      this.getData()
    })

  }

  getData(){
    const {dispatch} = this.props;
    dispatch({
      type: 'distributionRoute/queryDistributionRoute',
      payload:{
        page:1,
        page_size:49,
        OrganizationId:this.state.OrganizationId
      }
    });
  }
  formatTime(val,formatString='YYYY年MM月DD日'){
    return moment(val).utcOffset(val).format(formatString)
  }

  TableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    this.setState({
      current:pagination.current,
    })
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      LineId:this.state.LineId,
      OrganizationId: this.state.OrganizationId,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'distributionRoute/queryDistributionRouteCommunity',
      payload: params,
    });
  }
  tabsChange(val){
    const {dispatch} = this.props;
    this.setState({
        LineId:val,
        current:1,
      },()=>{
      dispatch({
        type: 'distributionRoute/queryDistributionRouteCommunity',
        payload: {
          OrganizationId:this.state.OrganizationId,
          LineId:this.state.LineId,
          page_size: 10,
          page:1,
        },
      })
    })
  }
  tabsClick(val){
    const {dispatch} = this.props;
    dispatch({
      type: 'distributionRoute/setCurrentLineId',
      payload: val,
    })

  }
  handleCancel(name){
    this.setState({
      [name]:false,
    })
  }
  deleteLine(){
    const {distributionRoute:{currentLineId},dispatch} = this.props;
    dispatch({
      type: 'distributionRoute/removeLine',
      payload: {
        OrganizationId:this.state.OrganizationId,
        LineId:currentLineId,
      },
    }).then(()=>{
      this.getData();
    })
  }

  updateLine(){
    const {distributionRoute:{currentLineId},dispatch} = this.props;
    const {validateFields} = this.props.form;
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'distributionRoute/updateLine',
            payload: {
              ...values,
              LineId:currentLineId,
              OrganizationId:this.state.OrganizationId
            },
          }).then(()=>{
            this.getData();
            this.setState({
              editVisible:false
            })
          });
        }
      });
  }

  openModal(name){
    this.setState({
      [name]:true,
    })
  }
  unbind(val){
    const {dispatch} = this.props;
    dispatch({
      type: 'distributionRoute/removeDistribution',
      payload: {
        GroupId:val.GroupId,
        LineId:val.LineId,
      },
    }).then(()=>{
      dispatch({
        type: 'distributionRoute/queryDistributionRouteCommunity',
        payload: {
          OrganizationId:this.state.OrganizationId,
          LineId:val.LineId,
          page_size: 10,
          page:1,
        },
      })
    });
  }
  componentWillUnmount(){
    this.tabsClick('');
  }
  render() {
    const {dispatch,distributionRoute:{data:{List},routeCommunity,loading,currentLineId}} = this.props;
    const {getFieldDecorator,validateFields} = this.props.form;
    const handleOk = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'distributionRoute/submitDistributionRouteAdd',
            payload: {
              ...values,
              OrganizationId:this.state.OrganizationId
            },
          }).then(()=>{
            this.getData();
            this.setState({
              visible:false
            })
          });
        }
      });
    };
    const columns = [
      { title: '社团名称', dataIndex: 'GroupName', },
      {
        title: '团长姓名',dataIndex:'ManagerName'
      },
      {
        title: '手机号',dataIndex:'ManagerMobile'

      },
      {
        title: '操作',
        render:(text,record)=>(
          <a onClick={()=>{this.unbind(record)}}>移除</a>
        )

      }

    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: routeCommunity.Count,
      current: this.state.current,
    };
    const getList=(val)=>{

      return val.map((val,index)=>{
        return <TabPane style={{paddingLeft:0}} tab={val.Name} key={val.LineId}>
          <Table
            columns={columns}
            rowKey="GroupId"
            bordered={false}
            style={{marginRight:25,marginTop:25}}
            dataSource={routeCommunity.List}
            loading={loading}
            scroll={{y:400}}
            pagination={paginationProps}
            onChange={this.TableChange}
            size="small"
          />
          <div style={{marginTop:20,display:'flex',justifyContent:'center'}}>
            <Button icon="plus" type="primary" ghost ><Link to={`/group/&distributionRoute&/distributionRouteRelation/${this.state.LineId ? this.state.LineId : currentLineId}`}>关联社团</Link></Button>
          </div>
        </TabPane>
      })
    }



    return (
      <PageHeaderLayout>
        <Card bordered={false}
              title="配送路线规划"
        >
          <Button icon="plus" type="primary" ghost onClick={()=>{this.openModal('visible')}}>添加路线</Button>
          <Divider type="vertical" />
          <Button icon="delete" type="primary" ghost onClick={()=>{this.deleteLine()}}>删除路线</Button>
          <Divider type="vertical" />
          <Button icon="edit" type="primary" ghost onClick={()=>{this.openModal('editVisible')}}>重命名路线</Button>

          <Tabs
            activeKey={currentLineId}
            tabPosition='left'
            style={{ marginTop:20,height: 600,border:'1px solid #e8e8e8'}}
            onTabClick={(e)=>{this.tabsClick(e)}}
            onChange={this.tabsChange.bind(this)}
          >
            {getList(List)}
          </Tabs>

        </Card>
        {this.state.visible ? <Modal title="添加路线"
                                     visible={this.state.visible}
                                     onOk={handleOk}
                                     confirmLoading={loading}
                                     onCancel={()=>{this.handleCancel('visible')}}
        >
          <Form>
            <Form.Item
              labelCol={{span: 4,}}
              wrapperCol={{span: 20,}}
              label="路线名称"
            >
              {getFieldDecorator('Name', {
                rules: [{required: true, message: '路线名称为必填项' }],
              })(
                <Input
                  placeholder="请输入路线名称"
                />
              )}

            </Form.Item>
          </Form>
        </Modal>: ''}
        {this.state.editVisible ? <Modal title="编辑路线"
                                     visible={this.state.editVisible}
                                     onOk={this.updateLine.bind(this)}
                                     confirmLoading={loading}
                                     onCancel={()=>{this.handleCancel('editVisible')}}
        >
          <Form>
            <Form.Item
              labelCol={{span: 4,}}
              wrapperCol={{span: 20,}}
              label="路线名称"
            >
              {getFieldDecorator('Name', {
                rules: [{required: true, message: '路线名称为必填项' }],
              })(
                <Input
                  placeholder="请输入路线名称"
                />
              )}

            </Form.Item>
          </Form>
        </Modal>: ''}
      </PageHeaderLayout>

    );
  }
}
