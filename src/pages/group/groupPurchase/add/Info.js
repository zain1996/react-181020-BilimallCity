import React, { PureComponent } from 'react';
import {Form,Button,Icon,Input} from 'antd'
const FormItem = Form.Item;

@Form.create()
export default class Info extends PureComponent {

  constructor(props) {
    super(props);
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }

  remove = (k) => {
    const { form } = this.props;

    const keys = form.getFieldValue('keys');

    form.setFieldsValue({
      keys: keys.filter((val,key) => key !== k),
    });

  }

  add = () => {
    const { form } = this.props;

    let keys = form.getFieldValue('keys');

    keys = [...keys,{

    }];

    form.setFieldsValue({
      keys:keys
    });

  }

  handleSubmit = () => {
    let value = []
    this.props.form.validateFields((err, values) => {

        value = values.Info || []
    });
    return value
  }

  render(){

    const { getFieldDecorator, getFieldValue } = this.props.form;

    const {data:{Info}} = this.props;

    getFieldDecorator('keys', { initialValue: Info });

    const keys = getFieldValue('keys');
    const getPlaceholder = (val)=>{
      if(val===0){
        return '如:产品名称'
      }
      if(val===1){
        return '如:生产信息'
      }
      return '请输入选项'
    }
    const formItems = keys.map((k, index) => {
      return (
        <FormItem key={index}
                  style={{ marginBottom: 0 }}
        >
          <FormItem
            style={{display:'inline-block',width: '20%',
              border:'1px solid #d9d9d9',padding:5 ,
              borderBottom:index === keys.length ? 0: 1,
              borderRight:0,
              marginBottom: 0
            }}
          >
            {getFieldDecorator(`Info[${index}].Title`, {
              initialValue: Info[index] ? Info[index].Title : ''
            })(
              <Input placeholder={getPlaceholder(index)}/>
            )}

          </FormItem>
          <FormItem
            style={{display:'inline-block',width: '80%',
              border:'1px solid #d9d9d9',padding:5 ,
              borderBottom:index === keys.length ? 0: 1,
              marginBottom: 0
            }}
          >
            {getFieldDecorator(`Info[${index}].Content`, {
              initialValue: Info[index] ? Info[index].Content : ''
            })(
              <Input placeholder="请输入选项"/>
            )}

          </FormItem>
          <Icon
            style={{position: 'absolute',top:18,right:-20}}
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(index)}
          />
        </FormItem>
      );
    });
    return(
      <div>
        {formItems}
        <FormItem style={{border:'1px solid #d9d9d9',padding:5,width:'100%',textAlign:'center'}}>
          <Button onClick={this.add}>
            增加一栏
          </Button>
        </FormItem>
      </div>
    )
  }
}
