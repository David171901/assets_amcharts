/**
 * Name: Rendiento Planta Chungar
 * File name: sym-RendimientoPlantaChungar.js
 * Atribute (10 atribute): 
 *    example path: 
        "af:\\CDPMS16\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\PLANTA CONCENTRADORA CHUNGAR\00 EQUIPOS CRITICOS\DASHBOARD GERENCIAL MANTENIMIENTO|SUMA CHUNGAR"
        "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\PLANTA CONCENTRADORA CHUNGAR\\00 EQUIPOS CRITICOS\\DASHBOARD GERENCIAL MANTENIMIENTO|SUMA CHUNGAR G1"
        "af:\\CDPMS16\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\PLANTA CONCENTRADORA CHUNGAR\00 EQUIPOS CRITICOS\DASHBOARD GERENCIAL MANTENIMIENTO|SUMA REAL CHUNGAR"
        "af:\\CDPMS16\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\PLANTA CONCENTRADORA CHUNGAR\00 EQUIPOS CRITICOS\DASHBOARD GERENCIAL MANTENIMIENTO|SUMA REAL CHUNGAR G1"
        "af:\\CDPMS16\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\PLANTA CONCENTRADORA CHUNGAR\00 EQUIPOS CRITICOS\DASHBOARD GERENCIAL MANTENIMIENTO|TONELAJE F12 GUARDIA 1 REAL"
        "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\PLANTA CONCENTRADORA CHUNGAR\\00 EQUIPOS CRITICOS\\DASHBOARD GERENCIAL MANTENIMIENTO|TONELADAS SECAS DEPURADAS|Target"
        "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\PLANTA CONCENTRADORA CHUNGAR\\00 EQUIPOS CRITICOS\\DASHBOARD GERENCIAL MANTENIMIENTO|TONELADAS SECAS DEPURADAS|TargetDown"
        "af:\\CDPMS16\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\PLANTA CONCENTRADORA CHUNGAR\00 EQUIPOS CRITICOS\DASHBOARD GERENCIAL MANTENIMIENTO|TONELADAS SECAS DEPURADAS|TargetUp"
        "af:\\CDPMS16\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\PLANTA CONCENTRADORA CHUNGAR\00 EQUIPOS CRITICOS\DASHBOARD GERENCIAL MANTENIMIENTO|TONELADAS SECAS DEPURADAS"
        "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\PLANTA CONCENTRADORA CHUNGAR\\00 EQUIPOS CRITICOS\\DASHBOARD GERENCIAL MANTENIMIENTO|TONELADAS HUMEDAS DEPURADAS"

 * 
 */

