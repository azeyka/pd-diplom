export const notificationInitialState = {
    notification: {
        message: '',
        isSuccess: true,
        isShown: false,
    }
  };
  
export const notificationActions = {
    setIsShown: (state, params) => {
        return { notification: { ...state, ...params }}
    },

    show: (state, params) => {
        return { 
            notification: {
                ...state, 
                ...params,
                isShown: true,
            }
        }
    },

    setName: (state, name) => {
        return { user: {...state.user, name: name}}
    },
};