import { combineReducers, configureStore } from '@reduxjs/toolkit';

import userReducer from './services/userSlice';

import { authApi } from './services/authApi';
import { userApi } from './services/userApi';
import { companyApi } from './services/companyApi';
import { storeApi } from './services/storeApi';
import { itemApi } from './services/itemApi';
import { hsnApi } from './services/hsnApi';
import { rackApi } from './services/rackApi';
import { saltApi } from './services/saltApi';
import { unitApi } from './services/unitApi';
import { mfrApi } from './services/mfrApi';
import { patientApi } from './services/patientApi';
import { prescriptionApi } from './services/prescriptionApi';
import { doctorApi } from './services/doctorApi';
import { groupApi } from './services/groupApi';
import { ledgerApi } from './services/ledgerApi';
import { transactionApi } from './services/transactionApi';
import { salesBillApi } from './services/salesBillApi';
import { ledgerEntryApi } from './services/ledgerEntryApi';
import { saleMasterApi } from './services/saleMasterApi';
import { purchaseMasterApi } from './services/purchaseMasterApi';
import { purchaseBillApi } from './services/purchaseBillApi';
import { batchApi } from './services/batchApi';
import { stationApi } from './services/stationApi';
import { userCompanyApi } from './services/userCompanyApi';
import { posApi } from './services/posApi';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [hsnApi.reducerPath]: hsnApi.reducer,
    [rackApi.reducerPath]: rackApi.reducer,
    [saltApi.reducerPath]: saltApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [mfrApi.reducerPath]: mfrApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [prescriptionApi.reducerPath] : prescriptionApi.reducer,
    [doctorApi.reducerPath] : doctorApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [ledgerApi.reducerPath]: ledgerApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [salesBillApi.reducerPath] : salesBillApi.reducer,
    [ledgerEntryApi.reducerPath]: ledgerEntryApi.reducer,
    [saleMasterApi.reducerPath]: saleMasterApi.reducer,
    [purchaseMasterApi.reducerPath]: purchaseMasterApi.reducer,
    [purchaseBillApi.reducerPath]: purchaseBillApi.reducer,
    [batchApi.reducerPath]: batchApi.reducer,
    [stationApi.reducerPath]: stationApi.reducer,
    [userCompanyApi.reducerPath]: userCompanyApi.reducer,
    [posApi.reducerPath]: posApi.reducer,
    user: userReducer,
  })
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      userApi.middleware,
      companyApi.middleware,
      storeApi.middleware,
      itemApi.middleware,
      hsnApi.middleware,
      rackApi.middleware,
      saltApi.middleware,
      unitApi.middleware,
      mfrApi.middleware,
      patientApi.middleware,
      prescriptionApi.middleware,
      doctorApi.middleware,
      groupApi.middleware,
      ledgerApi.middleware,
      transactionApi.middleware,
      salesBillApi.middleware,
      ledgerEntryApi.middleware,
      saleMasterApi.middleware,
      purchaseMasterApi.middleware,
      purchaseBillApi.middleware,
      batchApi.middleware,
      stationApi.middleware,
      userCompanyApi.middleware,
      posApi.middleware,
    ),
}); 

export const persistor = persistStore(store);