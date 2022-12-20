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
        Width: 400,
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
    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString = "amChart_" + scope.symbol.Name;
    symbolContainerDiv.id = newUniqueIDString;

    var chart;
    var dataArray = [];

    function myCustomDataUpdateFunction(data) {
      if (data) {
        dataArray = [];

        if (!chart) chart = getNewChart(dataArray);
        else refreshChart(chart, dataArray);
      }
    }

    function getNewChart(dataArray) {

      return AmCharts.makeChart(symbolContainerDiv.id, {
        "type": "serial",
        "depth3D": 100,
        "angle": 30,
        "hideCredits": true,
        "dataProvider": [ {
          "category": "Wine left in the barrel",
          "value1": 30,
          "value2": 70
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
    }

    function refreshChart(chart, dataArray) {
      chart.dataProvider = dataArray;
      // chart.validateData();
      // chart.validateNow();
    }

    function myCustomConfigurationChangeFunction(data) {
      if (chart) {
        // chart.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);