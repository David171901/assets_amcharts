(function (CS) {
  //"use strict";
  var myEDcolumnDefinition = {
    typeName: "RendimientoPlantaBarras",
    displayName: "Rendimiento Planta Barras",
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    inject: ["timeProvider"],
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
        fontSize: 20,
        FormatType: null,
        lineThick: 4,
        seriesColor1: "#ffc90e",
        seriesColor2: "#00a2e8",
        seriesColor3: "#ff0000",
        seriesColor4: "#000000",
        seriesColor5: "#000000",
        seriesColor6: "#000000",
        seriesColor7: "#111111",
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
  symbolVis.prototype.init = function (scope, elem, timeProvider) {
    console.log("[+] B Sobre Puestas DD v4 - Loaded");
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    scope.config.FormatType = null;
    scope.timeED = { day: "", month: "", year: "" };
    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString =
      "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv.id = newUniqueIDString;
    var chart = false;
    var dataArray = [];
    var targetDefault;
    var targetDown;
    var targetUP;
    var maxLabelRight = 10000;

    function myCustomDataUpdateFunction(data) {
      // console.log(
      //   " ~ file: sym-RendimientoPlantaBarras.js:70 ~ myCustomDataUpdateFunction ~ data",
      //   data
      // );
      if (data !== null && data.Data) {
        dataArray = [];

        // Asignacion de targetDefaults
        targetDefault = data.Data[10].Values[0].Value;
        targetDown = data.Data[11].Values[0].Value;
        targetUP = data.Data[12].Values[0].Value;

        let firstTurn = data.Data[0];

        let firstTurnDepuredValues = firstTurn.Values.filter(
          (item) =>
            new Date(item.Time).getHours() == 0 &&
            new Date(item.Time).getMinutes() == 00
        );
        firstTurn.Values = firstTurnDepuredValues;

        let secondTurn = data.Data[1];
        let secondTurnDepuredValues = secondTurn.Values.filter(
          (item) =>
            new Date(item.Time).getHours() == 0 &&
            new Date(item.Time).getMinutes() == 00
        );
        secondTurn.Values = secondTurnDepuredValues;

        let firstTurnReal = data.Data[2];
        let secondTurnReal = data.Data[3];

        let firstTurnNew = data.Data[4];

        let firstTurnNewDepuredValues = firstTurnNew.Values.filter(
          (item) =>
            new Date(item.Time).getHours() == 0 &&
            new Date(item.Time).getMinutes() == 00
        );
        firstTurnNew.Values = firstTurnNewDepuredValues;

        let secondTurnNew = data.Data[5];

        let secondTurnNewDepuredValues = secondTurnNew.Values.filter(
          (item) =>
            new Date(item.Time).getHours() == 0 &&
            new Date(item.Time).getMinutes() == 00
        );
        secondTurnNew.Values = secondTurnNewDepuredValues;

        let firstTurnNewReal = data.Data[6];

        let secondTurnNewReal = data.Data[7];

        // TONELAJES ************************************
        let dryTonnage = data.Data[13];
        let wetTonnage = data.Data[14];

        let dryTonnageReal = {};
        dryTonnageReal.Values = [];
        let wetTonnageReal = {};
        wetTonnageReal.Values = [];
        // **********************************************

        let customStartDate = timeProvider.displayTime.start;

        let stringUnitsFirst, stringUnitsSecond, stringUnitsFourth;
        stringUnitsFirst = stringUnitsSecond = stringUnitsFourth = "";
        if (firstTurn.Units) stringUnitsFirst = firstTurn.Units;
        if (secondTurn.Units) stringUnitsSecond = secondTurn.Units;
        if (firstTurnNew.Units) stringUnitsFourth = firstTurnNew.Units;

        let monthNow = 0;
        if (firstTurn.Values.length > 0) {
          let searchTimeDate = new Date(customStartDate);

          monthNow = searchTimeDate.getMonth() + 2;

          let searchYear = searchTimeDate.getFullYear();
          let daysOfMonth = getDaysOfMonth(monthNow, searchYear);

          fillDataArray(
            firstTurn,
            secondTurn,
            firstTurnReal,
            secondTurnReal,
            new Date(customStartDate),
            daysOfMonth,
            dataArray,
            firstTurnNew,
            secondTurnNew,
            firstTurnNewReal,
            secondTurnNewReal,
            dryTonnage,
            wetTonnage,
            dryTonnageReal,
            wetTonnageReal
          );

          setValueAxisYToMargin(dataArray);
        }

        if (!chart)
          chart = getNewChart(
            symbolContainerDiv,
            monthNow,
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
      secondTurn,
      firstTurnReal,
      secondTurnReal,
      start,
      daysOfMonth,
      dataArray,
      firstTurnNew,
      secondTurnNew,
      firstTurnNewReal,
      secondTurnNewReal,
      dryTonnage,
      wetTonnage,
      dryTonnageReal,
      wetTonnageReal
    ) {
      let todayDate =
        timeProvider.displayTime.end != "*"
          ? new Date(timeProvider.displayTime.end)
          : new Date();
      let currentDay = todayDate.getDate();
      let currentHour = todayDate.getHours();
      let currentMonth = todayDate.getMonth() + 1;
      let iterableDate = start;

      iterableDate.setHours(0);

      let daysOfPreviewMonth = getDaysOfMonth(start.getMonth() + 1);
      let moreDays = daysOfPreviewMonth - start.getDate();
      todayDate.setDate(todayDate.getDate() + 1);

      let daysOfMonth_ = setDaysCalendarMine(todayDate.getMonth());

      for (let dayIndex = 1; dayIndex <= daysOfMonth_ + moreDays; dayIndex++) {
        iterableDate.setDate(iterableDate.getDate() + 1);

        if (iterableDate.getTime() <= todayDate.getTime()) {
          let firstTurnValue = getTurnValue(
            firstTurn,
            iterableDate,
            true,
            firstTurnReal,
            secondTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );

          let secondTurnValue = getTurnValue(
            secondTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );

          let firstTurnNewValue = getTurnValueForNews(
            firstTurnNew,
            iterableDate,
            true,
            firstTurnNewReal,
            secondTurnNewReal,
            currentDay,
            currentHour,
            currentMonth
          );

          let secondTurnNewValue = getTurnValueForNews(
            secondTurnNew,
            iterableDate,
            false,
            firstTurnNewReal,
            secondTurnNewReal,
            currentDay,
            currentHour,
            currentMonth
          );

          // TONELAJES ************************************
          let dryTonnageValue = getTonnageValueForNews(
            dryTonnage,
            iterableDate,
            false,
            dryTonnageReal,
            wetTonnageReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let wetTonnageValue = getTonnageValueForNews(
            wetTonnage,
            iterableDate,
            false,
            dryTonnageReal,
            wetTonnageReal,
            currentDay,
            currentHour,
            currentMonth
          );

          let floatFirstTurn = parseFloat(firstTurnValue);
          let floatSecondTurn = parseFloat(secondTurnValue);
          let floatFirstTurnNew = parseFloat(firstTurnNewValue);
          let floatSecondTurnNew = parseFloat(secondTurnNewValue);

          // TONELAJES ************************************
          let floatDryTonnage = parseFloat(dryTonnageValue);
          let floatWetTonnage = parseFloat(wetTonnageValue);

          let total = getTotalTurns(floatFirstTurn, floatSecondTurn);
          let totalnew = getTotalTurns(floatFirstTurnNew, floatSecondTurnNew);

          let newDataObject = getNewDataObject(
            iterableDate,
            floatFirstTurn,
            floatSecondTurn,
            total,
            floatFirstTurnNew,
            floatSecondTurnNew,
            totalnew,
            floatDryTonnage,
            floatWetTonnage
          );
          dataArray.push(newDataObject);
        } else {
          let newDataObject = getNewDataObject(
            iterableDate,
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

    function setDaysCalendarMine(month) {
      let dayCalendar;

      switch (month) {
        case 0:
          dayCalendar = 28;
          break;
        case 1:
          dayCalendar = 25;
          break;
        case 2:
          dayCalendar = 28;
          break;
        case 3:
          dayCalendar = 27;
          break;
        case 4:
          dayCalendar = 28;
          break;
        case 5:
          sdayCalendar = 27;
          break;
        case 6:
          dayCalendar = 28;
          break;
        case 7:
          dayCalendar = 28;
          break;
        case 8:
          dayCalendar = 27;
          break;
        case 9:
          dayCalendar = 28;
          break;
        case 10:
          dayCalendar = 27;
          break;
        case 11:
          dayCalendar = 31;
          break;
        default:
          break;
      }

      return dayCalendar;
    }

    function setValueAxisYToMargin(dataArray) {
      let totals = dataArray.map(function (item) {
        return item.total;
      });

      let lineswet = dataArray.map(function (item) {
        return item.wettonnage;
      });

      let linesdry = dataArray.map(function (item) {
        return item.drytonnage;
      });

      let maximum = Math.max.apply(null, totals);
      let maximumlineswet = Math.max.apply(null, lineswet);
      let maximumlinesdry = Math.max.apply(null, linesdry);

      let axisValue = maximum + maximum / 10;
      scope.config.yAxisRange = "customRange";
      scope.config.maximumYValue = parseInt(axisValue);
      scope.config.maximumYValueAxisv2 =
        maximumlineswet > maximumlinesdry
          ? parseInt(maximumlineswet)
          : parseInt(maximumlinesdry);
      scope.config.minimumYValue = 0;
    }

    function getNewDataObject(
      dayIndex,
      firstTurnValue,
      secondTurnValue,
      total,
      firstTurnNew,
      secondTurnNew,
      totalnew,
      dryTonnage,
      wetTonnage
    ) {
      return {
        timestamp: dayIndex.getDate() + "/" + (dayIndex.getMonth() + 1),
        turno1: firstTurnValue
          ? firstTurnValue.toFixed(scope.config.decimalPlaces)
          : firstTurnValue,
        turno2: secondTurnValue
          ? secondTurnValue.toFixed(scope.config.decimalPlaces)
          : secondTurnValue,
        total: total ? total.toFixed(scope.config.decimalPlaces) : total,
        turno1new: firstTurnNew
          ? firstTurnNew.toFixed(scope.config.decimalPlaces)
          : firstTurnNew,
        turno2new: secondTurnNew
          ? secondTurnNew.toFixed(scope.config.decimalPlaces)
          : secondTurnNew,
        totalnew: totalnew
          ? totalnew.toFixed(scope.config.decimalPlaces)
          : totalnew,
        drytonnage: dryTonnage
          ? dryTonnage.toFixed(scope.config.decimalPlaces)
          : dryTonnage,
        wettonnage: wetTonnage
          ? wetTonnage.toFixed(scope.config.decimalPlaces)
          : wetTonnage,
        // Dry Tonnage
        drytonnageup: dryTonnage
          ? dryTonnage > 5733
            ? dryTonnage.toFixed(scope.config.decimalPlaces)
            : null
          : null,
        drytonnagedown: dryTonnage
          ? dryTonnage < 5187
            ? dryTonnage.toFixed(scope.config.decimalPlaces)
            : null
          : null,
      };
    }

    function setTrendCategory() {
      let endCategory =
        timeProvider.displayTime.end != "*"
          ? new Date(timeProvider.displayTime.end)
          : new Date();
      let startCategory = new Date(timeProvider.displayTime.start);
      startCategory = addDays(startCategory, 1);
      chart.trendLines[0].finalCategory = `${endCategory.getDate()}/${
        endCategory.getMonth() + 1
      }`;
      chart.trendLines[0].initialCategory = `${startCategory.getDate()}/${
        startCategory.getMonth() + 1
      }`;
      chart.trendLines[1].finalCategory = `${endCategory.getDate()}/${
        endCategory.getMonth() + 1
      }`;
      chart.trendLines[1].initialCategory = `${startCategory.getDate()}/${
        startCategory.getMonth() + 1
      }`;
      chart.trendLines[2].finalCategory = `${endCategory.getDate()}/${
        endCategory.getMonth() + 1
      }`;
      chart.trendLines[2].initialCategory = `${startCategory.getDate()}/${
        startCategory.getMonth() + 1
      }`;
    }

    function addDays(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
    }

    function refreshChart(chart, scope, monthNow) {
      if (!chart.chartScrollbar.enabled) {
        if (scope.config.showTitle) {
          chart.titles = createArrayOfChartTitles(monthNow);
        } else {
          chart.titles = null;
        }
        chart.valueAxes[0].minimum = getCorrectChartMin();
        chart.valueAxes[0].maximum = getCorrectChartMax() + maxLabelRight;
        chart.valueAxes[1].minimum = getCorrectChartMin();
        chart.valueAxes[1].maximum = getCorrectChartMax() + maxLabelRight;

        chart.valueAxes[2].maximum = getCorrectChartLine();

        chart.dataProvider = dataArray;
        chart.validateData();
        chart.validateNow();
      }
    }

    function getTurnValue(
      turnArray,
      iterableDate,
      isFirstTurn,
      firstTurnReal,
      secondTurnReal,
      currentDay,
      currentHour,
      currentMonth
    ) {
      let turnValue = null;
      let originalArrayLength = turnArray.Values.length;
      let hasSavedValues = originalArrayLength != 0;
      let arrayLength = hasSavedValues ? originalArrayLength : 1;

      for (let itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
        if (hasSavedValues)
          turnValue = getSavedValue(
            turnValue,
            turnArray,
            itemIndex,
            iterableDate
          );
        if (turnValue != null) continue;

        turnValue = getRealValue(
          turnValue,
          iterableDate,
          currentDay,
          currentHour,
          firstTurnReal,
          secondTurnReal,
          isFirstTurn,
          currentMonth
        );
        if (turnValue != null) break;

        if (
          hasSavedValues &&
          itemIndex == originalArrayLength - 1 &&
          currentDay == iterableDate.getDate()
        )
          turnValue = getLastUnsavedTemporal(
            firstTurnReal,
            secondTurnReal,
            isFirstTurn,
            currentMonth
          );
      }
      return turnValue != null
        ? turnValue.toString().replace(",", ".")
        : turnValue;
    }

    function getTurnValueForNews(
      turnArray,
      iterableDate,
      isFirstTurn,
      firstTurnReal,
      secondTurnReal,
      currentDay,
      currentHour,
      currentMonth
    ) {
      let turnValue = null;
      let originalArrayLength = turnArray.Values.length;
      let hasSavedValues = originalArrayLength != 0;
      let arrayLength = hasSavedValues ? originalArrayLength : 1;

      for (let itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
        if (hasSavedValues)
          turnValue = getSavedValue(
            turnValue,
            turnArray,
            itemIndex,
            iterableDate
          );
        if (turnValue != null) continue;

        turnValue = getRealValue(
          turnValue,
          iterableDate,
          currentDay,
          currentHour,
          firstTurnReal,
          secondTurnReal,
          isFirstTurn,
          currentMonth
        );
        if (turnValue != null) break;
      }
      return turnValue != null
        ? turnValue.toString().replace(",", ".")
        : turnValue;
    }

    function getTonnageValueForNews(
      turnArray,
      iterableDate,
      isFirstTurn,
      firstTurnReal,
      secondTurnReal,
      currentDay,
      currentHour,
      currentMonth
    ) {
      let turnValue = null;
      let originalArrayLength = turnArray.Values.length;
      let hasSavedValues = originalArrayLength != 0;
      let arrayLength = hasSavedValues ? originalArrayLength : 1;

      for (let itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
        if (hasSavedValues)
          turnValue = getSavedValue(
            turnValue,
            turnArray,
            itemIndex,
            iterableDate
          );
        if (turnValue != null) continue;
        turnValue = getRealValue(
          turnValue,
          iterableDate,
          currentDay,
          currentHour,
          firstTurnReal,
          secondTurnReal,
          isFirstTurn,
          currentMonth
        );
        if (turnValue != null) break;
      }
      return turnValue != null
        ? turnValue.toString().replace(",", ".")
        : turnValue;
    }

    function getSavedValue(turnValue, turnArray, itemIndex, iterableDate) {
      let itemDate = new Date(turnArray.Values[itemIndex].Time);

      let itemDay = itemDate.getDate();
      let itemMonth = itemDate.getMonth() + 1;

      let iterableDay = iterableDate.getDate();
      let iterableMonth = iterableDate.getMonth() + 1;

      if (iterableDay == itemDay && itemMonth == iterableMonth)
        turnValue = turnArray.Values[itemIndex].Value;
      return turnValue;
    }

    function getRealValue(
      turnValue,
      iterableDate,
      currentDay,
      currentHour,
      firstTurnReal,
      secondTurnReal,
      isFirstTurn,
      currentMonth
    ) {
      if (isFirstTurn) {
        return getFirstTurnRealValue(
          turnValue,
          iterableDate,
          currentDay,
          currentHour,
          firstTurnReal,
          currentMonth
        );
      } else {
        return getSecondTurnRealValue(
          turnValue,
          iterableDate,
          currentDay,
          currentHour,
          secondTurnReal,
          currentMonth
        );
      }
    }

    function getLastUnsavedTemporal(
      firstTurnReal,
      secondTurnReal,
      isFirstTurn
    ) {
      if (isFirstTurn)
        return firstTurnReal.Values[firstTurnReal.Values.length - 1].Value;
      else return secondTurnReal.Values[secondTurnReal.Values.length - 1].Value;
    }

    function getFirstTurnRealValue(
      turnValue,
      iterableDate,
      currentDay,
      currentHour,
      firstTurnReal,
      currentMonth
    ) {
      let iterableDay = iterableDate.getDate();

      if (
        iterableDay == currentDay &&
        currentHour >= 0 &&
        currentHour < 7 &&
        iterableDate.getMonth() + 1 == currentMonth
      )
        return firstTurnReal.Values[firstTurnReal.Values.length - 1].Value;
      else if (
        iterableDay - 1 == currentDay &&
        currentHour >= 19 &&
        currentHour < 24 &&
        iterableDate.getMonth() + 1 == currentMonth
      )
        return firstTurnReal.Values[firstTurnReal.Values.length - 1].Value;
      else return turnValue;
    }

    function getSecondTurnRealValue(
      turnValue,
      iterableDate,
      currentDay,
      currentHour,
      secondTurnReal,
      currentMonth
    ) {
      let iterableDay = iterableDate.getDate();

      if (
        iterableDay == currentDay &&
        currentHour >= 7 &&
        currentHour < 19 &&
        iterableDate.getMonth() + 1 == currentMonth
      ) {
        if (secondTurnReal.Values.length > 0) {
          return secondTurnReal.Values[secondTurnReal.Values.length - 1].Value;
        } else {
          return 0;
        }
      } else if (
        iterableDay - 1 == currentDay &&
        currentHour >= 19 &&
        currentHour < 24 &&
        iterableDate.getMonth() + 1 == currentMonth
      ) {
        return 0;
      } else {
        return turnValue;
      }
    }

    function getTotalTurns(firstTurnValue, secondTurnValue) {
      let firstTurn = firstTurnValue || 0;
      let secondTurn = secondTurnValue || 0;
      let total = firstTurn + secondTurn;
      return total != 0 ? total : null;
    }

    function getCorrectChartMin() {
      let result = undefined;
      if (scope.config.yAxisRange == "customRange") {
        result = scope.config.minimumYValue;
      } else {
        result = undefined;
      }
      return result;
    }

    function getCorrectChartMax() {
      let result = undefined;
      if (scope.config.yAxisRange == "customRange") {
        result = scope.config.maximumYValue;
      } else {
        result = undefined;
      }
      return result;
    }

    function getCorrectChartLine() {
      let result = undefined;
      if (scope.config.yAxisRange == "customRange") {
        result = scope.config.maximumYValueAxisv2;
      } else {
        result = undefined;
      }
      return result;
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

    function getNewChart(
      symbolContainerDiv,
      monthNow,
      scope,
      stringUnitsFirst,
      stringUnitsSecond,
      stringUnitsFourth,
      dataArray
    ) {
      return AmCharts.makeChart(symbolContainerDiv.id, {
        type: "serial",
        //"theme": "light",
        hideCredits: true,
        addClassNames: true,
        depth3D: 0,
        angle: 0,
        marginRight: 1,
        marginLeft: 1,
        trendLines: [
          {
            finalCategory: "29/11",
            finalValue: targetUP,
            initialCategory: "31/12",
            initialValue: targetUP,
            lineColor: "#f58e8e",
            //tipe: "smoothedLine",
            lineThickness: 5,
            balloonText: "Límite superiorERS +5%" + " (" + targetUP + ")",
            //labelText: 5733 + "Tn",
            valueAxis: "Axis2",
          },
          {
            finalCategory: "29/11",
            finalValue: targetDown,
            initialCategory: "31/12",
            initialValue: targetDown,
            lineColor: "#f58e8e",
            lineThickness: 5,
            balloonText: "Límite inferior -5%" + " (" + targetDown + ")",
            //labelText: 5187 + "Tn",
            valueAxis: "Axis2",
          },
          {
            finalCategory: "29/11",
            finalValue: targetDefault,
            initialCategory: "31/12",
            initialValue: targetDefault,
            lineColor: "#5e8dff",
            lineThickness: 5,
            balloonText: "Target / TMS" + " (" + targetDefault + ")",
            //labelText: 5460 + "Tn",
            valueAxis: "Axis2",
          },
        ],
        titles: createArrayOfChartTitles(),
        fontSize: 35,
        categoryField: "timestamp",
        backgroundAlpha: 0,
        precision: scope.config.decimalPlaces,
        backgroundColor: scope.config.backgroundColor,
        plotAreaFillColors: scope.config.plotAreaFillColor,
        color: scope.config.textColor,
        plotAreaFillAlphas: 1,
        autoMargin: true,
        autoMarginOffset: 10,
        decimalSeparator: ".",
        thousandsSeparator: "",
        pathToImages: "Scripts/app/editor/symbols/ext/images/",
        startDuration: 1,
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
            id: "Axis0",
            stackType: "regular",
            gridAlpha: 0,
            axisColor: scope.config.seriesColor2,
            position: "left",
            minimum: scope.config.minimumYValue,
            maximum: scope.config.maximumYValue,
            labelsEnabled: false,
          },
          {
            id: "Axis1",
            stackType: "regular",
            gridAlpha: 0,
            axisColor: scope.config.seriesColor2,
            position: "left",
            minimum: scope.config.minimumYValue,
            maximum: scope.config.maximumYValue,
            labelsEnabled: false,
          },
          {
            id: "Axis2",
            axisAlpha: 1,
            position: "right",
            gridAlpha: 0,
            maximum: scope.config.maximumYValueAxisv2,
            minimum: 0,
          },
        ],
        categoryAxis: {
          axisColor: scope.config.seriesColor2,
          minPeriod: "ss",
          gridAlpha: 0.5,
          gridPosition: "start",
          autoWrap: true,
        },
        graphs: [
          {
            id: "GAcumulado1",
            clustered: false,
            title: "Turno Noche SC-CAR",
            type: "column",
            fillAlphas: 1,
            lineAlpha: 1,
            lineColor: scope.config.seriesColor1,
            fontSize: 35,
            bold: true,
            labelText: "[[turno1]]",
            showAllValueLabels: true,
            labelRotation: 270,
            balloonText:
              "[[title]]" +
              "</b><br />[[timestamp]]</b><br />[[turno1]] " +
              stringUnitsFirst,
            valueField: "turno1",
            valueAxis: "Axis0",
          },
          {
            id: "GAcumulado2",
            clustered: false,
            title: "Turno Día SC-CAR",
            type: "column",
            fillAlphas: 0.8,
            lineAlpha: 0.3,
            fontSize: 35,
            bold: true,
            lineColor: scope.config.seriesColor2,
            labelText: "[[turno2]]",
            showAllValueLabels: true,
            labelRotation: 270,
            balloonText:
              "[[title]]" +
              "</b><br />[[timestamp]]</b><br />[[turno2]] " +
              stringUnitsSecond,
            valueField: "turno2",
            valueAxis: "Axis0",
          },
          {
            id: "Procesado1",
            clustered: false,
            title: "Turno Noche Ticlio",
            type: "column",
            fillAlphas: 0.8,
            fontSize: 35,
            bold: true,
            lineColor: scope.config.seriesColor4,
            columnWidth: 0.5,
            showAllValueLabels: true,
            labelRotation: -45,
            backgroundcolor: "transparent",
            balloonText:
              "[[title]]" +
              "<b><br />[[timestamp]]</b><br />[[turno1new]] " +
              stringUnitsFourth,
            valueField: "turno1new",
            valueAxis: "Axis1",
            labelText: "",
          },
          {
            id: "Procesado2",
            clustered: false,
            title: "Turno Día Ticlio",
            type: "column",
            fillAlphas: 0.8,
            fontSize: 35,
            bold: true,
            lineColor: scope.config.seriesColor5,
            columnWidth: 0.5,
            showAllValueLabels: true,
            labelRotation: -45,
            backgroundcolor: "transparent",
            balloonText:
              "[[title]]" +
              "<b><br />[[timestamp]]</b><br />[[turno2new]] " +
              stringUnitsFourth,
            valueField: "turno2new",
            valueAxis: "Axis1",
            labelText: "",
          },
          {
            id: "Line1",
            valueAxis: "Axis2",
            fontSize: scope.config.fontSize,
            balloonText: "Toneladas Secas" + "</b><br/>[[drytonnage]]T",
            labelPosition: "top",
            title: "Toneladas Secas",
            valueField: "drytonnage",
            showBalloon: true,
            color: "#0a0a0a",
            bulletSize: 30,
            lineColor: "#000000",
            type: "smoothedLine",
            bullet: "diamond",
            lineThickness: 3,
            bulletBorderAlpha: 2,
            useLineColorForBulletBorder: true,
            bulletBorderThickness: 4,
            fillAlphas: 0,
            lineAlpha: 1,
            dashLengthField: "dashLengthLine",
            labelText: "[[drytonnage]]",
          },
          {
            id: "Line2",
            valueAxis: "Axis2",
            fontSize: scope.config.fontSize,
            balloonText: "Toneladas Humedas" + "</b><br/>[[wettonnage]]T",
            labelPosition: "top",
            title: "Toneladas Humedas",
            valueField: "wettonnage",
            showBalloon: true,
            color: "#BFB8B8",
            bulletSize: 20,
            lineColor: "#BFB8B8",
            type: "smoothedLine",
            bullet: "round",
            lineThickness: 3,
            bulletBorderAlpha: 2,
            useLineColorForBulletBorder: true,
            bulletBorderThickness: 4,
            fillAlphas: 0,
            lineAlpha: 1,
            dashLengthField: "dashLengthLine",
          },
          {
            id: "Line3",
            valueAxis: "Axis2",
            balloonText: "Toneladas Humedas" + "</b><br/>[[drytonnageup]]T",
            fontSize: scope.config.fontSize + 10,
            labelPosition: "top",
            bullet: "diamond",
            lineThickness: 3,
            bulletBorderAlpha: 2,
            useLineColorForBulletBorder: true,
            bulletBorderThickness: 4,
            title: "Toneladas Secas (Up)",
            valueField: "drytonnageup",
            showBalloon: true,
            linecolor: "#001BFF",
            Color: "#001BFF",
            bulletSize: 30,
            lineAlpha: 0,
          },
          {
            id: "Line4",
            valueAxis: "Axis2",
            balloonText: "Toneladas Humedas" + "</b><br/>[[drytonnagedown]]T",
            fontSize: scope.config.fontSize + 10,
            labelPosition: "top",
            bullet: "diamond",
            lineThickness: 3,
            bulletBorderAlpha: 2,
            useLineColorForBulletBorder: true,
            bulletBorderThickness: 4,
            title: "Toneladas Secas (Down)",
            valueField: "drytonnagedown",
            showBalloon: true,
            linecolor: "#FF0000",
            Color: "#FF0000",
            bulletSize: 30,
            lineAlpha: 0,
          },
        ],
        legend: {
          position: scope.config.legendPosition,
          equalWidths: true,
          color: scope.config.textColor,
          enabled: scope.config.showLegend,
          valueAlign: "right",
          horizontalGap: 10,
          useGraphSettings: true,
          size: 36,
          bold: true,
          markerSize: 36,
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
        setTrendCategory();
        chart.valueAxes[0].minimum = getCorrectChartMin();
        chart.valueAxes[0].maximum = getCorrectChartMax() + maxLabelRight;
        chart.valueAxes[1].minimum = getCorrectChartMin();
        chart.valueAxes[1].maximum = getCorrectChartMax() + maxLabelRight;

        chart.valueAxes[2].maximum = getCorrectChartLine();
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
        if (chart.graphs[0].lineThickness !== scope.config.lineThick) {
          chart.graphs[0].lineThickness = scope.config.lineThick;
        }
        // if (chart.graphs[0].lineColor !== scope.config.seriesColor1) {
        //     chart.graphs[0].lineColor = scope.config.seriesColor1;
        // }
        // if (chart.graphs[1].lineColor !== scope.config.seriesColor2) {
        //     chart.graphs[1].lineColor = scope.config.seriesColor2;
        // }
        // if (chart.graphs[2].lineColor !== scope.config.seriesColor3) {
        //     chart.graphs[2].lineColor = scope.config.seriesColor3;
        // }
        // if (chart.graphs[3].lineColor !== scope.config.seriesColor4) {
        //     chart.graphs[3].lineColor = scope.config.seriesColor4;
        // }
        // if (chart.graphs[4].lineColor !== scope.config.seriesColor5) {
        //     chart.graphs[4].lineColor = scope.config.seriesColor5;
        // }
        // if (chart.graphs[5].lineColor !== scope.config.seriesColor6) {
        //     chart.graphs[5].lineColor = scope.config.seriesColor6;
        // }

        if (chart.chartScrollbar.enabled != scope.config.showChartScrollBar) {
          chart.chartScrollbar.enabled = scope.config.showChartScrollBar;
        }
        if (scope.config.showValues) {
          chart.graphs[0].labelText = "[[value]]";
          chart.graphs[1].labelText = "[[value]]";
        } else {
          chart.graphs[0].labelText = "";
          chart.graphs[1].labelText = "";
        }
        if (chart.precision != scope.config.decimalPlaces) {
          chart.precision = scope.config.decimalPlaces;
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
