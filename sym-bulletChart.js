(function (BS) {
  function symbolVis() {}
  BS.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "bulletChart",
    displayName: "Bullet Chart",
    datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        FormatType: null,
        Height: 200,
        Width: 500,
        colorChart1: "#47DB53",
        colorChart2: "#C3E44B",
        colorChart3: "#F6FC45",
        colorChart4: "#F8DC55",
        colorChart5: "#FC8D45",
        colorChart6: "#000000",
        colorChart7: "#000000",
        numberRange1: 20,
        numberRange2: 20,
        numberRange3: 20,
        numberRange4: 20,
        numberRange5: 20,
        customTitle: "",
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
      console.log(" ~ file: sym-bulletChart.js:54 ~ myCustomDataUpdateFunction ~ data", data)
      if (data) {
        dataArray = [];

        if (!chart) chart = getNewChart(dataArray);
        else refreshChart(chart, dataArray);
      }
    }

    function getNewChart(dataArray) {
      return AmCharts.makeChart(symbolContainerDiv.id, {
        type: "serial",
        theme: "none",
        autoMargins: false,
        marginTop: 30,
        marginLeft: 100,
        marginBottom: 30,
        marginRight: 100,
        hideCredits: true,
        dataProvider: [
          {
            category: scope.config.customTitle,
            excelent: scope.config.numberRange1,
            good: scope.config.numberRange2,
            average: scope.config.numberRange3,
            poor: scope.config.numberRange4,
            bad: scope.config.numberRange5,
            limit: 78,
            full: 100,
            bullet: 65,
          },
        ],
        valueAxes: [
          {
            maximum: scope.config.numberRange1 + scope.config.numberRange2 + scope.config.numberRange3 + scope.config.numberRange4 + scope.config.numberRange5,
            stackType: "regular",
            gridAlpha: 0,
          },
        ],
        startDuration: 1,
        graphs: [
          {
            fillAlphas: 0.8,
            lineColor: scope.config.colorChart1,
            showBalloon: false,
            type: "column",
            valueField: "excelent",
          },
          {
            fillAlphas: 0.8,
            lineColor: scope.config.colorChart2,
            showBalloon: false,
            type: "column",
            valueField: "good",
          },
          {
            fillAlphas: 0.8,
            lineColor: scope.config.colorChart3,
            showBalloon: false,
            type: "column",
            valueField: "average",
          },
          {
            fillAlphas: 0.8,
            lineColor: scope.config.colorChart4,
            showBalloon: false,
            type: "column",
            valueField: "poor",
          },
          {
            fillAlphas: 0.8,
            lineColor: scope.config.colorChart5,
            showBalloon: false,
            type: "column",
            valueField: "bad",
          },
          {
            clustered: false,
            columnWidth: 0.3,
            fillAlphas: 1,
            lineColor: scope.config.colorChart6,
            stackable: false,
            type: "column",
            valueField: "bullet",
          },
          {
            columnWidth: 0.5,
            lineColor: scope.config.colorChart7,
            lineThickness: 3,
            noStepRisers: true,
            stackable: false,
            type: "step",
            valueField: "limit",
          },
        ],
        rotate: true,
        columnWidth: 1,
        categoryField: "category",
        categoryAxis: {
          gridAlpha: 0,
          position: "left",
        },
      });
    }

    function refreshChart(chart, dataArray) {
      // chart.dataProvider = dataArray;
      chart.validateData();
      chart.validateNow();
    }

    function myCustomConfigurationChangeFunction(data) {
      if (chart) {

        chart.graphs[0].lineColor = scope.config.colorChart1;
        chart.graphs[1].lineColor = scope.config.colorChart2;
        chart.graphs[2].lineColor = scope.config.colorChart3;
        chart.graphs[3].lineColor = scope.config.colorChart4;
        chart.graphs[4].lineColor = scope.config.colorChart5;
        chart.graphs[5].lineColor = scope.config.colorChart6;
        chart.graphs[6].lineColor = scope.config.colorChart7;


        if(scope.config.customTitle) chart.dataProvider = [{
          ...chart.dataProvider[0],
          category: scope.config.customTitle,
        }];

        if(scope.config.numberRange1) chart.dataProvider = [{
          ...chart.dataProvider[0],
          excelent: scope.config.numberRange1,
        }];

        if(scope.config.numberRange2) chart.dataProvider = [{
          ...chart.dataProvider[0],
          good: scope.config.numberRange2,
        }];

        if(scope.config.numberRange3) chart.dataProvider = [{
          ...chart.dataProvider[0],
          average: scope.config.numberRange3,
        }];

        if(scope.config.numberRange4) chart.dataProvider = [{
          ...chart.dataProvider[0],
          poor: scope.config.numberRange4,
        }];

        if(scope.config.numberRange5) chart.dataProvider = [{
          ...chart.dataProvider[0],
          bad: scope.config.numberRange5,
        }];

        // if(scope.config.numberRange1 || scope.config.numberRange2 || scope.config.numberRange3 || scope.config.numberRange4 || scope.config.numberRange5) chart.valueAxes = [{
        //   ...chart.valueAxes[0],
        //   maximum: scope.config.numberRange1 + scope.config.numberRange2 + scope.config.numberRange3 + scope.config.numberRange4 + scope.config.numberRange5,
        // }]

        chart.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);
