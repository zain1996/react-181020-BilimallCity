import {stringify} from 'qs';
import request from '../utils/request';

/**
 * 获取社群详细信息
 * @returns {Promise<Object>}
 */
export async function queryCommunityInfo(params) {
  return request(`/api/v1/community/org/group/info/${params.OrganizationId}/${params.GroupId}`)
}

/**
 * 获取社群列表
 * @returns {Promise<Object>}
 */
export async function queryCommunityList(params) {

  return request(`/api/v1/community/org/group/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 审核
 * @returns {Promise<Object>}
 */
export async function submitCommunityAudited(params) {

  return request(`/api/v1/community/org/group/audit/${params.OrganizationId}/${params.GroupId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 编辑社群信息
 * @returns {Promise<Object>}
 */
export async function submitCommunityEdit(params) {

  return request(`/api/v1/community/org/group/edit/${params.OrganizationId}/${params.GroupId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 添加社群信息
 * @returns {Promise<Object>}
 */
export async function submitCommunityAdd(params) {

  return request(`/api/v1/community/org/group/add/${params.OrganizationId}`,{
    method:'POST',
    body:params
  })
}
