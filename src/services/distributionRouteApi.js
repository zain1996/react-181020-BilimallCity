import {stringify} from 'qs';
import request from '../utils/request';



/**
 * 获取配送路线
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryDistributionRoute(params) {
  return request(`/api/v1/group_buying/org/line/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 获取配送路线社群
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryDistributionRouteCommunity(params) {
  return request(`/api/v1/group_buying/org/line_community/list/${params.OrganizationId}/${params.LineId}?${stringify(params)}`)
}

/**
 * 获取未关联路线社群列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function querybindCommunityList(params) {
  return request(`/api/v1/group_buying/org/line_community/need_bind_list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 添加配送路线
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitDistributionRouteAdd(params) {
  return request(`/api/v1/group_buying/org/line/add/${params.OrganizationId}`,{
    method: 'POST',
    body: params,
  })
}

/**
 * 关联社群
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitBindCommunityAdd(params) {
  return request(`/api/v1/group_buying/org/line_community/bind/${params.LineId}`,{
    method: 'POST',
    body: params,
  })
}

/**
 * 取消关联
 * @param params
 * @returns {Promise<Object>}
 */
export async function removeDistribution(params) {
  return request(`/api/v1/group_buying/org/line_community/unbind/${params.LineId}`,{
    method: 'POST',
    body: params,
  })
}
/**
 * 删除路线
 * @param params
 * @returns {Promise<Object>}
 */
export async function removeLine(params) {
  return request(`/api/v1/group_buying/org/line/delete/${params.OrganizationId}/${params.LineId}`,{
    method: 'POST',
    body: params,
  })
}

/**
 * 编辑路线
 * @param params
 * @returns {Promise<Object>}
 */
export async function updateLine(params) {
  return request(`/api/v1/group_buying/org/line/edit/${params.OrganizationId}/${params.LineId}`,{
    method: 'POST',
    body: params,
  })
}
