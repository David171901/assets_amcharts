(function (BS) {
  function symbolVis() {}
  BS.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "parettochart",
    displayName: "Diagrama Paretto",
    datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/parettoChartCOMM.png",
    visObjectType: symbolVis,

    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        FormatType: null,
        Height: 500,
        Width: 500,
        fontSize: 16,
        textColor1: "black",
        textColor2: "#000000",
        colorfill2: "#FC0000",
        backgroundColor: "transparent",
        useCustomTitle: false,
        customTitle: "",
        showLegend: false,
        decimalPlaces: 0,
        colorBar1: "#B4BABD",
        colorBar2: "#B4BABD",
        colorBar3: "#B4BABD",
        colorBar4: "#B4BABD",
        colorBar5: "#B4BABD",
        colorBar6: "#B4BABD",
        colorBar7: "#B4BABD",
        colorBar8: "#B4BABD",
        colorBar9: "#B4BABD",
        colorBar10: "#B4BABD",
        mode3D: false,
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
    console.log("\t[+]Diagrama Paretto");
    scope.config.FormatType = null;
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString = "amChart_" + scope.symbol.Name;
    symbolContainerDiv.id = newUniqueIDString;

    var chart;
    var dataArray;
    let colors = [
      scope.config.colorBar1,
      scope.config.colorBar2,
      scope.config.colorBar3,
      scope.config.colorBar4,
      scope.config.colorBar5,
      scope.config.colorBar6,
      scope.config.colorBar7,
      scope.config.colorBar8,
      scope.config.colorBar9,
      scope.config.colorBar10,
    ];

    // Funcion inicilizadora
    function myCustomDataUpdateFunction(data) {
      dataArray = [];
      if (data) {

        let accumulated;
        let accumulatedPercentage = 0;
        accumulated = data.Data.filter( el => el.Values.length > 0 ).reduce((accumulator, currentValue) => accumulator + currentValue.Values.at(-1).Value , 0);
        dataArray = data.Data.map( ( el, index ) => {
          accumulatedPercentage = accumulatedPercentage + ( (parseFloat((el.Values.length > 0) ? el.Values.at(-1).Value : 0) / accumulated) * 100 );
          return {
            Label: el.Label.split('|')[1],
            Time: el.StartTime,
            Value: (el.Values.length > 0) ? el.Values.at(-1).Value.toFixed(scope.config.decimalPlaces) : 0,
            Percent: isNaN(accumulatedPercentage) ? 0 : accumulatedPercentage.toFixed(scope.config.decimalPlaces),
            color: colors[index]
          }
        })

        if (!chart) chart = getNewChart(dataArray);
        else refreshChart(chart, dataArray);
      } else {
        getNewChart(dataArray)
      }
    }

    // Funcion invocadora del grafico 
    function getNewChart(dataArray) {
        return AmCharts.makeChart(symbolContainerDiv.id, {
          type: "serial",
          titles: createArrayOfChartTitles(),
          hideCredits: true,
          colors: ["", scope.config.colorfill2],
          dataProvider: dataArray,
          color: scope.config.textColor1,
          depth3D: (scope.config.mode3D) ? 20 : 0,
          angle: 35,
          valueAxes: [
            {
              id: "v1",
              axisAlpha: 0,
              position: "left",
              step: 2,
            },
            {
              id: "v2",
              axisAlpha: 0,
              position: "right",
              unit: "%",
              gridAlpha: 0,
              maximum: 100,
              minimum: 0,
            },
          ],
          startDuration: 1,
          graphs: [
            {
              fillAlphas: 1,
              fillColorsField: "color",
              title: "Value",
              type: "column",
              valueField: "Value",
              labelText: "[[Value]]",
              fontSize: scope.config.fontSize,
              balloonText: "[[Label]]:[[Value]]",
            },
            {
              valueAxis: "v2",
              bullet: "round",
              lineThickness: 3,
              bulletSize: 7,
              bulletBorderAlpha: 1,
              bulletColor: "#FFFFFF",
              useLineColorForBulletBorder: true,
              fillAlphas: 0,
              lineAlpha: 1,
              title: "Percent",
              valueField: "Percent",
              labelText: "[[Percent]]%",
              fontSize: scope.config.fontSize,
              balloonText: "[[Label]]:[[Percent]]%",
              precision: scope.config.decimalPlaces,
              labelPosition: "bottom",
              color: scope.config.textColor2,
            },
          ],
          categoryField: "Label",
          categoryAxis: {
            gridPosition: "start",
            axisAlpha: 0,
            tickLength: 0,
          },
          legend: {
            enabled: scope.config.showLegend,
            align: "center",
            position: "bottom",
            color: scope.config.textColor1,
            fontSize: scope.config.fontSize,
            labelHeight: 150,
          },
        });
    }

    // Funcion refresco del grafico 
    function refreshChart(chart, dataArray) {
      chart.titles = createArrayOfChartTitles();
      chart.dataProvider = dataArray;
      chart.validateData();
      chart.validateNow();
    }

    function createArrayOfChartTitles() {
      var titlesArray;
      if (scope.config.useCustomTitle) {
        titlesArray = [
          {
            text: scope.config.customTitle,
            size: scope.config.fontSize + 5,
          },
        ];
      }
      return titlesArray;
    }

    // Funcion de configuracion de estilos
    function myCustomConfigurationChangeFunction(data) {
      if (chart) {
        if (chart.fontSize !== scope.config.fontSize) {
          chart.titles = createArrayOfChartTitles();
          chart.fontSize = scope.config.fontSize;
          chart.graphs[0].fontSize = scope.config.fontSize;
          chart.graphs[1].fontSize = scope.config.fontSize;
          chart.legend.fontSize = scope.config.fontSize;
        }

        if (chart.graphs[1].precision != scope.config.decimalPlaces) {
          chart.graphs[1].precision = scope.config.decimalPlaces;
        }

        if (chart.graphs[0].color !== scope.config.textColor1) {
          chart.graphs[0].color = scope.config.textColor1;
          chart.legend.color = scope.config.textColor1;
        }

        if (chart.graphs[1].color !== scope.config.textColor2) {
          chart.graphs[1].color = scope.config.textColor2;
        }

        if (chart.colors[1] != scope.config.colorfill2) {
          chart.colors[1] = scope.config.colorfill2;
        }

        if (scope.config.useCustomTitle)
          chart.titles = createArrayOfChartTitles();
        else chart.titles = null;

        chart.legend.enabled = scope.config.showLegend;

        chart.depth3D = (scope.config.mode3D) ? 20 : 0;

        chart.validateData();
        chart.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);