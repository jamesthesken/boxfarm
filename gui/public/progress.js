(function () {

  var circle = document.getElementById('one');
  var text = document.getElementById('percent-one');
  var angle = 0;
  var percent = 70*4.7

  window.timer = window.setInterval(function () {
    circle.setAttribute("stroke-dasharray", angle + ", 20000");
    text.innerHTML = parseInt(angle/471*100);

    if (angle >= percent) {
      window.clearInterval(window.timer);
    }
    angle += 6;
  }.bind(this), 30);

  //---

  var circle1 = document.getElementById('two');
  var text1 = document.getElementById('percent-two');
  var angle1 = 0;
  var percent1 = 60*4.7

  window.timer1 = window.setInterval(function () {
    circle1.setAttribute("stroke-dasharray", angle1 + ", 20000");
    text1.innerHTML = parseInt(angle1/471*100);

    if (angle1 >= percent1) {
      window.clearInterval(window.timer1);
    }
    angle1 += 7;
  }.bind(this), 30);

  //---

  var circle2 = document.getElementById('three');
  var text2 = document.getElementById('percent-three');
  var angle2 = 0;
  var percent2 = 40*4.7

  window.timer2 = window.setInterval(function () {
    circle2.setAttribute("stroke-dasharray", angle2 + ", 20000");
    text2.innerHTML = parseInt(angle2/471*100);

    if (angle2 >= percent2) {
      window.clearInterval(window.timer2);
    }
    angle2 += 6;
  }.bind(this), 30);

})()
