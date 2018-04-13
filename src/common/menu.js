import userIcon from '../assets/user.png'
import community from '../assets/community.png'
import purchase from '../assets/purchase.png'
import distribution from '../assets/distribution.png'
import orderForm from '../assets/orderForm.png'
import route from '../assets/route.png'

const menuData = [
  {
    name: '成员管理',
    icon: userIcon,
    path:'group/groupUser'
  },
  {
    name: '社团管理',
    icon: community,
    path:'group/community'
  },
  {
    name: '团购任务',
    icon: purchase,
    path:'group/groupPurchase',
    children:[
      {
        name: '团购任务列表',
        icon: purchase,
        path:'groupPurchaseList',
      },
      {
        name: '送货单',
        icon: distribution,
        path:'distributionList',
      },
      {
        name: '销售概况单',
        icon: orderForm,
        path:'orderForm',
      }
    ]
  },
  {
    name: '配送路线规划',
    icon: route,
    path:'group/distributionRoute'
  },
];

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData);

