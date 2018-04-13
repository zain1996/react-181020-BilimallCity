import {Form, Input, Modal} from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};

@Form.create()
class ResetPwdDialog extends React.Component {
  state = {
    checkNick: false,
    modalVisible:false
  };
  check = () => {
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          console.info('success');
        }
      },
    );
  }
  handleChange = (e) => {
    this.setState({
      checkNick: e.target.checked,
    }, () => {
      this.props.form.validateFields(['nickname'], {force: true});
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal title="重置密码"
             size="small"
             visible={this.props.visible}
             onOk={this.props.onOk}
             onCancel={this.props.onCancel}
      >
        <div>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('nickname', {
              rules: [{
                required: false,
              }],
            })(
              <b>味罗天下</b>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            {getFieldDecorator('nickname', {
              rules: [{
                required: false,
              }],
            })(
              <p>13598759853</p>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="新密码">
            {getFieldDecorator('pwd', {
              rules: [{
                required: true,
                message: '密码不能少于6个字符',
              }],
            })(
              <Input placeholder="不少于6个字符"/>
            )}
          </FormItem>


        </div>
      </Modal>
    );
  }
}

export default ResetPwdDialog;
