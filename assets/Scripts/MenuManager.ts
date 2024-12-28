import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuManager')
export class MenuManager extends Component {
   StartGame()
   {
       director.loadScene('Game');
   }
}