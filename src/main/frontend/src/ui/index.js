import Ico from './ico';
import Scroll from './scroll/scroll';
import Modal, {Alert, Dialog, Confirm} from './modal/modal';
import Btn from './btn'
import DropDown, {VerticalOneLevel, Triangle, Close, DpBtn} from './dropdown/dropdown'
import toolTip from './toolTip'

import Tost, {successTost, errorTost, warnTost, infoTost} from './tost/index'
import './skins/skin.css'

const Modals = {Alert, Dialog, Confirm}
const Tosts = {successTost, errorTost, warnTost, infoTost}
const tost = Tost
const tosts = Tosts

export {
  Tost, tost, Tosts, tosts, // 顶部提示消息
  Ico,
  Btn,
  Scroll,//滚动条
  Modal, Modals, //模态框
  DropDown, VerticalOneLevel, Triangle, Close, DpBtn,
  toolTip
}
