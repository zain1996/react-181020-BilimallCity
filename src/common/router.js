import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';
import { checkRole } from '../utils/utilsCheckRole';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/group/groupUser': {
      checkOpen: checkRole(1000),
      component: dynamicWrapper(app, ['group/user'], () => import('../pages/group/user/User'))
    },
    '/group/community': {
      checkOpen: checkRole(2000),
      component: dynamicWrapper(app, ['group/community'], () => import('../pages/group/community/CommunityList'))
    },
    '/group/&community&/communityEdit/:GroupId': {
      component: dynamicWrapper(app, ['group/community','getToken'], () => import('../pages/group/community/CommunityEdit'))
    },
    '/group/&community&/communityAdd': {
      component: dynamicWrapper(app, ['group/community','getToken'], () => import('../pages/group/community/CommunityAdd'))
    },
    '/group/groupPurchase/groupPurchaseList': {
      checkOpen: checkRole(3000),
      component: dynamicWrapper(app, ['group/purchase','group/purchaseEnd'], () => import('../pages/group/groupPurchase/GroupPurchase'))
    },
    '/group/&groupPurchaseList&/add': {
      component: dynamicWrapper(app, ['group/purchaseAdd'], () => import('../pages/group/groupPurchase/add/Add'))
    },
    '/group/&groupPurchaseList&/edit/:TaskId': {
      component: dynamicWrapper(app, ['group/purchaseEdit'], () => import('../pages/group/groupPurchase/edit/Edit'))
    },
    '/group/&groupPurchaseList&/resetAdd/:TaskId': {
      component: dynamicWrapper(app, ['group/purchaseEdit','group/purchaseAdd'], () => import('../pages/group/groupPurchase/resetAdd/ResetAdd'))
    },
    '/group/groupPurchase/orderForm': {
      checkOpen: checkRole(3001),
      component: dynamicWrapper(app, ['group/orderForm'], () => import('../pages/group/orderForm/orderForm'))
    },
    '/group/groupPurchase/&orderForm&/orderFormInfo/:IndentId': {
      component: dynamicWrapper(app, ['group/orderForm'], () => import('../pages/group/orderForm/orderFormInfo'))
    },
    '/group/groupPurchase/&orderForm&/orderFormAdd': {
      component: dynamicWrapper(app, ['group/orderForm'], () => import('../pages/group/orderForm/orderFormAdd'))
    },
    '/group/groupPurchase/&orderForm&/orderFormResult': {
      component: dynamicWrapper(app, [], () => import('../pages/group/orderForm/orderFormResult'))
    },
    '/group/groupPurchase/distributionList': {
      checkOpen: checkRole(3001),
      component: dynamicWrapper(app, ['group/distribution'], () => import('../pages/group/distribution/distributionList'))
    },
    '/group/groupPurchase/&distributionList&/distributionAdd': {
      component: dynamicWrapper(app, ['group/distribution'], () => import('../pages/group/distribution/distributionAdd'))
    },
    '/group/groupPurchase/&distributionList&/distributionResult': {
      component: dynamicWrapper(app, [], () => import('../pages/group/distribution/distributionResult'))
    },
    '/group/distributionRoute': {
      component: dynamicWrapper(app, ['group/distributionRoute'], () => import('../pages/group/distributionRoute/route'))
    },
    '/group/&distributionRoute&/distributionRouteRelation/:LineId': {
      component: dynamicWrapper(app, ['group/distributionRoute'], () => import('../pages/group/distributionRoute/relation'))
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../pages/login/Login')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });

  return routerDataWithName;
};
