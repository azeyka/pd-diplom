export const userInitialState = {
    token: localStorage.getItem('token'),
    userInfo: {
        username: localStorage.getItem('username') || 'Аноним',
        type: localStorage.getItem('userType'),
        shop: { name: localStorage.getItem('shopName'), id: localStorage.getItem('shopId') },
    }
 
  };
  
export const userActions = {
    setToken: (state, token) => {
        localStorage.setItem('token', token);
        return { token: token }
    },
    delToken: () => {
        localStorage.removeItem('token')
        return { token: null }
    },
    setUserInfo: (state, userInfo) => {
        localStorage.setItem('username', userInfo.username);
        if (userInfo.type === 'shop') {
            localStorage.setItem('userType', 'shop');
            localStorage.setItem('shopName', userInfo.shop.name)
            localStorage.setItem('shopId', userInfo.shop.id)
        }
        return { userInfo: { ...state.userInfo, ...userInfo }}
    },

    delUserInfo: () => {
        localStorage.removeItem('username')
        localStorage.removeItem('userType')
        localStorage.removeItem('shopName')
        localStorage.removeItem('shopId')
        return { userInfo: {}}
    },

    setShopInfo: (state, info) => {
        localStorage.setItem('userType', 'shop');
        localStorage.setItem('shopName', info.name)
        localStorage.setItem('shopId', info.id)
        return {userInfo: { ...state.userInfo, type: 'shop', shop: {...info} }}
    },

    delShopInfo: (state) => {
        localStorage.setItem('userType', 'user');
        localStorage.removeItem('shopName')
        return {userInfo: { ...state.userInfo, type: 'user', shop: {name: null, id: null} }}
    }
};