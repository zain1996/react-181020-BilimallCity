import {stringify} from 'qs';
import request from '../utils/request';

/**
 * 获取权限列表
 * @returns {Promise<Object>}
 */
export async function queryRoleList(params) {
  return request(`/api/v1/agency/org/role/list/${params.id}?${stringify(params)}`)
}

/**
 * 获取成员列表
 * @returns {Promise<Object>}
 */
export async function queryUserList(params) {
  return request(`/api/v1/agency/org/staff/list/${params.id}?${stringify(params)}`)
}

/**
 * 获取获取角色
 * @returns {Promise<Object>}
 */
export async function queryAddRoleList() {
  return request(`/api/v1/agency/org/authorization/list`)
}


/**
 * 编辑成员信息
 * @returns {Promise<Object>}
 */
export async function submitUserInfo(params) {
  return request(`/api/v1/agency/org/staff/edit/${params.OrganizationId}/${params.uid}`, {
    method: 'POST',
    body: params,
  });

}
/**
 * 禁用成员
 * @returns {Promise<Object>}
 */
export async function uploadGroupUserState(params) {
  return request(`/api/v1/agency/org/staff/disable/${params.OrganizationId}/${params.UserId}`, {
    method: 'POST',
    body: params,
  });
}


/**
 * 添加成员
 * @returns {Promise<Object>}
 */
export async function uploadGroupAddUser(params) {
  return request(`/api/v1/agency/org/staff/add/${params.OrganizationId}`, {
    method: 'POST',
    body: params,
  });

}

/**
 * 修改成员
 * @returns {Promise<Object>}
 */
export async function uploadGroupEditUser(params) {
  return request(`/api/v1/agency/org/staff/edit/${params.OrganizationId}/${params.UserId}`, {
    method: 'POST',
    body: params,
  });

}
/**
 * 添加角色
 * @returns {Promise<Object>}
 */
export async function uploadAddRole(params) {
  return request(`/api/v1/agency/org/role/add/${params.OrganizationId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 编辑角色
 * @returns {Promise<Object>}
 */
export async function uploadEditRole(params) {
  return request(`/api/v1/agency/org/role/edit/${params.OrganizationId}/${params.RoleId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 禁用角色
 * @returns {Promise<Object>}
 */
export async function uploadGroupRoleState(params) {
  return request(`/api/v1/agency/org/role/disable/${params.OrganizationId}/${params.RoleId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 检查手机是否已经被绑定为团购组织管理员、组织成员或者社区合伙人
 * @returns {Promise<Object>}
 */
export async function queryCheckBind(params) {
  return request(`/api/v1/user/org/user/check_bind_mobile/${params}`);
}

/**
 * 修改角色
 * @returns {Promise<Object>}
 */
export async function queryEditRoleList(params) {
  return request(`/api/v1/agency/org/role/get/${params.OrganizationId}/${params.RoleId}`)
}
