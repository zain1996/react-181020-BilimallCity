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
    type:'purchaseAdd/queryImgToken',
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

  componentWillMount(){

    let array = [];

    this.props.data.IllustrationPictures.map((val,index)=>{
      array.push({
        uid: index,
        name: `${index}.png`,
        status: 'done',
        url: val,
      })
    })

    this.setState({
      IllustrationPictures:array,
      int:1
    })

  }

  IllustrationPicturesChange = ({ fileList,file}) => {
    const {dispatch,data,tokens} = this.props;


    this.setState({
      IllustrationPictures:[...fileList],
    })


    if(file.status==='done'){

      dispatch({
        type: 'purchaseAdd/setAdd',
        payload: {
          ...data,
          IllustrationPictures: [...data.IllustrationPictures,tokens.StoreUrl],
        },
      });
    }

  }

  IllustrationPicturesRemove(file){
    const {dispatch,data} = this.props;

    let array = data.IllustrationPictures.filter((v,k)=>{ return v.indexOf(file.response.img) < 0 })

    dispatch({
      type: 'purchaseAdd/setAdd',
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
        type: 'purchaseAdd/setAdd',
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
  const { form, data,dispatch,tokens,formItemLayout,GroupBuyingMode} = this.props;
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
          <Input placeholder="" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="商品简介"
      >
        {getFieldDecorator('Introduction', {
          initialValue: data.Introduction || '',
          rules:[{required: true, message: '商品简介为必填项'}]}
        )(
          <TextArea rows={4} />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="封面图"
      >
        <Upload
          name="file"
          data={tokens}
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
        <Info data={data} getInstance={(childCp) => { this.childInfoCp = childCp;}}/>
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="表格明细"
      >
        <Sku form={form}
             GroupBuyingMode={GroupBuyingMode}
             OrganizationId={this.props.OrganizationId}
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
