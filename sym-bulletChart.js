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
        Height: 500,
        Width: 250,
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
        type: "serial",
        theme: "none",
        autoMargins: false,
        marginTop: 30,
        marginLeft: 80,
        marginBottom: 30,
        marginRight: 50,
        "hideCredits": true,
        dataProvider: [
          {
            category: "Evaluation",
            excelent: 20,
            good: 20,
            average: 20,
            poor: 20,
            bad: 20,
            limit: 78,
            full: 100,
            bullet: 65,
          },
        ],
        valueAxes: [
          {
            maximum: 100,
            stackType: "regular",
            gridAlpha: 0,
          },
        ],
        startDuration: 1,
        graphs: [
          {
            fillAlphas: 0.8,
            lineColor: "#19d228",
            showBalloon: false,
            type: "column",
            valueField: "excelent",
          },
          {
            fillAlphas: 0.8,
            lineColor: "#b4dd1e",
            showBalloon: false,
            type: "column",
            valueField: "good",
          },
          {
            fillAlphas: 0.8,
            lineColor: "#f4fb16",
            showBalloon: false,
            type: "column",
            valueField: "average",
          },
          {
            fillAlphas: 0.8,
            lineColor: "#f6d32b",
            showBalloon: false,
            type: "column",
            valueField: "poor",
          },
          {
            fillAlphas: 0.8,
            lineColor: "#fb7116",
            showBalloon: false,
            type: "column",
            valueField: "bad",
          },
          {
            clustered: false,
            columnWidth: 0.3,
            fillAlphas: 1,
            lineColor: "#000000",
            stackable: false,
            type: "column",
            valueField: "bullet",
          },
          {
            columnWidth: 0.5,
            lineColor: "#000000",
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
