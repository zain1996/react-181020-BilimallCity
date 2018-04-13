import {getLocalStorage} from './utils'

const RoleArray ={
  1000:{
    "AuthorizationId":1000,
    "Title":"成员管理",
  },
  1001:{
    "AuthorizationId":1001,
    "Title":"查看成员",
  },
  1002:{
    "AuthorizationId":1002,
    "Title":"编辑成员",
  },
  1003:{
    "AuthorizationId":1003,
    "Title":"查看角色",
  },
  1004:{
    "AuthorizationId":1004,
    "Title":"编辑角色",
  },
  2000:{
    "AuthorizationId":2000,
    "Title":"社团管理",
  },
  2001:{
    "AuthorizationId":2001,
    "Title":"查看社团",
  },
  2002:{
    "AuthorizationId":2002,
    "Title":"编辑社团",
  },
  3000:{
    "AuthorizationId":3000,
    "Title":"团购任务管理",
  },
  3002:{
    "AuthorizationId":3002,
    "Title":"编辑团购任务",
  },
  3001:{
    "AuthorizationId":3001,
    "Title":"查看团购任务",
  }
}




export function checkRole(id) {

  const roleMap = getLocalStorage('userData')

  const roleId = RoleArray[id].AuthorizationId;

  if(!roleMap){
    return false
  }

  if(roleMap.Staff.RoleAuthorization[1]){
    return false
  }

  return !roleMap.Staff.RoleAuthorization[roleId]
}

