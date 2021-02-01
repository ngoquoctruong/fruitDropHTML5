window.__require=function e(i,t,n){function o(s,c){if(!t[s]){if(!i[s]){var a=s.split("/");if(a=a[a.length-1],!i[a]){var u="function"==typeof __require&&__require;if(!c&&u)return u(a,!0);if(r)return r(a,!0);throw new Error("Cannot find module '"+s+"'")}s=a}var l=t[s]={exports:{}};i[s][0].call(l.exports,function(e){return o(i[s][1][e]||e)},l,l.exports,e,i,t,n)}return t[s].exports}for(var r="function"==typeof __require&&__require,s=0;s<n.length;s++)o(n[s]);return o}({FruitFactory:[function(e,i){"use strict";cc._RF.push(i,"5ba0biz2HhFDoXsCEnXEDtd","FruitFactory");var t=e("./../view/FruitView");cc.Class({extends:cc.Component,properties:{fruitPrefab:cc.Prefab},getFruit:function(){var e=this.getFruitLevel(),i=cc.instantiate(this.fruitPrefab);i.parent=this.node;var n=i.getComponent(t);return n.setLevel(e),n},getFruitLevel:function(){return Math.floor(5*Math.random())}}),cc._RF.pop()},{"./../view/FruitView":"FruitView"}],FruitView:[function(e,i){"use strict";cc._RF.push(i,"a0bceyYXeBGmo7PDff9ZEb/","FruitView"),e("FruitView"),cc.Class({extends:cc.Component,properties:{rigidbody:cc.RigidBody,collider:cc.Collider,fruitSprite:cc.Sprite,fruitScaleSizeByLevel:[cc.Float],fruitTexture:[cc.SpriteFrame],fruitDefaultSize:30,fruitScaleSize:0,level:0},start:function(){this.node.scale=0,this.rigidbody.type=cc.RigidBodyType.Static},setLevel:function(e){this.level=e,this.fruitSprite.spriteFrame=this.fruitTexture[e],this.fruitScaleSize=this.fruitScaleSizeByLevel[e],this.collider.tag=e,this.node.scale=this.fruitScaleSize},dropDown:function(e,i){this.animateFruitMoveXAxis(e,i)},onBeginContact:function(e,i,t){var n=this;if(this.level===t.tag&&!this._isBeingFusion)if(this._isBeingFusion=!0,this.node.uuid<t.node.uuid)this.node.removeFromParent(),this._isBeingFusion=!1;else if(this.node.uuid>t.node.uuid){t.node.removeFromParent();var o=this.level+1,r=new cc.Event.EventCustom("fruitcombine",!0);r.detail=o,this.node.dispatchEvent(r),this.setLevel(o),this.animateFruitFusion(function(){return n._isBeingFusion=!1})}},animateFruitMoveXAxis:function(e,i){var t=this;cc.tween(this.node).to(.35,{x:{value:e,easing:"expoOut"}}).call(function(){t.rigidbody.type=cc.RigidBodyType.Dynamic,i&&i()}).delay(1.5).call(function(){t._isCompletedDropping=!0}).start()},animateFruitSpawn:function(e){this.node.scale=0,cc.tween(this.node).to(.25,{scale:{value:this.fruitScaleSize,easing:"sineIn"}}).call(function(){return e&&e()}).start()},animateFruitFusion:function(e){this.node.scale=0,cc.tween(this.node).to(.15,{scale:{value:this.fruitScaleSize,easing:"sineIn"}}).call(function(){return e&&e()}).start()},animateExplosion:function(){this.node.removeFromParent()},animateWarning:function(){this._warningTween=cc.tween(this.node).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).repeatForever().start()},update:function(){if(this._isCompletedDropping)if(this.node.y+this.node.height*this.node.scale/2>507){if(this._hasWarnning)return;this._hasWarnning=!0,this.animateWarning(),this.startGameOverCountdown(),console.log("WARNING "+this.node.uuid)}else{if(!this._hasWarnning)return;this._hasWarnning=!1,this._countdown&&clearTimeout(this._countdown),this.node.color=cc.Color.WHITE,this._warningTween&&this._warningTween.stop(),console.log("STOP WARNING "+this.node.uuid)}},startGameOverCountdown:function(){var e=this;this._countdown=setTimeout(function(){console.log("FIRE EVENT "+e.node.uuid),e.node.dispatchEvent(new cc.Event.EventCustom("fruitoverlimit",!0))},3e3)}}),cc._RF.pop()},{FruitView:"FruitView"}],GameOverView:[function(e,i){"use strict";cc._RF.push(i,"8bdb57b1qhPi6G7a2iZ6SPo","GameOverView"),cc.Class({extends:cc.Component,properties:{scoreLabel:cc.Label},show:function(e){this.node.active=!0,this.scoreLabel.string="SCORE: "+e},replay:function(){cc.director.loadScene("mainGame")}}),cc._RF.pop()},{}],MainGameController:[function(e,i){"use strict";cc._RF.push(i,"025812yNeBPSoW3kv06EGE0","MainGameController");var t=e("./FruitFactory"),n=e("../view/GameOverView");cc.Class({extends:cc.Component,properties:{fruitFactory:t,gameOver:n,fruitSpawnPos:cc.Vec2,scoreLabel:cc.Label,score:0},onLoad:function(){this.physicsManager=cc.director.getPhysicsManager(),this.physicsManager.enabled=!0},start:function(){this.node.on(cc.Node.EventType.MOUSE_DOWN,this.onMouseMove,this),this.node.on("fruitcombine",this.onFruitCombine,this),this.node.on("fruitoverlimit",this.onFruitOverLimit,this),this.createFruit()},createFruit:function(){var e=this.fruitFactory.getFruit();e.node.position=this.fruitSpawnPos,e.animateFruitSpawn(),this._curFruitSelector=e},onMouseMove:function(e){var i=this;if(!this._isFruitDropping){this._isFruitDropping=!0;var t=e.getLocation();this._curFruitSelector.dropDown(t.x,function(){setTimeout(function(){i._isFruitDropping=!1,i.createFruit()},1500)})}},onFruitCombine:function(e){e.stopPropagation(),this.score+=10*e.detail,this.scoreLabel.string=""+this.score},onFruitOverLimit:function(){this._isGameEnd||(this._isGameEnd=!0,this.showGameOver())},showGameOver:function(){this.gameOver.show(this.score)}}),cc._RF.pop()},{"../view/GameOverView":"GameOverView","./FruitFactory":"FruitFactory"}],MouseInput:[function(e,i){"use strict";cc._RF.push(i,"da8faR7nPBD/o2kWJ6TYq3I","MouseInput"),cc.Class({extends:cc.Component,properties:{target:cc.Prefab},start:function(){this.node.on(cc.Node.EventType.MOUSE_DOWN,this.onMouseMove,this)},onMouseMove:function(e){var i=e.getLocation(),t=cc.instantiate(this.target);t.parent=this.node.parent,t.x=i.x,t.y=i.y,console.log("position",i)}}),cc._RF.pop()},{}]},{},["FruitFactory","MainGameController","MouseInput","FruitView","GameOverView"]);