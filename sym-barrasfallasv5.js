(function (CS) {
  var myEDcolumnDefinition = {
    typeName: "barrasfallasv5",
    displayName: "Diagrama de Barras Eventos con tarjets",
    inject: ["timeProvider"],
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    supportsDynamicSearchCriteria: true,
    iconUrl: "/Scripts/app/editor/symbols/ext/icons/barrasCOMM.png",
    visObjectType: symbolVis,
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        // DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
        Height: 600,
        Width: 1400,
        decimalPlaces: 0,
        textColor: "black",
        backgroundColor: "transparent",
        gridColor: "transparent",
        // plotAreaFillColor: "transparent",
        showTitle: true,
        showValues: true,
        fontSize: 12,
        FormatType: null,
        lineThick: 1,
        seriesColor1: "#3ab8a8",
        seriesColor2: "#297c72",
        seriesColor3: "#000000",
        seriesColor4: "#000000",
        showLegend: true,
        showChartScrollBar: false,
        legendPosition: "bottom",
        bulletSize: 8,
        customTitle: "",
        labelText: "",
        labelunit: "",
        graph3Value: "media",
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
    console.log("\t[+]Barras Fallas v5");
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    scope.config.FormatType = null;

    scope.config.stringLabel1 = "";
    scope.config.stringLabel2 = "";
    scope.config.stringLabel3 = "";
    scope.config.stringLabel4 = "";
    scope.config.stringLabel5 = "";
    scope.config.stringLabel6 = "";
    scope.config.stringLabel7 = "";
    scope.config.stringLabel8 = "";
    scope.config.stringLabel9 = "";
    scope.config.stringLabel10 = "";
    scope.config.stringUnits = "";

    var symbolContainerDiv = elem.find("#container")[0];
    var newUniqueIDString =
      "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
    symbolContainerDiv.id = newUniqueIDString;
    var chart = false;
    var dataArray = [];
    var Labels = [
      "Actividad Operacional",
      "Averías de Instrumentos",
      "Averías Eléctricas",
      "Averías Mecánicas",
      "Funcionamiento",
      "Influencia Externa",
      "Mantenimiento Planificado",
      "Otros",
      "Seguridad",
      "Stand By",
    ];

    function myCustomDataUpdateFunction(data) {
      let dataFormat = data.Data[0].Values;
      let arrayData = [
        ...new Set(dataFormat.map((el) => el.Value.split("||")[0])),
      ].map((element) =>
        Object({
          Label: element,
          Incidents: dataFormat
            .map((elem) =>
              Object({
                ...elem,
              })
            )
            .filter((el) => el.Value.includes(element)),
        })
      );

      let DATA = {
        Data: arrayData.map((element) => formatItem(element)),
        SymbolName: "Symbol4",
      };

      let titles = DATA.Data.map((el) => el.Label);
      if (DATA !== null && DATA.Data) {
        dataArray = [];
        // Averías Eléctricas
        let firstTurn =
          DATA.Data.filter((el) => el.Label == Labels[0])[0] ||
          formatItem({ Incidents: [] });
        // Averías Mecánicas
        let secondTurn =
          DATA.Data.filter((el) => el.Label == Labels[1])[0] ||
          formatItem({ Incidents: [] });
        // Funcionamiento
        let thirdTurn =
          DATA.Data.filter((el) => el.Label == Labels[2])[0] ||
          formatItem({ Incidents: [] });
        // Influencia Externa
        let fourthTurn =
          DATA.Data.filter((el) => el.Label == Labels[3])[0] ||
          formatItem({ Incidents: [] });
        // Mantenimiento Planificable
        let fifthTurn =
          DATA.Data.filter((el) => el.Label == Labels[4])[0] ||
          formatItem({ Incidents: [] });
        // Seguridad
        let sixthTurn =
          DATA.Data.filter((el) => el.Label == Labels[5])[0] ||
          formatItem({ Incidents: [] });
        // Stand By
        let seventhTurn =
          DATA.Data.filter((el) => el.Label == Labels[6])[0] ||
          formatItem({ Incidents: [] });
        // Otros
        let eighthTurn =
          DATA.Data.filter((el) => el.Label == Labels[7])[0] ||
          formatItem({ Incidents: [] });
        // Actividad Operacional
        let ninethTurn =
          DATA.Data.filter((el) => el.Label == Labels[8])[0] ||
          formatItem({ Incidents: [] });
        // Averías de Instrumentos
        let tenthTurn =
          DATA.Data.filter((el) => el.Label == Labels[9])[0] ||
          formatItem({ Incidents: [] });
        // segundo aset  --Tiempo total de operacion
        let eleventhTurn = data.Data[1];
        // Tonelaje seco
        let twelfthTurn = data.Data[2];
        // Tonelaje humedo
        let thirteenthTurn = data.Data[3];
        // Target 
        let targetDefault = data.Data[4]?.Values[0]?.Value || -10;
        // Target Down
        let targetDown = data.Data[5]?.Values[0]?.Value || -10;
        // Target UP
        let targetUP = data.Data[6]?.Values[0]?.Value || -10;
        
        let firstTurnReal = {};
        firstTurnReal.Values = [];
        let secondTurnReal = {};
        secondTurnReal.Values = [];
        let thirdTurnReal = {};
        thirdTurnReal.Values = [];
        let fourthTurnReal = {};
        fourthTurnReal.Values = [];
        let fifthTurnReal = {};
        fifthTurnReal.Values = [];
        let sixthTurnReal = {};
        sixthTurnReal.Values = [];
        let seventhTurnReal = {};
        seventhTurnReal.Values = [];
        let eighthTurnReal = {};
        eighthTurnReal.Values = [];
        let ninethTurnReal = {};
        ninethTurnReal.Values = [];
        let tenthTurnReal = {};
        tenthTurnReal.Values = [];
        let eleventhTurnReal = {};
        eleventhTurnReal.Values = [];
        let twelfthTurnReal = {};
        twelfthTurnReal.Values = [];
        let thirteenthTurnReal = {};
        thirteenthTurnReal.Values = [];

        let currentDay = new Date();
        let customStartDate = timeProvider.displayTime.start;
        let stringUnitsFirst,
          stringUnitsSecond,
          stringUnitsThird,
          stringUnitsFourth;
        stringUnitsFirst =
          stringUnitsSecond =
          stringUnitsThird =
          stringUnitsFourth =
            "";
        let monthNow = 0;
        let searchTimeDate = new Date(customStartDate);
        monthNow = searchTimeDate.getMonth() + 2;
        let searchYear = searchTimeDate.getFullYear();
        let daysOfMonth = 28;
        fillDataArray(
          firstTurn,
          secondTurn,
          thirdTurn,
          fourthTurn,
          fifthTurn,
          sixthTurn,
          seventhTurn,
          eighthTurn,
          ninethTurn,
          tenthTurn,
          eleventhTurn,
          twelfthTurn,
          thirteenthTurn,
          firstTurnReal,
          secondTurnReal,
          thirdTurnReal,
          fourthTurnReal,
          fifthTurnReal,
          sixthTurnReal,
          seventhTurnReal,
          eighthTurnReal,
          ninethTurnReal,
          tenthTurnReal,
          eleventhTurnReal,
          twelfthTurnReal,
          thirteenthTurnReal,
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
            dataArray,
            titles,
            targetUP,
            targetDown,
            targetDefault
          );
        else refreshChart(chart, scope, monthNow, dataArray);
      }
    }

    function addDays(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
    }

    // New functions
    function addDaysToDate(date, days) {
      var res = new Date(date);
      res.setDate(res.getDate() + days);
      return res;
    }

    function formatDate(year, month, day) {
      return `${year}-${month <= 9 ? `0${month}` : `${month}`}-${
        day <= 9 ? `0${day}` : `${day}`
      }`;
    }

    function formatItem(data) {
      let startTime = new Date(timeProvider.displayTime.start);
      let endTime = !new Date(timeProvider.displayTime.end).getMonth()
        ? new Date()
        : new Date(timeProvider.displayTime.end);
      let daysOfPreviewMonth = getDaysOfMonth(startTime.getMonth() + 1); //+1
      let moreDays = null;
      moreDays = daysOfPreviewMonth - startTime.getDate();

      let items = [];
      for (let index = 0; index < endTime.getDate() + moreDays + 1; index++) {
        let dayStart = startTime.getDate();
        let monthStart = startTime.getMonth() + 1;
        let yearStart = startTime.getFullYear();
        let item = data.Incidents.filter((element) =>
          element.Time.includes(formatDate(yearStart, monthStart, dayStart))
        ).map((element) =>
          Object({
            Value: element.Value.length == 0 ? [] : element.Value,
            Time: formatDate(yearStart, monthStart, dayStart),
          })
        );
        items.push(item);
        startTime = addDaysToDate(startTime, 1);
      }

      startTime = new Date(timeProvider.displayTime.start);

      let dataArray = [];
      for (let index = 0; index < endTime.getDate() + moreDays + 1; index++) {
        let dayStart = startTime.getDate();
        let monthStart = startTime.getMonth() + 1; // +1
        let yearStart = startTime.getFullYear();
        let dayEnd = endTime.getDate();
        let monthEnd = endTime.getMonth() + 1; // +1
        let yearEnd = endTime.getFullYear();
        let item =
          items.length == 0
            ? dataArray.push(
                Object({
                  Value: 0,
                  Time: formatDate(yearStart, monthStart, dayStart),
                })
              )
            : dataArray.push(
                Object({
                  Value:
                    items[index].reduce(
                      (previousValue, currentValue) =>
                        previousValue +
                        parseInt(currentValue.Value.split("||")[2]),
                      0
                    ) / 60,
                  Time: new Date(formatDate(yearStart, monthStart, dayStart))
                    .toISOString()
                    .replace(".000", "")
                    .replace("00:00:00", "11:59:00"),
                })
              );

        startTime = addDaysToDate(startTime, 1);
      }
      return Object({
        Values: dataArray,
        EndTime: "2022-10-04T14:41:10.306Z",
        Maximum: 100,
        Minimum: 0,
        StartTime: "2022-09-29T00:00:00Z",
        Label: data.Label,
      });
    }
    // ***end***

    function fillDataArray(
      firstTurn,
      secondTurn,
      thirdTurn,
      fourthTurn,
      fifthTurn,
      sixthTurn,
      seventhTurn,
      eighthTurn,
      ninethTurn,
      tenthTurn,
      eleventhTurn,
      twelfthTurn,
      thirteenthTurn,
      firstTurnReal,
      secondTurnReal,
      thirdTurnReal,
      fourthTurnReal,
      fifthTurnReal,
      sixthTurnReal,
      seventhTurnReal,
      eighthTurnReal,
      ninethTurnReal,
      tenthTurnReal,
      eleventhTurnReal,
      twelfthTurnReal,
      thirteenthTurnReal,
      start,
      daysOfMonth,
      dataArray
    ) {
      console.log(new Date(timeProvider.displayTime.start).getDate());
      console.log(" ~ file: sym-barrasfallasv5.js:381 ~ daysOfMonth", daysOfMonth)
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
      
      let daysOfMonth_ = setDaysCalendarMine(todayDate.getMonth());
      if((new Date(timeProvider.displayTime.start).getMonth() == 0) && (new Date(timeProvider.displayTime.start).getDate() == 1) ) {
        daysOfMonth_ = 0;
        moreDays = 27;
      };

      todayDate.setDate(todayDate.getDate() + 1);
      
      for (let dayIndex = 1; dayIndex <= daysOfMonth_ + moreDays; dayIndex++) {
        iterableDate.setDate(iterableDate.getDate() + 1);

        if (iterableDate.getTime() <= todayDate.getTime()) {
          let firstTurnValue = getTurnValue(
            firstTurn,
            iterableDate,
            true,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
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
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let thirdTurnValue = getTurnValue(
            thirdTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let fourthTurnValue = getTurnValue(
            fourthTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let fifthTurnValue = getTurnValue(
            fifthTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let sixthTurnValue = getTurnValue(
            sixthTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let seventhTurnValue = getTurnValue(
            seventhTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let eighthTurnValue = getTurnValue(
            eighthTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let ninethTurnValue = getTurnValue(
            ninethTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let tenthTurnValue = getTurnValue(
            tenthTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let eleventhTurnValue = getTurnValue(
            eleventhTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let twelfthTurnValue = getTurnValue(
            twelfthTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );
          let thirteenthTurnValue = getTurnValue(
            thirteenthTurn,
            iterableDate,
            false,
            firstTurnReal,
            secondTurnReal,
            thirdTurnReal,
            fourthTurnReal,
            fifthTurnReal,
            sixthTurnReal,
            seventhTurnReal,
            eighthTurnReal,
            ninethTurnReal,
            tenthTurnReal,
            eleventhTurnReal,
            twelfthTurnReal,
            thirteenthTurnReal,
            currentDay,
            currentHour,
            currentMonth
          );

          let floatFirstTurn = parseFloat(firstTurnValue);
          let floatSecondTurn = parseFloat(secondTurnValue);
          let floatThirdTurn = parseFloat(thirdTurnValue);
          let floatFourthTurn = parseFloat(fourthTurnValue);
          let floatFifthTurn = parseFloat(fifthTurnValue);
          let floatSixthTurn = parseFloat(sixthTurnValue);
          let floatSeventhTurn = parseFloat(seventhTurnValue);
          let floatEighthTurn = parseFloat(eighthTurnValue);
          let floatNinethTurn = parseFloat(ninethTurnValue);
          let floatTenthTurn = parseFloat(tenthTurnValue);
          let floatEleventhTurn = parseFloat(eleventhTurnValue);
          let floatTwelfthTurn = parseFloat(twelfthTurnValue);
          let floatThirteenthTurn = parseFloat(thirteenthTurnValue);

          let total = getTotalTurns(
            floatFirstTurn,
            floatSecondTurn,
            floatThirdTurn,
            floatFourthTurn,
            floatFifthTurn,
            floatSixthTurn,
            floatSeventhTurn,
            floatEighthTurn,
            floatNinethTurn,
            floatTenthTurn,
            floatEleventhTurn,
            floatTwelfthTurn
          );
          let media = getMediaTurns(
            floatFirstTurn,
            floatSecondTurn,
            floatThirdTurn,
            floatFourthTurn,
            floatFifthTurn,
            floatSixthTurn,
            floatSeventhTurn,
            floatEighthTurn,
            floatNinethTurn,
            floatTenthTurn,
            floatEleventhTurn,
            floatTwelfthTurn
          );

          let newDataObject = getNewDataObject(
            iterableDate.getDate(),
            floatFirstTurn,
            floatSecondTurn,
            floatThirdTurn,
            floatFourthTurn,
            floatFifthTurn,
            floatSixthTurn,
            floatSeventhTurn,
            floatEighthTurn,
            floatNinethTurn,
            floatTenthTurn,
            floatEleventhTurn,
            floatTwelfthTurn,
            floatThirteenthTurn,
            total,
            media,
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
            [iterableDate.getMonth() + 1]
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
      thirdTurnValue,
      fourthTurnValue,
      fifthTurnValue,
      sixthTurnValue,
      seventhTurnValue,
      eighthTurnValue,
      ninethTurnValue,
      tenthTurnValue,
      eleventhTurnValue,
      twelfthTurnValue,
      thirteenthTurn,
      total,
      media,
      month
    ) {
      return {
        timestamp: dayIndex + "/" + month,
        turno1:
          (eleventhTurnValue
            ? eleventhTurnValue.toFixed(scope.config.decimalPlaces)
            : eleventhTurnValue) || null,
        dateturno1:
          (eleventhTurnValue
            ? formatDateTurns(eleventhTurnValue.toFixed(scope.config.decimalPlaces))
            : eleventhTurnValue) || null,
        turno2:
          (secondTurnValue
            ? secondTurnValue.toFixed(scope.config.decimalPlaces)
            : secondTurnValue) || null,
        turno3:
          (thirdTurnValue
            ? thirdTurnValue.toFixed(scope.config.decimalPlaces)
            : thirdTurnValue) || null,
        turno4:
          (fourthTurnValue
            ? fourthTurnValue.toFixed(scope.config.decimalPlaces)
            : fourthTurnValue) || null,
        turno5:
          (fifthTurnValue
            ? fifthTurnValue.toFixed(scope.config.decimalPlaces)
            : fifthTurnValue) || null,
        turno6:
          (sixthTurnValue
            ? sixthTurnValue.toFixed(scope.config.decimalPlaces)
            : sixthTurnValue) || null,
        turno7:
          (seventhTurnValue
            ? seventhTurnValue.toFixed(scope.config.decimalPlaces)
            : seventhTurnValue) || null,
        turno8:
          (eighthTurnValue
            ? eighthTurnValue.toFixed(scope.config.decimalPlaces)
            : eighthTurnValue) || null,
        turno9:
          (ninethTurnValue
            ? ninethTurnValue.toFixed(scope.config.decimalPlaces)
            : ninethTurnValue) || null,
        turno10:
          (tenthTurnValue
            ? tenthTurnValue.toFixed(scope.config.decimalPlaces)
            : tenthTurnValue) || null,
        turno11:
          (firstTurnValue
            ? firstTurnValue.toFixed(scope.config.decimalPlaces)
            : firstTurnValue) || null,
        turno12:
        (twelfthTurnValue
          ? twelfthTurnValue.toFixed(0)
          : twelfthTurnValue) || null,
        turno13:
          (thirteenthTurn ? thirteenthTurn.toFixed(0) : thirteenthTurn) || null,
        // TARGET
        turno14:
        (twelfthTurnValue  ? ((twelfthTurnValue > 5623) ? twelfthTurnValue.toFixed(0) : null) : null),
        turno15:
        (twelfthTurnValue  ? ((twelfthTurnValue < 5296) ? twelfthTurnValue.toFixed(0) : null) : null),
          total: total ? total.toFixed(scope.config.decimalPlaces) : total,
        media: media ? media.toFixed(scope.config.decimalPlaces) : media,
        description: formatBalloonText(secondTurnValue,
          thirdTurnValue,
          fourthTurnValue,
          fifthTurnValue,
          sixthTurnValue,
          seventhTurnValue,
          eighthTurnValue,
          ninethTurnValue,
          tenthTurnValue,
          eleventhTurnValue)
      };
    }

    function formatDateTurns(number) {
      let int = Math.trunc(number);
      let float = ((number - Math.trunc(number))*60).toFixed(0);
      return `${int}h ${float}m`
    }

    function formatBalloonText(
      secondTurnValue,
      thirdTurnValue,
      fourthTurnValue,
      fifthTurnValue,
      sixthTurnValue,
      seventhTurnValue,
      eighthTurnValue,
      ninethTurnValue,
      tenthTurnValue,
      eleventhTurnValue
    ) {
      return `${secondTurnValue != 0 ? `RE │ Avería de Instrumentos: ${secondTurnValue ? formatDateTurns(secondTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"} ${thirdTurnValue != 0 ? `RE │ Avería Eléctrica : ${thirdTurnValue ? formatDateTurns(thirdTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"}  ${fourthTurnValue != 0 ? `RM │ Avería Mecánica: ${fourthTurnValue ? formatDateTurns(fourthTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"}  ${fifthTurnValue != 0 ? `TF │ Funcionamiento : ${fifthTurnValue ? formatDateTurns(fifthTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"}  ${sixthTurnValue != 0 ? `RG │ Influencia Externa: ${sixthTurnValue ? formatDateTurns(sixthTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"}  ${seventhTurnValue != 0 ? `MP │ Mantenimiento Planificado: ${seventhTurnValue ? formatDateTurns(seventhTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"} ${eighthTurnValue != 0 ? `Otros : ${eighthTurnValue ? formatDateTurns(eighthTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"}  ${ninethTurnValue != 0 ? `RnP │ Seguridad: ${ninethTurnValue ? formatDateTurns(ninethTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"}  ${tenthTurnValue != 0 ? `TnP │ Stand By: ${tenthTurnValue ? formatDateTurns(tenthTurnValue.toFixed(scope.config.decimalPlaces)) : ""} <br>`: "<span></span>"}`
    }

    function refreshChart(chart, scope, monthNow, dataArray) {
      if (!chart.chartScrollbar.enabled) {
        if (scope.config.showTitle) {
          chart.titles = createArrayOfChartTitles(monthNow);
        } else {
          chart.titles = null;
        }

        chart.dataProvider = dataArray;
      }
    }

    function setTrendCategory () {
      let endCategory = timeProvider.displayTime.end != "*" ? new Date(timeProvider.displayTime.end) : new Date();
      let startCategory = new Date(timeProvider.displayTime.start);
      startCategory = addDays(startCategory,1);
      chart.trendLines[0].finalCategory = `${endCategory.getDate()}/${endCategory.getMonth()+1}`;
      chart.trendLines[0].initialCategory = `${startCategory.getDate()}/${startCategory.getMonth()+1}`;
      chart.trendLines[1].finalCategory = `${endCategory.getDate()}/${endCategory.getMonth()+1}`;
      chart.trendLines[1].initialCategory = `${startCategory.getDate()}/${startCategory.getMonth()+1}`;
      chart.trendLines[2].finalCategory = `${endCategory.getDate()}/${endCategory.getMonth()+1}`;
      chart.trendLines[2].initialCategory = `${startCategory.getDate()}/${startCategory.getMonth()+1}`;

  }
    
    function getTurnValue(
      turnArray,
      iterableDate,
      isFirstTurn,
      firstTurnReal,
      secondTurnReal,
      thirdTurnReal,
      fourthTurnReal,
      fifthTurnReal,
      sixthTurnReal,
      seventhTurnReal,
      eighthTurnReal,
      ninethTurnReal,
      tenthTurnReal,
      eleventhTurnReal,
      twelfthTurnReal,
      thirteenthTurnReal,
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
          thirdTurnReal,
          fourthTurnReal,
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
            thirdTurnReal,
            fourthTurnReal,
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

    function getRealValue(
      turnValue,
      iterableDate,
      currentDay,
      currentHour,
      firstTurnReal,
      secondTurnReal,
      thirdTurnReal,
      fourthTurnReal,
      isFirstTurn,
      currentMonth
    ) {
      if (isFirstTurn)
        return getFirstTurnRealValue(
          turnValue,
          iterableDate,
          currentDay,
          currentHour,
          firstTurnReal,
          currentMonth
        );
      else
        return getSecondTurnRealValue(
          turnValue,
          iterableDate,
          currentDay,
          currentHour,
          secondTurnReal,
          currentMonth
        );
    }

    function getLastUnsavedTemporal(
      firstTurnReal,
      secondTurnReal,
      thirdTurnReal,
      fourthTurnReal,
      isFirstTurn
    ) {
      if (isFirstTurn) return null;
      else return null;
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
        return null;
      else if (
        iterableDay - 1 == currentDay &&
        currentHour >= 19 &&
        currentHour < 24 &&
        iterableDate.getMonth() + 1 == currentMonth
      )
        return null;
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
      )
        return null;
      else if (
        iterableDay - 1 == currentDay &&
        currentHour >= 19 &&
        currentHour < 24 &&
        iterableDate.getMonth() + 1 == currentMonth
      )
        return 0;
      else return turnValue;
    }

    function getTotalTurns(
      firstTurnValue,
      secondTurnValue,
      thirdTurnValue,
      fourthTurnValue,
      fifthTurnValue,
      sixthTurnValue,
      seventhTurnValue,
      eighthTurnValue,
      ninethTurnValue,
      tenthTurnValue,
      eleventhTurnValue,
      twelfthTurnValue
    ) {
      let firstTurn = firstTurnValue || 0;
      let secondTurn = secondTurnValue || 0;
      let thirdTurn = thirdTurnValue || 0;
      let fourthTurn = fourthTurnValue || 0;
      let fifthTurn = fifthTurnValue || 0;
      let sixthTurn = sixthTurnValue || 0;
      let seventhTurn = seventhTurnValue || 0;
      let eighthTurn = eighthTurnValue || 0;
      let ninethTurn = ninethTurnValue || 0;
      let tenthTurn = tenthTurnValue || 0;
      let eleventhTurn = eleventhTurnValue || 0;
      let twelfthTurn = twelfthTurnValue || 0;
      let total =
        firstTurn +
        secondTurn +
        thirdTurn +
        fourthTurn +
        fifthTurn +
        sixthTurn +
        seventhTurn +
        eighthTurn +
        ninethTurn +
        tenthTurn +
        eleventhTurn +
        twelfthTurn;
      return total != 0 ? total : null;
    }

    function getMediaTurns(
      firstTurnValue,
      secondTurnValue,
      thirdTurnValue,
      fourthTurnValue,
      fifthTurnValue,
      sixthTurnValue,
      seventhTurnValue,
      eighthTurnValue,
      ninethTurnValue,
      tenthTurnValue,
      eleventhTurnValue,
      twelfthTurnValue
    ) {
      let firstTurn = firstTurnValue || 0;
      let secondTurn = secondTurnValue || 0;
      let thirdTurn = thirdTurnValue || 0;
      let fourthTurn = fourthTurnValue || 0;
      let fifthTurn = fifthTurnValue || 0;
      let sixthTurn = sixthTurnValue || 0;
      let seventhTurn = seventhTurnValue || 0;
      let eighthTurn = eighthTurnValue || 0;
      let ninethTurn = ninethTurnValue || 0;
      let tenthTurn = tenthTurnValue || 0;
      let eleventhTurn = eleventhTurnValue || 0;
      let twelfthTurn = twelfthTurnValue || 0;
      let media =
        (firstTurn +
          secondTurn +
          thirdTurn +
          fourthTurn +
          fifthTurn +
          sixthTurn +
          seventhTurn +
          eighthTurn +
          ninethTurn +
          tenthTurn +
          eleventhTurn +
          twelfthTurn) /
        12;
      return media != 0 ? media : null;
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

    function getDaysOfMonth(numMonth, numYear) {
      let daysOfMonth = 31; // 31 cambiado por 28
      numMonth = parseInt(numMonth);
      numYear = parseInt(numYear);
      if (numMonth == 4 || numMonth == 6 || numMonth == 9 || numMonth == 11) {
        daysOfMonth = 30; // 30 cambiado por 28
      }
      if (numMonth == 2) {
        daysOfMonth = 28;
        if (numYear % 4 == 0) {
          daysOfMonth = 29;
        }
      }
      return daysOfMonth;
    }

    function getDefaultArray(value) {
      let todayDate =
        timeProvider.displayTime.end != "*"
          ? new Date(timeProvider.displayTime.end)
          : new Date();
      let daysOfMonth = getDaysOfMonth(
        todayDate.getMonth() + 1,
        todayDate.getFullYear
      );
      let month = todayDate.getMonth() + 1;
      let year = todayDate.getFullYear();

      let dataArray = [];
      for (let index = 1; index <= daysOfMonth; index++) {
        let indexString = index <= 9 ? `0${index}` : `${index}`;
        let monthString = month <= 9 ? `0${month}` : `${month}`;
        dataArray.push(
          Object({
            Value: value,
            Time: `${year}-${monthString}-${indexString}T05:00:00Z`,
          })
        );
      }
      return Object({
        StartTime: "2022-10-01T00:00:00Z",
        EndTime: "2022-10-18T17:16:56.97Z",
        Minimum: 0,
        Maximum: 100,
        Values: dataArray,
      });
    }

    function getNewChart(
      symbolContainerDiv,
      monthNow,
      scope,
      stringUnitsFirst,
      stringUnitsSecond,
      dataArray,
      titles,
      targetUP,
      targetDown,
      targetDefault
    ) {
      if (scope.config.password == "COMM2020$") {
        return AmCharts.makeChart(symbolContainerDiv.id, {
          type: "serial",
          hideCredits: true,
          creditsPosition: "bottom-right",
          angle: 0,
          marginRight: 1,
          marginLeft: 1,
          titles: createArrayOfChartTitles(),
          fontSize: scope.config.fontSize,
          categoryField: "timestamp",
          precision: scope.config.decimalPlaces,
          backgroundColor: scope.config.backgroundColor,
          color: scope.config.textColor,
          autoMargin: true,
          autoMarginOffset: 10,
          decimalSeparator: ".",
          thousandsSeparator: "",
          pathToImages: "Scripts/app/editor/symbols/ext/images/",
          startDuration: 1,
          balloon: {
            maxWidth: 1000,
            fontSize: scope.config.fontSize + 5,
            fillAlpha: 1,
            borderThickness: 6,
            bordercolor: "#0a0a0a",
            cornerRadius: 2,
            textAlign: "left",
            fadeOutDuration: 10,
          },
          trendLines: [
            {
              finalCategory: "29/11",
              finalValue: targetUP,
              initialCategory: "28/12",
              initialValue: targetUP,
              lineColor: "#ffcccc",
              //tipe: "smoothedLine",
              lineThickness: 5,
              balloonText: "Límite superior +3%" + " (" + targetUP + ")",
             //labelText: 5733 + "Tn",
              valueAxis: "Axis2",
              fillAlphas: 0.5,
            },
            {
              finalCategory: "29/11",
              finalValue: targetDown,
              initialCategory: "28/12",
              initialValue: targetDown,
              lineColor: "#ffcccc",
              lineThickness: 5,
              balloonText: "Límite inferior -3%" + " (" + targetDown + ")",
             //labelText: 5187 + "Tn",
              valueAxis: "Axis2",
              fillAlphas: 0.5,
            },
            {
              finalCategory: "29/11",
              finalValue: targetDefault,
              initialCategory: "28/12",
              initialValue: targetDefault,
              lineColor: "#5e8dff",
              lineThickness: 5,
              balloonText: "Target / TMS" + " (" + targetDefault + ")",
              //labelText: 5460 + "Tn",
              valueAxis: "Axis2",
              fillAlphas: 0.5,
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
            selectedBackgroundAlpha: 0.2,
          },
          valueAxes: [
            {
              id: "Axis1",
              gridAlpha: 0,
              axisColor: scope.config.seriesColor2,
              position: "left",
              stackType: "regular",
              // "title": "Horas",
              maximum: 100,
              minimum: 0,
              step: 2,
              labelsEnabled: false,
            },
            {
              id: "Axis2",
              axisAlpha: 1,
              position: "right",
              gridAlpha: 0.05,
              maximum: 6500,
              minimum: 3500,
              step: 5000,
              //labelsEnabled: false,
            },
          ],
          categoryAxis: {
            axisColor: scope.config.seriesColor2,
            minPeriod: "ss",
            gridAlpha: 0.35,
            gridPosition: "start",
            autoWrap: true,
          },
          depth3D: 20,
          angle: 35,
          graphs: [
            {
              id: "GAcumulado1",
              clustered: false,
              title: "Disponibilidad",
              type: "column",
              fillAlphas: 1,
              color: "#000000",
              labelText: "[[turno1]]" + " " + scope.config.labelunit,
              bold: true,
              balloonText:
                "<strong> Disponibilidad: </strong> </b><br />" +
                "[[dateturno1]]  </b><br />" +        
                "<strong> Eventos: </strong> </b><br />" +
                "[[description]]" +
                scope.config.labelunit,
              valueField: "turno1",
              valueAxis: "Axis1",
              lineColor: "#25E576",
              labelRotation: 270,
              
            },
            {
              id: "GAcumulado2",
              clustered: false,
              title: Labels[1],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno2]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[1] +
                "</b><br />[[timestamp]]</b><br />[[turno2]] " +
                scope.config.labelunit,
              valueField: "turno2",
              valueAxis: "Axis1",
              lineColor: "#238673",
            },
            {
              id: "GAcumulado3",
              clustered: false,
              title: Labels[2],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno3]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[2] +
                "</b><br />[[timestamp]]</b><br />[[turno3]] " +
                scope.config.labelunit,
              valueField: "turno3",
              valueAxis: "Axis1",
              lineColor: "#D4AC0D",
            },
            {
              id: "GAcumulado4",
              clustered: false,
              title: Labels[3],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno4]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[3] +
                "</b><br />[[timestamp]]</b><br />[[turno4]] " +
                scope.config.labelunit,
              valueField: "turno4",
              valueAxis: "Axis1",
              lineColor: "#CA6F1E",
            },
            {
              id: "GAcumulado5",
              clustered: false,
              title: Labels[4],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno5]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[4] +
                "</b><br />[[timestamp]]</b><br />[[turno5]] " +
                scope.config.labelunit,
              valueField: "turno5",
              valueAxis: "Axis1",
              lineColor: "#884EA0",
            },
            {
              id: "GAcumulado6",
              clustered: false,
              title: Labels[5],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno6]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[5] +
                "</b><br />[[timestamp]]</b><br />[[turno6]] " +
                scope.config.labelunit,
              valueField: "turno6",
              valueAxis: "Axis1",
              lineColor: "#1BD2D8",
            },
            {
              id: "GAcumulado7",
              clustered: false,
              title: Labels[6],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno7]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[6] +
                "</b><br />[[timestamp]]</b><br />[[turno7]] " +
                scope.config.labelunit,
              valueField: "turno7",
              valueAxis: "Axis1",
              lineColor: "#2E4053",
            },
            {
              id: "GAcumulado8",
              clustered: false,
              title: Labels[7],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno8]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[7] +
                "</b><br />[[timestamp]]</b><br />[[turno8]] " +
                scope.config.labelunit,
              valueField: "turno8",
              valueAxis: "Axis1",
              lineColor: "#685858",
            },
            {
              id: "GAcumulado9",
              clustered: false,
              title: Labels[8],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno9]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[8] +
                "</b><br />[[timestamp]]</b><br />[[turno9]] " +
                scope.config.labelunit,
              valueField: "turno9",
              valueAxis: "Axis1",
              lineColor: "#839192",
            },
            {
              id: "GAcumulado10",
              clustered: false,
              title: Labels[9],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno10]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[9] +
                "</b><br />[[timestamp]]</b><br />[[turno10]] " +
                scope.config.labelunit,
              valueField: "turno10",
              valueAxis: "Axis1",
              lineColor: "#D0D3D4",
            },
            {
              id: "GAcumulado11",
              clustered: false,
              title: Labels[0],
              type: "column",
              bold: true,
              fillAlphas: 1,
              color: "#000000",
              fontSize: scope.config.fontSize,
              labelText: "[[turno11]]" + " " + scope.config.labelunit,
              balloonText:
                Labels[0] +
                "</b><br />[[timestamp]]</b><br />[[turno11]] " +
                scope.config.labelunit,
              valueField: "turno11",
              valueAxis: "Axis1",
              lineColor: "#2471A3",
            },
            {
              //Linea de codigo para el trend de tonelaje humedo o seco
              id: "Line1",
              valueAxis: "Axis2",
              balloonText:
                "Toneladas Secas" + "</b><br/>[[turno12]]T",
              fontSize: scope.config.fontSize + 10,
              labelPosition: "top",
              bullet: "diamond",
              lineThickness: 3,
              bulletBorderAlpha: 2,
              useLineColorForBulletBorder: true,
              bulletBorderThickness: 4,
              labelText: "[[turno12]]",
              title: "Toneladas Secas",
              valueField: "turno12",
              showBalloon: true,
              linecolor: "#25E576",
              type: "smoothedLine",
              Color: "#000000",
              bulletSize: 20,
              lineAlpha: 1,
              dashLengthField: "dashLengthLine",
            },
           /* {
              id: "Line3",
              valueAxis: "Axis2",
              balloonText:
                "Toneladas Humedas" + "</b><br/>[[turno14]]T",
              fontSize: scope.config.fontSize + 10,
              labelPosition: "top",
              bullet: "triangleUp",
              lineThickness: 3,
              bulletBorderAlpha: 2,
              useLineColorForBulletBorder: true,
              bulletBorderThickness: 4,
              labelText: "[[turno14]]",
              title: "Toneladas Humedas (Up)",
              valueField: "turno14",
              showBalloon: true,
              linecolor: "#00c71b",
              Color: "#CD6155",
              bulletSize: 30,
              lineAlpha: 0,
            },
            {
              id: "Line4",
              valueAxis: "Axis2",
              balloonText:
                "Toneladas Humedas" + "</b><br/>[[turno15]]T",
              fontSize: scope.config.fontSize + 10,
              labelPosition: "top",
              bullet: "triangleUp",
              lineThickness: 3,
              bulletBorderAlpha: 2,
              useLineColorForBulletBorder: true,
              bulletBorderThickness: 4,
              labelText: "[[turno15]]",
              title: "Toneladas Humedas (Down)",
              valueField: "turno15",
              showBalloon: true,
              linecolor: "#00c71b",
              Color: "#F4D03F",
              bulletSize: 30,
              lineAlpha: 0,
            },*/
            {//linea de codigo para el tarjet de tonelaje humedo o seco
              id: "Line2",
              valueAxis: "Axis2",
              fontSize: scope.config.fontSize + 5,
              balloonText: "Toneladas Humedas" + "</b><br/>[[turno13]]T",
              labelPosition: "top",
              title: "Toneladas Humedas",
              valueField: "turno13",
              showBalloon: true,
              color: "#BFB8B8",
              bulletSize: 15,
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

      return AmCharts.makeChart(symbolContainerDiv.id, {
        type: "serial",
        theme: "none",
        marginRight: 70,
        dataProvider: [],
        startDuration: 1,
        graphs: [
          {
            balloonText: "<b>Default</b>",
            fillAlphas: 0.9,
            lineAlpha: 0.5,
            type: "column",
            valueField: "turno1",
          },
        ],
        chartCursor: {
          categoryBalloonEnabled: false,
          cursorAlpha: 0,
          zoomable: false,
          //oneBalloonOnly: true,
          fadeOutDuration: 1000,
        },
        categoryField: "timestamp",
        categoryAxis: {
          gridPosition: "start",
          labelRotation: 45,
        },
        export: {
          enabled: true,
        },
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
      setTrendCategory ();
      if (chart) {
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
        if (chart.fontSize !== scope.config.fontSize) {
          chart.fontSize = scope.config.fontSize;
          chart.graphs[0].fontSize = scope.config.fontSize + 10;
        }
        if (chart.graphs[0].lineThickness !== scope.config.lineThick) {
          chart.graphs[0].lineThickness = scope.config.lineThick;
        }
        if (chart.chartScrollbar.enabled != scope.config.showChartScrollBar) {
          chart.chartScrollbar.enabled = scope.config.showChartScrollBar;
        }
        if (scope.config.showValues) {
          chart.graphs[0].labelText =
            "[[dateturno1]]" + " " + scope.config.labelunit;
          chart.graphs[1].labelText =
            "[[turno2]]" + " " + scope.config.labelunit;
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