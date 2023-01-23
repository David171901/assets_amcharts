/**
 * Name: tumv2
 * File name: sym-tumv2.js
 * Atribute (2 atributes): 
 *    example path: 
            "af:\\YAUMS26\BASE DE DATOS  PIAF - UM YAULI\PLANTA CONCENTRADORA VICTORIA\00 EQUIPOS CRITICOS\MOLINOS\MOLINO PRIMARIO|PARADA COMPLETA"
            "af:\\YAUMS26\BASE DE DATOS  PIAF - UM YAULI\PLANTA CONCENTRADORA VICTORIA\00 EQUIPOS CRITICOS\MOLINOS\MOLINO PRIMARIO|TIEMPO DE OPERACION TOTAL POR DIA"

 *    example data: 
            1. [
                {
                    "Value": "RE||5200||Sistema de Alimentación||6801||Trunion||120||Averías de Instrumentos||12020||Sin señal||-||0",
                    "Time": "2023-01-01T00:00:00Z"
                },
                {
                    "Value": "RP||5200||Sistema de Alimentación||2||NA||160||Actividad Operacional||16043||Adición de Barras||-||22.09553426",
                    "Time": "2023-01-01T20:49:18Z"
                },
                {
                    "Value": "RE||5200||Sistema de Alimentación||6801||Trunion||120||Averías de Instrumentos||12020||Sin señal||-||0",
                    "Time": "2023-01-02T00:00:00Z"
                },
                {
                    "Value": "RE||5200||Sistema de Alimentación||6801||Trunion||120||Averías de Instrumentos||12020||Sin señal||-||0",
                    "Time": "2023-01-03T00:00:00Z"
                }
            ]
            2. [
                {
                    "Value": 24,
                    "Time": "2023-01-01T00:00:00Z"
                },
                {
                    "Value": 23.52167510986328,
                    "Time": "2023-01-02T00:00:00Z"
                },
                {
                    "Value": 24,
                    "Time": "2023-01-03T00:00:00Z"
                },
                {
                    "Value": 23.998979568481445,
                    "Time": "2023-01-04T00:00:00Z"
                },
                {
                    "Value": 24,
                    "Time": "2023-01-05T00:00:00Z"
                },
                {
                    "Value": 23.711645126342773,
                    "Time": "2023-01-06T00:00:00Z"
                }
            ]
 * 
 */

