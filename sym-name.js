(function (BS) {
  function symbolVis() {}
  BS.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "name",
    displayName: "[NAME]",
    datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries", // OPCIONAL
        FormatType: null, // OPCIONAL
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
        type: "pie",
        theme: "none",
        dataProvider: [
          {
            country: "Lithuania",
            litres: 501.9,
          },
          {
            country: "Czech Republic",
            litres: 301.9,
          },
          {
            country: "Ireland",
            litres: 201.1,
          },
          {
            country: "Germany",
            litres: 165.8,
          },
          {
            country: "Australia",
            litres: 139.9,
          },
          {
            country: "Austria",
            litres: 128.3,
          },
          {
            country: "UK",
            litres: 99,
          },
          {
            country: "Belgium",
            litres: 60,
          },
          {
            country: "The Netherlands",
            litres: 50,
          },
        ],
        valueField: "litres",
        titleField: "country",
        balloon: {
          fixedPosition: true,
        },
      });
    }

    function refreshChart(chart, dataArray) {
      chart.dataProvider = dataArray;
      chart.validateData();
      chart.validateNow();
    }

    function myCustomConfigurationChangeFunction(data) {
      if (chart) {
        chart.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);