import {stringify} from 'qs';
import request from '../utils/request';

/**
 * 获取验证码
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryVerificationCode(params) {
  return request(`/api/v1/user/org/user/login_mobile_verify?${stringify(params)}`)
}

/**
 * 登陆
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitLogin(params) {
  return request(`/api/v1/user/org/user/login`,{
    method:'POST',
    body:params
  })
}
/**
 * 退出登陆
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitLogout(params) {
  return request(`/api/v1/user/org/user/logout/`,{
    method:'POST',
    body:params
  })
}

