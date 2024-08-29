import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from '../slice/userSlice'; 
import adminSlice from '../slice/adminSlice'


const persistConfig = {
  key: 'root',
  whitelist: ['user'],
  storage,
};

const rootReducer = combineReducers({
  user: userSlice,
  admin:adminSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(Store);
export type RootState = ReturnType<typeof rootReducer>;
export { Store, persistor };
