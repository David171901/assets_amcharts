(function (CS) {
  var myGaugeDefinition = {
    typeName: "gaugeChart",
    displayName: "Diagrama Gauge",
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/gaugeCOMM.png",
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        //DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
        Height: 500,
        Width: 750,
        backgroundColor: "transparent",
        gridColor: "transparent",
        plotAreaFillColor: "transparent",
        decimalPlaces: 1,
        FormatType: null,
        showTitle: true,
        fontSize: 16,
        customTitle: "",
        //color para las bandas
        bandColor1: "#CBCCCD",
        bandColor2: "#3cd3a3",
        bulletSize: 8,
      };
    },
    configOptions: function () {
      return [
        {
          title: "Editar Formato",
          mode: "format",
        },
      ];
    },
  };

  function symbolVis() {}

  CS.deriveVisualizationFromBase(symbolVis);
  symbolVis.prototype.init = function (scope, elem) {
    console.log("\t[+]Gauge Chart");
    // INIT ATRIBUTES
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    scope.config.FormatType = null;

    // DOM
    var symbolContainerDiv1 = elem.find("#container1")[0];
    var newUniqueIDString1 =
      "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv1.id = newUniqueIDString1;
    var chart;
    var dataArray = [];

    function myCustomDataUpdateFunction(data) {
      const dataInfo = getDataProvider(data);
      dataArray.push(dataInfo);
      !chart
        ? (chart = generateChart(dataArray, scope))
        : refreshChart(chart, dataArray);
    }

    function getDataProvider(data) {
      let lastValue = data.Data[0].Values.at(-1).Value;
      return lastValue;
    }

    function refreshChart(chart, dataArray) {
      var value = dataArray.at(-1);

      chart.arrows[0].setValue(value);
      chart.axes[0].setTopText(value + " %");
      chart.axes[0].bands[1].setEndValue(value);
      chart.validateData();
      chart.validateNow();
      return chart;
    }

    function createArrayOfChartTitles() {
      var titlesArray = null;
      if (scope.config.useCustomTitle) {
        titlesArray = [
          {
            text: scope.config.customTitle,
            size: scope.config.fontSize + 10,
          },
        ];
      }
      return titlesArray;
    }

    function myCustomConfigurationChangeFunction() {
      if (chart) {
        // set title
        if (scope.config.showTitle) {
          chart.titles = createArrayOfChartTitles();
        }
        if (scope.config.fontSize) {
          chart.titles = createArrayOfChartTitles();
          chart.axes[0].fontSize = scope.config.fontSize;
          chart.axes[0].bottomTextFontSize = scope.config.fontSize;
        }

        // set colors
        if (chart.axes[0].bands[0].color !== scope.config.bandColor1)
          chart.axes[0].bands[0].color = scope.config.bandColor1;
        if (chart.axes[0].bands[1].color !== scope.config.bandColor2)
          chart.axes[0].bands[1].color = scope.config.bandColor2;

        chart.validateData();
        chart.validateNow();
      }
    }

    function generateChart(dataArray, scope) {
      console.log(" ~ file: sym-gaugeChart.js:117 ~ generateChart ~ dataArray", dataArray)
      chart = AmCharts.makeChart(symbolContainerDiv1.id, {
        theme: "none",
        type: "gauge",
        hideCredits: true,
        titles: [
          {
            text: scope.config.customTitle,
            size: scope.config.fontSize + 10,
          },
        ],
        axes: [
          {
            topTextFontSize: scope.config.fontSize,
            topTextYOffset: 70,
            axisColor: "#31d6ea",
            axisThickness: 1,
            endValue: 100,
            gridInside: true,
            inside: true,
            radius: "50%",
            valueInterval: 10,
            tickColor: "#67b7dc",
            startAngle: -90,
            endAngle: 90,
            unit: "%",
            bandOutlineAlpha: 0,
            fontSize: scope.config.fontSize,
            bands: [
              {
                color: scope.config.bandColor1,
                endValue: 100,
                innerRadius: "105%",
                radius: "170%",
                startValue: 0,
              },
              {
                color: scope.config.bandColor2,
                endValue: 0,
                innerRadius: "105%",
                radius: "170%",
                startValue: 0,
              },
            ],
          },
        ],
        arrows: [
          {
            alpha: 1,
            innerRadius: "35%",
            nailRadius: 0,
            radius: "170%",
            value: dataArray.at(-1),
          },
        ],
      });

      refreshChart(chart, dataArray);
      return chart;
    }
  };

  CS.symbolCatalog.register(myGaugeDefinition);
})(window.PIVisualization);
