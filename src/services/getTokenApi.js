import {stringify} from 'qs';
import request from '../../src/utils/request';


/**
 * 获取身份证token
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryIdCardPicToken(params) {
  return request(`/api/v1/user/org/user/id_card_pic_token`, {
    method: 'POST',
    body: params,
  });
}

