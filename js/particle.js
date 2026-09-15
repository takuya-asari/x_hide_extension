// 各種パラメーター
const ratio = 10;   // 画面に表示するパーティクル数の計算に利用
const min = 0.3;    // 移動スピードの最小値
const max = 2;      // 移動スピードの最大値
const dist = 200;   // 線で繋がるまでの距離

// 以下、処理
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
let intParticle = 0;    // 表示するパーティクル数
let aryParticle = [];   // パーティクル要素の情報
let canvas = {};        // canvasの縦横の情報
// 初期処理
function init(){
  calc();
  draw();
}
init();

// リサイズ処理
window.onresize = function(){
  calc();
}

// canvasサイズの調整
function calc(){
  canvas.width = cvs.width = document.body.clientWidth * 1.2;
  canvas.height = cvs.height = document.body.clientHeight * 1.2;
  intParticle = Math.floor((canvas.width / 300 * ratio) + (canvas.height / 300 * ratio));
  if(aryParticle.length < intParticle){
    create(aryParticle.length);
  }
}

// パーティカル要素を生成
function create(start){
  for(let i = start;i < intParticle;i++){
    aryParticle.push({
      position: {   // 初期位置
        x: random(0, canvas.width),
        y: random(0, canvas.height)
      },
      direction: {  // 進行方向
        x: random(min, max, true) * ((random(0, 1)? -1: 1)),
        y: random(min, max, true) * ((random(0, 1)? -1: 1))
      },
      circle: 2     // パーティクルの半径
    });
  }
}

// 指定範囲ないから乱数を生成
function random(min, max, deci = false){
  let result = Math.random() * (max + 1 - min) + min;
  return  (deci)? result: Math.floor(result);
}

// 描画処理
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i = 0;i < intParticle;i++){
    let _p = aryParticle[i];
    // 縁を描画
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 1;
    ctx.arc(_p.position.x, _p.position.y, _p.circle, 0, 2 * Math.PI);
    ctx.fill();

    // パーティクルの更新
    aryParticle[i].position.x += _p.direction.x;
    aryParticle[i].position.y += _p.direction.y;

    // 画面の端に当たったら方向を帰る
    if(_p.position.x < 0 || _p.position.x > canvas.width){
      aryParticle[i].direction.x *= -1;
    }
    if(_p.position.y < 0 || _p.position.y > canvas.height){
      aryParticle[i].direction.y *= -1;
    }

    // リサイズでパーティクルが完全に見切れた場合
    if(_p.position.x < -_p.circle) aryParticle[i].position.x = _p.circle;
    if(_p.position.x > canvas.width + _p.circle) aryParticle[i].position.x = canvas.width - (_p.circle * 2);
    if(_p.position.y < -_p.circle) aryParticle[i].position.y = _p.circle;
    if(_p.position.y > canvas.height + _p.circle) aryParticle[i].position.y = canvas.height - (_p.circle * 2);

    // 線で繋ぐ
    for(let _i = 0;_i < intParticle;_i++){
      let _n = aryParticle[_i];
      if(i != _i){
        let _dist = Math.abs(_p.position.x - _n.position.x) + Math.abs(_p.position.y - _n.position.y);
        if(_dist < dist){
          ctx.beginPath();

          ctx.globalCompositeOperation = "multiply";

          let alpha = ((dist-_dist)>(dist/2)? 1: 1-(((dist/2)-(dist-_dist))/(dist/2)));
          ctx.globalAlpha = alpha * 0.2;

          ctx.strokeStyle = "#ffffff";
          ctx.moveTo(_p.position.x, _p.position.y);
          ctx.lineTo(_n.position.x, _n.position.y);
          ctx.stroke();

          ctx.globalCompositeOperation = "source-over";
        }
      }
    }
  }
  requestAnimationFrame(draw);
}

var requestAnimationFrame = ( function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout( callback, 1000 / 60 );
          };
} )();
