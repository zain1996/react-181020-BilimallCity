import React, { PureComponent } from 'react';
import {Upload,Button,Icon,Select,Table,Input,InputNumber} from 'antd'
import CombinationModel from './CombinationModel'
const Option = Select.Option;

export default class Combination extends PureComponent {

  state = {
    imgFiles: [],
    SkuId:"0",
    visible:false,
    CombinationData:[]
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

    data.Combination[k][name] = e;

    dispatch({
      type:'purchaseAdd/setAdd',
      payload:{
        ...data
      }
    })

  }
  setCombinationAdd(){
    const {data , dispatch} = this.props
    dispatch({
      type:'purchaseAdd/setAdd',
      payload:{
        ...data,
        Combination:[...data.Combination,{}]
      }
    })
  }

  setCombinationDelete(index){
    const {data , dispatch} = this.props
    let newCombination = data.Combination
    newCombination = newCombination.filter((k,v) => v!==index)
    dispatch({
      type:'purchaseAdd/setAdd',
      payload:{
        ...data,
        Combination:newCombination
      }
    })
  }

  imgOnchange(info,index) {
    const {dispatch,data,tokens} = this.props;
    if (info.file.status === 'done') {
      let Combination = data.Combination;
      Combination[index]['IllustrationPicture'] = tokens.StoreUrl;
      Combination[index]['tempIllustrationPicture'] = tokens.AccessUrl;
      dispatch({
        type:'purchaseAdd/setAdd',
        payload:{
          ...data,
          Combination:[
            ...Combination
          ]
        }
      })
    }
  }

  openCombinationModel(val,data){

    this.setState({
      SkuId:val,
      CombinationData:data
    },()=>{
      this.setModelVisible(true);
    })
  }

  getSubSkuItems(val){

    const {data:{Sku}} = this.props
    let string = []

    Object.values(val).map((v,k)=>{
      string.push(Sku[v.SkuId].Name.join(' ') + ' X' + v.Count)
    })

    return string.join('\n')
  }
  setModelVisible(val){
    this.setState({
      visible:val
    })
  }
  render(){
    const {data:{Combination},QINIU_SERVER,beforeUpload,tokens} = this.props
    const Props = {
      name: 'file',
      action: QINIU_SERVER,
    };
    const columns = [
      {
        title: '套装名称',
        dataIndex:'Name',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <Input value={text} onChange={(e)=>{this.inputOnchange(e.target.value,k,'Name')}} style={{width:80}} placeholder="" />
            </div>
          )
        }
      },
      {
        title: '市场价',
        dataIndex:'MarketPrice',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <InputNumber value={text} onChange={(e)=>{this.inputOnchange(e,k,'MarketPrice')}} style={{width:50}} placeholder="" />
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
              <InputNumber value={text} onChange={(e)=>{this.inputOnchange(e,k,'GroupBuyingPrice')}} style={{width:50}} placeholder="" />
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
              <InputNumber value={text} onChange={(e)=>{this.inputOnchange(e,k,'SettlementPrice')}} style={{width:50}} placeholder="" />

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
              <InputNumber value={text} onChange={(e)=>{this.inputOnchange(e,k,'CostPrice')}} style={{width:50}} placeholder="" />

            </div>
          )
        }
      },
      {
        title: '组合详情',
        dataIndex:'SubSkuItems',
        render: (text,record,k) => {
          return (
            <div key={k} style={{width:80}}>
              <a onClick={()=>{this.openCombinationModel(k,text)}}>{text ? this.getSubSkuItems(text) : '关联单品'}</a>
            </div>
          )
        }
      },
      {
        title: '是否显示',
        dataIndex:'IsShow',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <Select onChange={(e)=>{ this.inputOnchange(e === 1 ? true : false,k,'IsShow')}} value={text === true ? 1 : 0}  style={{ width: 80 }} >
                <Option value={1}>显示</Option>
                <Option value={0}>不显示</Option>
              </Select>
            </div>
          )
        }
      },
      {
        title: '配图',
        dataIndex:'IllustrationPicture',
        render: (text,record,k) => {
          return (
            <div key={k}>
              <Upload {...Props}
                      onChange={(e)=>{this.imgOnchange(e,k)}}
                      beforeUpload={beforeUpload.bind(this)}
                      data={tokens}
                      showUploadList={false}
              >
                <Button style={{backgroundImage:`url(${Combination[k].IllustrationPicture})`,backgroundSize:"100%",minWidth:80}}>
                  {!Combination[k].IllustrationPicture ? <div><Icon type="upload" /> 上传</div>:''}
                </Button>
              </Upload>
            </div>
          )
        }
      },
      {
        title: '操作',
        render: (text,record,k) => {
          return (
            <a onClick={()=>{this.setCombinationDelete(k)}}>删除</a>
          )
        }
      }
    ]
    return(
      <div>
        <div style={{padding:10,borderBottom:'1px solid #d9d9d9'}}>组合规格 <a style={{float:'right'}} onClick={()=>{this.setCombinationAdd()}}>添加组合</a></div>
        {this.state.visible ? <CombinationModel
          SkuId={this.state.SkuId}
          setModelVisible={this.setModelVisible.bind(this)}
          visible={this.state.visible}
          CombinationData={this.state.CombinationData}
          inputOnchange={this.inputOnchange.bind(this)}
          data={this.props.data} getInstance={(childCp) => { this.childCp = childCp;}}/>:''}
        <div style={{padding:10}}>
          <Table
            rowKey={(val,index)=>index}
            columns={columns}
            dataSource={Combination}
            pagination={false}
            scroll={{x:true}}
            size="small"
          />
        </div>
      </div>
    )
  }
}
