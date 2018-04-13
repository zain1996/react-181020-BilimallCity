import React, {PureComponent} from 'react';
import { Form,Divider, Input, Button, Upload, message ,Icon} from 'antd';
import base64 from 'base-64';

const { TextArea } = Input;


class Step3 extends PureComponent {


  handleChange = (content) => {
    const {dispatch,data} = this.props;

    dispatch({
      type: 'purchaseEdit/setAdd',
      payload: {
        ...data,
        WxSellText:content.target.value
      },
    });

  }

  render(){

    const {data} = this.props;

    return (
      <Form layout="horizontal" style={{marginTop:40}}>
        <h2 style={{color:'green'}}>
          接龙单产品信息:
        </h2>
        <Form.Item
          style={{marginLeft:'12.5%',width:'66.66666667%',marginBottom:50}}
        >
          <TextArea placeholder="（将发送到团购群里的产品信息完整的粘贴到该地方）" rows={8} onChange={(val)=>{this.handleChange(val)}} value={data.WxSellText} />
        </Form.Item>
      </Form>
    );
  }
};

export default Step3;
