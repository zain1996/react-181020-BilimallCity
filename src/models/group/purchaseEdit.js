import {getLocalStorage} from "../../utils/utils"
const userData = getLocalStorage('userData');

let api;

if(userData.Staff.GroupBuyingMode===2){
  api = require('../../services/singleMode/purchaseApi')
}else{
  api = require('../../services/purchaseApi')
}

const {
  uploadPurchaseEdit,
  queryPurchaseEdit,
  queryImgToken
} = api;

import {routerRedux} from 'dva/router'
export default {
  namespace: 'purchaseEdit',

  state: {
    data: {
      Specification:[

      ],
      backets:[

      ],
      Sku:[

      ],
      Info:[

      ],
      IllustrationPictures:[]
    },
    Tokens:{},
    stepFormSubmitting: false,
    loading: false,
  },

  effects: {
    *uploadPurchaseEdit({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(uploadPurchaseEdit, payload);
      if(response.Message==='success'){
        yield put(routerRedux.push('/group/groupPurchase/groupPurchaseList'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryPurchaseEdit({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPurchaseEdit, payload);
      const newSpecification = [];
      const Sku = [];
      const Combination = [];

      Object.values(response.Data.Specification.Items).map((val,i)=>{

        newSpecification.push ({
          Name:val.Name,
          Labels:[],
          LabelIdCounter:val.LabelIdCounter
        })

        Object.values(val.Labels).map((value,index)=>{
          newSpecification[i].Labels.push({
            LabelId:value.LabelId,
            Name:value.Name,
          })
        })

      })



      Object.values(response.Data.Specification.SkuMap).map((val,i)=>{
        Sku.push({
          LabelIds:[],
          Name:[],
          MarketPrice:val.MarketPrice,
          tempSkuId:val.SkuId,
          SkuId:i+"",
          GroupBuyingPrice:val.GroupBuyingPrice,
          SettlementPrice:val.SettlementPrice,
          CostPrice:val.CostPrice,
          LabelIdCounter:'',
          IsShow:val.IsShow,
          InventoryCount:val.InventoryCount,
          IllustrationPicture:val.IllustrationPicture,
          tempIllustrationPicture:val.IllustrationPicture,
        })

        Sku[i][`IndexId${i}`] = i;
        Object.values(val.Labels).map((value,index)=>{
          Sku[i].LabelIds.push(value.LabelId)
          Sku[i].Name.push(value.Name)
        })
      })
      const getSkuId = (val)=>{
        let id = 0;
        Sku.map((v,k)=>{

          if(v.tempSkuId===val){
            id = v.SkuId
            return
          }
        })
        return id
      }

      const getSubItems = (val)=>{
        let array = []

        Object.values(val).map((v,k)=>{
          array[k] = {
            SkuId:getSkuId(v.SkuId),
            Count:v.Count,
          }
        })
        return array;
      }

      if(response.Data.Specification.CombinationSkuMap){
        Object.values(response.Data.Specification.CombinationSkuMap).map((val,i)=>{

          Combination.push({
            Name:val.Name,
            MarketPrice:val.MarketPrice,
            GroupBuyingPrice:val.GroupBuyingPrice,
            SettlementPrice:val.SettlementPrice,
            CostPrice:val.CostPrice,
            SubSkuItems:getSubItems(val.SubItems),
            IsShow:val.IsShow,
            InventoryCount:val.InventoryCount,
            IllustrationPicture:val.IllustrationPicture,
            tempIllustrationPicture:val.IllustrationPicture,
          })
        })
      }


      response.Data = {
        ...response.Data,
        oldSpecification:response.Data.Specification,
        tempIllustrationPicture:response.Data.IllustrationPicture,
        tempCoverPicture:response.Data.CoverPicture,
        Specification:newSpecification,
        Combination:Combination,
        Sku:Sku
      }

      yield put({
        type: 'getPurchaseEdit',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryImgToken({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryImgToken, payload);

      yield put({
        type: 'getImgToken',
        payload: response.Data.Tokens[0],
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {

    setAdd(state, action) {
      return {
        ...state,
        data:action.payload
      };
    },

    getPurchaseEdit(state, action) {
      return {
        ...state,
        data:action.payload.Data
      };
    },

    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    getImgToken(state, action) {
      return {
        ...state,
        Tokens: {
          key:action.payload.Key,
          AccessUrl:action.payload.AccessUrl,
          StoreUrl:action.payload.StoreUrl,
          name:action.payload.OriginalFileName,
          token:action.payload.Token,
        },
      };
    },
  },
};
