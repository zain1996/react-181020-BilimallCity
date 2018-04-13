import React, { PureComponent } from 'react';
import {Form,Button,Icon,Input,Modal} from 'antd'
const FormItem = Form.Item;

@Form.create()
export default class Specification extends PureComponent {

  state = {
    Specification:[],
    visible:false
  }


  constructor(props) {
    super(props);
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }

  remove = (index) => {
    let { data:{Specification},GroupState } = this.props;
    if(GroupState > 0 ? true : false){
      return false
    }
    Specification = Specification.filter((k,v) => v!==index)

    this.update(Specification);

  }

  removeChilder = (index,indexChilder) => {
    let { data:{Specification},GroupState } = this.props;
    if(GroupState > 0 ? true : false){
      return false
    }
    Specification[index].Labels = Specification[index].Labels.filter((v,k) => {
      Specification[index].Labels[k].LabelId = `${index}:${k}`;
      return k!==indexChilder
    })

    this.update(Specification);
  }

  skuSpecification(){
    const {data,dispatch,GroupState} = this.props;
    if(GroupState>0){
      return false
    }
    let val = data.Specification
    let list = []
    val.map((v,k)=>{
      list[k] = [];
      v.Labels.map((cV,cK)=>{
        list[k][cK] = [];
        list[k][cK]['LabelId'] = cV.LabelId
        list[k][cK]['Name'] = cV.Name
      })
    })

    let backets = []

    let preview = 1

    list = list.reverse();

    list.forEach(value => {

      backets.push({
        repeat : preview,
        values : value
      })

      preview = preview * value.length

    })

    backets = backets.reverse()

    let table = []

    for(let i=0;i<preview;i++){

      table[i] = {}

      table[i].LabelIds = [];
      table[i].Name = [];
      table[i].SkuId = i+"";
    }

    backets.forEach(backet => {

      for(let index=0;index < preview;) {
        backet.values.forEach((newVal,kk) => {
          for (let i =0; i<backet.repeat;i++) {

            table[index].LabelIds.push(newVal.LabelId);
            table[index].Name.push(newVal.Name);
            index++

          }
        })
      }
    })

    if(!val.length){
      table = [];
    }

    dispatch({
      type:'purchaseEdit/setAdd',
      payload:{
        ...data,
        backets:backets,
        Sku:table,
        Combination:[]
      }
    })

    this.setModelVisible()

  }

  addChilder = (index) => {

    let { data:{Specification} } = this.props;

    let Labels = Specification[index].Labels;

    Specification[index].Labels = [...Labels, {
      LabelId:`${index}:${Labels.length + 1}`,
      Name:''
    }];

    this.update(Specification);

  };

  add = () => {
    let { data:{Specification} } = this.props;

    Specification = [...Specification, {
      Name : '',
      Labels: [],
    }];
    this.update(Specification)

  }

  update(val){
    const { dispatch,data } = this.props;

    let newVal = {
      ...data,
      Specification:val
    }


    dispatch({
      type:'purchaseEdit/setAdd',
      payload:{
        ...newVal,
      }
    })

  }

  setChilderValue(e,parentId,childerId){

    const {target:{value}} = e;

    const { data:{Specification} } = this.props;

    Specification[parentId].Labels[childerId].Name = value

    this.update(Specification)

  }

  setParentValue(e,parentId){

    const {target:{value}} = e;

    const { data:{Specification} } = this.props;

    Specification[parentId].Name = value

    this.update(Specification)

  }
  handleSubmit = () => {

    this.props.form.validateFields((err, values) => {
      if (!err) {
        return values.info
      }else{
        return false
      }
    });
  }

  setModelVisible(val){
    this.setState({
      visible:val
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { data:{Specification},GroupState } = this.props;
    getFieldDecorator('keys', { initialValue: [] });
    const formChilderItems = (val)=>{
      return Specification[val].Labels.map((k, index) => {
        return (
          <div key={index} style={{marginRight:10,position: 'relative',width:120,display:'inline-block'}}>
            <Input
              disabled={GroupState > 0 ? true : false}
              style={{width:120}} onChange={(e)=>{this.setChilderValue(e,val,index)}}
              value={Specification[val].Labels[index].Name}
            />
            <Icon
              style={{position: 'absolute',right:-5,top:0}}
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={Specification.length === 1}
              onClick={() => this.removeChilder(val,index)}
            />
          </div>
        )
      })
    }


    const formItems = Specification.map((k, index) => {

      return (
        <div key={index} style={{marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',background:'rgb(246,246,246)',padding:5}}>
            规格名:<Input disabled={GroupState > 0 ? true : false}  style={{marginRight:10,width:60}} onChange={(e)=>{this.setParentValue(e,index)}}
                        value={Specification[index].Name}
          />
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={Specification.length === 1}
              onClick={() => this.remove(index)}
            />
          </div>
          <div style={{padding:5}}>
            <div style={{display:'inline-block',verticalAlign:'top'}}>规格值:</div>
            <div  style={{display:'inline-block',width:500}}>{formChilderItems(index)}
              <a disabled={GroupState > 0 ? true : false} onClick={()=>{this.addChilder(index)}}>
                增加规格值
              </a>
            </div>
          </div>

        </div>
      );
    });
    return(
      <Modal title="添加单品规格"
             visible={this.state.visible}
             onCancel={()=>{this.setModelVisible(false)}}
             onOk={()=>{this.skuSpecification()}}
             okText="生成"
             width={600}
      >
        <div style={{border:'1px solid #d9d9d9',padding:10}}>
          {formItems}
          <FormItem style={{background:'rgb(246,246,246)',padding:5,marginTop:20}}>
            <Button disabled={GroupState > 0 ? true : false} onClick={this.add} style={{ width:130 }}>
              增加规格名
            </Button>
          </FormItem>
        </div>
      </Modal>
    )
  }
}
