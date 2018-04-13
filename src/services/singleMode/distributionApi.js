import {stringify} from 'qs';
import request from '../../utils/request';


/**
 * 获取配送单列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryDistributionList(params) {
  return request(`/api/v1/group_buying_order/org/send/list/${params.OrganizationId}?${stringify(params)}`)
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
 * 绑定配送单团购任务
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitDistributionAdd(params) {
  return request(`/api/v1/group_buying_order/org/send/add/${params.OrganizationId}`,{
    method: 'POST',
    body: params,
  })
}
