import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import {Card,Button,List, message, Checkbox, Divider,Spin ,Row} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {getLocalStorage} from '../../../utils/utils'
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import style from './distributionAdd.less'


const userData = getLocalStorage('userData');
@connect(state => ({
  distribution: state.distribution,
}))

export default class distributionAdd extends PureComponent {

  state = {
    page:1,
  }

  formatTime(val,formatString='YYYY年MM月DD日'){
    return moment(val).utcOffset(val).format(formatString)
  }

  componentWillMount() {
    this.getData(1);
  }

  getData = (page) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'distribution/queryFinishBuyingList',
      payload:{
        page:page,
        page_size:10,
        OrganizationId:userData.id
      }
    });
  }

  handleInfiniteOnLoad = () => {

    let page = this.state.page + 1;

    this.setState({
      page:page
    })

    this.getData(page);

  }

  onChange(e,id) {

    const {dispatch,distribution:{finishBuyingList}}  = this.props;
    // let newData = finishBuyingList
    finishBuyingList.List.map((val,index)=>{

      if(val.TaskId === id ){
        finishBuyingList.List[index].isChecked = e.target.checked;
      }
    })

    dispatch({
      type: 'distribution/setDinishBuyingData',
      payload:finishBuyingList
    });
  }

  onAllChange(e,Time) {

    const {dispatch,distribution:{finishBuyingList}}  = this.props;
    // let newData = finishBuyingList
    finishBuyingList.List.map((val,index)=>{

      if(this.formatTime(val.StartTime) === Time ){
        finishBuyingList.List[index].isChecked = e.target.checked;
      }
    })

    dispatch({
      type: 'distribution/setDinishBuyingData',
      payload:finishBuyingList
    });
  }

  componentWillUnmount(){
    const {dispatch} = this.props;
    dispatch({
      type: 'distribution/resetFinishBuyingList'
    });
  }

  getList(data){
    const newList = [];
    return data.map((val,i)=>{
      newList[i] = this.formatTime(val.StartTime);
      const isCheck = newList[i] === newList[i-1]
      return (
        !isCheck ? <div key={i}>
          <Checkbox
            onChange={(e)=>{this.onAllChange(e,newList[i])}}
            style={{fontSize:18,fontWeight:600,marginBottom:20}}>{newList[i]}
          </Checkbox>
            {data.map((value,q)=>{
              return this.formatTime(value.StartTime)===newList[i] ?
                <div style={{paddingLeft:20}} key={q}>
                  <Checkbox
                    checked={value.isChecked}
                    onChange={(e)=>{this.onChange(e,value.TaskId)}}
                    style={{overflow: 'hidden',display:'flex',alignItems: 'center'}}
                  >
                    <div>
                    <img style={{width:60,height:60,float:'left',marginRight:10}} src={value.CoverPicture}/>
                    </div>
                    <div style={{marginLeft:110,marginTop:4}}>
                      <h4>名称：{value.Title}</h4>
                      <div>截单时间：{this.formatTime(value.EndTime,'YYYY.MM.DD HH:mm')}</div>
                    </div>
                  </Checkbox>
                  <Divider type="horizontal" />
                </div> :''
            })}
        </div>:''
      )
    })
  };

  handlerSubmit(){
    const {dispatch,distribution:{finishBuyingList}}  = this.props;

    let data = [];

    finishBuyingList.List.map(val=>{
      if(val.isChecked){
        data.push(val.TaskId)
      }
    })

    dispatch({
      type:'distribution/submitDistributionAdd',
      payload:{
        TaskIds:data,
        OrganizationId:userData.id
      }
    })
  }

  getCheckList(data){
    const newList = [];
    return data.map((val,i)=>{
      newList[i] = this.formatTime(val.StartTime);
      return (
        val.isChecked ? <div style={{marginTop:20}} key={i}>
          <Checkbox
            checked={true}
            style={{overflow: 'hidden',display:'flex',alignItems: 'center'}}
            onChange={(e)=>{this.onChange(e,val.TaskId)}}
          >
            <div>
              <img style={{width:60,height:60,float:'left',marginRight:10}} src={val.CoverPicture}/>
            </div>
            <div style={{marginLeft:110,marginTop:4}}>
              <h4>名称：{val.Title}</h4>
              <div>截单时间：{this.formatTime(val.EndTime,'YYYY.MM.DD HH:mm')}</div>
            </div>
          </Checkbox>
          <Divider type="horizontal" />
        </div>:''
      )
    })
  };

  render() {
    const {distribution:{finishBuyingList,loading}}  = this.props;

    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'送货单',
        href:'/group/groupPurchase/distributionList'
      }
      ,
      {
        title:'创建送货单',
      }
    ]

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}
              title="创建送货单"
        >
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div className={style.list}>
              <h3>待选</h3>
              <div className={style.listContent}>
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!finishBuyingList.loading && finishBuyingList.hasMore}
                  useWindow={false}
                >
                  <List>
                    {this.getList(finishBuyingList.List)}
                    {finishBuyingList.loading && finishBuyingList.hasMore && <Spin className={style.demoLoading} />}
                  </List>
                </InfiniteScroll>
              </div>
            </div>
            <div className={style.list}>
              <h3 style={{po:'fle'}}>已选</h3>
              <div className={style.listContent}>
                <List>
                  {this.getCheckList(finishBuyingList.List)}
                </List>
              </div>
            </div>
          </div>
          <div style={{display:'flex',marginTop:20,justifyContent:'center'}} ><Button loading={loading} onClick={()=>{this.handlerSubmit()}}>创建</Button></div>
        </Card>
      </PageHeaderLayout>

    );
  }
}
