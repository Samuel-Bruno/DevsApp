import { configureStore } from "@reduxjs/toolkit"
import Reducers from './reducers'
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key: 'DevsApp',
  storage
}

const persistedReducer = persistReducer(persistConfig, Reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})
const persistor = persistStore(store)

type RootState = ReturnType<typeof persistedReducer>

export { store, persistor }
export type { RootState }
