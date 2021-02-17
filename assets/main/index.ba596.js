window.__require=function i(e,t,n){function o(r,c){if(!t[r]){if(!e[r]){var a=r.split("/");if(a=a[a.length-1],!e[a]){var h="function"==typeof __require&&__require;if(!c&&h)return h(a,!0);if(s)return s(a,!0);throw new Error("Cannot find module '"+r+"'")}r=a}var u=t[r]={exports:{}};e[r][0].call(u.exports,function(i){return o(e[r][1][i]||i)},u,u.exports,i,e,t,n)}return t[r].exports}for(var s="function"==typeof __require&&__require,r=0;r<n.length;r++)o(n[r]);return o}({FruitFactory:[function(i,e){"use strict";cc._RF.push(e,"5ba0biz2HhFDoXsCEnXEDtd","FruitFactory");var t=i("./../view/FruitView");cc.Class({extends:cc.Component,properties:{fruitPrefab:cc.Prefab},getFruit:function(){var i=this.getFruitLevel(),e=cc.instantiate(this.fruitPrefab);e.parent=this.node;var n=e.getComponent(t);return n.setLevel(i,this.mainGameCtrl),n},getFruitLevel:function(){return Math.floor(5*Math.random())}}),cc._RF.pop()},{"./../view/FruitView":"FruitView"}],FruitView:[function(i,e){"use strict";cc._RF.push(e,"a0bceyYXeBGmo7PDff9ZEb/","FruitView"),cc.Class({extends:cc.Component,properties:{rigidbody:cc.RigidBody,physicsCircleCollider:cc.PhysicsCircleCollider,fruitSprite:cc.Sprite,fruitScaleSizeByLevel:[cc.Float],fruitTexture:[cc.SpriteFrame],wildcardTexture:cc.SpriteFrame,fruitDefaultSize:30,fruitScaleSize:0,level:0},start:function(){this.node.scale=0,this.node.height=this.node.width=this.fruitDefaultSize,this.physicsCircleCollider.radius=this.fruitDefaultSize/2,this.rigidbody.type=cc.RigidBodyType.Static,this.limitRannge=.8*cc.winSize.height,this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this)},setLevel:function(i){this.level=i,this.fruitSprite.spriteFrame=this.fruitTexture[i],this.fruitScaleSize=this.fruitScaleSizeByLevel[i],this.physicsCircleCollider.tag=i,this.node.scale=this.fruitScaleSize},setMainGameCtrl:function(i){this.mainGameCtrl=i},dropDown:function(i,e){this.animateFruitMoveXAxis(i,e)},onBeginContact:function(i,e,t){if(this._hasCollideOther||9999===t.tag||(this._hasCollideOther=!0,this.node.dispatchEvent(new cc.Event.EventCustom("fruitcollideother",!0))),5e3===this.physicsCircleCollider.tag&&5e3!==t.tag&&9999!==t.tag&&8888!==t.tag){var n=t.node.getComponent("FruitView");return this.rigidbody.enabledContactListener=!1,n.fuseFruit(),void this.destroyFruit()}this.level===t.tag&&(this._isBeingFusion||(this._isBeingFusion=!0,t.node.getComponent("FruitView").destroyFruit(),this.fuseFruit()))},onTouchEnd:function(){this.isCompletedDropping&&(this.mainGameCtrl.isHammerActive?(this.mainGameCtrl.onHammerPowerClicked(),this.destroyFruit()):this.mainGameCtrl.isLightningActive&&(this.mainGameCtrl.onLightningPowerClicked(),this.mainGameCtrl.destroyAllFruitWithLevel(this.level)))},destroyFruit:function(){var i=this;this.mainGameCtrl.destroyFruitInScreen(this.node.uuid),this._isBeingFusion=!1,setTimeout(function(){return i.node.removeFromParent()},0)},fuseFruit:function(){var i=this,e=this.level+1,t=new cc.Event.EventCustom("fruitcombine",!0);if(t.detail=e,this.node.dispatchEvent(t),this.setLevel(e),this.animateFruitFusion(function(){return i._isBeingFusion=!1}),e>=10){var n=new cc.Event.EventCustom("reachmaxfruit",!0);n.detail=e,this.node.dispatchEvent(n),setTimeout(function(){return i.destroyFruit()},200)}},setWildcard:function(){this.fruitSprite.spriteFrame=this.wildcardTexture,this.fruitScaleSize=this.fruitScaleSizeByLevel[1],this.physicsCircleCollider.tag=5e3,this.node.scale=this.fruitScaleSize},animateFruitMoveXAxis:function(i,e){var t=this,n=Math.abs(this.node.x-i)/cc.winSize.width*1;cc.tween(this.node).to(n,{x:{value:i,easing:"sineIn"}}).call(function(){t.rigidbody.type=cc.RigidBodyType.Dynamic,e&&e()}).delay(1.5).call(function(){t.isCompletedDropping=!0}).start()},animateFruitSpawn:function(i){this.node.scale=0,cc.tween(this.node).to(.25,{scale:{value:this.fruitScaleSize,easing:"sineIn"}}).call(function(){return i&&i()}).start()},animateFruitFusion:function(i){this.node.scale=this.fruitScaleSizeByLevel[this.level-1],cc.tween(this.node).to(.15,{scale:{value:this.fruitScaleSize,easing:"sineIn"}}).call(function(){return i&&i()}).start()},animateExplosion:function(){this.node.removeFromParent()},animateWarning:function(){this._warningTween=cc.tween(this.node).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).start()},update:function(){if(this.isCompletedDropping)if(this.node.y+this.node.height*this.node.scale/2>this.limitRannge){if(this._hasWarnning)return;this._hasWarnning=!0,this.animateWarning(),this.startGameOverCountdown()}else{if(!this._hasWarnning)return;this._hasWarnning=!1,this._countdown&&clearTimeout(this._countdown),this.node.color=cc.Color.WHITE,this._warningTween&&this._warningTween.stop()}},startGameOverCountdown:function(){var i=this;this._countdown=setTimeout(function(){i.node.dispatchEvent(new cc.Event.EventCustom("fruitoverlimit",!0))},3e3)}}),cc._RF.pop()},{}],GameOverView:[function(i,e){"use strict";cc._RF.push(e,"8bdb57b1qhPi6G7a2iZ6SPo","GameOverView"),cc.Class({extends:cc.Component,properties:{scoreLabel:cc.Label},show:function(i){this.node.active=!0,this.scoreLabel.string="SCORE: "+i},replay:function(){cc.director.loadScene("mainGame")}}),cc._RF.pop()},{}],LineLimitView:[function(i,e){"use strict";cc._RF.push(e,"5848e+pJTFNY5UMtA1cyzYf","LineLimitView"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){this.node.width=cc.winSize.width,this.node.y=.8*cc.winSize.height-cc.winSize.height/2},start:function(){}}),cc._RF.pop()},{}],MainGameController:[function(i,e){"use strict";cc._RF.push(e,"025812yNeBPSoW3kv06EGE0","MainGameController");var t=i("../view/FruitView"),n=i("../view/GameOverView");cc.Class({extends:cc.Component,properties:{fruitPrefab:cc.Prefab,gameOver:n,fruitSpawnPos:cc.Vec2,progresssBar:cc.ProgressBar,scoreLabel:cc.Label,score:0,level:1,levelLabel:cc.Label,hammerTips:cc.Node,isHammerActive:!1,lightningTips:cc.Node,isLightningActive:!1},onLoad:function(){this.physicsManager=cc.director.getPhysicsManager(),this.physicsManager.enabled=!0},start:function(){var i=this;this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this),this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this),this.node.on("fruitcombine",this.onFruitCombine,this),this.node.on("fruitoverlimit",this.onFruitOverLimit,this),this.node.on("fruitcollideother",this.onFruitCollideOther,this),this.node.on("reachmaxfruit",this.onReachMaxFruit,this),this.fruits={},this.progresssBar.totalLength=this.progresssBar.node.width,this.resetGameProfile(),setTimeout(function(){i.createFruit()},500)},createFruit:function(){var i=this.getFruit();this.fruits[i.node.uuid]=i,i.node.y=.8*cc.winSize.height,i.node.x=cc.winSize.width/2,i.animateFruitSpawn(),this._curFruitSelector=i,this._canCreateFruit=!0},getFruit:function(){var i=this.getFruitLevel(),e=cc.instantiate(this.fruitPrefab);e.parent=this.node;var n=e.getComponent(t);return n.setLevel(i),n.setMainGameCtrl(this),n},getFruitLevel:function(){return Math.floor(4*Math.random())},destroyAllFruitWithLevel:function(i){for(var e in this.fruits)this.fruits[e].isCompletedDropping&&this.fruits[e].level===i&&this.fruits[e].destroyFruit()},destroyFruitInScreen:function(i){this.fruits[i]&&delete this.fruits[i]},resetGameProfile:function(){this.level=1,this.levelLabel.string=1,this.score=0,this.scoreLabel.string=0,this.progresssBar.progress=1},onTouchEnd:function(i){var e=this;if(this._curFruitSelector&&this._canCreateFruit){this._canCreateFruit=!1;var t=i.getLocationX();this._curFruitSelector.dropDown(t,function(){e._curFruitSelector=null})}},onTouchMove:function(i){this._curFruitSelector&&(this._curFruitSelector.node.x=i.getLocationX())},onFruitCombine:function(i){i.stopPropagation(),this.score+=5*(i.detail-1)+10,this.scoreLabel.string=""+this.score},getTargetScore:function(i){return 1===i?100:i>10?void 0:i>1&&i<11?100+50*i:void 0},onFruitOverLimit:function(){this._isGameEnd||(this._isGameEnd=!0,this.showGameOver())},onReachMaxFruit:function(i){i.stopPropagation();var e=Math.floor(3*Math.random());return 0===e?this.onWildCardPowerClicked():1===e?this.onHammerPowerClicked():2===e?this.onLightningPowerClicked():void 0},onFruitCollideOther:function(i){i.stopPropagation(),this.createFruit()},onWildCardPowerClicked:function(){this._curFruitSelector&&this._curFruitSelector.setWildcard()},onHammerPowerClicked:function(){this.isLightningActive||(this.hammerTips.active=!this.hammerTips.active,this.isHammerActive=!this.isHammerActive)},onLightningPowerClicked:function(){this.isHammerActive||(this.lightningTips.active=!this.lightningTips.active,this.isLightningActive=!this.isLightningActive)},showGameOver:function(){this.gameOver.show(this.score)},update:function(){this.progresssBar.progress=.5}}),cc._RF.pop()},{"../view/FruitView":"FruitView","../view/GameOverView":"GameOverView"}],MouseInput:[function(i,e){"use strict";cc._RF.push(e,"da8faR7nPBD/o2kWJ6TYq3I","MouseInput"),cc.Class({extends:cc.Component,properties:{target:cc.Prefab},start:function(){this.node.on(cc.Node.EventType.MOUSE_DOWN,this.onMouseMove,this)},onMouseMove:function(i){var e=i.getLocation(),t=cc.instantiate(this.target);t.parent=this.node.parent,t.x=e.x,t.y=e.y,console.log("position",e)}}),cc._RF.pop()},{}],PlatformHelper:[function(i,e){"use strict";var t;cc._RF.push(e,"6c6feM0k09B/oS+IhdmOEDS","PlatformHelper"),t=cc.Enum({Top:0,Bottom:1,Left:2,Right:3}),cc.Class({extends:cc.Component,properties:{physicsBoxCollider:cc.PhysicsBoxCollider,state:t.Top},onLoad:function(){switch(this.state){case t.Top:this.physicsBoxCollider.size.width=cc.winSize.width,this.physicsBoxCollider.size.height=.2*cc.winSize.height,this.physicsBoxCollider.offset.y=.8*cc.winSize.height/2;case t.Bottom:this.physicsBoxCollider.size.width=cc.winSize.width,this.physicsBoxCollider.size.height=.1*cc.winSize.height,this.physicsBoxCollider.offset.y=-.9*cc.winSize.height/2;break;case t.Left:this.physicsBoxCollider.size.width=100,this.physicsBoxCollider.size.height=cc.winSize.height,this.physicsBoxCollider.offset.x=(cc.winSize.width+100)/2*-1;break;case t.Right:this.physicsBoxCollider.size.width=100,this.physicsBoxCollider.size.height=cc.winSize.height,this.physicsBoxCollider.offset.x=(cc.winSize.width+100)/2}}}),cc._RF.pop()},{}],ScreenAspectHelper:[function(i,e){"use strict";cc._RF.push(e,"bb3e4QSDZpOwovUiR8n4t9q","ScreenAspectHelper"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){cc.winSize.height<cc.winSize.width?cc.Canvas.instance.fitHeight=!0:cc.Canvas.instance.fitWidth=!0,this.node.height=cc.winSize.height,this.node.y=cc.winSize.height/2}}),cc._RF.pop()},{}]},{},["FruitFactory","MainGameController","MouseInput","PlatformHelper","ScreenAspectHelper","FruitView","GameOverView","LineLimitView"]);