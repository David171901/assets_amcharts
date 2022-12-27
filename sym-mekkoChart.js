(function (BS) {
  function symbolVis() {}
  BS.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "mekkoChart",
    displayName: "Mekko Chart",
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
      console.log(" ~ file: sym-mekkoChart.js:41 ~ myCustomDataUpdateFunction ~ data", data)
      if (data) {
        dataArray = [];
        
        formatData(data.Data)

        console.log(" ~ file: sym-mekkoChart.js:44 ~ myCustomDataUpdateFunction ~ dataArray", dataArray)

        if (!chart) chart = getNewChart(dataArray);
        else refreshChart(chart, dataArray);
      }
    }

    function formatData ( ...data ) {
      data[0].forEach(el => {
        dataArray.push(Object({
          total: el.Values.at(-1).Value,
          label: el.Label.split('|')[1],
        }));
      })
    }

    function getNewChart(dataArray) {
      return AmCharts.makeChart(symbolContainerDiv.id, {
        theme: "none",
        type: "serial",
        "hideCredits": true,
        dataProvider: [
          {
            label: "North America",
            trucks: 40000,
            total: 310000,
          },
          {
            label: "Asia",
            SUVs: 40000,
            total: 310000,
          },
          {
            label: "Europe",
            cars: 110000,
            total: 310000,
          },
        ],
        categoryField: "label",
        categoryAxis: {
          gridAlpha: 0.1,
          axisAlpha: 0,
          widthField: "total",
          gridPosition: "start",
        },

        valueAxes: [
          {
            // stackType: "100% stacked",
            gridAlpha: 0.1,
            // unit: "",
            axisAlpha: 0,
          },
        ],

        graphs: [
          {
            title: "Trucks",
            labelText: "[[value]]",
            valueField: "trucks",
            type: "column",
            fillAlphas: 1,
          },
          {
            title: "SUVs",
            labelText: "[[value]]",
            valueField: "SUVs",
            type: "column",
            fillAlphas: 1,
          },

          {
            title: "Cars",
            labelText: "[[value]]",
            valueField: "cars",
            type: "column",
            fillAlphas: 1,
          },
        ],
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
