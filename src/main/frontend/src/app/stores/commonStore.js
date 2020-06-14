/**
 * Description: 公共store
 * Created by lijm6@asiainfo.com
 */
import {observable, action} from 'mobx'

//公共store
class CommonStore {
  @observable userInfo = {}
  @observable httpAgent = null
  @observable systemInfo = {}
  @observable menus = []


  // 获取userInfo
  @action setUserInfo = (userInfo) => {
    this.userInfo = userInfo
  }

  //获取BU列表
  @action setHttpAgent = (httpAgent) => {
    this.httpAgent = httpAgent
  }

  // system info
  @action setSystemInfo = (info) => {
    this.systemInfo = info
  }

  // menus
  @action setMenus = (menus) => {
    this.menus = menus
  }

}

export default new CommonStore()
