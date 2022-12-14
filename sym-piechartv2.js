(function (BS) {
  function symbolVis() {}
  BS.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: "piechartv2",
    displayName: "Diagrama circular Eventos (cantidad)",
    datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/pieCOMM.png",
    visObjectType: symbolVis,

    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        FormatType: null,
        Height: 500,
        Width: 500,
        fontSize: 22,
        textColor: "black",
        backgroundColor: "transparent",
        outlineColor: "white",
        useCustomTitle: false,
        customTitle: "",
        showLabels: true,
        showLegend: false,
        donut: false,
        labels: [],
        units: [],
        decimalPlaces: 2,
        password: "",
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
    console.log("\t[+]PieCharts v2");
    scope.config.FormatType = null;
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString = "amChart_" + scope.symbol.Name;
    symbolContainerDiv.id = newUniqueIDString;
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

    var _0x7f2a = [
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x34\x39\x37\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x4D\x4F\x4C\x49\x4E\x4F\x5F\x50\x52\x49\x4D\x41\x52\x49\x4F\x5F\x21",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x31\x33\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x4D\x4F\x4C\x49\x4E\x4F\x5F\x41\x4C\x4C\x49\x53\x5F\x43\x48\x41\x4C\x4D\x45\x52\x5F",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x31\x38\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x4D\x4F\x4C\x49\x4E\x4F\x5F\x4B\x4F\x50\x50\x45\x52\x5F",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x32\x33\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x4D\x4F\x4C\x49\x4E\x4F\x5F\x38\x58\x36\x5F",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x34\x32\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x43\x48\x41\x4E\x43\x41\x44\x4F\x52\x41\x5F\x31\x5F",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x33\x37\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x43\x48\x41\x4E\x43\x41\x44\x4F\x52\x41\x5F\x32\x5F",
      "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x69\x76\x69\x73\x69\x6F\x6E\x2E\x76\x6F\x6C\x63\x61\x6E\x2E\x63\x6F\x6D\x2E\x70\x65\x2F\x50\x49\x56\x69\x73\x69\x6F\x6E\x2F\x23\x2F\x44\x69\x73\x70\x6C\x61\x79\x73\x2F\x35\x30\x35\x33\x32\x2F\x59\x41\x55\x4C\x49\x5F\x4D\x54\x54\x4F\x5F\x43\x48\x41\x4E\x43\x41\x44\x4F\x52\x41\x5F\x33\x5F",
    ];
    var linkAllowed = [
      _0x7f2a[0],
      _0x7f2a[1],
      _0x7f2a[2],
      _0x7f2a[3],
      _0x7f2a[4],
      _0x7f2a[5],
      _0x7f2a[6],
    ];
    var _0x5b1c = ["\x43\x4F\x4D\x4D\x32\x30\x32\x30\x24"];
    var password = _0x5b1c[0];
    var chart;
    var dataArray = [];

    function myCustomDataUpdateFunction(data) {
      console.log(" ~ file: sym-piechartv2.js:89 ~ myCustomDataUpdateFunction ~ data", data)
      
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
            })
          );
        else
          sortArray.push(
            Object({
              DataType: "Float",
              Label: Labels[index],
              Time: "18/10/2022, 22:27:18",
              Value: 0,
            })
          );
      }

      data = {
        Rows: sortArray,
      };
      console.log(" ~ file: sym-piechartv2.js:120 ~ myCustomDataUpdateFunction ~ data", data)

      if (data) {
        dataArray = [];
        for (var i = 0; i < data.Rows.length; i++) {
          let item = data.Rows[i];

          let itemHasLabel = !!item.Label;

          let itemHasUnits = !!item.Units;
          if (itemHasLabel) scope.config.labels.push(item.Label.split("|")[0]);
          if (itemHasUnits) scope.config.units.push(item.Units);
          let itemTime = new Date(item.Time).toLocaleTimeString();
          let itemValue = parseFloat(
            ("" + item.Value).replace(",", "")
          ).toFixed(scope.config.decimalPlaces);

          let newDataObject = {
            Label: item.Label,
            Time: itemTime,
            Units: scope.config.units[i] || "",
            Value: itemValue,
          };
          dataArray.push(newDataObject);
        }

        if (!chart) chart = getNewChart(dataArray);
        else refreshChart(chart, dataArray);
      }
    }

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

    function getNewChart(dataArray) {
      // if (
      //   scope.config.password == password &&
      //   linkAllowed.some((el) => el.includes(window.location.href))
      // ) {
        return AmCharts.makeChart(symbolContainerDiv.id, {
          type: "pie",
          dataProvider: dataArray,
          valueField: "Value",
          titleField: "Label",
          descriptionField: "Units",
          titles: createArrayOfChartTitles(),
          balloonText: "[[title]] [[value]] ([[percents]]%)",
          labelText: "[[title]] ([[percents]]%)",
          labelsEnabled: scope.config.showLabels,
          hideCredits: true,
          color: scope.config.textColor,
          outlineColor: scope.config.outlineColor,
          outlineAlpha: 1,
          outlineThickness: 1,
          innerRadius: 0,
          fontSize: scope.config.fontSize,
          depth3D: 20,
          angle: 35,
          startEffect: "elastic",
          labelRadius: 100,
          colors: [
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
          ],
          legend: {
            enabled: scope.config.showLegend,
            color: scope.config.textColor,
            valueText: "[[value]] [[description]]",
            fontSize: scope.config.fontSize,
            align: "center",
            position: "bottom",
          },
        });
      // }

      // return AmCharts.makeChart(symbolContainerDiv.id, {
      //   type: "pie",
      //   theme: "none",
      //   dataProvider: [],
      //   valueField: "litres",
      //   titleField: "country",
      //   balloon: {
      //     fixedPosition: true,
      //   },
      // });
    }

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

    function myCustomConfigurationChangeFunction(data) {
      if (chart) {
        if (chart.fontSize !== scope.config.fontSize) {
          chart.titles = createArrayOfChartTitles();
          chart.fontSize = scope.config.fontSize;
          chart.legend.fontSize = scope.config.fontSize;
        }

        if (chart.color !== scope.config.textColor) {
          chart.color = scope.config.textColor;
          chart.legend.color = scope.config.textColor;
        }

        if (chart.backgroundColor !== scope.config.backgroundColor)
          chart.backgroundColor = scope.config.backgroundColor;
        if (chart.outlineColor !== scope.config.outlineColor)
          chart.outlineColor = scope.config.outlineColor;
        if (scope.config.useCustomTitle)
          chart.titles = createArrayOfChartTitles();
        else chart.titles = null;

        chart.labelsEnabled = scope.config.showLabels;
        chart.legend.enabled = scope.config.showLegend;

        if (scope.config.donut) chart.innerRadius = "60%";
        else chart.innerRadius = 0;

        chart.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);
