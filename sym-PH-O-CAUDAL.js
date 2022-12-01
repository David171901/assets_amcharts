(function (CS) {
  //"use strict";
  var myEDcolumnDefinition = {
    typeName: "PH-O-CAUDAL",
    displayName: "PH (Estaciones Hidrometricas)",
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/PH_COMM.png",
    visObjectType: symbolVis,
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
        Height: 600,
        Width: 1600,
        Intervals: 1000,
        decimalPlaces: 0,
        textColor: "black",
        backgroundColor: "transparent",
        gridColor: "transparent",
        plotAreaFillColor: "transparent",
        showTitle: false,
        showValues: true,
        fontSize: 12,
        FormatType: null,
        seriesColor1: "#ffc90e",
        lineColor1: "#00a2e8",
        lineColor2: "#ff0000",
        showLegend: true,
        showChartScrollBar: false,
        legendPosition: "bottom",
        bulletSize: 8,
        customTitle: "",
        typegraphs: "line",
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
    console.log("\t[+] vertientes > ");
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    scope.config.FormatType = null;

    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString =
      "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv.id = newUniqueIDString;

    var listStations = elem.find("#selectStation")[0];
    var newUniqueIDStringDays =
      "listStations" + Math.random().toString(36).substr(2, 16);
    listStations.id = newUniqueIDStringDays;

    var chart = false;
    var dataArray = [];

    const insertRows = (rowToPut, cellulla, classToPut) => {
      let count = 0;
      rowToPut.forEach((element) => {
        count == 0
          ? (cellulla.innerHTML += `<option id="${element}" value="${count}"  selected =selected >${element}</option>`)
          : (cellulla.innerHTML += `<option id="${element}" value="${count}">${element}</option>`);
        cellulla.className = classToPut;
        count += 2;
      });
    };

    var stationsFlow = [];
    var isFirstLoad = true;

    function myCustomDataUpdateFunction(data) {
      if (isFirstLoad) {
        data.Data.forEach((element) => {
          stationsFlow.push(element.Label.split("|")[0]);
        });

        stationsFlow = new Set(stationsFlow);
        let headersRow = listStations;
        insertRows(
          stationsFlow,
          headersRow,
          "mttoCellClass mttoHeaderCellClass"
        );

        isFirstLoad = false;
      }

      if (data !== null && data.Data) {
        dataArray = [];

        let init = parseFloat(
          listStations.options[listStations.selectedIndex].value
        );
        let stationName = listStations.options[listStations.selectedIndex].text;

        if (chart) {
          if (stationName == "AS22" || stationName == "AS17" || stationName == "V-1" ) {
            chart.trendLines[0].initialValue = 6.5;
            chart.trendLines[1].initialValue = 8.5;
            chart.trendLines[0].finalValue = 6.5;
            chart.trendLines[1].finalValue = 8.5;
          } else if (stationName == "EM-521" || stationName == "MA-09" || stationName == "MA-19" || stationName == "MA-04") {
            chart.trendLines[0].initialValue = 6;
            chart.trendLines[1].initialValue = 9;
            chart.trendLines[0].finalValue = 6;
            chart.trendLines[1].finalValue = 9;
          } else {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[1].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
            chart.trendLines[1].finalValue = -10;
          }
        }

        var firstTurn = data.Data[init];
        var firstTurnDepuredValues = firstTurn.Values;
        firstTurn.Values = firstTurnDepuredValues;

        var firstTurnReal = data.Data[init + 1];

        var stringUnitsFirst, stringUnitsSecond, stringUnitsFourth;
        stringUnitsFirst = stringUnitsSecond = stringUnitsFourth = "";
        if (firstTurn.Units) stringUnitsFirst = firstTurn.Units;

        var monthNow = 0;
        if (firstTurn.Values.length > 0) {
          var searchTimeDate = new Date(
            firstTurn.Values[firstTurn.Values.length - 1].Time
          );
          monthNow = searchTimeDate.getMonth() + 1;
          var searchYear = searchTimeDate.getFullYear();
          var daysOfMonth = getDaysOfMonth(monthNow, searchYear);

          fillDataArray(
            firstTurn,
            firstTurnReal,
            monthNow,
            daysOfMonth,
            dataArray
          );
          setValueAxisYToMargin(dataArray);
        }

        if (!chart)
          chart = getNewChart(
            symbolContainerDiv,
            scope,
            stringUnitsFirst,
            stringUnitsSecond,
            stringUnitsFourth,
            dataArray
          );
        else refreshChart(chart, scope, monthNow);
      }
    }

    function fillDataArray(
      firstTurn,
      firstTurnReal,
      monthNow,
      daysOfMonth,
      dataArray
    ) {
      var todayDate = new Date();
      var currentDay = todayDate.getDate();
      var currentHour = todayDate.getHours();
      for (var dayIndex = 1; dayIndex <= daysOfMonth; dayIndex++) {
        var firstTurnValue = getTurnValue(
          firstTurn,
          dayIndex,
          monthNow,
          true,
          firstTurnReal,
          currentDay,
          currentHour
        );

        var floatFirstTurn = parseFloat(firstTurnValue);
        var total = getTotalTurns(floatFirstTurn);

        var newDataObject = getNewDataObject(dayIndex, floatFirstTurn, total);
        dataArray.push(newDataObject);
      }
    }

    function setValueAxisYToMargin(dataArray) {
      var totals = dataArray.map(function (item) {
        return item.total;
      });
      var maximum = Math.max.apply(null, totals);
      var minimum = Math.min.apply(null, totals);

      var axisValue = maximum + maximum / 10;
      scope.config.yAxisRange = "customRange";
    }

    function getNewDataObject(dayIndex, firstTurnValue, total) {
      return {
        timestamp: "D" + dayIndex,
        turno1: firstTurnValue
          ? firstTurnValue.toFixed(scope.config.decimalPlaces)
          : firstTurnValue,
        total: total ? total.toFixed(scope.config.decimalPlaces) : total,
      };
    }

    function refreshChart(chart, scope, monthNow) {
      if (!chart.chartScrollbar.enabled) {
        if (scope.config.showTitle) {
          chart.titles = createArrayOfChartTitles(monthNow);
        } else {
          chart.titles = null;
        }
        let totals = dataArray
          .map(function (item) {
            return item.total;
          })
          .filter((el) => el != null);
        let maximum = Math.max.apply(null, totals);
        let minimum = Math.min.apply(null, totals);
        chart.valueAxes[0].minimum = minimum - 2.5;
        chart.valueAxes[0].maximum = maximum + 2.5;
        chart.valueAxes[1].minimum = minimum - 2.5;
        chart.valueAxes[1].maximum = maximum + 2.5;

        chart.dataProvider = dataArray;
        chart.validateData();
        chart.validateNow();
      }
    }

    function getTurnValue(
      turnArray,
      dayIndex,
      monthNow,
      isFirstTurn,
      firstTurnReal,
      currentDay,
      currentHour
    ) {
      var turnValue = null;
      var hasSavedValues = turnArray.Values.length != 0;
      var arrayLength = hasSavedValues ? turnArray.Values.length : 1;

      for (var itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
        if (hasSavedValues)
          turnValue = getSavedValue(
            turnValue,
            turnArray,
            itemIndex,
            dayIndex,
            monthNow
          );
        if (turnValue != null) continue;
        turnValue = getRealValue(
          turnValue,
          dayIndex,
          currentDay,
          currentHour,
          firstTurnReal,
          isFirstTurn
        );
        if (turnValue != null) break;
      }
      return turnValue != null
        ? turnValue.toString().replace(",", ".")
        : turnValue;
    }

    function getSavedValue(
      turnValue,
      turnArray,
      itemIndex,
      dayIndex,
      monthNow
    ) {
      var itemDate = new Date(turnArray.Values[itemIndex].Time);
      var itemDay = itemDate.getDate();
      var itemMonth = itemDate.getMonth() + 1;

      if (dayIndex == itemDay && itemMonth == monthNow)
        turnValue = turnArray.Values[itemIndex].Value;
      return turnValue;
    }

    function getRealValue(
      turnValue,
      dayIndex,
      currentDay,
      currentHour,
      firstTurnReal,
      isFirstTurn
    ) {
      return getFirstTurnRealValue(
        turnValue,
        dayIndex,
        currentDay,
        currentHour,
        firstTurnReal
      );
    }

    function getFirstTurnRealValue(
      turnValue,
      dayIndex,
      currentDay,
      currentHour,
      firstTurnReal
    ) {
      if (dayIndex == currentDay && currentHour >= 0 && currentHour < 12)
        return firstTurnReal.Values[firstTurnReal.Values.length - 1].Value;
      else return turnValue;
    }

    function getTotalTurns(firstTurnValue) {
      var firstTurn = firstTurnValue || 0;
      var total = firstTurn;
      return total != 0 ? total : null;
    }

    function getCorrectChartMin() {
      var result = undefined;
      if (scope.config.yAxisRange == "customRange") {
        // result = scope.config.minimumYValue;
      } else {
        result = undefined;
      }
      return result;
    }

    function getCorrectChartMax() {
      var result = undefined;
      if (scope.config.yAxisRange == "customRange") {
        // result = scope.config.maximumYValue;
      } else {
        result = undefined;
      }
      return result;
    }

    function getDaysOfMonth(numMonth, numYear) {
      var daysOfMonth = 31;
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

    function getNewChart(
      symbolContainerDiv,
      scope,
      stringUnitsFirst,
      stringUnitsSecond,
      stringUnitsFourth,
      dataArray
    ) {
      let totals = dataArray
        .map(function (item) {
          return item.total;
        })
        .filter((el) => el != null);
      let maximum = Math.max.apply(null, totals);
      let minimum = Math.min.apply(null, totals);

      return AmCharts.makeChart(symbolContainerDiv.id, {
        type: "serial",
        theme: "light",
        creditsPosition: "bottom-right",
        addClassNames: true,
        depth3D: 2.5,
        angle: 30,
        marginRight: 1,
        marginLeft: 1,
        hideCredits: true,
        titles: createArrayOfChartTitles(),
        fontSize: 12,
        categoryField: "timestamp",
        backgroundAlpha: 1,
        precision: scope.config.decimalPlaces,
        backgroundColor: scope.config.backgroundColor,
        plotAreaFillColors: scope.config.plotAreaFillColor,
        color: scope.config.textColor,
        plotAreaFillAlphas: 0.1,
        autoMargin: true,
        autoMarginOffset: 10,
        decimalSeparator: ".",
        thousandsSeparator: "",
        pathToImages: "Scripts/app/editor/symbols/ext/images/",
        startDuration: 1,
        trendLines: [
          {
            finalCategory: "D1",
            finalValue: scope.config.targetvalue1,
            initialCategory: "D30",
            initialValue: scope.config.targetvalue1,
            lineColor: scope.config.lineColor1,
            lineThickness: 2.5,
            balloonText: "Límite inferior",
          },
          {
            finalCategory: "D1",
            finalValue: scope.config.targetvalue2,
            initialCategory: "D30",
            initialValue: scope.config.targetvalue2,
            lineColor: scope.config.lineColor2,
            lineThickness: 2.5,
            balloonText: "Límite superior",
          },
        ],
        chartScrollbar: {
          graph: "g1",
          graphType: "line",
          position: "bottom",
          scrollbarHeight: 20,
          autoGridCount: true,
          enabled: scope.config.showChartScrollBar,
          dragIcon: "dragIconRectSmall",
          backgroundAlpha: 1,

          backgroundColor: scope.config.plotAreaFillColor,
          selectedBackgroundAlpha: 0.2,
        },
        valueAxes: [
          {
            id: "Axis1",
            stackType: "regular",
            gridAlpha: 0,
            axisColor: scope.config.seriesColor2,
            position: "left",
            minimum: minimum - 2.5,
            maximum: maximum + 2.5,
          },
          {
            id: "Axis2",
            stackType: "regular",
            gridAlpha: 0,
            axisColor: scope.config.seriesColor2,
            position: "right",
          },
        ],
        categoryAxis: {
          axisColor: scope.config.seriesColor2,
          minPeriod: "ss",
          gridAlpha: 0,
          gridPosition: "start",
          autoWrap: true,
        },
        graphs: [
          {
            id: "GAcumulado1",
            clustered: false,
            title: "Ph",
            type: scope.config.typegraphs,
            // fillAlphas: 0.8,
            // lineAlpha: 0.3,
            lineColor: scope.config.seriesColor1,
            fontSize: 15,
            labelText: "[[turno1]]",
            showAllValueLabels: true,
            balloonText:
              "[[title]]" +
              "</b><br />[[timestamp]]</b><br />[[turno1]] " +
              stringUnitsFirst,
            valueField: "turno1",
            valueAxis: "Axis1",
          },
        ],
        legend: {
          enabled: scope.config.showLegend,
          color: scope.config.textColor,
          valueText: "[[value]] [[description]]",
          fontSize: scope.config.fontSize,
          position: "right",
        },
        dataProvider: dataArray,
      });
    }

    function createArrayOfChartTitles() {
      var titlesArray = null;
      if (scope.config.useCustomTitle) {
        titlesArray = [
          {
            text: scope.config.customTitle,
            size: scope.config.fontSize + 3,
          },
        ];
      }
      return titlesArray;
    }

    function myCustomConfigurationChangeFunction() {
      if (chart) {
        let totals = dataArray
          .map(function (item) {
            return item.total;
          })
          .filter((el) => el != null);
        let maximum = Math.max.apply(null, totals);
        let minimum = Math.min.apply(null, totals);
        chart.valueAxes[0].minimum = minimum - 2.5;
        chart.valueAxes[0].maximum = maximum + 2.5;
        chart.valueAxes[1].minimum = minimum - 2.5;
        chart.valueAxes[1].maximum = maximum + 2.5;
        if (scope.config.showTitle) {
          chart.titles = createArrayOfChartTitles();
        } else {
          chart.titles = null;
        }
        if (chart.color !== scope.config.textColor) {
          chart.color = scope.config.textColor;
        }
        if (chart.backgroundColor !== scope.config.backgroundColor) {
          chart.backgroundColor = scope.config.backgroundColor;
        }
        if (chart.plotAreaFillColors !== scope.config.plotAreaFillColor) {
          chart.plotAreaFillColors = scope.config.plotAreaFillColor;
        }
        if (chart.fontSize !== scope.config.fontSize) {
          chart.fontSize = scope.config.fontSize;
        }
        if (chart.graphs[0].lineColor !== scope.config.seriesColor1) {
          chart.graphs[0].lineColor = scope.config.seriesColor1;
        }
        if (chart.chartScrollbar.enabled != scope.config.showChartScrollBar) {
          chart.chartScrollbar.enabled = scope.config.showChartScrollBar;
        }
        if (scope.config.showValues) {
          chart.graphs[0].labelText = "[[value]]";
        } else {
          chart.graphs[0].labelText = "";
        }
        if (chart.precision != scope.config.decimalPlaces) {
          chart.precision = scope.config.decimalPlaces;
        }
        if (scope.config.typegraphs) {
          chart.graphs[0].type = scope.config.typegraphs;
        }
        if (scope.config.lineColor1 || scope.config.lineColor1) {
          chart.trendLines[0].lineColor = scope.config.lineColor1;
          chart.trendLines[1].lineColor = scope.config.lineColor2;
        }
        chart.legend.enabled = scope.config.showLegend;
        chart.legend.position = scope.config.legendPosition;
        chart.validateData();
        chart.validateNow();
      }
    }
  };

  CS.symbolCatalog.register(myEDcolumnDefinition);
})(window.PIVisualization);