(function (CS) {
  var myEDcolumnDefinition = {
    typeName: "RendimientoPlantaChungar",
    displayName: "Rendiento Planta Chungar",
    inject: ["timeProvider"],
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
        lineThick: 4,
        seriesColor1: "#66D47D",
        seriesColor2: "#00a2e8",
        seriesColor3: "#000000",
        seriesColor4: "#000000",
        seriesColor5: "#000000",
        seriesColor6: "#000000",
        seriesColor7: "#111111",
        seriescolor8: "#ffc90e",
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
    console.log("\t[+]Rendimiento de Planta Chungar");
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    scope.config.FormatType = null;

    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString =
      "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv.id = newUniqueIDString;
    var chart = false;
    var dataArray = [];
    var targetDefault;
    var targetDown;
    var targetUP;

    // Funcion inicializadora
    function myCustomDataUpdateFunction(data) {
      if (data !== null && data.Data) {
        dataArray = [];

        let firstTurn = formatTwoArraysInOne(sumatoriaDosDataArrayPorFecha(data.Data[12].Values,data.Data[13].Values),data.Data[11]);
        // let secondTurn = data.Data[1];
        let secondTurn = {
          DataType: "Float",
          DisplayDigits: -5,
          EndTime: "2023-01-12T19:11:51.857Z",
          Label: "03 PLANTA CONCENTRADORA|SUMA TONELAJE G2",
          Maximum: 0,
          Minimum: 0,
          Path: "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\PLANTA CONCENTRADORA CHUNGAR\\00 KPIs CLAVE\\03 PLANTA CONCENTRADORA|SUMA TONELAJE G2",
          StartTime: "2023-01-01T00:00:00Z",
          Values: [
            {
              Value: 0,
              Time: "2023-01-01T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-02T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-03T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-04T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-05T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-06T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-07T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-08T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-09T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-10T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-11T00:00:00Z",
            },
            {
              Value: 0,
              Time: "2023-01-12T00:00:00Z",
            },
          ],
        };

        let firstTurnReal = data.Data[2];
        // let secondTurnReal = data.Data[3];
        let secondTurnReal = {
          DataType: "Float",
          DisplayDigits: -5,
          EndTime: "2023-01-12T19:11:51.857Z",
          Label: "03 PLANTA CONCENTRADORA|SUMA TONELAJE G2",
          Maximum: 0,
          Minimum: 0,
          Path: "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\PLANTA CONCENTRADORA CHUNGAR\\00 KPIs CLAVE\\03 PLANTA CONCENTRADORA|SUMA TONELAJE G2",
          StartTime: "2023-01-01T00:00:00Z",
          Values: [
            { Value: 0, Time: "2023-01-01T00:00:00Z" },
            { Value: 0, Time: "2023-01-12T19:10:47.315414Z" },
          ],
        };

        let customDate = data.Data[4];

        // Asignacion de targetDefaults *****************
        targetDefault = data.Data[5].Values[0].Value;
        targetDown = data.Data[6].Values[0].Value;
        targetUP = data.Data[7].Values[0].Value;

        // TONELAJES ************************************
        let dryTonnage = formatTwoArraysInOne(sumatoriaDosDataArrayPorFecha(data.Data[12].Values,data.Data[13].Values),data.Data[11]);
        let wetTonnage = data.Data[9];

        let dryTonnageReal = {};
        dryTonnageReal.Values = [];
        let wetTonnageReal = {};
        wetTonnageReal.Values = [];
        // **********************************************

        let customStartDate = timeProvider.displayTime.start;

        let fechaInicio = timeProvider.displayTime.start;

        let stringUnitsFirst, stringUnitsSecond;
        stringUnitsFirst = stringUnitsSecond = "";
        if (firstTurn.Units) stringUnitsFirst = firstTurn.Units;
        if (secondTurn.Units) stringUnitsSecond = secondTurn.Units;

        let monthNow = 0;

        let searchTimeDate = new Date(customStartDate);

        monthNow = searchTimeDate.getMonth() + 2;

        let searchYear = searchTimeDate.getFullYear();
        let daysOfMonth = getDaysOfMonth(monthNow, searchYear);

        fillDataArray(
          firstTurn,
          secondTurn,
          firstTurnReal,
          secondTurnReal,
          dryTonnage,
          dryTonnageReal,
          wetTonnage,
          wetTonnageReal,
          new Date(customStartDate),
          daysOfMonth,
          dataArray
        );
        setValueAxisYToMargin(dataArray);

        if (!chart)
          chart = getNewChart(
            symbolContainerDiv,
            monthNow,
            scope,
            stringUnitsFirst,
            stringUnitsSecond,
            dataArray
          );
        else refreshChart(chart, scope, monthNow);
      }
    }

    function formatTwoArraysInOne (value1, value2) {
      let lastValue2 = value2.Values.at(-1);
      return {
        ...value1,
        Values: [...value1.Values, lastValue2]
      }
    }

    function generarFechasIntermedias(fechaInicio, fechaFin) {
      const fechas = [];
    
      // Convertir las fechas a objetos Date
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);
    
      // Iterar sobre el rango de fechas y agregar cada fecha al array
      let fechaActual = new Date(fechaInicioObj);
      while (fechaActual <= fechaFinObj) {
        fechas.push(new Date(fechaActual));
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    
      // Convertir las fechas en formato ISO 8601
      const fechasISO = fechas.map((fecha) => fecha.toISOString().split('T')[0]);
      return fechasISO;
    }

    function sumatoriaDosDataArrayPorFecha (data1, data2) {
      let startDate = timeProvider.displayTime.start;
      let endDate = timeProvider.displayTime.end != "*"
        ? new Date(timeProvider.displayTime.end)
        : new Date();
      const fechasIntermedias = generarFechasIntermedias(startDate, endDate);
      let arrayValues = [];
      fechasIntermedias.forEach(el => {
        let dataValue1 = data1.filter(elem => elem.Time.includes(el))[0] ? data1.filter(elem => elem.Time.includes(el))[0].Value : 0;
        let dataValue2 = data2.filter(elem => elem.Time.includes(el))[0] ? data2.filter(elem => elem.Time.includes(el))[0].Value : 0;
        
        arrayValues.push({
          Value: (el == '2023-01-29') ? 0 : dataValue1 + dataValue2,
          Time: `${el}T19:00:00.000Z`,
        })
      })
      
      return {
        DataType: "Float",
        DisplayDigits: -5,
        EndTime: "2023-01-12T19:11:51.857Z",
        Label: "03 PLANTA CONCENTRADORA|SUMA TONELAJE G2",
        Maximum: 0,
        Minimum: 0,
        Path: "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\PLANTA CONCENTRADORA CHUNGAR\\00 KPIs CLAVE\\03 PLANTA CONCENTRADORA|SUMA TONELAJE G2",
        StartTime: "2023-01-01T00:00:00Z",
        Values: arrayValues,
      };
    }

    function restarCincoHoras (date) {
      const fecha = new Date(date);
      fecha.setHours(fecha.getHours() - 5);
      return fecha
    }

    function fillDataArray(
      firstTurn,
      secondTurn,
      firstTurnReal,
      secondTurnReal,
      dryTonnage,
      dryTonnageReal,
      wetTonnage,
      wetTonnageReal,
      start,
      daysOfMonth,
      dataArray
    ) {
      let todayDate =
        timeProvider.displayTime.end != "*"
          ? new Date(timeProvider.displayTime.end)
          : new Date();
      let currentDay = todayDate.getDate();
      let currentHour = todayDate.getHours();
      let currentMonth = todayDate.getMonth() + 1;
      let iterableDate = start;
      let daysOfPreviewMonth = getDaysOfMonth(start.getMonth() + 1);
      let moreDays = null;

      moreDays = daysOfPreviewMonth - start.getDate();

      todayDate.setDate(todayDate.getDate() + 1);

      for (let dayIndex = 1; dayIndex <= daysOfMonth + moreDays; dayIndex++) {
        iterableDate.setDate(iterableDate.getDate() + 1);

        if (iterableDate.getTime() <= todayDate.getTime()) {
          //traen el ultimo si no tiene un valor registrado x requerimiento(getTurnValue)
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

          //no escribe nada si no hay valor registrado(getTurnValueForNews)
          let floatFirstTurn = parseFloat(firstTurnValue);
          let floatSecondTurn = parseFloat(secondTurnValue);
          let floatDryTonnage = parseFloat(dryTonnageValue);
          let floatWetTonnage = parseFloat(wetTonnageValue);
          let total = getTotalTurns(floatFirstTurn, floatSecondTurn);

          let newDataObject = getNewDataObject(
            iterableDate.getDate(),
            floatFirstTurn,
            floatSecondTurn,
            floatDryTonnage,
            floatWetTonnage,
            total,
            [iterableDate.getMonth() + 1]
          );
          dataArray.push(newDataObject);
        } else {
          let newDataObject = getNewDataObject(
            iterableDate.getDate(),
            null,
            null,
            null,
            null,
            null,
            [iterableDate.getMonth() + 1]
          );
          dataArray.push(newDataObject);
        }
      }
    }

    function setValueAxisYToMargin(dataArray) {
      let totals = dataArray.map(function (item) {
        return item.total;
      });
      let maximum = Math.max.apply(null, totals);

      let axisValue = maximum + maximum / 10;
      scope.config.yAxisRange = "customRange";
      scope.config.maximumYValue = parseInt(axisValue);
      scope.config.minimumYValue = 0;
    }

    function getNewDataObject(
      dayIndex,
      firstTurnValue,
      secondTurnValue,
      dryTonnage,
      wetTonnage,
      total,
      month
    ) {
      let todayDate =
        timeProvider.displayTime.end != "*"
          ? new Date(timeProvider.displayTime.end)
          : new Date();
      let currentMonth = todayDate.getMonth() + 1;
      return {
        timestamp: dayIndex + "/" + month,
        turno1: firstTurnValue
          ? firstTurnValue.toFixed(scope.config.decimalPlaces)
          : firstTurnValue,
        turno2: secondTurnValue
          ? secondTurnValue.toFixed(scope.config.decimalPlaces)
          : secondTurnValue,
        drytonnage: dryTonnage
          ? dryTonnage.toFixed(scope.config.decimalPlaces)
          : dryTonnage,
        wettonnage: wetTonnage
          ? wetTonnage.toFixed(scope.config.decimalPlaces)
          : wetTonnage,
        // Dry Tonnage
        drytonnageup: dryTonnage
          ? dryTonnage > 5775
            ? dryTonnage.toFixed(scope.config.decimalPlaces)
            : null
          : null,
        drytonnagedown: dryTonnage
          ? dryTonnage < 5238
            ? dryTonnage.toFixed(scope.config.decimalPlaces)
            : null
          : null,
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
          currentDay == iterableDate.getDate() &&
          currentMonth == iterableDate.getMonth() + 1
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

    // Funcion obtener dias del mes
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

    // Funcion inicializadora del grafico
    function getNewChart(
      symbolContainerDiv,
      monthNow,
      scope,
      stringUnitsFirst,
      stringUnitsSecond,
      dataArray
    ) {
      return AmCharts.makeChart(symbolContainerDiv.id, {
        type: "serial",
        theme: "none",
        hideCredits: true,
        creditsPosition: "bottom-right",
        addClassNames: true,
        depth3D: 20,
        angle: 0,
        marginRight: 1,
        marginLeft: 1,
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
        valueAxes: [
          {
            id: "Axis0",
            stackType: "regular",
            gridAlpha: 0,
            axisColor: scope.config.seriesColor2,
            position: "left",
            minimum: 0, //scope.config.minimumYValue,
            maximum: 15000, //scope.config.maximumYValue,
            labelsEnabled: false,
          },
          {
            id: "Axis1",
            stackType: "regular",
            gridAlpha: 0,
            axisColor: scope.config.seriesColor2,
            position: "left",
            minimum: 0, //scope.config.minimumYValue,
            maximum: 15000, //scope.config.maximumYValue,
            labelsEnabled: false,
          },
          {
            id: "Axis2",
            axisAlpha: 1,
            position: "right",
            gridAlpha: 0.1,
            maximum: 6000, //scope.config.maximumYValueAxisv2,
            minimum: 3000,
            labelsEnabled: true,
            step: 1000,
          },
        ],
        trendLines: [
          {
            finalCategory: "28/2",
            finalValue: targetUP,
            initialCategory: "29/1",
            initialValue: targetUP,
            lineColor: "#0084ff",
            //tipe: "smoothedLine",
            lineThickness: 5,
            balloonText: "Limite superior +5%" + " (" + targetUP + ")",
            //labelText: 5733 + "Tn",
            valueAxis: "Axis2",
          },
          {
            finalCategory: "28/2",
            finalValue: targetDown,
            initialCategory: "29/1",
            initialValue: targetDown,
            lineColor: "#f58e8e",
            lineThickness: 5,
            balloonText: "Limite inferior -5%" + " (" + targetDown + ")",
            //labelText: 5187 + "Tn",
            valueAxis: "Axis2",
          },
          {
            finalCategory: "28/2",
            finalValue: targetDefault,
            initialCategory: "29/1",
            initialValue: targetDefault,
            lineColor: "#57f76c",
            lineThickness: 5,
            balloonText: "Target / TMS" + " (" + targetDefault + ")",
            //labelText: 5460 + "Tn",
            valueAxis: "Axis2",
          },
        ],
        thousandsSeparator: "",
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
            title: "CHUNGAR",
            type: "column",
            fillAlphas: 0.8,
            lineAlpha: 0.3,
            lineColor: scope.config.seriesColor1,
            fontSize: scope.config.fontSize + 15,
            opacity: 1,
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
            id: "Line1",
            valueAxis: "Axis2",
            fontSize: scope.config.fontSize + 10,
            balloonText: "Toneladas Secas" + "</b><br/>[[drytonnage]]T",
            labelPosition: "bottom",
            title: "Toneladas Secas",
            valueField: "drytonnage",
            showBalloon: true,
            color: "#000000",
            bulletSize: 30,
            lineColor: "#08FF00",
            type: "smoothedLine",
            bullet: "diamond",
            lineThickness: 3,
            bulletBorderAlpha: 2,
            useLineColorForBulletBorder: true,
            bulletBorderThickness: 4,
            fillAlphas: 0,
            lineAlpha: 0.9,
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
            color: "#e0dcdc",
            bulletSize: 25,
            lineColor: "#e0dcdc",
            type: "smoothedLine",
            bullet: "diamond",
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
            balloonText: "Toneladas Secas" + "</b><br/>[[drytonnageup]]T",
            fontSize: scope.config.fontSize + 10,
            labelPosition: "top",
            bullet: "diamond",
            lineThickness: 3,
            bulletBorderAlpha: 2,
            useLineColorForBulletBorder: true,
            bulletBorderThickness: 4,
            title: "Produccion encima del l�mite esperado",
            valueField: "drytonnageup",
            showBalloon: true,
            balloncolor: "#001BFF",
            color: "#000000",
            bulletSize: 30,
            lineAlpha: 0,
            lineColor: "#3f48cc"
          },
          {
            id: "Line4",
            valueAxis: "Axis2",
            balloonText: "Toneladas Secas" + "</b><br/>[[drytonnagedown]]T",
            fontSize: scope.config.fontSize + 10,
            labelPosition: "top",
            bullet: "diamond",
            lineThickness: 3,
            bulletBorderAlpha: 2,
            useLineColorForBulletBorder: true,
            bulletBorderThickness: 4,
            title: "Produccion debajo del l�mite esperado",
            valueField: "drytonnagedown",
            showBalloon: true,
            color: "#000000",
            bulletSize: 30,
            lineAlpha: 0,
            lineColor: "#ed1c24"
          },
        ],
        legend: {
          position: scope.config.legendPosition,
          equalWidths: false,
          color: scope.config.textColor,
          enabled: scope.config.showLegend,
          valueAlign: "right",
          horizontalGap: 10,
          useGraphSettings: true,
          bold: true,
          markerSize: 24,
        },
        dataProvider: dataArray,
      });
    }

    // Funcion seteo de trends
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

    // Funcion añadir dias
    function addDays(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
    }

    // Funcion creacion de titulos
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

    // Funcion de configuracion
    function myCustomConfigurationChangeFunction() {
      if (chart) {
        setTrendCategory();
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
        if (chart.chartScrollbar.enabled != scope.config.showChartScrollBar) {
          chart.chartScrollbar.enabled = scope.config.showChartScrollBar;
        }
        if (scope.config.showValues) {
          chart.graphs[0].labelText = "[[value]]";
          chart.graphs[1].labelText = "[[value]]";
          chart.graphs[2].labelText = "[[value]]";
        } else {
          chart.graphs[0].labelText = "";
          chart.graphs[1].labelText = "";
          chart.graphs[2].labelText = "";
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
