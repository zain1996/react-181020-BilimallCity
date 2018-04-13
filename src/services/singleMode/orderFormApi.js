import {stringify} from 'qs';
import request from '../../utils/request';

/**
 * 获取订货单列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryOrderFormList(params) {
  return request(`/api/v1/group_buying_order/org/indent/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 获取订货单概要
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryOrderInfo(params) {
  return request(`/api/v1/group_buying_order/org/indent/summary/${params}`)
}

/**
 * 获取已结团团购任务列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryFinishBuyingList(params) {
  return request(`/api/v1/group_buying_order/org/task/sold_list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 绑定订货单团购任务
 * @param padrams
 * @returns {Promise<Object>}
 */
export async function submitOrderFormAdd(params) {
  return request(`/api/v1/group_buying_order/org/indent/add/${params.OrganizationId}`,{
    method: 'POST',
    body: params,
  })
}
