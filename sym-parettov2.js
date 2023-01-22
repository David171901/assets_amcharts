/**
 * Name: Diagrama Paretto (cantidad)
 * File name: sym-parettov2.js
 * Atribute (1 atribute): 
 *    example path: "af:\\YAUMS26\BASE DE DATOS  PIAF - UM YAULI\PLANTA CONCENTRADORA VICTORIA\00 EQUIPOS CRITICOS\MOLINOS\MOLINO PRIMARIO|TIEMPO COMPLETO 2"
 *    example data: [
          {
              "Value": "Mantenimiento Planificado||Inspección programada||25.7852816266667",
              "Time": "2022-12-23T02:59:46Z"
          },
          {
              "Value": "Influencia Externa||Paro externo||24.803918965",
              "Time": "2022-12-24T14:16:25Z"
          },
          {
              "Value": "Averías de Instrumentos||Sin señal||18.0991142266667",
              "Time": "2022-12-28T14:09:15Z"
          },
          {
              "Value": "Actividad Operacional||Adición de Barras||22.09553426",
              "Time": "2023-01-01T20:49:18Z"
          }
      ]
 * 
 */

(function (BS) {
  function symbolVis() {}
  BS.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "parettov2",
    displayName: "Diagrama Paretto (cantidad)",
    datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/parettoCOMM.png",
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
    console.log("\t[+]Diagrama Paretto (cantidad)");
    scope.config.FormatType = null;
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString = "amChart_" + scope.symbol.Name;
    symbolContainerDiv.id = newUniqueIDString;

    var symbolContainerA = elem.find("#href")[0];
    var newUniqueIDStringA = "a_" + scope.symbol.Name;
    symbolContainerA.id = newUniqueIDStringA;

    var Labels = [
      "Actividad Operacional",
      "Averias de Instrumentos",
      "Averias Electricas",
      "Averias Mecanicas",
      "Funcionamiento",
      "Influencia Externa",
      "Mantenimiento Planificado",
      "Otros",
      "Seguridad",
      "Stand By",
    ];
    let colors = [
      "#2471A3",
      "#17A589",
      "#D4AC0D",
      "#CA6F1E",
      "#884EA0",
      "#1BD2D8",
      "#2E4053",
      "#685858",
      "#839192",
      "#D0D3D4",
    ];
    var _0x7410 = [
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x30\x32\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x4D\x4F\x4C\x49\x4E\x4F\x5F\x50\x52\x49\x4D\x41\x52\x49\x4F\x5F\x34",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x31\x36\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x4D\x4F\x4C\x49\x4E\x4F\x5F\x41\x4C\x4C\x49\x53\x5F\x43\x48\x41\x4C\x4D\x45\x52\x5F\x34",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x32\x37\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x4D\x4F\x4C\x49\x4E\x4F\x5F\x38\x58\x36\x5F\x34",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x32\x31\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x4D\x4F\x4C\x49\x4E\x4F\x5F\x4B\x4F\x50\x50\x45\x52\x5F\x34",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x34\x35\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x43\x48\x41\x4E\x43\x41\x44\x4F\x52\x41\x5F\x31\x5F\x34",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x34\x30\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x43\x48\x41\x4E\x43\x41\x44\x4F\x52\x41\x5F\x32\x5F\x34",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x33\x35\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x43\x48\x41\x4E\x43\x41\x44\x4F\x52\x41\x5F\x33\x5F\x34",
    ];
    var linkAllowed = [
      _0x7410[0],
      _0x7410[1],
      _0x7410[2],
      _0x7410[3],
      _0x7410[4],
      _0x7410[5],
      _0x7410[6],
    ];
    var _0x5b1c = ["\x43\x4F\x4D\x4D\x32\x30\x32\x30\x24"];
    var password = _0x5b1c[0];
    var chart;
    var dataArray = [];

    // Funcion inicilizadora
    function myCustomDataUpdateFunction(data) {
      let var1 = $(`#${symbolContainerA.id}`);
      var1.attr("href", scope.config.href);

      let dataFormat = data.Data[0].Values.filter((el) => {
        return !el.Time.includes("T00:00:00Z");
      });
      let arrayFormat = countTypesFailures(dataFormat);

      let sortArray = [];
      for (let index = 0; index < Labels.length; index++) {
        let filterArray = arrayFormat.filter((elem) => {
          return elem.Label.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(Labels[index]);
        });
        if (filterArray.length > 0)
          sortArray.push(
            Object({
              ...filterArray[0],
              Colors: colors[index],
            })
          );
        else
          sortArray.push(
            Object({
              DataType: "Float",
              Label: Labels[index],
              Time: "18/10/2022, 22:27:18",
              Value: 0,
              Colors: colors[index],
            })
          );
      }

      data = {
        Rows: sortArray,
      };
      if (data) {
        dataArray = [];
        let items = data.Rows;
        items = items.map((element) => {
          return {
            ...element,
            val: parseInt(element.Value),
          };
        });
        items = items.sort((a, b) => {
          return parseInt(b.val) - parseInt(a.val);
        });
        let sum = items.reduce(
          (previousValue, currentValue) =>
            previousValue + parseInt(currentValue.Value),
          0
        );
        let accumulated_average = 0;

        for (var i = 0; i < items.length; i++) {
          if (!i == 0)
            accumulated_average += (parseInt(items[i - 1].Value) / sum) * 100;
          let item = items[i];

          let itemHasLabel = !!item.Label;

          if (itemHasLabel) scope.config.labels.push(item.Label.split("|")[0]);
          let itemTime = new Date(item.Time).toLocaleTimeString();
          let itemValue = parseFloat(
            ("" + item.Value).replace(",", "")
          ).toFixed(0);
          let percent = parseFloat(
            (
              accumulated_average +
              parseFloat(
                ((item.Value / sum) * 100).toFixed(scope.config.decimalPlaces)
              )
            ).toFixed(scope.config.decimalPlaces)
          );

          let newDataObject = {
            Label: item.Label || "",
            Time: itemTime,
            Value: itemValue,
            percent: percent,
            color: item.Colors,
          };
          dataArray.push(newDataObject);
        }

        if (!chart) chart = getNewChart(dataArray);
        else refreshChart(chart, dataArray);
      }
    }

    // Funcion parseo de datos
    /**
     * 
     * input: [
          {
              "Value": "Averías Eléctricas||Baja RPM||32.6883740733333",
              "Time": "2022-12-20T14:39:18Z"
          },
          {
              "Value": "Funcionamiento||En Operación||43.065720875",
              "Time": "2022-12-20T15:15:04Z"
          },
          {
              "Value": "Mantenimiento Planificado||Inspección programada||25.7852816266667",
              "Time": "2022-12-23T02:59:46Z"
          },
          {
              "Value": "Influencia Externa||Paro externo||24.803918965",
              "Time": "2022-12-24T14:16:25Z"
          },
          {
              "Value": "Averías de Instrumentos||Sin señal||18.0991142266667",
              "Time": "2022-12-28T14:09:15Z"
          },
          {
              "Value": "Actividad Operacional||Adición de Barras||22.09553426",
              "Time": "2023-01-01T20:49:18Z"
          }
      ]
     * output: [
          {
              "Label": "Averías Eléctricas",
              "Value": 1,
              "DataType": "Float",
              "Time": "22/1/2023, 16:04:50"
          },
          {
              "Label": "Funcionamiento",
              "Value": 1,
              "DataType": "Float",
              "Time": "22/1/2023, 16:04:50"
          },
          {
              "Label": "Mantenimiento Planificado",
              "Value": 1,
              "DataType": "Float",
              "Time": "22/1/2023, 16:04:50"
          },
          {
              "Label": "Influencia Externa",
              "Value": 1,
              "DataType": "Float",
              "Time": "22/1/2023, 16:04:50"
          },
          {
              "Label": "Averías de Instrumentos",
              "Value": 1,
              "DataType": "Float",
              "Time": "22/1/2023, 16:04:50"
          },
          {
              "Label": "Actividad Operacional",
              "Value": 1,
              "DataType": "Float",
              "Time": "22/1/2023, 16:04:50"
          }
      ]
     * 
     */
    function countTypesFailures(data) {
      let array = data.map((el) => el.Value.split("||")[0]);
      let arrayLabel = [...new Set(data.map((el) => el.Value.split("||")[0]))];
      let dataArray = [];
      arrayLabel.forEach((element) => {
        let count = 0;
        for (let index = 0; index < array.length; index++) {
          element == array[index] ? (count = count + 1) : (count = count + 0);
        }
        dataArray.push({
          Label: element,
          Value: count,
          DataType: "Float",
          Time: new Date().toLocaleString(),
        });
      });

      return dataArray;
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
          depth3D: 20,
          angle: 35,
          valueAxes: [
            {
              id: "v1",
              axisAlpha: 0,
              position: "left",
              step: 2,
              labelsEnabled: false,
              title: "Cantidad ( Ocurrencia )",
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
              fontSize: scope.config.fontSize + 10,
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
              valueField: "percent",
              labelText: "[[percent]]%",
              fontSize: scope.config.fontSize + 10,
              balloonText: "[[Label]]:[[percent]]%",
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
          chart.graphs[0].fontSize = scope.config.fontSize + 10;
          chart.graphs[1].fontSize = scope.config.fontSize + 10;
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

        if (chart.backgroundColor !== scope.config.backgroundColor)
          chart.backgroundColor = scope.config.backgroundColor;

        if (scope.config.useCustomTitle)
          chart.titles = createArrayOfChartTitles();
        else chart.titles = null;

        chart.legend.enabled = scope.config.showLegend;

        chart.validateData();
        chart.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);
