import {
  queryRoleList,
  queryUserList,
  queryAddRoleList,
  uploadAddRole,
  uploadGroupAddUser,
  uploadEditRole,
  uploadGroupEditUser,
  uploadGroupUserState,
  uploadGroupRoleState,
  queryCheckBind,
  queryEditRoleList
}
  from "../../services/userApi";

export default {

  namespace: 'groupUser',
  state: {
    data: {
      List: []
    },
    roles: {
      List: []
    },
    addRoles:{
      List:[]
    },
    editRoles:{
      StaffRole:{RoleName:''}
    },
    checkedValue:false,
    pagination: '',
    loading: true
  },

  effects: {
    * queryUserList({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const res = yield call(queryUserList, payload);
      yield put({
        type: 'getUserList',
        payload: res,
      });

      yield put({
        type: 'changeLoading',
        payload: false
      })
    },
    * queryCheckBind({payload}, {call, put}) {
      const res = yield call(queryCheckBind, payload.mobile);

      if(res.Data.CanBeBound){
        payload.callback();
      }else{
        payload.callback('该用户已经存在');
      }

    },
    * queryRoleList({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const res = yield call(queryRoleList, payload);
      yield put({
        type: 'getRoleList',
        payload: res,
      });

      yield put({
        type: 'changeLoading',
        payload: false
      })
    },

    * queryAddRoleList({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const res = yield call(queryAddRoleList, payload);
      yield put({
        type: 'getAddRoleList',
        payload: res,
      });
      yield put({
        type: 'changeLoading',
        payload: false
      });
    },
    * queryEditRoleList({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const res = yield call(queryEditRoleList, payload);
      yield put({
        type: 'getEditRoleList',
        payload: res,
      });
      yield put({
        type: 'changeLoading',
        payload: false
      });
    },
    * uploadAddRole({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const res = yield call(uploadAddRole, payload);
      yield put({
        type: 'changeLoading',
        payload: false
      });
    }
    ,
    * uploadEditRole({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const res = yield call(uploadEditRole, payload);
      yield put({
        type: 'changeLoading',
        payload: false
      });
    },
    * uploadGroupUserState({payload}, {select,call, put}) {

      const res = yield call(uploadGroupUserState, payload);

    },
    * uploadGroupRoleState({payload}, {select,call, put}) {

      const res = yield call(uploadGroupRoleState, payload);

    },
    * uploadGroupAddUser({payload}, {call, put}) {

      const res = yield call(uploadGroupAddUser, payload);
      if(!res.Code){

      }

    },
    * uploadGroupEditUser({payload}, {call, put}) {
      const res = yield call(uploadGroupEditUser, payload);
    }
  },

  reducers: {
    getUserList(state, action) {
      return {
        ...state,
        data: action.payload.Data,
      }
    },
    getAddRoleList(state, action) {
      return {
        ...state,
        addRoles: action.payload.Data,
      }
    },
    getEditRoleList(state, action) {
      return {
        ...state,
        editRoles: action.payload.Data,
      }
    },
    changeChecked(state, action) {
      return {
        ...state,
        addRoles: action.payload,
      }
    },
    getRoleList(state, action) {
      return {
        ...state,
        roles: action.payload.Data,
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload
      }
    }
  }
}
