(function (BS) {
  function symbolVis() {}
  BS.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "multibarschart",
    displayName: "Grafico de barras agrupadas",
    inject: ["timeProvider"],
    datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/barsVerticalCOMM.png",
    visObjectType: symbolVis,

    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        FormatType: null,
        Height: 500,
        Width: 500,
        fontSize: 22,
        textColor1: "black",
        textColor2: "#000000",
        colorfill2: "#FC0000",
        backgroundColor: "transparent",
        outlineColor: "white",
        useCustomTitle: false,
        customTitle: "",
        showLegend: false,
        fontSizeInside: 12,
        labels: [],
        units: [],
        decimalPlaces: 0,
        href: "",
        rotate: false,
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

  symbolVis.prototype.init = function (scope, elem, timeProvider) {
    console.log("\t[+]Diagrama Paretto");
    scope.config.FormatType = null;
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString = "amChart_" + scope.symbol.Name;
    symbolContainerDiv.id = newUniqueIDString;

    var chart;
    var dataArray;
    var graphArray;
    var titleArray;

    // Funcion inicilizadora
    function myCustomDataUpdateFunction(data) {

      data = {
        "Data": [
            {
                "Values": [
                    {
                        "Value": "25||50||75",
                        "Time": "2023-01-31T09:27:29Z"
                    },
                    {
                        "Value": "25||50||75",
                        "Time": "2023-01-31T13:49:32Z"
                    },
                    {
                        "Value": "25||50||75",
                        "Time": "2023-01-31T14:49:14Z"
                    },
                    {
                        "Value": "25||50||75",
                        "Time": "2023-01-31T14:52:44Z"
                    }
                ],
                "StartTime": "2023-01-29T00:00:00Z",
                "EndTime": "2023-02-10T15:30:39.325Z",
                "Minimum": 0,
                "Maximum": 100,
                "DisplayDigits": -5,
                "Label": "Test POSTMAN|potencia1",
                "Path": "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\Test POSTMAN|potencia1",
                "Units": "kilowatts",
                "DataType": "Float"
            },
            {
                "Values": [
                    {
                        "Value": "75||50||25",
                        "Time": "2023-01-31T09:27:29Z"
                    },
                    {
                        "Value": "75||50||25",
                        "Time": "2023-01-31T13:49:32Z"
                    },
                    {
                        "Value": "75||50||25",
                        "Time": "2023-01-31T14:49:14Z"
                    },
                    {
                        "Value": "75||50||25",
                        "Time": "2023-01-31T14:52:44Z"
                    }
                ],
                "StartTime": "2023-01-29T00:00:00Z",
                "EndTime": "2023-02-10T15:30:39.325Z",
                "Minimum": 0,
                "Maximum": 0,
                "DisplayDigits": -5,
                "Label": "Test POSTMAN|potenciaalcuadrado",
                "Path": "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\Test POSTMAN|potenciaalcuadrado",
                "DataType": "Float"
            },
            {
              "Values": [
                  {
                      "Value": "25||50||75",
                      "Time": "2023-01-31T09:27:29Z"
                  },
                  {
                      "Value": "25||50||75",
                      "Time": "2023-01-31T13:49:32Z"
                  },
                  {
                      "Value": "25||50||75",
                      "Time": "2023-01-31T14:49:14Z"
                  },
                  {
                      "Value": "25||50||75",
                      "Time": "2023-01-31T14:52:44Z"
                  }
              ],
              "StartTime": "2023-01-29T00:00:00Z",
              "EndTime": "2023-02-10T15:30:39.325Z",
              "Minimum": 0,
              "Maximum": 100,
              "DisplayDigits": -5,
              "Label": "Test POSTMAN|potencia1",
              "Path": "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\Test POSTMAN|potencia1",
              "Units": "kilowatts",
              "DataType": "Float"
          },
          {
              "Values": [
                  {
                      "Value": "75||50||25",
                      "Time": "2023-01-31T09:27:29Z"
                  },
                  {
                      "Value": "75||50||25",
                      "Time": "2023-01-31T13:49:32Z"
                  },
                  {
                      "Value": "75||50||25",
                      "Time": "2023-01-31T14:49:14Z"
                  },
                  {
                      "Value": "75||50||25",
                      "Time": "2023-01-31T14:52:44Z"
                  }
              ],
              "StartTime": "2023-01-29T00:00:00Z",
              "EndTime": "2023-02-10T15:30:39.325Z",
              "Minimum": 0,
              "Maximum": 0,
              "DisplayDigits": -5,
              "Label": "Test POSTMAN|potenciaalcuadrado",
              "Path": "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\Test POSTMAN|potenciaalcuadrado",
              "DataType": "Float"
          },
          {
            "Values": [
                {
                    "Value": "25||50||75",
                    "Time": "2023-01-31T09:27:29Z"
                },
                {
                    "Value": "25||50||75",
                    "Time": "2023-01-31T13:49:32Z"
                },
                {
                    "Value": "25||50||75",
                    "Time": "2023-01-31T14:49:14Z"
                },
                {
                    "Value": "25||50||75",
                    "Time": "2023-01-31T14:52:44Z"
                }
            ],
            "StartTime": "2023-01-29T00:00:00Z",
            "EndTime": "2023-02-10T15:30:39.325Z",
            "Minimum": 0,
            "Maximum": 100,
            "DisplayDigits": -5,
            "Label": "Test POSTMAN|potencia1",
            "Path": "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\Test POSTMAN|potencia1",
            "Units": "kilowatts",
            "DataType": "Float"
        },
        {
            "Values": [
                {
                    "Value": "75||50||25",
                    "Time": "2023-01-31T09:27:29Z"
                },
                {
                    "Value": "75||50||25",
                    "Time": "2023-01-31T13:49:32Z"
                },
                {
                    "Value": "75||50||25",
                    "Time": "2023-01-31T14:49:14Z"
                },
                {
                    "Value": "75||50||25",
                    "Time": "2023-01-31T14:52:44Z"
                }
            ],
            "StartTime": "2023-01-29T00:00:00Z",
            "EndTime": "2023-02-10T15:30:39.325Z",
            "Minimum": 0,
            "Maximum": 0,
            "DisplayDigits": -5,
            "Label": "Test POSTMAN|potenciaalcuadrado",
            "Path": "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\Test POSTMAN|potenciaalcuadrado",
            "DataType": "Float"
        }
      ],
      "SymbolName": "Symbol6"
    }

      console.log(
        " ~ file: sym-parettochart.js:59 ~ myCustomDataUpdateFunction ~ data",
        data
      );
      dataArray = [];
      if (data) {
        fillTitleArray(data);
        fillDataArray(data);
        // fillGraphArray(data);
        console.log(" ~ file: sym-multibarschart.js:132 ~ myCustomDataUpdateFunction ~ dataArray", dataArray)
        console.log(" ~ file: sym-multibarschart.js:132 ~ myCustomDataUpdateFunction ~ titleArray", titleArray)
        if (!chart) chart = getNewChart(dataArray, graphArray);
        else refreshChart(chart, dataArray, graphArray);
      } else {
        getNewChart(dataArray, graphArray);
      }
    }

    function fillDataArray(data) {
      for (let index = 0; index < data.Data.length; index++) {
        const values = data.Data[index].Values.at(-1).Value;
        let newDataObject = getNewDataObject(values, index);
        dataArray.push(newDataObject);
      }
    }

    function getNewDataObject( values,index ) {
      return  {
        label: titleArray[index],
        income: values.split('||')[0],
        expenses: values.split('||')[1],
        bill: values.split('||')[2],
      }
    }

    function fillTitleArray(data) {
      titleArray = [];
      titleArray = data.Data.map((el) => el.Label.split("|")[1]);
    }

    function getDaysOfMonth(numMonth, numYear) {
      let daysOfMonth = 31;
      numMonth = parseInt(numMonth);
      numYear = parseInt(numYear);
      if (numMonth == 4 || numMonth == 6 || numMonth == 9 || numMonth == 11) {
        daysOfMonth = 30;
      }
      if (numMonth == 2) {
        daysOfMonth = 28;
        if (numYear % 4 == 0) {
          daysOfMonth = 29;
        }
      }
      return daysOfMonth;
    }

    // Funcion invocadora del grafico
    function getNewChart(dataArray, graphArray) {
      return AmCharts.makeChart(symbolContainerDiv.id, {
        type: "serial",
        theme: "none",
        categoryField: "label",
        rotate: scope.config.rotate,
        startDuration: 1,
        categoryAxis: {
          gridPosition: "start",
          position: "left",
        },
        trendLines: [],
        graphs: [
          {
            balloonText: "Income:[[value]]",
            fillAlphas: 0.8,
            id: "AmGraph-1",
            lineAlpha: 0.2,
            title: "Income",
            type: "column",
            valueField: "income",
          },
          {
            balloonText: "Expenses:[[value]]",
            fillAlphas: 0.8,
            id: "AmGraph-2",
            lineAlpha: 0.2,
            title: "Expenses",
            type: "column",
            valueField: "expenses",
          },
          {
            balloonText: "Bill:[[value]]",
            fillAlphas: 0.8,
            id: "AmGraph-3",
            lineAlpha: 0.2,
            title: "Bill",
            type: "column",
            valueField: "bill",
          },
        ],
        guides: [],
        valueAxes: [
          {
            id: "ValueAxis-1",
            position: "top",
            axisAlpha: 0,
          },
        ],
        allLabels: [],
        balloon: {},
        titles: [],
        dataProvider: dataArray,
      });
    }

    // Funcion refresco del grafico
    function refreshChart(chart, dataArray, graphArray) {
      // chart.titles = createArrayOfChartTitles();
      // chart.dataProvider = dataArray;
      // chart.graphs = graphArray;
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


        // if (chart.fontSize !== scope.config.fontSize) {
        // chart.titles = createArrayOfChartTitles();
        // chart.fontSize = scope.config.fontSize;
        // chart.graphs[0].fontSize = scope.config.fontSize + 10;
        // chart.graphs[1].fontSize = scope.config.fontSize + 10;
        // chart.legend.fontSize = scope.config.fontSize;
        // }

        // if (chart.graphs[1].precision != scope.config.decimalPlaces) {
        //   chart.graphs[1].precision = scope.config.decimalPlaces;
        // }

        // if (chart.graphs[0].color !== scope.config.textColor1) {
        //   chart.graphs[0].color = scope.config.textColor1;
        //   chart.legend.color = scope.config.textColor1;
        // }

        // if (chart.graphs[1].color !== scope.config.textColor2) {
        //   chart.graphs[1].color = scope.config.textColor2;
        // }

        // if (chart.colors[1] != scope.config.colorfill2) {
        //   chart.colors[1] = scope.config.colorfill2;
        // }

        // if (chart.backgroundColor !== scope.config.backgroundColor)
        //   chart.backgroundColor = scope.config.backgroundColor;

        if (scope.config.useCustomTitle)
          chart.titles = createArrayOfChartTitles();
        else chart.titles = null;

        if(scope.config.rotate) chart.rotate = scope.config.rotate;
        else chart.rotate = scope.config.rotate;

        chart.legend.enabled = scope.config.showLegend;

        chart.validateData();
        chart.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);
