window.__require=function e(t,i,o){function n(s,a){if(!i[s]){if(!t[s]){var c=s.split("/");if(c=c[c.length-1],!t[c]){var u="function"==typeof __require&&__require;if(!a&&u)return u(c,!0);if(r)return r(c,!0);throw new Error("Cannot find module '"+s+"'")}s=c}var h=i[s]={exports:{}};t[s][0].call(h.exports,function(e){return n(t[s][1][e]||e)},h,h.exports,e,t,i,o)}return i[s].exports}for(var r="function"==typeof __require&&__require,s=0;s<o.length;s++)n(o[s]);return n}({1:[function(e,t){var i=e("./package.json").version,o="en",n="jp",r={jp:{play:"\u30b9\u30bf\u30fc\u30c8"},en:{play:"Play Now!"}},s=500;function a(){console.log("H5ad v"+i),this._isInitialised=!1,this._splashAdShown=!1}function c(e){for(var t in e=e||{})void 0===e[t]&&delete e[t];return e}function u(e,t){console.error(e),(t=t||{}).noBreak?t.noBreak():(t.beforeBreak&&t.beforeBreak(),t.afterBreak&&t.afterBreak())}function h(){if(!navigator.language)return n;var e=navigator.language.toLowerCase().substr(0,2);return r[e]?e:o}a.prototype.initialize=function(e){if(this._isInitialised)console.warn("h5ad: already initialized");else{if(this._isInitialised=!0,e&&void 0!==e.adBreakTimeout&&(s=e.adBreakTimeout),!window.adsbygoogle){var t=document.createElement("script");t.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",t.setAttribute("data-ad-client","ca-pub-123456789"),t.setAttribute("data-adbreak-test","on"),t.async=!0,document.head.appendChild(t),window.adsbygoogle=window.adsbygoogle||[],adBreak=window.adBreak=function(e){console.log("adBreak:",e),window.adsbygoogle.push(e)},adConfig=window.adConfig=function(e){console.log("adConfig:",e),window.adsbygoogle.push(e)}}adConfig({preloadAdBreaks:"on",sound:"on"})}},a.prototype.onStart=function(e){if(e=e||{},this._isInitialised||this.initialize({adBreakTimeout:e.adBreakTimeout}),this._splashAdShown)console.warn("h5ad: onStart has already been called");else{this._splashAdShown=!0;var t="";t+=".splahContainer {",t+="    background-color: black;",t+="    position: absolute;",t+="    width: 100%;",t+="    height: 100%;",t+="    text-align: left;",t+="}",t+=".splahContainer .gameIcon {",t+="    position: relative;",t+="    width: 100px;",t+="    height: 100px;",t+="    background-size: 100%;",t+="    transform: translate(-50%, -100%);",t+="    left: 50%;",t+="    top: 31%;",t+="    border-radius: 10px;",t+="    border: 2px white solid;",t+="    border-radius: min(2vh,2vw);",t+="    border: min(0.7vw, 0.7vh) white solid;",t+="    width: min(30vw, 20vh);",t+="    height: min(30vw, 20vh);",t+="}",t+=".splahContainer .startButton {",t+="    background-color: rgb(255, 193, 7);",t+="    padding: 20px 30px;",t+="    border-radius: 13px;",t+="    transform: translate(-50%, 100%);",t+="    left: 50%;",t+="    top: 40%;",t+="    border: 5px solid white;",t+="    position: relative;",t+="    cursor: pointer;",t+="    font-size: 26px;",t+="    font-family: arial, verdana;",t+="    color: white;",t+="    text-align: center;",t+="    transition: all 0.1s;",t+="    width: min(50vw,27vh);",t+="    padding: min(3vw,3vh);",t+="    font-size: min(4vh,9vw);",t+="    border-radius: min(2vh,2vw);",t+="    border: min(1vw, 1vh) white solid;",t+="}",t+=".splahContainer .startButton:hover {",t+="    transform: translate(-50%, 100%) scale(1.1);",t+="    background-color: rgb(255 217 104);",t+="}";var i=document.createElement("style");i.styleSheet?i.styleSheet.cssText=t:i.appendChild(document.createTextNode(t)),document.getElementsByTagName("head")[0].appendChild(i);var o=document.createElement("div");e.color&&(o.style.backgroundColor=e.color),o.className="splahContainer";var n=document.createElement("div");n.textContent=r[h()].play,n.className="startButton",o.appendChild(n);var a=document.createElement("div");a.className="gameIcon",e.icon&&(a.style.backgroundImage="url("+e.icon+")"),o.appendChild(a),document.body.appendChild(o),n.onclick=function(){afterBreakCallbackCalled=!1;var t=setTimeout(function(){afterBreakCallbackCalled||(afterBreakCallbackCalled=!0,e.afterBreak&&e.afterBreak())},s);try{adBreak(c({type:"start",name:e.name||"splash_screen",beforeBreak:function(){clearTimeout(t)},afterBreak:function(){afterBreakCallbackCalled||(afterBreakCallbackCalled=!0,e.afterBreak&&e.afterBreak())}}))}catch(i){u(i,e)}setTimeout(function(){document.body.removeChild(o)},200)}}},a.prototype.onNext=function(e){(e=e||{}).type="next",this.adBreak(e)},a.prototype.onBrowse=function(e){(e=e||{}).type="browse",this.adBreak(e)},a.prototype.onPause=function(e){(e=e||{}).type="pause",this.adBreak(e)},a.prototype.onReward=function(e){(e=e||{}).type="reward",this.adBreak(e)},a.prototype.adBreak=function(e){var t,i=(e=e||{}).type;if(-1===["next","browse","pause","reward"].indexOf(i))return console.error("H5ad: unknown type",i);"reward"!==i&&(t=setTimeout(function(){e.noBreak&&e.noBreak()},s));try{adBreak(c({type:i,name:e.name||i,beforeBreak:function(){t&&clearTimeout(t),e.beforeBreak&&e.beforeBreak()},afterBreak:e.afterBreak,beforeReward:e.beforeReward,adDismissed:"reward"===i?e.adDismissed||function(){}:void 0,adComplete:e.adComplete}))}catch(o){u(o,e)}},a.prototype.onMute=function(){adConfig({sound:"off"})},a.prototype.onUnmute=function(){adConfig({sound:"on"})},t.exports=new a},{"./package.json":2}],2:[function(e,t){t.exports={_from:"git+https://github.com/gc-turbo/h5ad.git#v1.1.0",_id:"h5ad@1.1.0",_inBundle:!1,_integrity:"",_location:"/h5ad",_phantomChildren:{},_requested:{type:"git",raw:"h5ad@git+https://github.com/gc-turbo/h5ad.git#v1.1.0",name:"h5ad",escapedName:"h5ad",rawSpec:"git+https://github.com/gc-turbo/h5ad.git#v1.1.0",saveSpec:"git+https://github.com/gc-turbo/h5ad.git#v1.1.0",fetchSpec:"https://github.com/gc-turbo/h5ad.git",gitCommittish:"v1.1.0"},_requiredBy:["/"],_resolved:"git+https://github.com/gc-turbo/h5ad.git#c29be9a114267f1717e47e3e4c77ea488268e1b1",_spec:"h5ad@git+https://github.com/gc-turbo/h5ad.git#v1.1.0",_where:"E:\\GitRepo2\\GcTurbo\\fruitdrop",author:{name:"GC Turbo"},bugs:{url:"https://github.com/gc-turbo/h5ad/issues"},bundleDependencies:!1,deprecated:!1,description:"Ad API wrapper for GC Turbo hyper casual games",homepage:"https://github.com/gc-turbo/h5ad#readme",license:"",main:"index.js",name:"h5ad",repository:{type:"git",url:"git+https://github.com/gc-turbo/h5ad.git"},scripts:{},version:"1.1.0"}},{}],EffectPlayer:[function(e,t){"use strict";cc._RF.push(t,"3f882wc0QhMH4Zvy9b4pYkl","EffectPlayer"),cc.Class({extends:cc.Component,properties:{greenFruitAnim:sp.Skeleton,redFruitAnim:sp.Skeleton,yellowFruitAnim:sp.Skeleton,orangeFruitAnim:sp.Skeleton,purpleFruitAnim:sp.Skeleton,isReady:!0},playGreenFx:function(){this.playFx(this.greenFruitAnim)},playRedFx:function(){this.playFx(this.redFruitAnim)},playYellowFx:function(){this.playFx(this.yellowFruitAnim)},playOrangeFx:function(){this.playFx(this.orangeFruitAnim)},playPurpleFx:function(){this.playFx(this.purpleFruitAnim)},playFx:function(e){var t=this;this.isReady=!1,e.setAnimation(0,"baozha",!1),setTimeout(function(){t.isReady=!0},1500)}}),cc._RF.pop()},{}],EffectSpawner:[function(e,t){"use strict";cc._RF.push(t,"718d2HkpDlBrpl5Hp5b460D","EffectSpawner");var i=e("./EffectPlayer");cc.Class({extends:cc.Component,properties:{fxPrefab:cc.Prefab,fxPool:[i]},showFruitFx:function(e,t,i){var o=this.getEffectPlayerInPool();if(!o)return console.warn("NOT ENOUGH FX");var n=o.node.getComponent("EffectPlayer");return o.node.scale=i,o.node.position=t,0===e||9===e||10===e?n.playGreenFx():1===e?n.playPurpleFx():2===e||8===e?n.playOrangeFx():3===e||4===e?n.playRedFx():n.playYellowFx()},getEffectPlayerInPool:function(){for(var e=!1,t=0;t<this.fxPool.length;t++){var i=this.fxPool[t];if(i.isReady)return e=!0,i}if(!e){var o=cc.instantiate(this.fxPrefab);o.parent=this.node;var n=o.getComponent("EffectPlayer");return this.fxPool.push(n),n}}}),cc._RF.pop()},{"./EffectPlayer":"EffectPlayer"}],FruitFactory:[function(e,t){"use strict";cc._RF.push(t,"5ba0biz2HhFDoXsCEnXEDtd","FruitFactory");var i=e("./../view/FruitView");cc.Class({extends:cc.Component,properties:{fruitPrefab:cc.Prefab},getFruit:function(){var e=this.getFruitLevel(),t=cc.instantiate(this.fruitPrefab);t.parent=this.node;var o=t.getComponent(i);return o.setLevel(e,this.mainGameCtrl),o},getFruitLevel:function(){return Math.floor(5*Math.random())}}),cc._RF.pop()},{"./../view/FruitView":"FruitView"}],FruitView:[function(e,t){"use strict";cc._RF.push(t,"a0bceyYXeBGmo7PDff9ZEb/","FruitView"),cc.Class({extends:cc.Component,properties:{rigidbody:cc.RigidBody,physicsCircleCollider:cc.PhysicsCircleCollider,fruitSprite:cc.Sprite,fruitScaleSizeByLevel:[cc.Float],fruitTexture:[cc.SpriteFrame],wildcardTexture:cc.SpriteFrame,fruitDefaultSize:15,fruitScaleSize:0,level:0,fruiDropSound:cc.AudioClip,smallFruiCombineSound:cc.AudioClip,mediumFruiCombineSound:cc.AudioClip,largeFruiCombineSound:cc.AudioClip},start:function(){this.node.scale=0,this.node.height=this.node.width=this.fruitDefaultSize,this.physicsCircleCollider.radius=this.fruitDefaultSize/2,this.rigidbody.type=cc.RigidBodyType.Static,this.limitRannge=.75*cc.winSize.height,this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this)},setLevel:function(e){this.level=e,this.fruitSprite.spriteFrame=this.fruitTexture[e],this.fruitScaleSize=this.fruitScaleSizeByLevel[e],this.physicsCircleCollider.tag=e,this.node.scale=this.fruitScaleSize},setMainGameCtrl:function(e){this.mainGameCtrl=e},dropDown:function(e,t){this.animateFruitMoveXAxis(e,t)},onBeginContact:function(e,t,i){if(this.isCompletedDropping){var o=i.node.getComponent("FruitView");if(!o||o.isCompletedDropping){if(this._hasCollideOther||9999===i.tag||(this._hasCollideOther=!0,this.node.dispatchEvent(new cc.Event.EventCustom("fruitcollideother",!0))),5e3===this.physicsCircleCollider.tag&&5e3!==i.tag&&9999!==i.tag&&8888!==i.tag&&i.tag<10)return this.rigidbody.enabledContactListener=!1,o.fuseFruit(),void this.destroyFruit();this.level===i.tag&&(this._isBeingFusion||i.tag>=10||(this._isBeingFusion=!0,o.destroyFruit(),this.fuseFruit()))}}},onTouchEnd:function(){this.isCompletedDropping&&(this.mainGameCtrl.isHammerActive?(this.mainGameCtrl.disableHammerPower(),this.playSoundByLevel(this.level),this.destroyFruit()):this.mainGameCtrl.isLightningActive&&(this.mainGameCtrl.disableLightningPower(),this.playSoundByLevel(this.level),this.mainGameCtrl.destroyAllFruitWithLevel(this.level)))},destroyFruit:function(){var e=this;this.mainGameCtrl.effectSpawner.showFruitFx(this.level,this.node.position,this.node.scale),this.mainGameCtrl.destroyFruitInScreen(this.node.uuid),this._isBeingFusion=!1,setTimeout(function(){return e.node.removeFromParent()},0)},fuseFruit:function(){var e=this,t=this.level+1,i=new cc.Event.EventCustom("fruitcombine",!0);if(i.detail=t,this.node.dispatchEvent(i),this.setLevel(t),this.playSoundByLevel(t),this.mainGameCtrl.effectSpawner.showFruitFx(t-1,this.node.position,this.node.scale),this.animateFruitFusion(function(){return e._isBeingFusion=!1}),t>=10){var o=new cc.Event.EventCustom("reachmaxfruit",!0);o.detail=t,this.node.dispatchEvent(o)}},playSoundByLevel:function(e){return e<6?this.playSound(this.smallFruiCombineSound):e>=6&&e<9?this.playSound(this.mediumFruiCombineSound):this.playSound(this.largeFruiCombineSound)},setWildcard:function(){this.fruitSprite.spriteFrame=this.wildcardTexture,this.fruitScaleSize=this.fruitScaleSizeByLevel[1],this.physicsCircleCollider.tag=5e3,this.node.scale=this.fruitScaleSize},animateFruitMoveXAxis:function(e,t){var i=this,o=Math.abs(this.node.x-e)/cc.winSize.width*1;this.playSound(this.fruiDropSound),cc.tween(this.node).to(o,{x:{value:e,easing:"sineIn"}}).call(function(){i.isCompletedDropping=!0,i.rigidbody.type=cc.RigidBodyType.Dynamic,t&&t()}).start()},animateFruitSpawn:function(e){this.node.scale=0,cc.tween(this.node).to(.25,{scale:{value:this.fruitScaleSize,easing:"sineIn"}}).call(function(){e&&e()}).start()},animateFruitFusion:function(e){this.node.scale=this.fruitScaleSizeByLevel[this.level-1],cc.tween(this.node).to(.15,{scale:{value:this.fruitScaleSize,easing:"sineIn"}}).call(function(){return e&&e()}).start()},animateExplosion:function(){this.node.removeFromParent()},animateWarning:function(){this._warningTween=cc.tween(this.node).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.RED,easing:"sineIn"}}).to(.5,{color:{value:cc.Color.WHITE,easing:"sineIn"}}).start()},update:function(){if(this._hasCollideOther)if(this.node.y+this.node.height*this.node.scale/2>this.limitRannge){if(this._hasWarnning)return;this._hasWarnning=!0,this.animateWarning(),this.startGameOverCountdown()}else{if(!this._hasWarnning)return;this._hasWarnning=!1,this._countdown&&clearTimeout(this._countdown),this.node.color=cc.Color.WHITE,this._warningTween&&this._warningTween.stop()}},startGameOverCountdown:function(){var e=this;this._countdown=setTimeout(function(){e&&e.node&&e.node.dispatchEvent(new cc.Event.EventCustom("fruitoverlimit",!0))},5e3)},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{}],GameOverView:[function(e,t){"use strict";cc._RF.push(t,"8bdb57b1qhPi6G7a2iZ6SPo","GameOverView"),cc.Class({extends:cc.Component,properties:{clickSound:cc.AudioClip,winSound:cc.AudioClip,loseSound:cc.AudioClip,winPanel:cc.Node,losePanel:cc.Node,congratPanel:cc.Node,watchAdButton:cc.Node,reachScoreLabel:cc.Node,scoreLabel:cc.Label,levelLabel:cc.Label,_popuStack:[]},showGameWin:function(e){this.node.active=!0,this.watchAdButton.active=!0,this.winPanel.active=!0,this.losePanel.active=!1,this.congratPanel.active=!1,this.reachScoreLabel.active=!1,this.scoreLabel.node.active=!1,this.levelLabel.string=e,this.playSound(this.winSound)},showGameLose:function(e){this.node.active=!0,this.winPanel.active=!1,this.congratPanel.active=!1,this.watchAdButton.active=!1,this.losePanel.active=!0,this.reachScoreLabel.active=!0,this.scoreLabel.node.active=!0,this.scoreLabel.string=e,this.playSound(this.loseSound)},showCongratPanel:function(e){this.node.active=!0,this.watchAdButton.active=!0,this.winPanel.active=!1,this.losePanel.active=!1,this.reachScoreLabel.active=!0,this.scoreLabel.node.active=!0,this.congratPanel.active=!0,this.scoreLabel.string=e,this.playSound(this.winSound)},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{}],IntroView:[function(e,t){"use strict";cc._RF.push(t,"64dd28Ng3dBOpBSrw2chJ+P","IntroView");var i=e("h5ad"),o=e("../utils/utils");cc.Class({extends:cc.Component,properties:{clickSound:cc.AudioClip,loading:cc.Node},onLoad:function(){i.onStart({icon:o.getResourceUrl("icon"),color:"rgb(133 122 236)"})},onPlayClicked:function(){this.loading.active=!0,this.playSound(this.clickSound),cc.director.loadScene("mainGame")},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{"../utils/utils":"utils",h5ad:1}],LineLimitView:[function(e,t){"use strict";cc._RF.push(t,"5848e+pJTFNY5UMtA1cyzYf","LineLimitView"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){this.node.width=cc.winSize.width,this.node.y=.75*cc.winSize.height-cc.winSize.height/2}}),cc._RF.pop()},{}],MainGameController:[function(e,t){"use strict";cc._RF.push(t,"025812yNeBPSoW3kv06EGE0","MainGameController");var i=e("../view/FruitView"),o=e("../view/GameOverView"),n=e("../view/PowerUpButtonView"),r=e("../utils/utils"),s=e("./EffectSpawner"),a=e("h5ad"),c=[5,6,7,8,9,10];cc.Class({extends:cc.Component,properties:{loading:cc.Node,effectSpawner:s,fruitPrefab:cc.Prefab,gameOver:o,fruitSpawnPos:cc.Vec2,progresssBar:cc.ProgressBar,progressBarValue:0,scoreLabel:cc.Label,score:0,fruitTexture:[cc.SpriteFrame],fruitGoalSprite:cc.Sprite,fruitGoalIndex:0,level:1,levelLabel:cc.Label,hammerTips:cc.Node,isHammerActive:!1,lightningTips:cc.Node,isLightningActive:!1,powerUpUsageStock:[cc.Integer],powerButton:[n],reachTargetFruitSound:cc.AudioClip,clickSound:cc.AudioClip,showRewardedAd:null,showRewardedAdSuccessCb:null,prepareRewardedAdsInterval:null},onLoad:function(){this.physicsManager=cc.director.getPhysicsManager(),this.physicsManager.enabled=!0},start:function(){var e=this;this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this),this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this),this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this),this.node.on("fruitcombine",this.onFruitCombine,this),this.node.on("fruitoverlimit",this.onFruitOverLimit,this),this.node.on("fruitcollideother",this.onFruitCollideOther,this),this.node.on("reachmaxfruit",this.onReachMaxFruit,this),this.fruits={},this.resetGameProfile(),setTimeout(function(){e.createFruit()},500)},createFruit:function(){var e=this;if(this._canCreateFruit){var t=this.getFruit();this.fruits[t.node.uuid]=t,t.node.y=.84*cc.winSize.height,t.node.x=cc.winSize.width/2,t.animateFruitSpawn(function(){e._curFruitSelector=t,e._canCreateFruit=!1,e._canDragFruit=!0,e.isWildCardActive=!1})}},getFruit:function(){var e=this.getFruitLevel(),t=cc.instantiate(this.fruitPrefab);t.parent=this.node;var o=t.getComponent(i);return o.setLevel(e),o.setMainGameCtrl(this),o},getFruitLevel:function(){return Math.floor(4*Math.random())},destroyAllFruitWithLevel:function(e){for(var t in this.fruits)this.fruits[t].isCompletedDropping&&this.fruits[t].level===e&&this.fruits[t].destroyFruit()},destroyFruitInScreen:function(e){this.fruits[e]&&delete this.fruits[e]},resetGameProfile:function(){this.level=1,this.levelLabel.string=1,this.score=0,this.scoreLabel.string=0,this.progressBarValue=0,this.fruitGoalIndex=0;for(var e=0;e<this.powerUpUsageStock.length;e++)this.powerUpUsageStock[e]=0;this.powerButton.forEach(function(e){e.updateStock(0),e.setAdsAvailability(!1)}),this._canCreateFruit=!0,this._isGameEnd=!1,this.prepareRewardedAds()},stopRetryRewardedAds:function(){this.prepareRewardedAdsInterval&&(clearInterval(this.prepareRewardedAdsInterval),this.prepareRewardedAdsInterval=null)},prepareRewardedAds:function(){var e=this;if(this.showRewardedAd||this._isGameEnd)return this.stopRetryRewardedAds();this.prepareRewardedAdsInterval||(this.prepareRewardedAdsInterval=setInterval(function(){e.prepareRewardedAds()},15e3)),a.onReward({beforeReward:function(t){e.stopRetryRewardedAds(),e._isGameEnd||(e.powerButton.forEach(function(e){e.setAdsAvailability(!0)}),e.showRewardedAd=function(){e.showRewardedAd=null,e.powerButton.forEach(function(e){e.setAdsAvailability(!1)}),t()})},beforeBreak:function(){cc.director.pause(),cc.audioEngine.pauseAll()},afterBreak:function(){cc.director.resume(),cc.audioEngine.resumeAll(),e._isGameEnd||e.prepareRewardedAds()},adComplete:function(){e.showRewardedAdSuccessCb&&e.showRewardedAdSuccessCb(),e.showRewardedAdSuccessCb=null}})},onTouchEnd:function(e){this._canDragFruit&&this.dropFruit(e.getLocationX())},onTouchMove:function(e){this._canDragFruit&&this._curFruitSelector&&(this.isHammerActive||this.isLightningActive||(this._curFruitSelector.node.x=this.validatePositionX(e.getLocationX())))},onTouchCancel:function(e){this.dropFruit(e.getLocationX())},dropFruit:function(e){var t=this;this._curFruitSelector&&(this.isHammerActive||this.isLightningActive||(this._canCreateFruit=!1,this._canDragFruit=!1,this._curFruitSelector.dropDown(this.validatePositionX(e),function(){t._curFruitSelector=null})))},validatePositionX:function(e){var t=this._curFruitSelector.node.height*this._curFruitSelector.node.scale/2,i=t,o=this.node.width-t;return Math.max(i,Math.min(o,e))},onFruitCombine:function(e){var t=this;e.stopPropagation(),this.score+=5*(e.detail-1)+10,this.scoreLabel.string=""+this.score;var i=this.getTargetScore(this.level);this.score<i?this.progressBarValue=(this.score-this.getTargetScore(this.level-1))/(i-this.getTargetScore(this.level-1)):(this.level+=1,this.levelLabel.string=""+this.level,this.progressBarValue=(this.score-this.getTargetScore(this.level-1))/(this.getTargetScore(this.level)-this.getTargetScore(this.level-1)),this.gameOver.showGameWin(this.level),cc.director.pause()),e.detail+1>c[this.fruitGoalIndex]&&(this.fruitGoalIndex=Math.min(this.fruitGoalIndex+1,c.length-1),this.fruitGoalSprite.spriteFrame=this.fruitTexture[c[this.fruitGoalIndex]],setTimeout(function(){t.gameOver.showCongratPanel(t.score),cc.director.pause()},1e3))},getTargetScore:function(e){return 0===e?0:1===e?100:e>1&&e<11?50*e+this.getTargetScore(e-1):500*(e-10)+this.getTargetScore(e-1)},onFruitOverLimit:function(){this._isGameEnd||(this._isGameEnd=!0,this.stopRetryRewardedAds(),this.gameOver.showGameLose(this.score))},onReachMaxFruit:function(e){e.stopPropagation(),this.gameOver.showCongratPanel(this.score)},onFruitCollideOther:function(e){e.stopPropagation(),this._canCreateFruit=!0,this.createFruit()},onWildCardPowerClicked:function(){if(!this.isWildCardActive){this.playSound(this.clickSound);var e=this;if(0===this.powerUpUsageStock[2])return this.showRewardedAdSuccessCb=function(){e.powerUpUsageStock[2]+=1,e.powerButton[2].updateStock(e.powerUpUsageStock[2])},void this.showRewardedAd();this._curFruitSelector&&(this.powerUpUsageStock[2]=Math.max(0,this.powerUpUsageStock[2]-1),this.powerButton[2].updateStock(this.powerUpUsageStock[2]),this._curFruitSelector.setWildcard(),this.isWildCardActive=!0)}},onHammerPowerClicked:function(){if(this.canActiveDestroyPower()){this.playSound(this.clickSound);var e=this;if(0===this.powerUpUsageStock[0])return this.showRewardedAdSuccessCb=function(){e.powerUpUsageStock[0]+=1,e.powerButton[0].updateStock(e.powerUpUsageStock[0])},void this.showRewardedAd();this.powerUpUsageStock[0]=Math.max(0,this.powerUpUsageStock[0]-1),this.powerButton[0].updateStock(this.powerUpUsageStock[0]),this.hammerTips.active=!0,this.isHammerActive=!0}},onLightningPowerClicked:function(){if(this.canActiveDestroyPower()){this.playSound(this.clickSound);var e=this;if(0===this.powerUpUsageStock[1])return this.showRewardedAdSuccessCb=function(){e.powerUpUsageStock[1]+=1,e.powerButton[1].updateStock(e.powerUpUsageStock[1])},void this.showRewardedAd();this.powerUpUsageStock[1]=Math.max(0,this.powerUpUsageStock[1]-1),this.powerButton[1].updateStock(this.powerUpUsageStock[1]),this.lightningTips.active=!0,this.isLightningActive=!0}},canActiveDestroyPower:function(){return 0!==this.getFruitCountInScreen()&&!this.isHammerActive&&!this.isLightningActive},getFruitCountInScreen:function(){var e=0;for(var t in this.fruits)this.fruits[t].isCompletedDropping&&(e+=1);return e},disableHammerPower:function(){var e=this;this.hammerTips.active=!1,setTimeout(function(){e.isHammerActive=!1},0)},disableLightningPower:function(){var e=this;this.lightningTips.active=!1,setTimeout(function(){e.isLightningActive=!1},0)},onContinueClicked:function(){var e=this;this._isGameEnd?r.showAds("next",!0,function(){e.loading.active=!0,cc.director.loadScene("mainGame")}):(cc.director.resume(),this.gameOver.node.active=!1)},onGetPowerUpClicked:function(){var e=this;r.showAds("browse",!0,function(){cc.director.resume(),e.getRandomPowerUp(),e.gameOver.node.active=!1})},getRandomPowerUp:function(){var e=Math.floor(3*Math.random());this.powerUpUsageStock[e]+=1,this.powerButton[e].updateStock(this.powerUpUsageStock[e])},update:function(){this.progresssBar.progress=this.progressBarValue},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{"../utils/utils":"utils","../view/FruitView":"FruitView","../view/GameOverView":"GameOverView","../view/PowerUpButtonView":"PowerUpButtonView","./EffectSpawner":"EffectSpawner",h5ad:1}],MouseInput:[function(e,t){"use strict";cc._RF.push(t,"da8faR7nPBD/o2kWJ6TYq3I","MouseInput"),cc.Class({extends:cc.Component,properties:{target:cc.Prefab},start:function(){this.node.on(cc.Node.EventType.MOUSE_DOWN,this.onMouseMove,this)},onMouseMove:function(e){var t=e.getLocation(),i=cc.instantiate(this.target);i.parent=this.node.parent,i.x=t.x,i.y=t.y,console.log("position",t)}}),cc._RF.pop()},{}],PlatformHelper:[function(e,t){"use strict";var i;cc._RF.push(t,"6c6feM0k09B/oS+IhdmOEDS","PlatformHelper"),i=cc.Enum({Top:0,Bottom:1,Left:2,Right:3}),cc.Class({extends:cc.Component,properties:{physicsBoxCollider:cc.PhysicsBoxCollider,state:i.Top},onLoad:function(){switch(this.state){case i.Top:this.physicsBoxCollider.size.width=cc.winSize.width,this.physicsBoxCollider.size.height=.2*cc.winSize.height,this.physicsBoxCollider.offset.y=.8*cc.winSize.height/2;case i.Bottom:this.physicsBoxCollider.size.width=cc.winSize.width,this.physicsBoxCollider.size.height=.162*cc.winSize.height,this.physicsBoxCollider.offset.y=-.848*cc.winSize.height/2;break;case i.Left:this.physicsBoxCollider.size.width=100,this.physicsBoxCollider.size.height=cc.winSize.height,this.physicsBoxCollider.offset.x=(cc.winSize.width+100)/2*-1;break;case i.Right:this.physicsBoxCollider.size.width=100,this.physicsBoxCollider.size.height=cc.winSize.height,this.physicsBoxCollider.offset.x=(cc.winSize.width+100)/2}}}),cc._RF.pop()},{}],PowerUpButtonView:[function(e,t){"use strict";cc._RF.push(t,"b02e7f0vVZLXYuo+QHWrsPs","PowerUpButtonView"),cc.Class({extends:cc.Component,properties:{adsIcon:cc.Node,stockIcon:cc.Node,stockCount:cc.Label,adAvailable:cc.Boolean},onLoad:function(){this.adAvailable=!1},updateStock:function(e){void 0===e&&(e=this.getStock());var t=e>0;this.stockIcon.active=!this.adAvailable||t,this.adsIcon.active=!this.stockIcon.active,this.stockCount.string=""+e,this.updateClickability()},setAdsAvailability:function(e){this.adAvailable=e,this.updateStock()},updateClickability:function(){this.node._touchListener.setEnabled(this.adAvailable||this.getStock()>0)},getStock:function(){return Number(this.stockCount?this.stockCount.string:0)}}),cc._RF.pop()},{}],ScreenAspectHelper:[function(e,t){"use strict";cc._RF.push(t,"bb3e4QSDZpOwovUiR8n4t9q","ScreenAspectHelper"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){cc.winSize.height<cc.winSize.width?cc.Canvas.instance.fitHeight=!0:cc.Canvas.instance.fitWidth=!0,this.node.height=cc.winSize.height,this.node.y=cc.winSize.height/2}}),cc._RF.pop()},{}],SoundToggle:[function(e,t){"use strict";cc._RF.push(t,"b4202ty3ENJA7mc77KDTEFp","SoundToggle"),cc.Class({extends:cc.Component,properties:{buttonSprite:cc.Sprite,buttonTextures:[cc.SpriteFrame],clickSound:cc.AudioClip},onLoad:function(){var e=cc.sys.localStorage.getItem("soundConfig")||1;this.buttonSprite.spriteFrame=this.buttonTextures[e],this.setSoundConfig(e)},onSoundButtonClicked:function(){var e=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(this.clickSound,!1,e);var t=1==e?0:1;cc.sys.localStorage.setItem("soundConfig",t),this.buttonSprite.spriteFrame=this.buttonTextures[t],this.setSoundConfig(t)},setSoundConfig:function(e){1==e?cc.audioEngine.setMusicVolume(1):cc.audioEngine.setMusicVolume(0)}}),cc._RF.pop()},{}],utils:[function(e,t){"use strict";cc._RF.push(t,"f9831/6oa1L3YaV5/OmwuM4","utils");var i=e("h5ad");t.exports={showAds:function(e,t,o){i.adBreak({type:e,beforeBreak:function(){t&&(cc.director.pause(),cc.audioEngine.pauseAll())},afterBreak:function(){t&&(cc.director.resume(),cc.audioEngine.resumeAll()),o&&o()},noBreak:function(){o&&o()}})},getResourceUrl:function(e){var t=cc.resources.getInfoWithPath(e),i=t.uuid;return t.nativeVer&&(i+="."+t.nativeVer),"./assets/resources/native/"+i.substr(0,2)+"/"+i+".png"}},cc._RF.pop()},{h5ad:1}]},{},["EffectPlayer","EffectSpawner","FruitFactory","MainGameController","MouseInput","SoundToggle","PlatformHelper","ScreenAspectHelper","utils","FruitView","GameOverView","IntroView","LineLimitView","PowerUpButtonView"]);