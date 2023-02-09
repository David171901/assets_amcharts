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
      console.log(
        " ~ file: sym-parettochart.js:59 ~ myCustomDataUpdateFunction ~ data",
        data
      );
      dataArray = [];
      if (data) {
        fillDataArray(data);
        fillTitleArray(data);
        fillGraphArray(data);

        if (!chart) chart = getNewChart(dataArray, graphArray);
        else refreshChart(chart, dataArray, graphArray);
      } else {
        getNewChart(dataArray, graphArray);
      }
    }

    function fillDataArray(data) {
      let lastDate =
        timeProvider.displayTime.end != "*"
          ? new Date(timeProvider.displayTime.end)
          : new Date();
      let startDate = new Date(timeProvider.displayTime.start);
      let iterableDate = startDate;
      let daysOfMonth = getDaysOfMonth(lastDate.getMonth() + 1);
      let daysOfPreviewMonth = getDaysOfMonth(startDate.getMonth() + 1);
      let moreDays = null;

      moreDays = daysOfPreviewMonth - startDate.getDate();
      lastDate.setDate(lastDate.getDate() + 1);

      for (let dayIndex = 1; dayIndex <= daysOfMonth + moreDays; dayIndex++) {
        iterableDate.setDate(iterableDate.getDate() + 1);

        if (iterableDate.getTime() <= lastDate.getTime()) {
          // One
          let arrayValuesOne = data.Data[0].Values.filter((el) =>
            el.Time.includes(formatDate(iterableDate))
          ).map((el) => el.Value);
          arrayValuesOne = arrayValuesOne.filter((el) => el != "Calc Failed");
          let maxValueOne =
            arrayValuesOne.length > 0 ? Math.max(...arrayValuesOne) : 0;
          // Two
          let arrayValuesTwo = !data.Data[1]
            ? []
            : data.Data[1].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesTwo = arrayValuesTwo.filter((el) => el != "Calc Failed");
          let maxValueTwo = !data.Data[1]
            ? 0
            : arrayValuesTwo.length > 0
            ? Math.max(...arrayValuesTwo)
            : 0;
          // Three
          let arrayValuesThree = !data.Data[2]
            ? []
            : data.Data[2].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesThree = arrayValuesThree.filter(
            (el) => el != "Calc Failed"
          );
          let maxValueThree = !data.Data[2]
            ? 0
            : arrayValuesThree.length > 0
            ? Math.max(...arrayValuesThree)
            : 0;
          // Four
          let arrayValuesFour = !data.Data[3]
            ? []
            : data.Data[3].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesFour = arrayValuesFour.filter((el) => el != "Calc Failed");
          let maxValueFour = !data.Data[3]
            ? 0
            : arrayValuesFour.length > 0
            ? Math.max(...arrayValuesFour)
            : 0;
          // Five
          let arrayValuesFive = !data.Data[4]
            ? []
            : data.Data[4].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesFive = arrayValuesFive.filter((el) => el != "Calc Failed");
          let maxValueFive = !data.Data[4]
            ? 0
            : arrayValuesFive.length > 0
            ? Math.max(...arrayValuesFive)
            : 0;
          // Six
          let arrayValuesSix = !data.Data[5]
            ? []
            : data.Data[5].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesSix = arrayValuesSix.filter((el) => el != "Calc Failed");
          let maxValueSix = !data.Data[5]
            ? 0
            : arrayValuesSix.length > 0
            ? Math.max(...arrayValuesSix)
            : 0;
          // Seven
          let arrayValuesSeven = !data.Data[6]
            ? []
            : data.Data[6].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesSeven = arrayValuesSeven.filter(
            (el) => el != "Calc Failed"
          );
          let maxValueSeven = !data.Data[6]
            ? 0
            : arrayValuesSeven.length > 0
            ? Math.max(...arrayValuesSeven)
            : 0;
          // Eight
          let arrayValuesEight = !data.Data[7]
            ? []
            : data.Data[6].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesEight = arrayValuesEight.filter(
            (el) => el != "Calc Failed"
          );
          let maxValueEight = !data.Data[7]
            ? 0
            : arrayValuesEight.length > 0
            ? Math.max(...arrayValuesEight)
            : 0;
          // Nine
          let arrayValuesNine = !data.Data[8]
            ? []
            : data.Data[6].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesNine = arrayValuesNine.filter((el) => el != "Calc Failed");
          let maxValueNine = !data.Data[8]
            ? 0
            : arrayValuesNine.length > 0
            ? Math.max(...arrayValuesNine)
            : 0;
          // Ten
          let arrayValuesTen = !data.Data[9]
            ? []
            : data.Data[6].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesTen = arrayValuesTen.filter((el) => el != "Calc Failed");
          let maxValueTen = !data.Data[9]
            ? 0
            : arrayValuesTen.length > 0
            ? Math.max(...arrayValuesTen)
            : 0;
          // Eleven
          let arrayValuesEleven = !data.Data[10]
            ? []
            : data.Data[10].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesEleven = arrayValuesEleven.filter(
            (el) => el != "Calc Failed"
          );
          let maxValueEleven = !data.Data[10]
            ? 0
            : arrayValuesEleven.length > 0
            ? Math.max(...arrayValuesEleven)
            : 0;
          // Twelve
          let arrayValuesTwelve = !data.Data[11]
            ? []
            : data.Data[11].Values.filter((el) =>
                el.Time.includes(formatDate(iterableDate))
              ).map((el) => el.Value);
          arrayValuesTwelve = arrayValuesTwelve.filter(
            (el) => el != "Calc Failed"
          );
          let maxValueTwelve = !data.Data[11]
            ? 0
            : arrayValuesTwelve.length > 0
            ? Math.max(...arrayValuesTwelve)
            : 0;

          let newDataObject = getNewDataObject(
            formatDate(iterableDate),
            maxValueOne,
            maxValueTwo,
            maxValueThree,
            maxValueFour,
            maxValueFive,
            maxValueSix,
            maxValueSeven,
            maxValueEight,
            maxValueNine,
            maxValueTen,
            maxValueEleven,
            maxValueTwelve
          );
          dataArray.push(newDataObject);
        } else {
          let newDataObject = getNewDataObject(
            formatDate(iterableDate),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
          );
          dataArray.push(newDataObject);
        }
      }
    }

    function fillTitleArray(data) {
      titleArray = [];
      titleArray = data.Data.map((el) => el.Label.split("|")[1]);
    }

    function fillGraphArray(data) {
      graphArray = [];
      for (let index = 1; index <= data.Data.length; index++) {
        graphArray.push({
          id: `g${index}`,
          balloon: {
            drop: true,
            adjustBorderColor: false,
            color: "#ffffff",
          },
          type: "column",
          bullet: "round",
          bulletBorderAlpha: 1,
          bulletColor: "#FFFFFF",
          bulletSize: 5,
          hideBulletsCount: 50,
          lineThickness: 2,
          title: `${titleArray[index - 1]}`,
          useLineColorForBulletBorder: true,
          valueField: `value${index}`,
          balloonText: `<span style='font-size:18px;'>[[value${index}]]</span>`,
          fillAlphas: 0.8,
          lineAlpha: 0.3,
          valueAxis: "v1",
        });
      }
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

    function formatDate(date) {
      return date.toISOString().split("T")[0];
    }

    function getNewDataObject(
      date,
      value1,
      value2,
      value3,
      value4,
      value5,
      value6,
      value7,
      value8,
      value9,
      value10,
      value11,
      value12
    ) {
      return {
        date,
        value1,
        value2,
        value3,
        value4,
        value5,
        value6,
        value7,
        value8,
        value9,
        value10,
        value11,
        value12,
      };
    }

    // Funcion invocadora del grafico
    function getNewChart(dataArray, graphArray) {
      return AmCharts.makeChart(symbolContainerDiv.id, {
        type: "serial",
        theme: "none",
        categoryField: "year",
        rotate: true,
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
        dataProvider: [
          {
            year: 2005,
            income: 23.5,
            expenses: 18.1,
            bill: 18.1,
          },
          {
            year: 2006,
            income: 26.2,
            expenses: 22.8,
            bill: 26.2,
          },
          {
            year: 2007,
            income: 30.1,
            expenses: 23.9,
            bill: 0,
          },
          {
            year: 2008,
            income: 29.5,
            expenses: 25.1,
            bill: 29.5,
          },
          {
            year: 2009,
            income: 24.6,
            expenses: 25,
            bill: 0,
          },
        ],
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

        chart.legend.enabled = scope.config.showLegend;

        chart.validateData();
        chart.validateNow();
      }
    }
  };

  BS.symbolCatalog.register(definition);
})(window.PIVisualization);
