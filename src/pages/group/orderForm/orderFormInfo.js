import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import {Table,Card,Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import {getLocalStorage} from '../../../utils/utils'

const userData = getLocalStorage('userData');
@connect(state => ({
  orderForm: state.orderForm,
}))

export default class orderForm extends PureComponent {

  state = {
    title:0,
    OrganizationId:0,
    IndentId:0,
  };

  componentWillMount() {

    const {match:{params},dispatch} = this.props;

    this.setState({
      title:params.title,
      OrganizationId:userData.id,
      IndentID:params.IndentId,
    },()=>{
      dispatch({
        type: 'orderForm/queryOrderInfo',
        payload:this.state.IndentID
      });
    })

  }


  formatTime(val,formatString='YYYY年MM月DD日'){
    return moment(val).utcOffset(val).format(formatString)
  }

  render() {
    const {orderForm:{orderInfo:{TaskStatistics},loading}} = this.props;
    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'销售概况单',
        href:`/group/groupPurchase/orderForm`
      }
      ,
      {
        title:'销售概况单概要',
      }
    ]

    const columns = [
      {
        title: '团购日期',
        dataIndex:'StartTime',
        render:(text,record,index)=>{
          return this.formatTime(text);
        }
      },
      {
        title: '商品名称',
        dataIndex:'Title',
        render:(text,record,index)=>{
          return text
        }

      },
      {
        title: '规格', dataIndex: 'SkuId',
        render:(text,record,index)=>{
          return Object.values(record.Labels).map((val)=>{
            return val.Name + '\n'
          })
        }
      },
      {
        title: '团购价', dataIndex: 'GroupBuyingPrice',
        render:(text,record,index)=>{
          return text
        }
      },
      {
        title: '结算价', dataIndex: 'SettlementPrice',
        render:(text,record,index)=>{
          return text
        }
      },
      {
        title: '成本价', dataIndex: 'CostPrice',
        render:(text,record,index)=>{
          return text
        }
      },
      {
        title: '销量', dataIndex: 'Sales',
        render:(text,record,index)=>{
          return text
        }
      },
      {
        title: '参团数', dataIndex: 'CommunityCount',
        render:(text,record,index)=>{
          return text
        }
      },
      {
        title: '总成本', dataIndex: 'TotalCost',
        render:(text,record,index)=>{
          return text
        }
      },
      {
        title: '总结算额', dataIndex: 'TotalSettlement',
        render:(text,record,index)=>{
          return text
        }
      }

    ];


    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}>
        <Card bordered={false}
              title="销售概况单概要"
        >
          <Table
            bordered
            pagination={false}
            columns={columns}
            rowKey='index'
            dataSource={TaskStatistics}
            loading={loading}
          />
        </Card>
      </PageHeaderLayout>

    );
  }
}
