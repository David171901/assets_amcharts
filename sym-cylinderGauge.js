/**
 * Name: Cylinder Gauge
 * File name: sym-cylinderGauge.js
 * Atribute (1 atribute): 
 *    example path: 
         "af:\\\\YAUMS26\\BASE DE DATOS  PIAF - UM YAULI\\PLANTA CONCENTRADORA VICTORIA\\00 EQUIPOS CRITICOS\\MOLINOS\\MOLINO PRIMARIO|DISPONIBILIDAD GUARDIA DIA (A)"
          "af:\\\\YAUMS26\\BASE DE DATOS  PIAF - UM YAULI\\PLANTA CONCENTRADORA VICTORIA\\00 EQUIPOS CRITICOS\\MOLINOS\\MOLINO PRIMARIO|DISPONIBILIDAD REAL GUARDIA DIAN (A)"
 *    example data: 
          1. [
              {
                  "Value": 100,
                  "Time": "2023-01-01T00:00:00Z"
              },
              {
                  "Value": 96.01396942138672,
                  "Time": "2023-01-02T00:00:00Z"
              },
              {
                  "Value": 100,
                  "Time": "2023-01-03T00:00:00Z"
              },
              {
                  "Value": 100,
                  "Time": "2023-01-04T00:00:00Z"
              }
          ]

          2. [
                .
                .
                .
                {
                    "Value": 96.8391953,
                    "Time": "2023-01-22T21:00:00Z"
                },
                {
                    "Value": 96.95208,
                    "Time": "2023-01-22T21:20:00Z"
                },
                {
                    "Value": 97.05718,
                    "Time": "2023-01-22T21:40:00Z"
                },
                {
                    "Value": 97.15527,
                    "Time": "2023-01-22T22:00:00Z"
                },
                {
                    "Value": 97.24704,
                    "Time": "2023-01-22T22:20:00Z"
                },
                {
                    "Value": 97.33307,
                    "Time": "2023-01-22T22:40:00Z"
                },
                {
                    "Value": 97.41389,
                    "Time": "2023-01-22T23:00:00Z"
                },
                {
                    "Value": 97.48995,
                    "Time": "2023-01-22T23:20:00Z"
                }
            ]

 * 
 */

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
        customTitle: "",
        customTitle1: "",
        customTitle2: "",
        colorChart1: "#0EE1BE",
        colorChart2: "#0EE1BE",
        decimalPlaces: 0,
        fontSize: 12,
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
    var newUniqueIDString1 =
      "amChart_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv1.id = newUniqueIDString1;

    var symbolContainerDiv2 = elem.find("#container2")[0];
    var newUniqueIDString2 =
      "amChart_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv2.id = newUniqueIDString2;

    var chart;
    var dataArray = [];
    var dataNumber;

    // Funcion inicializadora
    function myCustomDataUpdateFunction(data) {
      console.log(" ~ file: sym-cylinderGauge.js:55 ~ myCustomDataUpdateFunction ~ data", data)
      scope.customTitle = scope.customTitle;
      if (data) {
        let static = data.Data[0];
        let real = data.Data[1];

        let realValue = getRealValue(real);
        let staticValue = getStaticValue(static);
        dataNumber = realValue;
        dataArray = [...staticValue];

        if (!chart) chart = getNewChart(dataArray, dataNumber);
        else refreshChart(chart, dataArray, dataNumber);
      }
    }

    // Funcion obtener ultimo valor real
    function getRealValue(data) {
      let Value = data.Values.at(-1).Value.toFixed(scope.config.decimalPlaces);
      return Value;
    }

    // Funcion creacion de titulos
    function createArrayOfChartTitles(typeChart) {
      var titlesArray;

      switch (typeChart) {
        case 'cylinder':
          if (scope.config.useCustomTitle1) {
            titlesArray = [
              {
                text: scope.config.customTitle1,
                size: scope.config.fontSize,
              },
            ];
          }
          return titlesArray;

          break;
        case 'line':
          if (scope.config.useCustomTitle2) {
            titlesArray = [
              {
                text: scope.config.customTitle2,
                size: scope.config.fontSize,
              },
            ];
          }
          return titlesArray;  

          break;
      
        default:
          break;
      }
    }

    // Funcion parseo valores estaticos
    function getStaticValue(data) {
      let Values = data.Values;
      let array = Values.map((elem) =>
        Object({
          value: elem.Value.toFixed(scope.config.decimalPlaces),
          date: elem.Time.split("T")[0].replace("2023-", ""),
        })
      );

      return array;
    }

    // Funcion creacion de grafico
    function getNewChart(dataArray, dataNumber) {
      var chartCylinderGauge = AmCharts.makeChart(symbolContainerDiv1.id, {
        type: "serial",
        depth3D: 100,
        angle: 30,
        titles: createArrayOfChartTitles('cylinder'),
        hideCredits: true,
        fontSize: scope.config.fontSize,
        dataProvider: [
          {
            category: "Wine left in the barrel",
            value1: dataNumber,
            value2: 100 - dataNumber,
          },
        ],
        valueAxes: [
          {
            stackType: "100%",
            gridAlpha: 0,
          },
        ],
        graphs: [
          {
            type: "column",
            topRadius: 1,
            columnWidth: 1,
            showOnAxis: true,
            lineThickness: 2,
            lineAlpha: 0.5,
            lineColor: "#FFFFFF",
            fillColors: scope.config.colorChart1,
            fillAlphas: 0.8,
            valueField: "value1",
          },
          {
            type: "column",
            topRadius: 1,
            columnWidth: 1,
            showOnAxis: true,
            lineThickness: 2,
            lineAlpha: 0.5,
            lineColor: "#cdcdcd",
            fillColors: "#cdcdcd",
            fillAlphas: 0.5,
            valueField: "value2",
          },
        ],
        categoryField: "category",
        categoryAxis: {
          axisAlpha: 0,
          labelOffset: 40,
          gridAlpha: 0,
        },
      });

      var chartLineBase = AmCharts.makeChart(symbolContainerDiv2.id, {
        type: "serial",
        theme: "none",
        marginRight: 40,
        marginLeft: 40,
        hideCredits: true,
        titles: createArrayOfChartTitles('line'),
        autoMarginOffset: 20,
        fontSize: scope.config.fontSize,
        valueAxes: [
          {
            id: "v1",
            axisAlpha: 0,
            position: "left",
            ignoreAxisWidth: true,
          },
        ],
        balloon: {
          borderThickness: 1,
          shadowAlpha: 0,
        },
        graphs: [
          {
            id: "g1",
            balloon: {
              drop: true,
              adjustBorderColor: false,
              color: "#ffffff",
            },
            bullet: "round",
            bulletBorderAlpha: 1,
            bulletColor: "#FFFFFF",
            lineColor: scope.config.colorChart2,
            bulletSize: 5,
            hideBulletsCount: 50,
            lineThickness: 2,
            title: "red line",
            useLineColorForBulletBorder: true,
            valueField: "value",
            balloonText: "<span style='font-size:18px;'>[[value]]</span>",
          },
        ],
        categoryField: "date",
        dataProvider: dataArray,
      });
      let amchart = { chartCylinderGauge, chartLineBase };
      refreshChart(amchart, dataArray, dataNumber);
      return { chartCylinderGauge, chartLineBase };
    }

    // Funcion refresco de la grafica
    function refreshChart(chart, dataArray, dataNumber) {
      let { chartCylinderGauge, chartLineBase } = chart;

      if (chartCylinderGauge) {
        chartCylinderGauge.titles = createArrayOfChartTitles('cylinder');
        chartCylinderGauge.dataProvider = [
          {
            category: "Wine left in the barrel",
            value1: dataNumber,
            value2: 100 - dataNumber,
          },
        ];
        chartCylinderGauge.validateData();
        chartCylinderGauge.validateNow();
      }

      if (chartLineBase) {
        chartLineBase.title = createArrayOfChartTitles('line');

        chartLineBase.dataProvider = dataArray;

        chartLineBase.validateData();
        chartLineBase.validateNow();
      }
    }

    // Funcion configuracion de la grafica
    function myCustomConfigurationChangeFunction(data) {
      if (chart) {
        let { chartCylinderGauge, chartLineBase } = chart;

        // chartCylinderGauge
        -
        j
        chartCylinderGauge.titles = createArrayOfChartTitles('cylinder');
        
        // chartLineBase
        chartLineBase.graphs[0].lineColor = scope.config.colorChart2;
        chartLineBase.titles = createArrayOfChartTitles('line');

        if (chart.fontSize !== scope.config.fontSize) {
          chartCylinderGauge.fontSize = scope.config.fontSize;
          chartLineBase.fontSize = scope.config.fontSize;
        }

        chartCylinderGauge.validateNow();
        chartLineBase.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);
