import react from 'react'
import Result from '../../../components/Result';
import { Button,Card } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
export default class distributionResult extends react.Component{

  render(){
    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'销售概况单',
        href:'/group/groupPurchase/orderForm'
      }
      ,
      {
        title:'结果',
      }
    ]

    return(
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Result
            type="success"
            title="提交成功"
            description="销售概况单生成数据提交成功，系统正在生成，请稍后在“销售概况单”模块中查看并导出"
            style={{ marginTop: 48, marginBottom: 16 }}
            actions={<Button><Link to="/group/groupPurchase/orderForm">前往查看</Link></Button>}
          />
        </Card>
      </PageHeaderLayout>
    )
  }

}
