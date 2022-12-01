(function (CS) {
  //"use strict";
  var myEDcolumnDefinition = {
    typeName: "CAUDAL",
    displayName: "Caudal (Estaciones Hidrometricas)",
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/CAUDAL_COMM.png",
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
        typegraphs: "column",
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
          // FUENTES DE AGUA (SC - MT)
          if (stationName == "LUCHEJO" || stationName == "HMT-01") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
          } else if (stationName == "POMACOCHA 1" || stationName == "HMT-02") {
            chart.trendLines[0].initialValue = 160;
            chart.trendLines[0].finalValue = 160;
          } else if (stationName == "POMACOCHA 2" || stationName == "HMT-03") {
            chart.trendLines[0].initialValue = 160;
            chart.trendLines[0].finalValue = 160;
          } else if (stationName == "VILLON" || stationName == "HMT-04") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
          } else if (stationName == "ARAPA" || stationName == "HMT-05") {
            chart.trendLines[0].initialValue = 12;
            chart.trendLines[0].finalValue = 12;
          } else if (stationName == "RIEGO DE ASPERSION" || stationName == "HMT-06") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
          } else if (stationName == "390 VELO DE NOVIA" || stationName == "HSC-01") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
          } else if (stationName == "SAN MARTIN" || stationName == "HSC-02") {
            chart.trendLines[0].initialValue = 15;
            chart.trendLines[0].finalValue = 15;
          } else if (stationName == "CAMILA" || stationName == "HSC-03") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
          } else if (stationName == "POZO TUBULAR CD" || stationName == "HSC-05") {
            chart.trendLines[0].initialValue = 15;
            chart.trendLines[0].finalValue = 15;
          } else if (stationName == "ESTACION: POZO TUBULAR B" || stationName == "HSC-06") {
            chart.trendLines[0].initialValue = 15;
            chart.trendLines[0].finalValue = 15;
          } else if (stationName == "ESTACION: POZO TUBULAR A" || stationName == "HSC-07") {
            chart.trendLines[0].initialValue = 15;
            chart.trendLines[0].finalValue = 15;
          } else if (stationName == "TUNEL 820" || stationName == "HSC-08") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
            // FUENTES DE AGUA (CAR)
          } else if (stationName == "FLEISHMAN 1" || stationName == "HCA-01") {
            chart.trendLines[0].initialValue = 1;
            chart.trendLines[0].finalValue = 1;
          } else if (stationName == "FLEISHMAN 2" || stationName == "HCA-02") {
            chart.trendLines[0].initialValue = 1;
            chart.trendLines[0].finalValue = 1;
          } else if (stationName == "RUMICHACA" || stationName == "HCA-03") {
            chart.trendLines[0].initialValue = 2;
            chart.trendLines[0].finalValue = 2;
          } else if (stationName == "TANQUE PRINCIPAL FUM 02 LINEA 1" || stationName == "HCA-04") {
            chart.trendLines[0].initialValue = 40;
            chart.trendLines[0].finalValue = 40;
          } else if (stationName == "TANQUE PRINCIPAL FUM 02 LINEA 2" || stationName == "HCA-05") {
            chart.trendLines[0].initialValue = 40;
            chart.trendLines[0].finalValue = 40;
          } else if (stationName == "HUALLO" || stationName == "HCA-06") {
            chart.trendLines[0].initialValue = 8;
            chart.trendLines[0].finalValue = 8;
          } else if (stationName == "CHUMPE 1" || stationName == "HCA-07") {
            chart.trendLines[0].initialValue = 46;
            chart.trendLines[0].finalValue = 46;
          } else if (stationName == "CHUMPE 2" || stationName == "HCA-08") {
            chart.trendLines[0].initialValue = 46;
            chart.trendLines[0].finalValue = 46;
          } else if (stationName == "BOMBA KSB" || stationName == "HCA-09") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
          } else if (stationName == "YANTAC" || stationName == "HCA-10") {
            chart.trendLines[0].initialValue = 3;
            chart.trendLines[0].finalValue = 3;
          } else if (stationName == "SANTA AGUEDA " || stationName == "HCA-11") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
            // VERTIMIENTOS (SCMT)
          } else if (stationName == "AS-22" || stationName == "AS22") {
            chart.trendLines[0].initialValue = 6.67;
            chart.trendLines[0].finalValue = 6.67;
            chart.trendLines[0].balloonText = `Caudal autorizado 6.67`;
          } else if (stationName == "EM-521" || stationName == "EM521") {
            chart.trendLines[0].initialValue = 80.895;
            chart.trendLines[0].finalValue = 80.895;
            chart.trendLines[0].balloonText = `Caudal autorizado 80.895`
            // VERTIMIENTOS (CAR)
          } else if (stationName == "V-1" || stationName == "V1") {
            chart.trendLines[0].initialValue = 0.19;
            chart.trendLines[0].finalValue = 0.19;
          } else if (stationName == "AS-17" || stationName == "AS17") {
            chart.trendLines[0].initialValue = 4.97;
            chart.trendLines[0].finalValue = 4.97;
          } else if (stationName == "MA-04" || stationName == "MA04") {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
          } else if (stationName == "MA-09" || stationName == "MA09") {
            chart.trendLines[0].initialValue = 116.667;
            chart.trendLines[0].finalValue = 116.667;
          } else if (stationName == "MA-19" || stationName == "MA19") {
            chart.trendLines[0].initialValue = 381.306;
            chart.trendLines[0].finalValue = 381.306;
          } else {
            chart.trendLines[0].initialValue = -10;
            chart.trendLines[0].finalValue = -10;
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
        chart.valueAxes[0].minimum = 0;
        chart.valueAxes[0].maximum = maximum + 2.5;
        chart.valueAxes[1].minimum = 0;
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
        fontSize: scope.config.fontSize,
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
            balloonText: "Caudal autorizado",
          }
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
            minimum: 0,
            // maximum: maximum + 2.5,
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
            title: "Caudal",
            type: scope.config.typegraphs,
            lineColor: scope.config.seriesColor1,
            fontSize: scope.config.fontSize + 5,
            labelText: "[[turno1]]",
            showAllValueLabels: true,
            fillAlphas: 1,
            balloonText:
              "[[title]]" +
              "</b><br />[[timestamp]]</b><br />[[turno1]] " +
              stringUnitsFirst,
            valueField: "turno1",
            valueAxis: "Axis1",
            labelRotation: 270,
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
        chart.valueAxes[0].minimum = 0;
        chart.valueAxes[0].maximum = maximum + 2.5;
        chart.valueAxes[1].minimum = 0;
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
