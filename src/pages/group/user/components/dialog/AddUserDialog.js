import {Form, Input, Modal,} from 'antd';
import {Select} from 'antd';
import {connect} from 'dva';

const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};

@connect(state => ({
  groupUser: state.groupUser,
}))
@Form.create()
class AddUserDialog extends React.Component {
  state = {
    checkNick: false,
    modalVisible: false
  };
  constructor(props) {
    super(props);
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }
  componentWillMount(){
    const {dispatch,OrganizationId} = this.props
    dispatch({
      type: 'groupUser/queryRoleList',
      payload:{
        page: 1,
        id: OrganizationId,
        page_size: 10
      }
    })
  }
  componentWillUnmount(){

    const  {resetFields } = this.props.form;

    resetFields();

  }

  getUserData(){
    const {form} = this.props;
    const {validateFields} = form
    let value = false;
    validateFields((err, values) => {
      if (!err) {
        value = values;
      }else{
        value = false
      }
    });
    return value
  }
  getRoleList(){
    const {groupUser:{roles:{List}}} = this.props
    if(!List){
      return '';
    }
    return List.map((val,i)=>(
      <Option key={i} value={val.RoleId}>{val.RoleName}</Option>
    ))
  }
  checkBind(rule,val,callback){
    if(!val){
      callback('成员手机是必填项')
      return
    }
    if(!/^1\d{10}$/.test(val)){
      callback('手机格式有误')
      return
    }
    const {dispatch} = this.props
    dispatch({
      type: 'groupUser/queryCheckBind',
      payload:{
        mobile:val,
        callback:callback
      }
    })
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal title="添加成员"
             size="small"
             width={"400px"}
             visible={this.props.visible}
             onOk={this.props.onOk}
             onCancel={this.props.onCancel}
      >
        <div>
          <FormItem {...formItemLayout} label="组织名称">
              <div>
                <b >{this.props.title}</b>
              </div>
          </FormItem>
          <FormItem {...formItemLayout} label="添加成员账号" hasFeedback>
            {getFieldDecorator('Mobile', {
              validateTrigger: 'onBlur',
              initialValue:'',
              rules: [{
                validator:(rule,val,callback)=>{this.checkBind(rule,val,callback)}
              }]
            })(
            <Input  placeholder="请填写手机号" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="成员姓名">
            {getFieldDecorator('Name', {
              initialValue:'',
              rules: [{
                required: true,
                message: '成员姓名为必填项目'
              }],
            })(
            <Input placeholder="成员真实姓名"  />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="角色">
            {getFieldDecorator('RoleId', {
              initialValue:'',
              rules: [{
                required: true,
                message: '角色为必选项目'
              }],
            })(
            <Select style={{width: '100%'}}>
              {this.getRoleList()}
            </Select>
            )}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default AddUserDialog;