(function (CS) {
  var myGaugeDefinition = {
    typeName: "tumv2",
    displayName: "tumv2",
    inject: ["timeProvider"],
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/TUM_COMM.png",
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        Height: 800,
        Width: 600,
        backgroundColor: "transparent",
        gridColor: "transparent",
        plotAreaFillColor: "transparent",
        decimalPlaces: 1,
        FormatType: null,
        showTitle: true,
        fontSize: 20,
        customTitle: "",
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
  symbolVis.prototype.init = function (scope, elem, timeProvider) {
    console.log("\t[+]Tum v2");
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
    var colors = [
      "#173fcf", //0
      "#34bfcf", //1
      "#34bfcf", //2
      "#34bfcf", //2
      "#08c447", //4
      "#08c447", //5
      "#7104d1", //6
      "#de0929", //7
      "#de0929", //8
      "#de0929", //9
      "#de0929", //10
      "#34bfcf", //11
    ];

    // Funcion inicializadora
    function myCustomDataUpdateFunction(data) {
      dataArray = [];
      const datainfo = getDataProvider(data);
      dataArray.push(...datainfo);

      !chart
        ? (chart = generateChart(dataArray, scope))
        : refreshChart(chart, dataArray);
    }

    function getDataProvider(data) {
      // Events - Lista de eventos
      let eventArray = data.Data[0].Values || [];
      let disponibilidad = data.Data[1].Values || [];

      // PROCESSED VARIABLES
      // Time Models Vars
      let dataFormat = timeModels(eventArray, disponibilidad);

      return dataFormat;
    }

    // Funcion parseo de datos por codigo TUM 
    function timeModels(data, disponibilidad) {
      return [
        {
          Label: "RnP:",
          Value: filterToModelTime("RnP", data),
          Color: colors[1],
          balloonText: "RnP:"
          
        },
        { 
          Label: "RP:", 
          Value: filterToModelTime("RP", data), 
          Color: colors[2],
        },
        { 
          Label: "RG:", 
          Value: filterToModelTime("RG", data), 
          Color: colors[3],
         },
        { 
          Label: "RE", 
          Value: filterToModelTime("RE", data), 
          Color: colors[4],
        },

        { Label: "RM", Value: filterToModelTime("RM", data), Color: colors[5] },
        { Label: "MP", Value: filterToModelTime("MP", data), Color: colors[6] },
        { Label: "IP", Value: filterToModelTime("IP", data), Color: colors[7] },
        { Label: "IM", Value: filterToModelTime("IM", data), Color: colors[8] },
        { Label: "IE", Value: filterToModelTime("IE", data), Color: colors[9] },
        { Label: "IO", Value: filterToModelTime("IO", data), Color: colors[10] },
        {
          Label: "TnP",
          Value: filterToModelTime("TnP", data),
          Color: colors[11],
        },
      ];
    }

    // Funcion de filtro por codigo
    function filterToModelTime(key, array) {
      return (
        array
          .filter((element, index) => element.Value.includes(key))
          .reduce(
            (previousValue, currentValue) =>
              previousValue +
              (parseInt(currentValue.Value.split("||").at(-1)) || 0),
            0
          ) / 60
      ).toFixed(2);
    }

     // Funcion refresco del grafico
    function refreshChart(chart, dataArray) {
      chart.validateData();
      chart.validateNow();
      return chart;
    }

     // Funcion configuracion del titulo
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

    // Funcion de configuracion del grafico
    function myCustomConfigurationChangeFunction() {
      if (chart) {
        // set title
        if (scope.config.showTitle) {
          chart.titles = createArrayOfChartTitles();
        }
        if (scope.config.fontSize) {
          chart.titles = createArrayOfChartTitles();
          chart.axes[0].fontSize = scope.config.fontSize;
          chart.axes[0].bottomTextFontSize = scope.config.fontSize + 10;
        }

        chart.validateData();
        chart.validateNow();
      }
    }

    // Funcion invocadora del grafico 
    function generateChart(dataArray, scope) {
      chart = AmCharts.makeChart(symbolContainerDiv1.id, {
        theme: "none",
        type: "serial",
        titles: createArrayOfChartTitles(),
        fontSize: scope.config.fontSize,
        hideCredits: true,
        startDuration: 2,
        rotate: 90,
        dataProvider: dataArray,
        balloon: {
          maxWidth: 1000,
          fontSize: scope.config.fontSize + 5,
          fillAlpha: 1,
          borderThickness: 6,
          bordercolor: "#0a0a0a",
          cornerRadius: 2,
          textAlign: "left",
          fadeOutDuration: 10,
        },
        valueAxes: [
          {
            id: "v1",
            axisAlpha: 0,
            position: "left",
            maximum: 5,
            minimum: 0,
           // labelsEnabled: false,
          },
          {
            id: "v2",
            axisAlpha: 0,
            position: "right",
            minimum: 0,
            labelsEnabled: false,
          },
        ],
        graphs: [
          {
            balloonText: "[[category]]: <b>[[value]] horas</b>",
            fillColorsField: "Color",
            fillAlphas: 1,
            lineAlpha: 0.1,
            type: "column",
            valueField: "Value",
          },
          {
            valueAxis: "v2",
            balloonText: "[[category]]: <b>[[value]] horas</b>",
            fillColorsField: "Color",
            fillAlphas: 1,
            lineAlpha: 0.1,
            type: "column",
            valueField: "Value",
            valueField: "TnP",
          },
        ],
        depth3D: 20,
        angle: 30,
        chartCursor: {
          categoryBalloonEnabled: false,
          cursorAlpha: 0,
          zoomable: false,
        },
        categoryField: "Label",
        categoryAxis: {
          gridPosition: "start",
        },
      });
      refreshChart(chart, dataArray);
      return chart;
    }
  };

  CS.symbolCatalog.register(myGaugeDefinition);
})(window.PIVisualization);
