/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};
var select = document.getElementById('city-select');
// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '',
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
 function renderChart() {
  var wrap = document.getElementsByClassName('aqi-chart-wrap')[0];
  wrap.innerHTML = "";
  var cnt = 0;
  for(var i in chartData){
    cnt += 1;
  }
  var width = (600/cnt).toFixed();
  for(var key in chartData){
    var div = document.createElement('div');
    div.style.height = chartData[key] +'px';
    div.style.width = width +'px';
    div.title = key + ' AQI：' + chartData[key];
    wrap.appendChild(div);
  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
 function graTimeChange() {

  // 设置对应数据
  var val;
  var inputs = document.getElementsByName('gra-time');
  for (var i = 0; i < inputs.length; i++) {
    if(inputs[i].checked){
      val = inputs[i].value;
      break;
    }
  };
  if(val == pageState.nowGraTime)
    return;
  pageState.nowGraTime = val;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
 function citySelectChange() {

  if(select.value == pageState.nowSelectCity)
    return;
  pageState.nowSelectCity = select.value;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
 function initGraTimeForm() {
  var inputs = document.getElementsByName('gra-time');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onchange = graTimeChange;
  };
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
 function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var flag = true;
  for(var key in aqiSourceData){
    /* 初始化pageState.nowSelectCity */
    if(flag){
      flag = false;
      pageState.nowSelectCity = key;
    }
    select.options.add(new Option(key,key));
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
 function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData = {};
  var temp = {};
  if(pageState.nowGraTime == 'day'){
    chartData =  aqiSourceData[pageState.nowSelectCity];
  }else if(pageState.nowGraTime == 'week'){
    var cnt = 1, sum = 0;
    temp = aqiSourceData[pageState.nowSelectCity];
    for(var key in temp){
       sum += temp[key];
       if(cnt%7==0){
        chartData["第" + cnt/7 + "周"] = (sum/7).toFixed();
        sum = 0;
      }
      cnt++;
    }
}else{
  temp = aqiSourceData[pageState.nowSelectCity];
  var res = [0,0,0];
  for(var key in temp){
    var m = parseInt(key.split('-')[1]);
    res[m-1] += temp[key];
  }
  chartData = {
    '2016-01': (res[0]/31).toFixed(),
    '2016-02': (res[1]/29).toFixed(),
    '2016-03': (res[2]/31).toFixed()
  }
}
console.log(chartData);
}

/**
 * 初始化函数
 */
 function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  renderChart();
}

init();