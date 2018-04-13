import react from 'react'
import {Card,Button,List,Spin,Table} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {getLocalStorage} from '../../../utils/utils'
import InfiniteScroll from 'react-infinite-scroller';
import {connect} from 'dva';
const userData = getLocalStorage('userData');
import style from './relation.less'
@connect(state => ({
  distributionRoute: state.distributionRoute,
}))
export default class relation extends react.Component{

  state= {
    page:1,
    mockData:{}
  }

  componentWillMount() {
    this.getData(1);
  }

  componentWillUnmount(){
    const {dispatch} = this.props;
    dispatch({
      type: 'distributionRoute/resetBindCommunityList'
    });
  }

  getData = (page) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'distributionRoute/querybindCommunityList',
      payload:{
        page:page,
        page_size:10,
        OrganizationId:userData.id
      }
    });
  }

  handleInfiniteOnLoad = () => {
    let page = this.state.page + 1;

    this.setState({
      page:page
    })

    this.getData(page);

  }

  addMockData(val){
    let list = this.state.mockData;

    if(!(val.GroupId in list)){
      list[Number(val.GroupId)] = val
    }

    this.setState({
      mockData:{...list}
    })
  }

  removeMockData(val){
    let list = this.state.mockData;

    if(val.GroupId in list){
      delete list[val.GroupId]
    }

    this.setState({
      mockData:{...list}
    })
  }

  handlerSubmit(){
    let data = Object.keys(this.state.mockData);
    data.map((val,index)=>{
      data[index] = Number(val)
    })

    const {dispatch,match:{params}} = this.props;
    dispatch({
      type: 'distributionRoute/submitBindCommunityAdd',
      payload:{
        LineId:params.LineId,
        GroupIds:data
      }
    });

  }

  render(){

    const {dispatch,distributionRoute:{bindCommunityList,loading}} = this.props;

    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'路线列表',
        href:'/group/distributionRoute'
      }
      ,
      {
        title:'关联社团',
      }
    ]

    const columns = [
      {
        title: '社团名称',
        dataIndex: 'GroupName',
      },
      {
        title: '团长姓名',
        dataIndex: 'ManagerName',
      },
      {
        title: '操作',
        render: (text, record) => (
          <a onClick={()=>{this.addMockData(record)}}>添加</a>
        ),
      }
    ];

    const mockDataColumns = [
      {
        title: '社团名称',
        dataIndex: 'GroupName',
      },
      {
        title: '团长姓名',
        dataIndex: 'ManagerName',
      },
      {
        title: '操作',
        render: (text, record) => (
          <a onClick={()=>{this.removeMockData(record)}}>删除</a>
        ),
      }
    ];
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}
              title="关联社团"
        >

          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div className={style.list}>
              <h3>待选</h3>
              <div className={style.listContent}>
                <InfiniteScroll
                  initialLoad={false}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!bindCommunityList.loading && bindCommunityList.hasMore}
                  useWindow={false}
                >
                  <List>
                    <Table
                      rowKey="GroupId"
                      columns={columns}
                      dataSource={bindCommunityList.List}
                      pagination={false}
                    />
                    {bindCommunityList.loading && bindCommunityList.hasMore && <Spin className={style.demoLoading} />}
                  </List>
                </InfiniteScroll>
              </div>
            </div>
            <div className={style.list}>
              <h3 style={{po:'fle'}}>已选</h3>
              <div className={style.listContent}>
                <List>
                  <Table
                    rowKey="GroupId"
                    columns={mockDataColumns}
                    dataSource={Object.values(this.state.mockData)}
                    pagination={false}
                  />
                </List>
              </div>
            </div>
          </div>
          <div style={{display:'flex',marginTop:20,justifyContent:'center'}} ><Button loading={loading} onClick={()=>{this.handlerSubmit()}}>确定</Button></div>
        </Card>
      </PageHeaderLayout>
    )
  }
}
