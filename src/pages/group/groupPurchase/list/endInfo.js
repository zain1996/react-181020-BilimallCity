import React, { Component } from 'react';
import {Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Button,Table,Modal} from 'antd';


@connect(state => ({
  purchaseEnd: state.purchaseEnd,
}))
export default class EndInfo extends Component {

  componentWillMount(){
    const {dispatch,OrganizationId,TaskId} = this.props
    dispatch({
      type:'purchaseEnd/queryEndInfo',
      payload:{
        OrganizationId:OrganizationId,
        TaskId:TaskId
      }
    })
    this.queryFinishBuyingGroupList(1)

  }

  handleTableChange = (pagination, filtersArg, sorter) => {
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
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.queryFinishBuyingGroupList(pagination.current)
  }

  queryFinishBuyingGroupList(page){
    const {dispatch,OrganizationId,TaskId} = this.props
    dispatch({
      type:'purchaseEnd/queryFinishBuyingGroupList',
      payload:{
        OrganizationId:OrganizationId,
        TaskId:TaskId,
        page:page,
        page_size:10
      }
    })
  }

  submitEnd(){
    const {dispatch,OrganizationId,TaskId,switchEnd} = this.props
    dispatch({
      type:'purchaseEnd/submitEnd',
      payload:{
        OrganizationId:OrganizationId,
        TaskId:TaskId,
      }
    }).then(()=>{

    })
  }

  render(){
    const columns=[
      {
        title:'社团名称',
        dataIndex:'GroupName'
      },
      {
        title:'团长名称',
        dataIndex:'ManagerName'
      },
      {
        title:'联系手机',
        dataIndex:'ManagerMobile'
      },
      {
        title:'产品规格',
        render:(text,record,index)=>{
          if(record.BuyDetail.IsCombination){
              let name = '';

                Object.values(record.BuyDetail.CombinationGoods.SubItems).map((v,i)=>{

                  Object.values(v.Labels).map((val,ii)=>{
                    name += val.Name + '\n'
                  })

              })

              return <div key={index}>{name}</div>;

          }else{
            return <div key={index}>{record.BuyDetail.SingleGoods.Name}</div>;
          }
        }

      },
      {
        title:'销量',
        render:(text,record,index)=>{
          return record.Count
        }
      },
    ]

    const {visible,switchEnd,purchaseEnd:{FinishBuyingGroupList:{List},EndInfo}} = this.props
    return (
      <Modal title="结团确定"
             width={"600px"}
             onCancel={()=>{switchEnd(false)}}
             visible={visible}
             footer={null}
             style={{padding:0}}
      >
        <p>团购任务：</p>
        <p>
          <span style={{marginRight:20}}>覆盖社团数:{EndInfo.TotalGroupCount}</span>
          <span style={{marginRight:20}}>已报单社团数:{EndInfo.BuyGroupCount}</span>
          <span>未报单社团数:{EndInfo.NotBuyGroupCount}</span>
        </p>
        <p>
          报单明细：({EndInfo.BuyGroupCount}/{EndInfo.TotalGroupCount})
        </p>

        <Table size="small"
               onChange={this.handleTableChange}
               rowKey="BuyId"
               dataSource={List}
               columns={columns}
        />
        <div style={{marginTop:20,textAlign:'center'}}>
          <Button type="primary" onClick={this.submitEnd.bind(this)}>确认结团</Button>
        </div>
      </Modal>
    )
  }

}
