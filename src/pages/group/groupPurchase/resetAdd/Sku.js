import React, { PureComponent } from 'react';
import {Upload,Button,Icon,Table,InputNumber,Select} from 'antd'
import SpecificationView from './Specification';
import Combination from './Combination';
const Option = Select.Option;
export default class Sku extends PureComponent {

  state = {
    Sku:[],
    imgFiles: [],
  }

  constructor(props) {
    super(props);
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }

  inputOnchange(e,k,name){
    const {dispatch,data} = this.props;

    let newSku = data.Sku;

    newSku[k][name] = e;

    dispatch({
      type:'purchaseEdit/setAdd',
      payload:{
        ...data,
        Sku:[
          ...newSku
        ]
      }
    })
  }

  imgOnchange(info,index) {
    const {dispatch,data,tokens} = this.props;
    if (info.file.status === 'done') {
      let newSku = data.Sku;
      newSku[index]['IllustrationPicture'] = tokens.StoreUrl;
      newSku[index]['tempIllustrationPicture'] = tokens.AccessUrl;
      dispatch({
        type:'purchaseEdit/setAdd',
        payload:{
          ...data,
          Sku:[
            ...newSku
          ]
        }
      })
    }
  }
  fill(e,name){
    const {dispatch,data}= this.props;

    let newSku = data.Sku;

    newSku.map(val=>{
      val[name] = e
    })

    dispatch({
      type:'purchaseEdit/setAdd',
      payload:{
        ...data,
        Sku:[
          ...newSku
        ]
      }
    })
  }

  setSpecificationVisible(){
    this.childCp.setModelVisible(true)
  }

  render(){
    const SpecificationData = this.props.data;
    const {data:{Specification,Sku},QINIU_SERVER,beforeUpload,tokens,form,GroupState,GroupBuyingMode} = this.props
    const buttonStyle = {
      marginRight:10,
      marginLeft:10,
      display:'inline-block',
      width:100
    }
    const Props = {
      name: 'file',
      action: QINIU_SERVER,
    };

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
        render: (text,record,k) => {
          return (
            <div key={k}>
              <InputNumber disabled={GroupState > 0 ? true : false} value={Sku[k].MarketPrice} style={{width:50}} onChange={(e)=>{this.inputOnchange(e,k,'MarketPrice')}}/>
            </div>
          )
        }
      },
      {
        title: '团购价',
        dataIndex:'GroupBuyingPrice',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <InputNumber disabled={GroupState > 0 ? true : false} value={Sku[k].GroupBuyingPrice} style={{width:50}} onChange={(e)=>{this.inputOnchange(e,k,'GroupBuyingPrice')}}/>
            </div>
          )
        }
      },
      {
        title: '结算价',
        dataIndex:'SettlementPrice',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <InputNumber disabled={GroupState > 0 ? true : false} value={Sku[k].SettlementPrice} style={{width:50}} onChange={(e)=>{this.inputOnchange(e,k,'SettlementPrice')}}/>
            </div>
          )
        }
      },
      {
        title: '成本价',
        dataIndex:'CostPrice',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <InputNumber disabled={GroupState > 0 ? true : false} value={Sku[k].CostPrice} style={{width:50}} onChange={(e)=>{this.inputOnchange(e,k,'CostPrice')}}/>
            </div>
          )
        }
      },

    ]

    if(GroupBuyingMode===2){
      columns.push({
        title: '库存',
        dataIndex:'InventoryCount',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <InputNumber disabled={GroupState > 0 ? true : false} value={Sku[k].InventoryCount} style={{width:50}} onChange={(e)=>{this.inputOnchange(e,k,'InventoryCount')}}/>
            </div>
          )
        }
      })

      columns.push({
        title: '是否显示',
        dataIndex:'IsShow',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <Select disabled={GroupState > 0 ? true : false} onChange={(e)=>{ this.inputOnchange(e === 1 ? true : false,k,'IsShow')}} value={text === true ? 1 : 0}  style={{ width: 80 }} >
                <Option value={1}>显示</Option>
                <Option value={0}>不显示</Option>
              </Select>
            </div>
          )
        }
      })
    }

    columns.push({
      title: '配图',
      dataIndex:'IllustrationPicture',
      render: (text,record,k) => {
        return (
          <div key={k}>
            <Upload {...Props}
                    onChange={(e)=>{this.imgOnchange(e,k)}}
                    beforeUpload={beforeUpload.bind(this)}
                    data={tokens}
                    disabled={GroupState > 0 ? true : false}
                    showUploadList={false}
            >
              <Button style={{backgroundImage:`url(${Sku[k].tempIllustrationPicture})`,backgroundSize:"100%",minWidth:100}}>
                {!Sku[k].tempIllustrationPicture ? <div><Icon type="upload" /> 上传</div>:''}
              </Button>
            </Upload>

          </div>
        )
      }
    })

    return(
      <div style={{border:'1px solid #d9d9d9'}}>
        <SpecificationView GroupState={GroupState} data={SpecificationData} dispatch={this.props.dispatch} getInstance={(childCp) => { this.childCp = childCp;}}/>
        <div style={{padding:10,borderBottom:'1px solid #d9d9d9'}}>单品规格 <a disabled={GroupState > 0 ? true : false} style={{float:'right'}} onClick={()=>{this.setSpecificationVisible()}} >修改或者添加</a></div>
        <div style={{padding:10}}>
          <div>批量填充:
            <InputNumber disabled={GroupState > 0 ? true : false} style={buttonStyle} onChange={(e)=>{this.fill(e,'MarketPrice')}} placeholder="市场价"/>
            <InputNumber disabled={GroupState > 0 ? true : false} style={buttonStyle} onChange={(e)=>{this.fill(e,'GroupBuyingPrice')}} placeholder="团购价"/>
            <InputNumber disabled={GroupState > 0 ? true : false} style={buttonStyle} onChange={(e)=>{this.fill(e,'SettlementPrice')}} placeholder="结算价"/>
            <InputNumber disabled={GroupState > 0 ? true : false} style={buttonStyle} onChange={(e)=>{this.fill(e,'CostPrice')}} placeholder="成本价"/>
          </div>

          <Table
            bordered={true}
            rowKey={(val,index)=>index}
            columns={columns}
            dataSource={Sku}
            pagination={false}
            scroll={{x:true}}
          />

        </div>
        {GroupBuyingMode===2 ? <Combination form={form}
                                            data={SpecificationData}
                                            dispatch={this.props.dispatch}
                                            QINIU_SERVER={QINIU_SERVER}
                                            beforeUpload={beforeUpload.bind(this)}
                                            tokens={tokens}/> :''}
      </div>
    )
  }
}
