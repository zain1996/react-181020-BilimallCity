import React, {PureComponent} from 'react';
import { Form, Input, Button, Upload, message ,Icon,Modal} from 'antd';
import styles from './style.less';
import Info from './Info';
import Sku from './Sku';

const {TextArea} = Input ;
const QINIU_SERVER = 'https://up-z2.qiniup.com'

function beforeUpload(file) {
  const {dispatch,OrganizationId} = this.props

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
    return
  }
  return  dispatch({
    type:'purchaseEdit/queryImgToken',
    payload:{
      FileNames:[file.name],
      OrganizationId:OrganizationId
    }
  })

}

class Step2 extends PureComponent {

  state = {
    IllustrationPictures:[],
    previewVisible: false,
    previewImage: '',
    int:false,
    loading: false,
  };

  constructor(props) {
    super(props);
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  componentWillReceiveProps(){
    const {data} = this.props
    let check = false
    if(this.state.int){
      return
    }

    if(data.IllustrationPictures.length > 0){
      check=true
    }
    let array = [];

    this.props.data.IllustrationPictures.map((val,index)=>{
      array.push({
        uid: index,
        name: `${index}.png`,
        response:{img:val},
        status: 'done',
        url: val,
      })
    })

    this.setState({
      IllustrationPictures:array,
      int:check
    })

  }

  IllustrationPicturesChange = ({ fileList,file}) => {
    const {dispatch,data,tokens} = this.props;


    this.setState({
      IllustrationPictures:[...fileList],
    })


    if(file.status==='done'){

      dispatch({
        type: 'purchaseEdit/setAdd',
        payload: {
          ...data,
          IllustrationPictures: [...data.IllustrationPictures,tokens.StoreUrl],
        },
      });
    }

  }

  IllustrationPicturesRemove(file){
    const {dispatch,data,GroupState} = this.props;

    if(GroupState > 1){
      return false
    }
    let array = data.IllustrationPictures.filter((v,k)=>{ return v.indexOf(file.response.img) < 0 })

    dispatch({
      type: 'purchaseEdit/setAdd',
      payload: {
        ...data,
        IllustrationPictures: array,
      },
    });

  }

  onChange = (info) => {
    const {dispatch,data,tokens} = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {

      dispatch({
        type: 'purchaseEdit/setAdd',
        payload: {
          ...data,
          CoverPicture: tokens.StoreUrl,
          tempCoverPicture: tokens.AccessUrl
        },
      });

      this.setState({
        loading: false,
      })
    }
  }

  getInfoData(){
    return this.childInfoCp.handleSubmit()
  }

  render(){
    const { previewVisible, previewImage,IllustrationPictures } = this.state;
    const { form, data,dispatch,tokens,formItemLayout,GroupState,GroupBuyingMode} = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout="horizontal" style={{marginTop:40}}>
        <h2 style={{color:'green'}}>
          填写团购任务信息:
        </h2>
        <Form.Item
          {...formItemLayout}
          label="商品名称"
        >
          {getFieldDecorator('Title', {
            initialValue: data.Title || '',
            rules: [{ required: true, message: '商品名称为必填项' }]
          })(
            <Input disabled={GroupState > 1 ? true : false} placeholder="" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="商品简介"
        >
          {getFieldDecorator('Introduction', {
            initialValue: data.Introduction || '',
            rules:[{required: true, message: '商品简介为必填项'}]
          })(
            <TextArea disabled={GroupState > 1 ? true : false} rows={4} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="封面图"
        >
          <Upload
            name="file"
            data={tokens}
            disabled={GroupState > 1 ? true : false}
            className={styles.avatarUploader}
            listType="picture-card"
            showUploadList={false}
            action={QINIU_SERVER}
            beforeUpload={beforeUpload.bind(this)}
            onChange={this.onChange.bind(this)}
          >
            {data.tempCoverPicture ? <img src={data.tempCoverPicture} width='100%' alt="" /> : <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">封面图</div>
            </div>}
          </Upload>

        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="更多配图（选填）"
        >
          <div className="clearfix">
            <Upload
              name="file"
              disabled={GroupState > 1 ? true : false}
              action={QINIU_SERVER}
              listType="picture-card"
              fileList={IllustrationPictures}
              beforeUpload={beforeUpload.bind(this)}
              onPreview={this.handlePreview}
              onChange={this.IllustrationPicturesChange}
              onRemove={this.IllustrationPicturesRemove.bind(this)}
              data={tokens}
            >
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
              </div>
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="产品信息（选填）"
        >
          <Info data={data} dispatch={dispatch} GroupState={GroupState} getInstance={(childCp) => { this.childInfoCp = childCp;}}/>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="表格明细"
        >
          <Sku form={form}
               GroupBuyingMode={GroupBuyingMode}
               OrganizationId={this.props.OrganizationId}
               GroupState={GroupState}
               beforeUpload={beforeUpload} tokens={tokens}
               QINIU_SERVER={QINIU_SERVER} data={data}
               dispatch={dispatch}
               getInstance={(childCp) => { this.childSkuCp = childCp;}}/>
        </Form.Item>
      </Form>
    );
  }
};

export default Step2;
