import React, { Component } from 'react';
import {Link} from 'dva/router';
import { connect } from 'dva';
import {Card, Icon, Row,Tag,Col, Divider} from 'antd';
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
        page_size:49
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

  checkFlag(val){
    const shapeType = {
      0: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="orange">未开团</Tag>,
      1: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="green">进行中</Tag>,
      2: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="magenta">已截单</Tag>,
      3: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="#c1c1c1">已结团</Tag>,
      4: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="#c1c1c1">已取消</Tag>,
    };
    return shapeType[val];
  }

  buttonCheckFlag(value){
    const shapeType = !checkRole(3002)?{
      0: [<Icon onClick={()=>{this.submitTaskDelete(value.TaskId)}} type="delete" />, <Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Icon type="edit" /></Link>,<span onClick={()=>{this.submitTaskShow(value.TaskId)}}>上架</span>],
      1: [<Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Icon type="edit" /></Link>,<Link to={`/group/&groupPurchaseList&/resetAdd/${value.TaskId}`}>重新开团</Link>,<span onClick={()=>{this.submitTaskHide(value.TaskId)}}>下架</span>],
      2: [<Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Icon type="edit" /></Link>,<Link to={`/group/&groupPurchaseList&/resetAdd/${value.TaskId}`}>重新开团</Link>,<span onClick={()=>{this.switchEnd(true,value.TaskId)}}>截团</span>],
      3: [<Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Icon type="edit" /></Link>,<Link to={`/group/&groupPurchaseList&/resetAdd/${value.TaskId}`}>重新开团</Link>],
      4: [<Link to={`/group/&groupPurchaseList&/edit/${value.TaskId}`}><Icon type="edit" /></Link>,<Link to={`/group/&groupPurchaseList&/resetAdd/${value.TaskId}`}>重新开团</Link>],
    }:'';

    return shapeType[value.GroupState];
  }

  formatTime(val,formatString='YYYY年MM月DD'){
    return moment(val).utcOffset(val).format(formatString)
  }

  getSpecification(v1,v2){
    if(v1===v2){
      return v2;
    }else{
      return v1+'~'+v2
    }
  }
  getList(List){
    const list = [];
    return List.map((val,i)=>{
      list[i] = this.formatTime(val.CreateTime);
      const isCheck = list[i] === list[i-1]

      return (
        !isCheck ? <div key={i}>
        <h2>{list[i]}</h2>
        <Divider type="horizontal" />
          <Row gutter={16}>
          {List.map((value,q)=>{
            let MarketPriceRange = this.getSpecification(value.Specification.MarketPriceRange.Min,value.Specification.MarketPriceRange.Max);
            let GroupBuyingPriceRange = this.getSpecification(value.Specification.GroupBuyingPriceRange.Min,value.Specification.GroupBuyingPriceRange.Max);
            let SettlementPriceRange = this.getSpecification(value.Specification.SettlementPriceRange.Min,value.Specification.SettlementPriceRange.Max);
            let CostPriceRange = this.getSpecification(value.Specification.CostPriceRange.Min,value.Specification.CostPriceRange.Max);
            const actions = this.buttonCheckFlag(value);
            return this.formatTime(value.CreateTime)===list[i] ? <Col className={style.col} key={q} span={8}><Card
              style={{ width: '100%'}}
              title={value.Title}
              bodyStyle={{ padding:10}}
              actions={actions}
            >
              <div>
                {this.checkFlag(value.GroupState)}
                <img style={{height:'100px',width:'100px',float:'left',marginRight:10}} src={value.CoverPicture}/>
                <div style={{marginLeft:110}}>
                  <div className={style.fontSize12}>
                    市场价:
                    <b style={{color:'#FFC107'}}>{MarketPriceRange}</b>
                    <br/>
                    团购价:
                    <b style={{color:'#FFC107'}}>{GroupBuyingPriceRange}</b>
                  </div>
                  <div className={style.fontSize12}>
                    结算价:
                    <b style={{color:'#FFC107'}}>{SettlementPriceRange}</b>
                    <br/>
                    成本价:
                    <b style={{color:'#FFC107'}}>{CostPriceRange}</b>
                  </div>
                  <div className={style.fontSize12}>开团时间：{this.formatTime(value.StartTime,'YYYY.MM.DD HH:mm')}</div>
                  <div className={style.fontSize12}>截单时间：{this.formatTime(value.EndTime,'YYYY.MM.DD HH:mm')}</div>
                  {/*<div>备注：{value.Notes}</div>*/}
                  <div className={style.fontSize12}>销量: {value.Sales}</div>
                </div>
              </div>
            </Card></Col>:''
          })}
          </Row>
      </div>:''
      )
    })
  };

  render(){
    const {purchase:{defaultData:{List}},visible,OrganizationId} = this.props
    const {TaskId} = this.state
    return (
      <div>
        {this.getList(List)}
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
