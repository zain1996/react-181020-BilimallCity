import {stringify} from 'qs';
import request from '../utils/request';

/**
 * 获取团购任务列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryPurchaseList(params) {
  return request(`/api/v1/group_buying/org/task/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 获取团购月任务列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryPurchaseMontherList(params) {
  return request(`/api/v1/group_buying/org/task/month_list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 发布团购任务
 * @param params
 * @returns {Promise<Object>}
 */
export async function uploadPurchaseAdd(params) {
  return request(`/api/v1/group_buying/org/task/add/${params.OrganizationId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取团购任务图片上传Token
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryImgToken(params) {
  return request(`/api/v1/group_buying/org/task/pic_token/${params.OrganizationId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 确定结团
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitEnd(params) {
  return request(`/api/v1/group_buying/org/task/finish_buying/${params.OrganizationId}/${params.TaskId}`, {
    method: 'POST',
    body: params,
  });
}


/**
 * 获取结团信息
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryEndInfo(params) {
  return request(`/api/v1/group_buying/org/task/finish_buying_confirm_count/${params.OrganizationId}/${params.TaskId}`);
}

/**
 * 获取社群团购信息列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryFinishBuyingGroupList(params) {
  return request(`/api/v1/group_buying/org/task/finish_buying_group_list/${params.OrganizationId}/${params.TaskId}?${stringify(params)}`);
}


/**
 * 获取团购任务编辑信息
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryPurchaseEdit(params) {
  return request(`/api/v1/group_buying/org/task/info/${params.TaskId}?${stringify(params)}`);
}

/**
 * 提交团购任务编辑
 * @param params
 * @returns {Promise<Object>}
 */
export async function uploadPurchaseEdit(params) {
  return request(`/api/v1/group_buying/org/task/edit/${params.OrganizationId}/${params.TaskId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 上架团购任务
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitTaskShow(params) {
  return request(`/api/v1/group_buying/org/task/show/${params.OrganizationId}/${params.TaskId}`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 下架团购任务
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitTaskHide(params) {
  return request(`/api/v1/group_buying/org/task/hide/${params.OrganizationId}/${params.TaskId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除团购任务
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitTaskDelete(params) {
  return request(`/api/v1/group_buying/org/task/delete/${params.OrganizationId}/${params.TaskId}`, {
    method: 'POST',
    body: params,
  });
}
