(function (CS) {
  //"use strict";
  var myEDcolumnDefinition = {
    typeName: "vertientesv2",
    displayName: "vertientesv2",
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    //iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
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
        seriesColor2: "#00a2e8",
        seriesColor3: "#ff0000",
        seriesColor4: "#000000",
        showLegend: true,
        showChartScrollBar: false,
        legendPosition: "bottom",
        bulletSize: 8,
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
  symbolVis.prototype.init = function (scope, elem) {
    console.log("\t[+] vertientes v2 > ");
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
        count += 4;
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

        var firstTurn = data.Data[init];
        var firstTurnDepuredValues = firstTurn.Values.filter(
          (item) =>
            new Date(item.Time).getHours() == 11 &&
            new Date(item.Time).getMinutes() == 59
        );
        firstTurn.Values = firstTurnDepuredValues;

        var secondTurn = data.Data[init + 1];
        var secondTurnDepuredValues = secondTurn.Values.filter(
          (item) =>
            new Date(item.Time).getHours() == 23 &&
            new Date(item.Time).getMinutes() == 59
        );
        secondTurn.Values = secondTurnDepuredValues;

        var firstTurnReal = data.Data[init + 2];
        var secondTurnReal = data.Data[init + 3];

        var stringUnitsFirst, stringUnitsSecond, stringUnitsFourth;
        stringUnitsFirst = stringUnitsSecond = stringUnitsFourth = "";
        if (firstTurn.Units) stringUnitsFirst = firstTurn.Units;
        if (secondTurn.Units) stringUnitsSecond = secondTurn.Units;

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
            secondTurn,
            firstTurnReal,
            secondTurnReal,
            monthNow,
            daysOfMonth,
            dataArray
          );
          setValueAxisYToMargin(dataArray);
        }
        dataArray = dataArrayToDataProvider(dataArray);
        console.log(" ~ file: sym-vertientesv2.js ~ line 150 ~ myCustomDataUpdateFunction ~ dataArray", dataArray)
        if (!chart)
          chart = getNewChart(
            symbolContainerDiv,
            scope,
            dataArray
          );
        else refreshChart(chart, scope, monthNow);
      }
    }

    function fillDataArray(
      firstTurn,
      secondTurn,
      firstTurnReal,
      secondTurnReal,
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
          secondTurnReal,
          currentDay,
          currentHour
        );
        var secondTurnValue = getTurnValue(
          secondTurn,
          dayIndex,
          monthNow,
          false,
          firstTurnReal,
          secondTurnReal,
          currentDay,
          currentHour
        );

        var floatFirstTurn = parseFloat(firstTurnValue);
        var floatSecondTurn = parseFloat(secondTurnValue);
        var total = getTotalTurns(floatFirstTurn, floatSecondTurn);

        var newDataObject = getNewDataObject(
          dayIndex,
          floatFirstTurn,
          floatSecondTurn,
          total
        );
        dataArray.push(newDataObject);
      }
    }

    function setValueAxisYToMargin(dataArray) {
      var totals = dataArray.map(function (item) {
        return item.total;
      });
      var maximum = Math.max.apply(null, totals);

      var axisValue = maximum + maximum / 10;
      scope.config.yAxisRange = "customRange";
      scope.config.maximumYValue = parseInt(axisValue);
      scope.config.minimumYValue = 0;
    }

    function getNewDataObject(
      dayIndex,
      firstTurnValue,
      secondTurnValue,
      total
    ) {
      return {
        timestamp: "D" + dayIndex,
        turno1: firstTurnValue
          ? firstTurnValue.toFixed(scope.config.decimalPlaces)
          : firstTurnValue,
        turno2: secondTurnValue
          ? secondTurnValue.toFixed(scope.config.decimalPlaces)
          : secondTurnValue,
        total: total ? total.toFixed(scope.config.decimalPlaces) : total,
      };
    }

    function refreshChart(chart, scope, monthNow) {
      chart.allLabels[0].text = `Total por Turnos: ${dataArray.reduce(
        (previousValue, currentValue) => previousValue + currentValue.value,
        0
      )}`;
      // if (!chart.chartScrollbar.enabled) {
      // if (scope.config.showTitle) {
      //     chart.titles = createArrayOfChartTitles(monthNow);
      // } else {
      //     chart.titles = null;
      // }

      chart.dataProvider = dataArray;
      chart.validateData();
      chart.validateNow();
      // }
    }

    function getTurnValue(
      turnArray,
      dayIndex,
      monthNow,
      isFirstTurn,
      firstTurnReal,
      secondTurnReal,
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
          secondTurnReal,
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
      secondTurnReal,
      isFirstTurn
    ) {
      if (isFirstTurn)
        return getFirstTurnRealValue(
          turnValue,
          dayIndex,
          currentDay,
          currentHour,
          firstTurnReal
        );
      else
        return getSecondTurnRealValue(
          turnValue,
          dayIndex,
          currentDay,
          currentHour,
          secondTurnReal
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

    function getSecondTurnRealValue(
      turnValue,
      dayIndex,
      currentDay,
      currentHour,
      secondTurnReal
    ) {
      if (dayIndex == currentDay && currentHour >= 12 && currentHour < 24)
        return secondTurnReal.Values[secondTurnReal.Values.length - 1].Value;
      else return turnValue;
    }

    function getTotalTurns(firstTurnValue, secondTurnValue) {
      var firstTurn = firstTurnValue || 0;
      var secondTurn = secondTurnValue || 0;
      var total = firstTurn + secondTurn;
      return total != 0 ? total : null;
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

    function dataArrayToDataProvider(dataArray) {
      const dataProvider = [
        {
          title: "Guardia Día",
          value: dataArray.reduce((previousValue, currentValue) => {
            return (
              previousValue +
              (!currentValue.turno1 ? 0 : parseInt(currentValue.turno1))
            );
          }, 0),
        },
        {
          title: "Guardia Noche",
          value: dataArray.reduce((previousValue, currentValue) => {
            return (
              previousValue +
              (!currentValue.turno2 ? 0 : parseInt(currentValue.turno2))
            );
          }, 0),
        },
      ];

      return dataProvider;
    }

    function getNewChart(
      symbolContainerDiv,
      scope,
      dataArray
    ) {
      console.log(" ~ file: sym-vertientesv2.js ~ line 419 ~ dataArray", dataArray)
      return AmCharts.makeChart(symbolContainerDiv.id, {
        type: "pie",
        theme: "none",
        titleField: "title",
        valueField: "value",
        labelText: "[[title]]: [[value]]",
        balloonText: "[[title]]: [[value]]",
        labelRadius: 5,
        radius: "42%",
        color: scope.config.textColor,
        backgroundColor: scope.config.backgroundColor,
        plotAreaFillColors: scope.config.plotAreaFillColor,
        innerRadius: "60%",
        dataProvider: dataArray,
        titles: createArrayOfChartTitles(),
        hideCredits: true,
        fontSize: scope.config.fontSize,
        colors: [
          scope.config.seriesColor1,
          scope.config.seriesColor2,
        ],
        legend: {
          position: scope.config.legendPosition,
          align: "center",
          enabled: scope.config.showLegend,
          color: scope.config.textColor,
        },
        allLabels: [
          {
            text: `Total por Turnos: ${dataArray.reduce(
              (previousValue, currentValue) =>
                previousValue + currentValue.value,
              0
            )}`,
            bold: true,
            x: 20,
            y: 20,
          },
        ],
      });
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
        if (scope.config.showTitle) {
          chart.titles = createArrayOfChartTitles();
        } else {
          chart.titles = null;
        }
        if (chart.color !== scope.config.textColor) {
          chart.color = scope.config.textColor;
          chart.legend.color = scope.config.textColor;
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
        if(chart.colors[0] != scope.config.seriesColor1 || chart.colors[1] != scope.config.seriesColor2) {
          chart.colors[0] = scope.config.seriesColor1;
          chart.colors[1] = scope.config.seriesColor2;
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
