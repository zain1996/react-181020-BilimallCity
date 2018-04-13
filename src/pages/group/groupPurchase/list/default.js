import React, { Component } from 'react';
import {Route, Switch ,Link} from 'dva/router';
import { connect } from 'dva';
import {Tag,Table,Button,Divider} from 'antd';
import moment from 'moment';
import style from './default.less';
import EndInfo from './endInfo'
import {checkRole} from '../../../../utils/utilsCheckRole'
@connect(state => ({
  purchase: state.purchase,
  visible: state.purchaseEnd.visible,
}))
export default class PurchaseDefault extends Component {

  state = {
    TaskId:'',
  }

  componentWillMount(){
    this.getData()
  }

  getData(){
    const {dispatch,OrganizationId} = this.props
    dispatch({
      type:'purchase/queryPurchaseList',
      payload:{
        OrganizationId:OrganizationId,
        page:1,
        page_size:10
      }
    })
  }


  submitTaskHide(TaskId){
    const {dispatch,OrganizationId} = this.props
    dispatch({
      type:'purchase/submitTaskHide',
      payload:{
        OrganizationId:OrganizationId,
        TaskId:TaskId
      }
    }).then(()=>{
      this.getData();
    })
  }

  submitTaskShow(TaskId){
    const {dispatch,OrganizationId} = this.props
    dispatch({
      type:'purchase/submitTaskShow',
      payload:{
        OrganizationId:OrganizationId,
        TaskId:TaskId
      }
    }).then(()=>{
      this.getData();
    })
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    const {OrganizationId} = this.props
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
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type:'purchase/queryPurchaseList',
      payload:{
        OrganizationId:OrganizationId,
        page:pagination.current,
        page_size:pagination.pageSize,
      }
    });
  }

  formatTime(val,formatString='YYYY年MM月DD'){
    return moment(val).utcOffset(val).format(formatString)
  }

  submitTaskDelete(TaskId){
    const {dispatch,OrganizationId} = this.props
    dispatch({
      type:'purchase/submitTaskDelete',
      payload:{
        OrganizationId:OrganizationId,
        TaskId:TaskId
      }
    }).then(()=>{
      this.getData();
    })
  }

  checkFlag(val){
    const shapeType = {
      0: <Tag  color="orange">未开团</Tag>,
      1: <Tag  color="green">进行中</Tag>,
      2: <Tag  color="magenta">已截单</Tag>,
      3: <Tag  color="#c1c1c1">已结团</Tag>,
      4: <Tag  color="#c1c1c1">已取消</Tag>,
    };
    return shapeType[val];
  }
  switchEnd(val,TaskId){
    const {dispatch} = this.props
    this.setState({
      TaskId:TaskId
    },()=>{
      dispatch({
        type:'purchaseEnd/setVisible',
        payload:val,
      })
    })
  }

  render(){
    const {purchase:{defaultData:{List,Count},loading}} = this.props

    const buttonCheckFlag = (value)=>{
      const shapeType = !checkRole(3002)?{
        0: <div><Button onClick={()=>{this.submitTaskDelete(value.TaskId)}} icon="delete" /><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Button icon="edit" /></Link><Divider type="vertical" /><a disabled>重新开团</a><Divider type="vertical" /><a onClick={()=>{this.submitTaskShow(value.TaskId)}}>上架</a></div>,
        1: <div><Button disabled icon="delete" /><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Button icon="edit" /></Link><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/resetAdd/${value.TaskId}`}>重新开团</Link><Divider type="vertical" /><a onClick={()=>{this.submitTaskHide(value.TaskId)}}>下架</a></div>,
        2: <div><Button disabled icon="delete" /><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Button disabled icon="edit" /></Link><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/resetAdd/${value.TaskId}`}>重新开团</Link><Divider type="vertical" /><a onClick={()=>{this.switchEnd(true,value.TaskId)}}>截团</a></div>,
        3: <div><Button disabled icon="delete" /><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Button disabled icon="edit" /></Link><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/resetAdd/${value.TaskId}`}>重新开团</Link></div>,
        4: <div><Button disabled icon="delete" /><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Button icon="edit" /></Link><Divider type="vertical" /><Link to={`/group/&groupPurchaseList&/resetAdd/${value.TaskId}`}>重新开团</Link></div>,
      }:'';

      return shapeType[value.GroupState];
    }

    const list = [];
    const columns = [
      {
        title: '产品',key:'TaskId',
        render:(text,record,index) =>{
          list[index] = this.formatTime(record.CreateTime);
          const isCheckTitle = list[index] === list[index-1] ? '': <h4>{list[index]}</h4>;
          return (<div key={index}>
            {isCheckTitle}
            <img style={{display:'inline-block',verticalAlign:'middle',width:100,marginRight:10}} src={record.CoverPicture}/>
            <div style={{display:'inline-block',verticalAlign:'middle'}}><h4 style={{}}>[{record.Title}]</h4>
              <div className={style.fontSize12}>
                市场价:<b style={{color:'#FFC107'}}>{record.Specification.MarketPriceRange.Min}~{record.Specification.MarketPriceRange.Max}</b>
                ,团购价:<b style={{color:'#FFC107'}}>{record.Specification.GroupBuyingPriceRange.Min}~{record.Specification.GroupBuyingPriceRange.Max}</b>
              </div>
              <div className={style.fontSize12}>
                结算价:<b style={{color:'#FFC107'}}>{record.Specification.SettlementPriceRange.Min}~{record.Specification.SettlementPriceRange.Max}</b>
                ,成本价:<b style={{color:'#FFC107'}}>{record.Specification.CostPriceRange.Min}~{record.Specification.CostPriceRange.Max}</b>
              </div>
            </div>
          </div>)
        }
      },
      {
        title: '开团日期',dataIndex:'StartTime',
        render:(text,record,index) =>(
          <div className={style.fontSize12}>{this.formatTime(text,'YYYY.MM.DD HH:mm')}</div>
        )
      },
      {
        title: '截单日期',dataIndex:'EndTime',
        render:(text,record,index) =>(
          <div className={style.fontSize12}>{this.formatTime(text,'YYYY.MM.DD HH:mm')}</div>
        )
      },
      {
        title: '备注',dataIndex:'Notes',
        render:(text,record,index) =>(
          <div className={style.fontSize12} style={{width:200}} title={text}>{text}</div>
        )
      },
      {
        title: '销量',dataIndex:'Sales'
      },
      {
        title: '状态',dataIndex:'GroupState',
        render:(text,record,index) =>(
          this.checkFlag(text)
        )
      },
      {
        title: '操作',
        render:(text,record,index)=>(
          <div>
            {buttonCheckFlag(record)}
          </div>
        )
      },
    ]
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: Count,
    };

    const {TaskId} = this.state
    const {visible,OrganizationId} = this.props
    return (

      <div>
        <Table
          size="small"
          loading={loading}
          border={false}
          rowKey={(record)=>record.TaskId}
          dataSource={List}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
        {visible ? <EndInfo
          visible={visible}
          switchEnd={this.switchEnd.bind(this)}
          TaskId={TaskId}
          OrganizationId={OrganizationId}
        />:''}
      </div>
    )
  }

}
