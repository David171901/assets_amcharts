﻿(function(CS) {
    var myEDcolumnDefinition = {
        typeName: "barrasfallasv3",
        displayName: 'Barras Fallas v3',
        inject: ['timeProvider'],
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        //iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 600,
                Width: 1600,
                Intervals: 1000,
                decimalPlaces: 0,
                textColor: "black",
                backgroundColor: "transparent",
                gridColor: "transparent",
                // plotAreaFillColor: "transparent",
                showTitle: false,
                showValues: true,
                fontSize: 12,
                FormatType: null,
                lineThick: 1,
                seriesColor1: "#3ab8a8",
                seriesColor2: "#297c72",
                seriesColor3: "#ff0000",
                seriesColor4: "#000000",
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                bulletSize: 8,
                customTitle: "",
                labelText: "",
                labelunit: "",
                // Title
                // titlegraph1:'ACTIVIDAD OPERACIONAL',
                // titlegraph2:'AVERIAS DE INSTRUMENTOS',
                // titlegraph3:'AVERIAS ELÉCTRICAS',
                // titlegraph4:'AVERIAS MECÁNICAS',
                // titlegraph5:'FUNCIONAMIENTO',
                // titlegraph6:'INFLUENCIA EXTERNA',
                // titlegraph7:'MANTENIMIENTO PLANIFICABLE',
                // titlegraph8:'OTROS',
                // titlegraph9:'SEGURIDAD',
                // titlegraph10:'STAND BY',
                graph3Value: 'media'
            };
        },
        configOptions: function() {
            return [{
                title: 'Editar Formato',
                mode: 'format'
            }];
        }
    };
 
    function symbolVis() {};
    CS.deriveVisualizationFromBase(symbolVis);
    symbolVis.prototype.init = function(scope, elem, timeProvider) {
        console.log('\t[+]Barras Fallas');
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
 
        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv.id = newUniqueIDString;
        var chart = false;
        var dataArray = [];
        const quantity = -((new Date).getDate());
 
        function myCustomDataUpdateFunction(data) {
            // console.log(" ~ file: sym-barrasfallasv2.js ~ line 87 ~ myCustomDataUpdateFunction ~ data", data)

            let dataFormat = data.Data[0].Values
            // console.log(" ~ file: sym-barrasfallasv3.js ~ line 90 ~ myCustomDataUpdateFunction ~ dataFormat", dataFormat)

            let arrayData = [...new Set(dataFormat.map(el => el.Value.split('||')[0]))].map(element => Object({
                    Label: element,
                    Incidents: dataFormat.map(elem => Object({
                        ...elem
                    })).filter(el => el.Value.includes(element)), 
                })
                )
            console.log(" ~ file: sym-barrasfallasv3.js ~ line 98 ~ arrayData ~ arrayData", arrayData)
        
            let DATA = {
                Data: arrayData.map(element => formatItem(element)),
                SymbolName: "Symbol4"
            }
            
            let titles = DATA.Data.map(el => el.Label)

            if (DATA !== null && DATA.Data) {
                dataArray = [];
 
                let firstTurn = DATA.Data[0];
                let secondTurn = DATA.Data[1];
                let thirdTurn = DATA.Data[2];
                let fourthTurn = DATA.Data[3];
                let fifthTurn = DATA.Data[4];
                let sixthTurn = DATA.Data[5];
                let seventhTurn = DATA.Data[6];
                let eighthTurn = DATA.Data[7];
                let ninethTurn = DATA.Data[8];
                let tenthTurn = DATA.Data[9];
 
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

                let currentDay = new Date();
                
                let customStartDate = timeProvider.displayTime.start;           
                               
                let stringUnitsFirst, stringUnitsSecond,stringUnitsThird, stringUnitsFourth;
                stringUnitsFirst = stringUnitsSecond= stringUnitsThird = stringUnitsFourth ="";
         
                let monthNow = 0;
               
                let searchTimeDate = new Date(customStartDate);
               
                monthNow = searchTimeDate.getMonth() + 2;
 
                let searchYear = searchTimeDate.getFullYear();
                let daysOfMonth = getDaysOfMonth(monthNow, searchYear);
                   
                fillDataArray(firstTurn, secondTurn, thirdTurn, fourthTurn, fifthTurn, sixthTurn, seventhTurn, eighthTurn, ninethTurn, tenthTurn, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal, new Date(customStartDate), daysOfMonth, dataArray)
                setValueAxisYToMargin(dataArray);
               
                if (!chart)
                    chart = getNewChart(symbolContainerDiv, monthNow, scope, stringUnitsFirst, stringUnitsSecond, dataArray, titles);
                else
                    refreshChart(chart, scope, monthNow);
            }
        }
 
        function addDays(fecha, dias){
            fecha.setDate(fecha.getDate() + dias);
            return fecha;
        }

        // NEW FUNCTIONS
        function addDaysToDate(date, days){
            var res = new Date(date);
            res.setDate(res.getDate() + days);
            return res;
        }
    
        function formatDate(year,month,day) {
            return `${year}-${(month<=9 ? `0${month}` : `${month}`)}-${(day<=9 ? `0${day}` : `${day}`)}`
        }

        function formatItem (data) {
            let startTime = new Date(timeProvider.displayTime.start)
            let endTime = new Date()
            let daysOfPreviewMonth = getDaysOfMonth(startTime.getMonth() + 1);
            let moreDays = null;
            moreDays = (daysOfPreviewMonth - startTime.getDate());
            // console.log("🚀 ~ file: barras.html ~ line 1260 ~ formatItem ~ moreDays", moreDays)
            let items = []
            for (let index = 0; index < (endTime.getDate() + moreDays + 1) ; index++) {
                let dayStart = startTime.getDate()
                let monthStart = startTime.getMonth() + 1
                let yearStart = startTime.getFullYear()
                let dayEnd = endTime.getDate()
                let monthEnd = endTime.getMonth() + 1
                let yearEnd = endTime.getFullYear()
                let item = data.Incidents
                .filter(element => element.Time.includes(formatDate(yearStart,monthStart,dayStart)))
                .map(element => Object({
                    Value: element.Value.length == 0 ? [] : element.Value,
                    Time: formatDate(yearStart,monthStart,dayStart),
                }));
                items.push(item);
                startTime = addDaysToDate(startTime,1);
            }
            
            // console.log("🚀 ~ file: barras.html ~ line 1276 ~ formatItem ~ items", items)
            startTime = new Date(timeProvider.displayTime.start)
            
            let dataArray = []
            for (let index = 0; index < (endTime.getDate() + moreDays + 1); index++) {
                let dayStart = startTime.getDate()
                let monthStart = startTime.getMonth() + 1
                let yearStart = startTime.getFullYear()
                let dayEnd = endTime.getDate()
                let monthEnd = endTime.getMonth() + 1
                let yearEnd = endTime.getFullYear()
                let item = (items.length == 0) 
                ? dataArray.push(Object({
                    Value: 0,
                    Time: formatDate(yearStart,monthStart,dayStart),
                })) 
                : dataArray.push(Object({
                    Value: (items[index].reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.Value.split('||')[2]),
                    0))/60,
                    Time: new Date(formatDate(yearStart,monthStart,dayStart)).toISOString().replace('.000','').replace('00:00:00','11:59:00'),
                })); 
    
                startTime = addDaysToDate(startTime,1);
            }
            return Object({
                Values: dataArray,
                EndTime: "2022-10-04T14:41:10.306Z",
                Maximum: 100,
                Minimum: 0,
                StartTime: "2022-09-29T00:00:00Z",
                Label: data.Label,
            })
        }
        // ***end***
 
        function fillDataArray(firstTurn, secondTurn, thirdTurn, fourthTurn, fifthTurn, sixthTurn, seventhTurn, eighthTurn, ninethTurn, tenthTurn, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal, start, daysOfMonth, dataArray) {
            let todayDate = timeProvider.displayTime.end != "*" ? new Date(timeProvider.displayTime.end) : new Date();
            let currentDay = todayDate.getDate();
            let currentHour = todayDate.getHours();
            let currentMonth = todayDate.getMonth()+1;
            let iterableDate = start;
            let daysOfPreviewMonth = getDaysOfMonth(start.getMonth() + 1);
            let moreDays = null;
           
            moreDays = (daysOfPreviewMonth - start.getDate());
           
            todayDate.setDate(todayDate.getDate()+1);
   
            for (let dayIndex = 1; dayIndex <= (daysOfMonth + moreDays) ; dayIndex++) {
                iterableDate.setDate(iterableDate.getDate()+1);
 
                if(iterableDate.getTime() <= todayDate.getTime()){
                    let firstTurnValue = getTurnValue(firstTurn, iterableDate, true,firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal,ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let secondTurnValue = getTurnValue(secondTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let thirdTurnValue = getTurnValue(thirdTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let fourthTurnValue = getTurnValue(fourthTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let fifthTurnValue = getTurnValue(fifthTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let sixthTurnValue = getTurnValue(sixthTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let seventhTurnValue = getTurnValue(seventhTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let eighthTurnValue = getTurnValue(eighthTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let ninethTurnValue = getTurnValue(ninethTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);
                    let tenthTurnValue = getTurnValue(tenthTurn, iterableDate, false, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal, ninethTurnReal, tenthTurnReal,currentDay, currentHour, currentMonth);

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

                    let total = getTotalTurns(floatFirstTurn, floatSecondTurn, floatThirdTurn, floatFourthTurn, floatFifthTurn, floatSixthTurn, floatSeventhTurn, floatEighthTurn, floatNinethTurn, floatTenthTurn);
                    let media = getMediaTurns(floatFirstTurn, floatSecondTurn, floatThirdTurn, floatFourthTurn, floatFifthTurn, floatSixthTurn, floatSeventhTurn, floatEighthTurn, floatNinethTurn, floatTenthTurn);
    
                    let newDataObject = getNewDataObject(iterableDate.getDate(), floatFirstTurn, floatSecondTurn, floatThirdTurn, floatFourthTurn, floatFifthTurn, floatSixthTurn, floatSeventhTurn, floatEighthTurn, floatNinethTurn, floatTenthTurn,total, media, [iterableDate.getMonth()+1]);
                    // console.log(newDataObject);
                    dataArray.push(newDataObject);
                }
                else{
                    let newDataObject = getNewDataObject(iterableDate.getDate(), null, null, null ,null, null, null, null, null ,null ,null, null,  null, [iterableDate.getMonth()+1]);
                    dataArray.push(newDataObject);
                }
            }    
        }
 
        function setValueAxisYToMargin(dataArray) {
            let totals = dataArray.map(function(item) { return item.total; });
            let maximum = Math.max.apply(null, totals);
 
            let axisValue = maximum + (maximum / 10);
            scope.config.yAxisRange = 'customRange';
            scope.config.maximumYValue = parseInt(axisValue);
            scope.config.minimumYValue = 0;
        }
 
        function getNewDataObject(dayIndex, firstTurnValue, secondTurnValue, thirdTurnValue, fourthTurnValue, fifthTurnValue, sixthTurnValue, seventhTurnValue, eighthTurnValue, ninethTurnValue, tenthTurnValue,total, media, month ) {
           
            return {
                "timestamp": dayIndex +"/" + month,
                "turno1": (firstTurnValue ? firstTurnValue.toFixed(scope.config.decimalPlaces) : firstTurnValue) || null,
                "turno2": (secondTurnValue ? secondTurnValue.toFixed(scope.config.decimalPlaces) : secondTurnValue) || null,
                "turno3": (thirdTurnValue ? thirdTurnValue.toFixed(scope.config.decimalPlaces) : thirdTurnValue) || null,
                "turno4": (fourthTurnValue ? fourthTurnValue.toFixed(scope.config.decimalPlaces) : fourthTurnValue) || null,
                "turno5": (fifthTurnValue ? fifthTurnValue.toFixed(scope.config.decimalPlaces) : fifthTurnValue) || null,
                "turno6": (sixthTurnValue ? sixthTurnValue.toFixed(scope.config.decimalPlaces) : sixthTurnValue)  || null,
                "turno7": (seventhTurnValue ? seventhTurnValue.toFixed(scope.config.decimalPlaces) : seventhTurnValue) || null,
                "turno8": (eighthTurnValue ? eighthTurnValue.toFixed(scope.config.decimalPlaces) : eighthTurnValue) || null,
                "turno9": (ninethTurnValue ? ninethTurnValue.toFixed(scope.config.decimalPlaces) : ninethTurnValue) || null,
                "turno10": (tenthTurnValue ? tenthTurnValue.toFixed(scope.config.decimalPlaces) : tenthTurnValue) || null,
                "total": total ? total.toFixed(scope.config.decimalPlaces) : total,        
                "media": media ? media.toFixed(scope.config.decimalPlaces) : media,        
            }  
        }

        function formatTime(time){
            return time;
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
 
        function getTurnValue(turnArray, iterableDate, isFirstTurn, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, fifthTurnReal, sixthTurnReal, seventhTurnReal, eighthTurnReal,ninethTurnReal, tenthTurnReal, currentDay, currentHour, currentMonth) {
            let turnValue = null;
            let originalArrayLength = turnArray.Values.length;
            let hasSavedValues = originalArrayLength != 0;
            let arrayLength = hasSavedValues ? originalArrayLength : 1;
 
            for (let itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
                if (hasSavedValues) turnValue = getSavedValue(turnValue, turnArray, itemIndex, iterableDate);
                if (turnValue != null) continue;
 
                turnValue = getRealValue(turnValue, iterableDate, currentDay, currentHour, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, isFirstTurn, currentMonth);
                if (turnValue != null) break;
 
                if (hasSavedValues && itemIndex == (originalArrayLength - 1) && (currentDay == iterableDate.getDate()) && (currentMonth == iterableDate.getMonth()+1))
                    turnValue = getLastUnsavedTemporal(firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, isFirstTurn, currentMonth);
            }
            return turnValue != null ? turnValue.toString().replace(",", ".") : turnValue;
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
 
 
        function getRealValue(turnValue, iterableDate, currentDay, currentHour, firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal, isFirstTurn, currentMonth) {
            if (isFirstTurn)
                return getFirstTurnRealValue(turnValue, iterableDate, currentDay, currentHour, firstTurnReal, currentMonth);
            else
                return getSecondTurnRealValue(turnValue, iterableDate, currentDay, currentHour, secondTurnReal, currentMonth);
        }
 
        function getLastUnsavedTemporal(firstTurnReal, secondTurnReal, thirdTurnReal, fourthTurnReal,  isFirstTurn) {
            if (isFirstTurn)
                return null;
            else
                return null;
        }
 
        function getFirstTurnRealValue(turnValue, iterableDate, currentDay, currentHour, firstTurnReal, currentMonth) {
 
            let iterableDay = iterableDate.getDate();
 
            if (iterableDay == currentDay && (currentHour >= 0 && currentHour < 7) && (iterableDate.getMonth()+1) == currentMonth)
                return null;
            else if ((iterableDay - 1) == currentDay && (currentHour >= 19 && currentHour < 24) && (iterableDate.getMonth()+1) == currentMonth)
                return null;
            else return turnValue;
        }
 
        function getSecondTurnRealValue(turnValue, iterableDate, currentDay, currentHour, secondTurnReal, currentMonth) {
            let iterableDay = iterableDate.getDate();
 
            if (iterableDay == currentDay && (currentHour >= 7 && currentHour < 19) && (iterableDate.getMonth()+1) == currentMonth)
                return null;
            else if ((iterableDay - 1) == currentDay && (currentHour >= 19 && currentHour < 24) && (iterableDate.getMonth()+1) == currentMonth)
                return 0;
            else return turnValue;
        }
 
        function getTotalTurns(firstTurnValue, secondTurnValue, thirdTurnValue, fourthTurnValue, fifthTurnValue, sixthTurnValue, seventhTurnValue, eighthTurnValue, ninethTurnValue, tenthTurnValue) {
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
            let total = firstTurn + secondTurn + thirdTurn + fourthTurn + fifthTurn + sixthTurn + seventhTurn + eighthTurn + ninethTurn + tenthTurn;
            return total != 0 ? total : null;
        }
 
        function getMediaTurns(firstTurnValue, secondTurnValue, thirdTurnValue, fourthTurnValue, fifthTurnValue, sixthTurnValue, seventhTurnValue, eighthTurnValue, ninethTurnValue, tenthTurnValue) {
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
            let media = (firstTurn + secondTurn + thirdTurn + fourthTurn + fifthTurn + sixthTurn + seventhTurn + eighthTurn + ninethTurn + tenthTurn)/10;
            return media != 0 ? media : null;
        }
 
        function getCorrectChartMin() {
            let result = undefined;
            if (scope.config.yAxisRange == 'customRange') {
                result = scope.config.minimumYValue;
            } else {
                result = undefined;
            }
            return result;
        }
 
        function getCorrectChartMax() {
            let result = undefined;
            if (scope.config.yAxisRange == 'customRange') {
                result = scope.config.maximumYValue;
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
 
        function getNewChart(symbolContainerDiv, monthNow, scope, stringUnitsFirst, stringUnitsSecond, dataArray, titles) {
            console.log("🚀 ~ file: sym-barrasfallasv3.js ~ line 481 ~ getNewChart ~ titles", titles)
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "hideCredits": true,
                "creditsPosition": "bottom-right",
                "angle": 0,
                "marginRight": 1,
                "marginLeft": 1,
                "titles": createArrayOfChartTitles(),
                "fontSize": scope.config.fontSize,
                "categoryField": "timestamp",
                "precision": scope.config.decimalPlaces,
                "backgroundColor": scope.config.backgroundColor,
                "color": scope.config.textColor,
                "autoMargin": true,
                "autoMarginOffset": 10,
                "decimalSeparator": ".",
                "thousandsSeparator": "",
                "pathToImages": "Scripts/app/editor/symbols/ext/images/",
                "startDuration": 1,
                "chartScrollbar": {
                    "graph": "g1",
                    "graphType": "line",
                    "position": "bottom",
                    "scrollbarHeight": 20,
                    "autoGridCount": true,
                    "enabled": scope.config.showChartScrollBar,
                    "dragIcon": "dragIconRectSmall",
                    "backgroundAlpha": 1,
                    "selectedBackgroundAlpha": 0.2
                },
                "valueAxes": [{
                        "id": "Axis1",
                        "stackType": "regular",
                        "gridAlpha": 0,
                        "axisColor": scope.config.seriesColor2,
                        "position": "left",
                        "title": "Horas",
                    },
                    {
                        "id": "Axis2",
                        "stackType": "regular",
                        "gridAlpha": 0,
                        "axisColor": scope.config.seriesColor2,
                        "position": "left",
                    }
                ],
                "categoryAxis": {
                    "axisColor": scope.config.seriesColor2,
                    "minPeriod": "ss",
                    "gridAlpha": 0,
                    "gridPosition": "start",
                    "autoWrap": true,
                },
                "graphs": [{
                        "id": "GAcumulado1",
                        "clustered": false,
                        "title": titles[0],
                        "type": "column",
                        "fillAlphas": 1,
                        "color": "#000000",
                        // "lineColor": scope.config.seriesColor1,
                        "fontSize": scope.config.fontSize,
                        "labelText": "[[turno1]]" + ' ' + scope.config.labelunit,
                        "bold": true,
                        "balloonText": titles[0] + "</b><br />[[timestamp]]</b><br />[[turno1]] " + scope.config.labelunit,
                        "valueField": "turno1",
                        "valueAxis": "Axis1",
                        "lineColor": "#f4c2c2",
                    },
                    {
                        "id": "GAcumulado2",
                        "clustered": false,
                        "title": titles[1],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno2]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[1] + "</b><br />[[timestamp]]</b><br />[[turno2]] " + scope.config.labelunit,
                        "valueField": "turno2",
                        "valueAxis": "Axis1",
                        "lineColor": "#A93226",
                    },
                    {
                        "id": "GAcumulado3",
                        "clustered": false,
                        "title": titles[2],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno3]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[2] + "</b><br />[[timestamp]]</b><br />[[turno3]] " + scope.config.labelunit,
                        "valueField": "turno3",
                        "valueAxis": "Axis1",
                        "lineColor": "#884EA0",
                    },
                    {
                        "id": "GAcumulado4",
                        "clustered": false,
                        "title": titles[3],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno4]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[3] + "</b><br />[[timestamp]]</b><br />[[turno4]] " + scope.config.labelunit,
                        "valueField": "turno4",
                        "valueAxis": "Axis1",
                        "lineColor": "#2471A3",
                    },
                    {
                        "id": "GAcumulado5",
                        "clustered": false,
                        "title": titles[4],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno5]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[4] + "</b><br />[[timestamp]]</b><br />[[turno5]] " + scope.config.labelunit,
                        "valueField": "turno5",
                        "valueAxis": "Axis1",
                        "lineColor": "#17A589",
                    },
                    {
                        "id": "GAcumulado6",
                        "clustered": false,
                        "title": titles[5],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno6]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[5] + "</b><br />[[timestamp]]</b><br />[[turno6]] " + scope.config.labelunit,
                        "valueField": "turno6",
                        "valueAxis": "Axis1",
                        "lineColor": "#D4AC0D",
                    },
                    {
                        "id": "GAcumulado7",
                        "clustered": false,
                        "title": titles[6],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno7]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[6] + "</b><br />[[timestamp]]</b><br />[[turno7]] " + scope.config.labelunit,
                        "valueField": "turno7",
                        "valueAxis": "Axis1",
                        "lineColor": "#CA6F1E",
                    },
                    {
                        "id": "GAcumulado8",
                        "clustered": false,
                        "title": titles[7],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno8]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[7] + "</b><br />[[timestamp]]</b><br />[[turno8]] " + scope.config.labelunit,
                        "valueField": "turno8",
                        "valueAxis": "Axis1",
                        "lineColor": "#D0D3D4",
                    },
                    {
                        "id": "GAcumulado9",
                        "clustered": false,
                        "title": titles[8],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno9]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[8] + "</b><br />[[timestamp]]</b><br />[[turno9]] " + scope.config.labelunit,
                        "valueField": "turno9",
                        "valueAxis": "Axis1",
                        "lineColor": "#839192",
                    },
                    {
                        "id": "GAcumulado10",
                        "clustered": false,
                        "title": titles[9],
                        "type": "column",
                        "bold": true,
                        "fillAlphas": 1,
                        "color": "#000000",
                        "fontSize": scope.config.fontSize,
                        // "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno10]]" + ' ' + scope.config.labelunit,
                        "balloonText": titles[9] + "</b><br />[[timestamp]]</b><br />[[turno10]] " + scope.config.labelunit,
                        "valueField": "turno10",
                        "valueAxis": "Axis1",
                        "lineColor": "#2E4053",
                    }
                ],
                "legend": {
                    "position": scope.config.legendPosition,
                    "equalWidths": false,
                    "color": scope.config.textColor,
                    "enabled": scope.config.showLegend,
                    "valueAlign": "right",
                    "horizontalGap": 10,
                    "useGraphSettings": true,
                    "bold": true,
                    "markerSize": 24
                },
                "dataProvider": dataArray
            });
        }
 
        function createArrayOfChartTitles() {
            var titlesArray = null;
            if (scope.config.useCustomTitle) {
                titlesArray = [{
                    "text": scope.config.customTitle,
                    "size": (scope.config.fontSize + 10)
                }];
            }
            return titlesArray;
        }
 
        function myCustomConfigurationChangeFunction() {
            if (chart) {
                chart.valueAxes[0].minimum = getCorrectChartMin();
                chart.valueAxes[0].maximum = getCorrectChartMax();
                chart.valueAxes[1].minimum = getCorrectChartMin();
                chart.valueAxes[1].maximum = getCorrectChartMax();
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
                // if (chart.plotAreaFillColors !== scope.config.plotAreaFillColor) {
                //     chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                // }
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
                    chart.graphs[0].labelText = "[[turno1]]" + ' ' + scope.config.labelunit;
                    chart.graphs[1].labelText = "[[turno2]]" + ' ' + scope.config.labelunit;
                    // chart.graphs[2].labelText = "[[value]]";
                } else {
                    chart.graphs[0].labelText = "";
                    chart.graphs[1].labelText = "";
                    // chart.graphs[2].labelText = "";
                }
                if (chart.precision != scope.config.decimalPlaces) {
                    chart.precision = scope.config.decimalPlaces;
                }

                // if(chart.graphs[0].title != scope.config.titlegraph1) chart.graphs[0].title = scope.config.titlegraph1
                // if(chart.graphs[1].title != scope.config.titlegraph2) chart.graphs[1].title = scope.config.titlegraph2
                // if(chart.graphs[2].title != scope.config.titlegraph3) chart.graphs[2].title = scope.config.titlegraph3

                chart.legend.enabled = scope.config.showLegend;
                chart.legend.position = scope.config.legendPosition;
                chart.validateData();
                chart.validateNow();
            }
        }
    };
 
    CS.symbolCatalog.register(myEDcolumnDefinition);
 
})(window.PIVisualization);