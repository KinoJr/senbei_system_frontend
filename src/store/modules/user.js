import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      userId: 0,
      token: getToken(),
      name: '',
      nickName: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            this.userId = res.userId
            this.token = res.token
            this.refToken = res.refToken
            setToken(res.token)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 刷新Token
      refreshToken(t) {
        setToken(t)
        this.token = t
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            const user = res.user
            // const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
            const avatar = (user.avatar == "" || user.avatar == null) ? defAva : user.avatar;
            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = user.userName
            this.nickName = user.nickName
            this.avatar = avatar;
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          }).catch(error => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            reject(error)
          })
        })
      }
    }
  })

export default useUserStore
