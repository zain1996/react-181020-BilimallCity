import {Form, Input, Modal,} from 'antd';
import {Select, Table, Divider, Switch, Checkbox} from 'antd';
import styles from './EditUserInfoDialog.less';
import {connect} from 'dva'
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 3},
  wrapperCol: {span: 21},
};

@connect(state => ({
  groupUser: state.groupUser,
}))
@Form.create()
class EditRoleDialog extends React.Component {
  state = {
    checkNick: false,
    modalVisible: false,
  };

  constructor(props) {
    super(props);
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }

  componentWillMount(){
    const {dispatch,OrganizationId,RoleId} = this.props
    dispatch({
      type: 'groupUser/queryEditRoleList',
      payload:{
        OrganizationId:OrganizationId,
        RoleId:RoleId
      }
    })
  }

  getRoleName(){
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
  render() {

    const {groupUser: {loading, editRoles: {Modules,StaffRole}},form} = this.props;
    const {getFieldDecorator} = form
    const checkedAll = (indexId,e)=>{
      Modules[indexId]['ModuleAuthorization']['IsOwn'] = e.target.checked;
      Object.keys(Modules[indexId]['SubAuthorizations']).map((val,index)=>{
        Modules[indexId]['SubAuthorizations'][val]['IsOwn'] = e.target.checked;
      })
      this.props.dispatch({
        type:'groupUser/changeChecked',
        payload:{
          Modules:Modules
        }
      })
    }

    const checkedChildren = (childrenId,parentId,e)=>{
      Modules[parentId]['SubAuthorizations'][childrenId]['IsOwn'] = e.target.checked;
      if(e.target.checked){
        Modules[parentId]['ModuleAuthorization']['IsOwn'] = e.target.checked;
      }else{
        Modules[parentId]['ModuleAuthorization']['IsOwn'] = e.target.checked;
        Object.values(Modules[parentId]['SubAuthorizations']).map((val,index)=>{
          if(val.IsOwn){
            Modules[parentId]['ModuleAuthorization']['IsOwn'] = !e.target.checked;
          }
        })
      }

      this.props.dispatch({
        type:'groupUser/changeChecked',
        payload:{
          Modules:Modules
        }
      })
    }

    const columns = [
      {
        title: '板块',
        dataIndex:'ModuleAuthorization.Title',
        render:(text,recoad,index)=>{
          return <Checkbox
            checked={recoad.ModuleAuthorization.IsOwn}
            onChange={(e)=>{checkedAll(index,e)}}
          >
            {text}
          </Checkbox>

        }
      },

      {
        title: '子版块',
        render: (text,recoad,index) => {
          return Object.values(recoad.SubAuthorizations).map((val,i)=>{
            return <Checkbox key={i}
               checked={val['IsOwn']}
               onChange={(e)=>{checkedChildren(val.AuthorizationId,index,e)}}
            >
              {val.Title}
            </Checkbox>
            }
          )
        },
      },
    ];
    return (
      <Modal title="添加角色"
             width={"800px"}
             visible={this.props.visible}
             onOk={this.props.onOk}
             onCancel={this.props.onCancel}
      >
        <div>
          <FormItem {...formItemLayout} label="角色名称">
            {getFieldDecorator('RoleName', {
              initialValue: StaffRole.RoleName || '',
              rules: [
                { required: true, message: '角色名称为必填项目'},
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="设置权限">

              <Table
                bordered
                rowKey={(key)=>{return key.ModuleAuthorization.AuthorizationId}}
                className={styles.table}
                loading={loading}
                dataSource={Modules}
                columns={columns}
                pagination={false}
              />

          </FormItem>

        </div>
      </Modal>
    );
  }
}

export default EditRoleDialog;
