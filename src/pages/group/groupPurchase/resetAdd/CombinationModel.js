import React, { PureComponent } from 'react';
import {Table,InputNumber,Modal,Checkbox} from 'antd'

export default class CombinationModel extends PureComponent{

  state={
    count:[],
    checked:[]
  }

  constructor(props) {
    super(props);
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }

  }

  componentWillMount(){
    const {CombinationData} = this.props;
    let data = this.state

    if(!CombinationData){
      return
    }

    Object.values(CombinationData).map((v,k)=>{
      data.count[v.SkuId]=v.Count;
      data.checked[v.SkuId]=true;
    })

    this.setState({
      ...data
    })
  }

  onChange(val,index,name){

    let data = this.state[name];

    data[index] = val;

    this.setState({
      [name]:[...data]
    })

  }

  sumbit(){
    const {SkuId,inputOnchange} =this.props
    let array = []
    this.state.checked.map((v,k)=>{
      if(v){
        array.push ({
          SkuId:k+"",
          Count:this.state.count[k] || 0
        })
      }
    })
    if(array.length === 0){
      return
    }
    inputOnchange(array,SkuId,'SubSkuItems')
    this.props.setModelVisible(false)
  }

  render(){
    const {data:{Specification,Sku},} = this.props

    const rowSpanFn = ()=>{

      if(!Sku.length){
        return
      }
      let row = [];
      let rowspan = Sku.length;
      for(let n = 0;  n < Specification.length; n++) {
        row[n] = parseInt(rowspan/Specification[n].Labels.length);
        rowspan = row[n];
      }
      return row.reverse();
    };

    const rowSpan = rowSpanFn();

    const list1 = Specification.map((val,index)=>{
      if(index === 0){
        return {
          title: val.Name,
          dataIndex:'Name',
          render: (text,record,k) => {
            const obj = {
              children: record.Name[index],
              props: {},
            };


            if(k%rowSpan[rowSpan.length -1  - index]===0){
              obj.props = {
                rowSpan:rowSpan[rowSpan.length -1 - index]
              }
            }else{
              obj.props = {
                rowSpan:0
              }
            }

            return obj;
          }
        }
      }else{
        return {
          title: val.Name,
          render: (text,record,k) => {
            const obj = {
              children: record.Name[index],
              props: {},
            };


            if(k%rowSpan[rowSpan.length -1  - index]===0){
              obj.props = {
                rowSpan:rowSpan[rowSpan.length -1 - index]
              }
            }else{
              obj.props = {
                rowSpan:0
              }
            }

            return obj;
          }
        }
      }
    });

    const columns = [
      ...list1,{
        title: '市场价',
        dataIndex:'MarketPrice',
        render: (text) => {
          return (
            text
          )
        }
      },
      {
        title: '团购价',
        dataIndex:'GroupBuyingPrice',
        render: (text) => {
          return (
            text
          )
        }
      },
      {
        title: '结算价',
        dataIndex:'SettlementPrice',
        render: (text) => {
          return (
            text
          )
        }
      },
      {
        title: '成本价',
        dataIndex:'CostPrice',
        render: (text) => {
          return (
            text
          )
        }
      },
      {
        title: '库存',
        dataIndex:'InventoryCount',
        render: (text) => {
          return (
            text
          )
        }
      },
      {
        title: '选择',
        render: (text,record,index) => {
          return (
            <Checkbox checked={this.state.checked[index]}  onChange={(e)=>{this.onChange(e.target.checked,index,'checked')}}/>
          )
        }
      },
      {
        title: '每个组件包含该单品件数',
        render: (text,record,index) => {
          return (
            <InputNumber value={this.state.count[index]} onChange={(e)=>{this.onChange(e,index,'count')}} style={{width:100}} placeholder="输入数量"/>
          )
        }
      }
    ]
    return(
      <Modal title="关联单品"
             visible={this.props.visible}
             onCancel={()=>{this.props.setModelVisible(false)}}
             onOk={()=>{this.sumbit()}}
             okText="确定"
             width={800}
      >

        <Table
          bordered={true}
          rowKey={(val,index)=>index}
          columns={columns}
          dataSource={Sku}
          pagination={false}
          scroll={{x:true}}
        />
      </Modal>
    )
  }
}
