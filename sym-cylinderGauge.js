(function (BS) {
  function symbolVis() {}
  BS.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "cylinderGauge",
    displayName: "Cylinder Gauge",
    datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        FormatType: null, 
        Height: 400,
        Width: 800,
      };
    },

    configOptions: function () {
      return [
        {
          title: "Format Symbol",
          mode: "format",
        },
      ];
    },
  };

  symbolVis.prototype.init = function (scope, elem) {
    scope.config.FormatType = null;
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    var symbolContainerDiv1 = elem.find("#container1")[0];
    var newUniqueIDString1 = "amChart_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv1.id = newUniqueIDString1;

    var symbolContainerDiv2 = elem.find("#container2")[0];
    var newUniqueIDString2 = "amChart_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv2.id = newUniqueIDString2;

    var chart;
    var dataArray = [];
    var dataNumber;

    function myCustomDataUpdateFunction(data) {
      if (data) {
        console.log(" ~ file: sym-cylinderGauge.js:46 ~ myCustomDataUpdateFunction ~ data", data)
        let static = data.Data[0];
        let real = data.Data[1];

        let realValue = getRealValue(real);
        let staticValue = getStaticValue(static);
        dataNumber = realValue;
        dataArray = [...staticValue];
        console.log(" ~ file: sym-cylinderGauge.js:56 ~ myCustomDataUpdateFunction ~ dataArray", dataArray)

        if (!chart) chart = getNewChart(dataArray,dataNumber);
        else refreshChart(chart, dataArray, dataNumber);
      }
    }

    function getRealValue ( data ) {
      let Value = data.Values.at(-1).Value;
      return Value;
    }

    function getStaticValue ( data ) {
      let Values = data.Values;
      let array = Values.map(elem => Object({
        value: elem.Value,
        date: elem.Time.split("T")[0].replace("2022-","")
      }))
      
      return array;
    }

    function getNewChart(dataArray, dataNumber) {

      var chartCylinderGauge = AmCharts.makeChart(symbolContainerDiv1.id, {
        "type": "serial",
        "depth3D": 100,
        "angle": 30,
        "hideCredits": true,
        "dataProvider": [ {
          "category": "Wine left in the barrel",
          "value1": dataNumber,
          "value2": 100 - dataNumber,
        } ],
        "valueAxes": [ {
          "stackType": "100%",
          "gridAlpha": 0
        } ],
        "graphs": [ {
          "type": "column",
          "topRadius": 1,
          "columnWidth": 1,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0.5,
          "lineColor": "#FFFFFF",
          "fillColors": "#0EE1BE",
          "fillAlphas": 0.8,
          "valueField": "value1"
        }, {
          "type": "column",
          "topRadius": 1,
          "columnWidth": 1,
          "showOnAxis": true,
          "lineThickness": 2,
          "lineAlpha": 0.5,
          "lineColor": "#cdcdcd",
          "fillColors": "#cdcdcd",
          "fillAlphas": 0.5,
          "valueField": "value2"
        } ],
        "categoryField": "category",
        "categoryAxis": {
          "axisAlpha": 0,
          "labelOffset": 40,
          "gridAlpha": 0
        },
      });


      var chartLineBase = AmCharts.makeChart(symbolContainerDiv2.id, {
    "type": "serial",
    "theme": "none",
    "marginRight": 40,
    "marginLeft": 40,
    "hideCredits": true,
    "autoMarginOffset": 20,
    "valueAxes": [{
        "id": "v1",
        "axisAlpha": 0,
        "position": "left",
        "ignoreAxisWidth":true
    }],
    "balloon": {
        "borderThickness": 1,
        "shadowAlpha": 0
    },
    "graphs": [{
        "id": "g1",
        "balloon":{
          "drop":true,
          "adjustBorderColor":false,
          "color":"#ffffff"
        },
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "lineColor": "#0EE1BE",
        "bulletSize": 5,
        "hideBulletsCount": 50,
        "lineThickness": 2,
        "title": "red line",
        "useLineColorForBulletBorder": true,
        "valueField": "value",
        "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
    }],
    "categoryField": "date",
    "dataProvider": dataArray,
});
      let amchart = {chartCylinderGauge, chartLineBase}
      refreshChart(amchart, dataArray, dataNumber);
      return {chartCylinderGauge, chartLineBase}
    }

    function refreshChart(chart, dataArray, dataNumber) {

      let {chartCylinderGauge, chartLineBase } = chart;

      chartCylinderGauge.dataProvider.value1 = dataNumber;
      chartCylinderGauge.dataProvider.value2 = 100 - dataNumber;
      chartLineBase.dataProvider = dataArray;

      chartCylinderGauge.validateData();
      chartCylinderGauge.validateNow();
      chartLineBase.validateData();
      chartLineBase.validateNow();
    }

    function myCustomConfigurationChangeFunction(data) {
      if (chart) {
        let {chartCylinderGauge, chartLineBase } = chart;
        chartCylinderGauge.validateNow();
        chartLineBase.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);