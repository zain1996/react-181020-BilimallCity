import {stringify} from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {

  return request(`/api/v1/admin/login/wx_work_auth_data?${stringify(params)}`);
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function queryGroupList(params) {
  return request(`/api/v1/agency/admin/organization/list?${stringify(params)}`)
}


export async function queryGroupInfo(params) {

  return request(`/api/v1/agency/admin/organization/info/${params}`)
}

export async function queryGroupCommunity(params) {

  return request(`/api/v1/community/admin/group/list/${params.OrganizationId}?${stringify(params)}`)
}

export async function queryGroupListInfo(params) {

  return request(`/api/v1/agency/admin/organization/info/${params}`)
}

export async function queryGroupEdit(params) {

  return request(`/api/v1/agency/admin/organization/info/${params}`)
}

export async function uploadGroupAddDate(params) {

    return request('/api/v1/agency/admin/organization/add',{
      method: 'POST',
      body: params,
    });
}
export async function uploadGroupEditDate(params) {

    return request('/api/v1/agency/admin/organization/edit',{
      method: 'POST',
      body: params,
    });
}

export async function uploadGroupState(params) {
    return request(`/api/v1/agency/admin/staff/disable/${params.OrganizationId}/${params.UserId}`,{
      method: 'POST',
      body: params,
    });
}
/**
 * 获取团购组织的成员列表
 * @param id
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryUserList(params) {
  return request(`/api/v1/agency/admin/staff/list/${params.id}?${stringify(params)}`)
}

/**
 * 获取团购任务列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryPurchaseList(params) {
  return request(`/api/v1/group_buying/admin/task/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 获取团购月任务列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryPurchaseMontherList(params) {
  return request(`/api/v1/group_buying/admin/task/month_list/${params.OrganizationId}?${stringify(params)}`)
}

export async function queryRoleList(params) {
  return request(`/api/v1/agency/admin/role/list/${params.id}?${stringify(params)}`)
}

export async function queryAddRoleList(params) {
  return request(`/api/v1/agency/admin/authorization/list`)
}

export async function queryEditRoleList(params) {
  return request(`/api/v1/agency/admin/role/get/${params.OrganizationId}/${params.RoleId}`)
}

/**
 * 编辑成员信息
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitUserInfo(params) {
  return request(`/api/v1/agency/admin/staff/edit/${params.OrganizationId}/${params.uid}`, {
    method: 'POST',
    body: params,
  });

}
/**
 * 禁用成员
 * @param params
 * @returns {Promise<Object>}
 */
export async function uploadGroupUserState(params) {
  return request(`/api/v1/agency/admin/staff/disable/${params.OrganizationId}/${params.UserId}`, {
    method: 'POST',
    body: params,
  });
}


/**
 * 添加成员
 * @param params
 * @returns {Promise<Object>}
 */
export async function uploadGroupAddUser(params) {
  return request(`/api/v1/agency/admin/staff/add/${params.OrganizationId}`, {
    method: 'POST',
    body: params,
  });

}

/**
 * 修改成员
 * @param params
 * @returns {Promise<Object>}
 */
export async function uploadGroupEditUser(params) {
  return request(`/api/v1/agency/admin/staff/edit/${params.OrganizationId}/${params.UserId}`, {
    method: 'POST',
    body: params,
  });

}
/**
 * 添加角色
 * @param params
 * @returns {Promise<Object>}
 */
export async function uploadAddRole(params) {
  return request(`/api/v1/agency/admin/role/add/${params.OrganizationId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 编辑角色
 * @param params
 * @returns {Promise<Object>}
 */
export async function uploadEditRole(params) {
  return request(`/api/v1/agency/admin/role/edit/${params.OrganizationId}/${params.RoleId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 禁用角色
 * @param params
 * @returns {Promise<Object>}
 */
export async function uploadGroupRoleState(params) {
  return request(`/api/v1/agency/admin/role/disable/${params.OrganizationId}/${params.RoleId}`, {
    method: 'POST',
    body: params,
  });
}


/**
 * 获取订货单列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryOrderFormList(params) {
  return request(`/api/v1/group_buying/admin/indent/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 获取订货单概要
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryOrderInfo(params) {
  return request(`/api/v1/group_buying/admin/indent/summary/${params}`)
}

/**
 * 获取配送单列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryDistributionList(params) {
  return request(`/api/v1/group_buying/admin/send/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 获取配送路线
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryDistributionRoute(params) {
  return request(`/api/v1/group_buying/admin/line/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 获取配送路线社群
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryDistributionRouteCommunity(params) {
  return request(`/api/v1/group_buying/admin/line_community/list/${params.OrganizationId}/${params.LineId}?${stringify(params)}`)
}

/**
 * 获取城市合伙人列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryCityList(params) {
  return request(`/api/v1/user/admin/user/organization_manager/list?${stringify(params)}`)
}

/**
 * 获取社区合伙人
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryCommunityList(params) {
  return request(`/api/v1/user/admin/user/community_manager/list?${stringify(params)}`)
}

/**
 * 获取城市组织成员
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryOrganizationList(params) {
  return request(`/api/v1/user/admin/user/organization_staff/list?${stringify(params)}`)
}

/**
 * 获取社群详细信息
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryGroupCommunityInfo(params) {
  return request(`/api/v1/community/admin/group/info/${params}`)
}
/**
 * 获取团购组织id
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryOrganizationId(params) {
  return request(`/api/v1/agency/admin/organization/get_organization_id?${stringify(params)}`)
}

