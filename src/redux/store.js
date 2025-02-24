import { configureStore } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../views/auth/authReducer";
import trainingReducer from "../views/training/TrainingRedux"; // import the training
import exerciseReducer from "../views/exercise/ExerciseRedux"; // import the exercise
import assistantsReducer from "../views/assistants/AssistantsRedux"; // import the assistants
import jobReducer from "../views/assistants/jobReducer";
import notificationReducer from "../views/dashboard/notificationReducer";
import chatSlice from "./chatReducer";
import socketSlice from "./socketReducer";
import userSlice from "../views/users/UsersRedux";
import roelSlice from "../views/roles/RolesRedux";
// Persist configuration for the auth reducer
const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    training: trainingReducer,
    exercise: exerciseReducer, // add the exercise here
    assistants: assistantsReducer, // add the assistants here
    job: jobReducer,
    notifications: notificationReducer,
    chat: chatSlice,
    users: userSlice,
    roles: roelSlice,

    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export persistor to be used in the app
export const persistor = persistStore(store);
