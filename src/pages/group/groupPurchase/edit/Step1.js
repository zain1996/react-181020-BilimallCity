import React, { PureComponent } from 'react';
import { Form, Switch,Input,DatePicker,Radio } from 'antd';
import moment from 'moment';
const {TextArea} = Input ;
const RadioGroup = Radio.Group;
class Step1 extends PureComponent {

  state = {
    startValue: null,
    ShowStartTime: null,
    endValue: null,
    int:false
  };

  componentWillReceiveProps(){
    const {data} = this.props
    let check = false
    if(this.state.int){
      return
    }

    if(data.StartTime){
      check=true
    }
    this.setState({
      startValue:data.StartTime,
      ShowStartTime:data.ShowStartTime,
      endValue:data.EndTime,
      int:check
    })

  }

  disabledStartDate = (startValue) => {
    return startValue && startValue.format('YYYY-MM-DD 00:00') < moment().format('YYYY-MM-DD 00:00');
  }


  onChange = (field, value) => {

    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }
  onShowStartTimeChange = (value) => {
    this.onChange('ShowStartTime', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  setSellType(e){
    const {dispatch,data} = this.props;
    data['SellType'] = e ? 2 : 1;
    dispatch({
      type:'purchaseEdit/setAdd',
      payload:{
        ...data,
      }
    })
  }


  render(){
    const {formItemLayout,form,data,GroupState,GroupBuyingMode} = this.props
    const { getFieldDecorator} = form;
    return (
      <div>
        <Form layout="horizontal" >
          <h2 style={{color:'green'}}>
            填写团购任务信息:
          </h2>
          {GroupBuyingMode === 2 ? <Form.Item
            {...formItemLayout}
            label="开团日期"
          >
            {getFieldDecorator('ShowStartTime', {
              initialValue: data.ShowStartTime ? moment(data.ShowStartTime, 'YYYY-MM-DD HH:mm'):null,
              rules: [{type:'object',required: true, message: '开团日期为必填项' }],
            })(
              <DatePicker
                disabled={GroupState > 0 ? true : false}
                disabledDate={this.disabledStartDate}
                onChange={this.onShowStartTimeChange}
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择日期"
              />
            )}

          </Form.Item> : <Form.Item
            {...formItemLayout}
            label="开团日期"
          >
            {getFieldDecorator('StartTime', {
              initialValue: data.StartTime ? moment(data.StartTime, 'YYYY-MM-DD HH:mm'):null,
              rules: [{type:'object',required: true, message: '开团日期为必填项' }],
            })(
              <DatePicker
                disabled={GroupState > 0 ? true : false}
                disabledDate={this.disabledStartDate}
                onChange={this.onStartChange}
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择日期"
              />
            )}

          </Form.Item>}
          <Form.Item
            {...formItemLayout}
            label="截单日期"
          >

            {getFieldDecorator('EndTime', {
              validateTrigger:['submit','onChange'],
              initialValue: data.EndTime ? moment(data.EndTime, 'YYYY-MM-DD HH:mm'):null,
              rules: [{type:'object',required: true, message: '截单日期为必填项' },{
                validator:(rule,val,callback)=>{
                  if(val.format() < this.state.ShowStartTime){
                    callback('截单日期必须大于开团日期！')
                  }else{
                    callback()
                  }
                },
              }],
            })(
              <DatePicker
                onChange={this.onEndChange}
                disabled={GroupState > 1 ? true : false}
                showTime={{ defaultValue: moment('00:01', 'HH:mm') }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择日期"
              />
            )}

          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          >

            {getFieldDecorator('Notes', {
              initialValue: data.Notes ||'',
              rules:[{
                validator:(rule,val,callback)=>{

                  if(val.length>50){
                    callback('字数最长50')
                  }else{
                    callback()
                  }
                }},
                {required: true, message: '备注为必填项' }
                ]
            })(
              <TextArea placeholder="(如：今晚截单，下周一左右配送！)" disabled={GroupState > 1 ? true : false} rows={4} />
            )}

          </Form.Item>
          {GroupBuyingMode === 2 ?<Form.Item
            {...formItemLayout}
            label="秒杀模式"
          >
            <Switch disabled={GroupState > 0 ? true : false} checked={data.SellType===2 ? true : false} onChange={(e)=>{this.setSellType(e)}}/>
          </Form.Item>:''}
          {data.SellType === 2?<Form.Item
            {...formItemLayout}
            colon={false}
            required={false}
            label=" "
          >
            {getFieldDecorator('StartTime', {
              initialValue: data.StartTime ? moment(data.StartTime, 'YYYY-MM-DD HH:mm'):null,
              rules: [{type:'object',required: true, message: '秒杀日期为必填项' },{
                validator:(rule,val,callback)=>{
                  if(val.format() < this.state.ShowStartTime){
                    callback('秒杀日期必须大于开团日期！')
                  }else{
                    callback()
                  }
                },
              }],
            })(
              <DatePicker
                onChange={this.onStartChange}
                showTime={{ defaultValue: moment('00:01', 'HH:mm') }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择日期"
              />
            )}

          </Form.Item>:''}
          <Form.Item
            {...formItemLayout}
            label="是否上架"
          >
            {getFieldDecorator('ShowState', {
              initialValue: data.ShowState === undefined ? 1 : data.ShowState,
            })(
              <RadioGroup disabled={GroupState > 0 ? true : false}>
                <Radio value={1}>是<br/></Radio>
                <Radio value={0}>否<br/></Radio>
              </RadioGroup>
            )}

          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Step1
