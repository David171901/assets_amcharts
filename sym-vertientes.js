(function (CS) {
    //"use strict";
    var myEDcolumnDefinition = {
        typeName: "vertientes",
        displayName: 'vertientes',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        //iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
        visObjectType: symbolVis,
        getDefaultConfig: function () {
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
                customTitle: ""
            };
        },
        configOptions: function () {
            return [{
                title: 'Editar Formato',
                mode: 'format'
            }];
        }
    };

    function symbolVis() { };
    CS.deriveVisualizationFromBase(symbolVis);
    symbolVis.prototype.init = function (scope, elem) {
        console.log("\t[+] vertientes > ")
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;

        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv.id = newUniqueIDString;

        var listStations = elem.find('#selectStation')[0];
        var newUniqueIDStringDays = "listStations" + Math.random().toString(36).substr(2, 16);
        listStations.id = newUniqueIDStringDays;

        var chart = false;
        var dataArray = [];

        const  insertRows = (rowToPut, cellulla, classToPut) => {
            let count = 0;
            rowToPut.forEach( element =>{
                count == 0 ? cellulla.innerHTML += `<option id="${element}" value="${count}"  selected =selected >${element}</option>`:
                cellulla.innerHTML += `<option id="${element}" value="${count}">${element}</option>`;
                cellulla.className = classToPut;
                count+=4;
            });      
        };

        var stationsFlow = [];
        var isFirstLoad = true;
            

        function myCustomDataUpdateFunction(data) {
            
            if (isFirstLoad){
                
                data.Data.forEach(element => {
                    stationsFlow.push(element.Label.split('|')[0]);
                });

                stationsFlow = new Set(stationsFlow);
                let headersRow = listStations;
                insertRows(stationsFlow, headersRow, "mttoCellClass mttoHeaderCellClass");
                
                isFirstLoad = false;
            };
            
            if (data !== null && data.Data) {
                console.log(data);
                dataArray = [];
                
                let init = parseFloat(listStations.options[listStations.selectedIndex].value);
                console.log('init:: ', init);
                
                
                var firstTurn = data.Data[init];
                var firstTurnDepuredValues = firstTurn.Values.filter(item => new Date(item.Time).getHours() == 11 && new Date(item.Time).getMinutes() == 59);
                firstTurn.Values = firstTurnDepuredValues;

                var secondTurn = data.Data[init+1];
                var secondTurnDepuredValues = secondTurn.Values.filter(item => new Date(item.Time).getHours() == 23 && new Date(item.Time).getMinutes() == 59);
                secondTurn.Values = secondTurnDepuredValues;

                var firstTurnReal = data.Data[init+2];
                var secondTurnReal = data.Data[init+3];
                
                var stringUnitsFirst, stringUnitsSecond, stringUnitsFourth;
                stringUnitsFirst = stringUnitsSecond = stringUnitsFourth = "";
                if (firstTurn.Units) stringUnitsFirst = firstTurn.Units;
                if (secondTurn.Units) stringUnitsSecond = secondTurn.Units;
                              

                var monthNow = 0;
                if (firstTurn.Values.length > 0) {

                    var searchTimeDate = new Date(firstTurn.Values[firstTurn.Values.length - 1].Time);
                    monthNow = searchTimeDate.getMonth() + 1;
                    var searchYear = searchTimeDate.getFullYear();
                    var daysOfMonth = getDaysOfMonth(monthNow, searchYear);

                    fillDataArray(firstTurn, secondTurn, firstTurnReal, secondTurnReal, monthNow, daysOfMonth, dataArray)
                    setValueAxisYToMargin(dataArray);
                }

                if (!chart)
                    chart = getNewChart(symbolContainerDiv, scope, stringUnitsFirst, stringUnitsSecond, stringUnitsFourth, dataArray);
                else
                    refreshChart(chart, scope, monthNow)

            }
        }

        function fillDataArray(firstTurn, secondTurn, firstTurnReal, secondTurnReal, monthNow, daysOfMonth, dataArray) {
            var todayDate = new Date();
            var currentDay = todayDate.getDate();
            var currentHour = todayDate.getHours();
            for (var dayIndex = 1; dayIndex <= daysOfMonth; dayIndex++) {
                var firstTurnValue = getTurnValue(firstTurn, dayIndex, monthNow, true, firstTurnReal, secondTurnReal, currentDay, currentHour);
                var secondTurnValue = getTurnValue(secondTurn, dayIndex, monthNow, false, firstTurnReal, secondTurnReal, currentDay, currentHour);

                var floatFirstTurn = parseFloat(firstTurnValue);
                var floatSecondTurn = parseFloat(secondTurnValue);
                var total = getTotalTurns(floatFirstTurn, floatSecondTurn);
            
                var newDataObject = getNewDataObject(dayIndex, floatFirstTurn, floatSecondTurn, total);
                dataArray.push(newDataObject);
            }
        }

        function setValueAxisYToMargin(dataArray) {
            var totals = dataArray.map(function (item) { return item.total; });
            var maximum = Math.max.apply(null, totals);

            var axisValue = maximum + (maximum / 10);
            scope.config.yAxisRange = 'customRange';
            scope.config.maximumYValue = parseInt(axisValue);
            scope.config.minimumYValue = 0;

        };

        function getNewDataObject(dayIndex, firstTurnValue, secondTurnValue, total) {
            return {
                "timestamp": "D" + dayIndex,
                "turno1": firstTurnValue ? firstTurnValue.toFixed(scope.config.decimalPlaces) : firstTurnValue,
                "turno2": secondTurnValue ? secondTurnValue.toFixed(scope.config.decimalPlaces) : secondTurnValue,
                "total": total ? total.toFixed(scope.config.decimalPlaces) : total,
            }
        }

        function refreshChart(chart, scope, monthNow) {
            if (!chart.chartScrollbar.enabled) {
                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles(monthNow);
                } else {
                    chart.titles = null;
                }
                chart.valueAxes[0].minimum = getCorrectChartMin();
                chart.valueAxes[0].maximum = getCorrectChartMax();
                chart.valueAxes[1].minimum = getCorrectChartMin();
                chart.valueAxes[1].maximum = getCorrectChartMax();

                chart.dataProvider = dataArray;
                chart.validateData();
                chart.validateNow();
            }
        }

        function getTurnValue(turnArray, dayIndex, monthNow, isFirstTurn, firstTurnReal, secondTurnReal, currentDay, currentHour) {
            var turnValue = null;
            var hasSavedValues = turnArray.Values.length != 0;
            var arrayLength = hasSavedValues ? turnArray.Values.length : 1;

            for (var itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
                if (hasSavedValues) turnValue = getSavedValue(turnValue, turnArray, itemIndex, dayIndex, monthNow);
                if (turnValue != null) continue;
                turnValue = getRealValue(turnValue, dayIndex, currentDay, currentHour, firstTurnReal, secondTurnReal, isFirstTurn);
                if (turnValue != null) break;
            }
            return turnValue != null ? turnValue.toString().replace(",", ".") : turnValue;
        }

        function getSavedValue(turnValue, turnArray, itemIndex, dayIndex, monthNow) {
            var itemDate = new Date(turnArray.Values[itemIndex].Time);
            var itemDay = itemDate.getDate();
            var itemMonth = itemDate.getMonth() + 1;

            if (dayIndex == itemDay && itemMonth == monthNow)
                turnValue = turnArray.Values[itemIndex].Value;
            return turnValue;
        }


        function getRealValue(turnValue, dayIndex, currentDay, currentHour, firstTurnReal, secondTurnReal, isFirstTurn) {
            if (isFirstTurn)
                return getFirstTurnRealValue(turnValue, dayIndex, currentDay, currentHour, firstTurnReal);
            else
                return getSecondTurnRealValue(turnValue, dayIndex, currentDay, currentHour, secondTurnReal);
        }

        function getFirstTurnRealValue(turnValue, dayIndex, currentDay, currentHour, firstTurnReal) {
            if (dayIndex == currentDay && (currentHour >= 0 && currentHour < 12))
                return firstTurnReal.Values[firstTurnReal.Values.length - 1].Value;
            else return turnValue;
        }

        function getSecondTurnRealValue(turnValue, dayIndex, currentDay, currentHour, secondTurnReal) {
            if (dayIndex == currentDay && (currentHour >= 12 && currentHour < 24))
                return secondTurnReal.Values[secondTurnReal.Values.length - 1].Value;            
            else return turnValue;
        }

        function getTotalTurns(firstTurnValue, secondTurnValue) {
            var firstTurn = firstTurnValue || 0;
            var secondTurn = secondTurnValue || 0;
            var total = firstTurn + secondTurn;
            return total != 0 ? total : null;
        }

        function getCorrectChartMin() {
            var result = undefined;
            if (scope.config.yAxisRange == 'customRange') {
                result = scope.config.minimumYValue;
            } else {
                result = undefined;
            }
            return result;
        }

        function getCorrectChartMax() {
            var result = undefined;
            if (scope.config.yAxisRange == 'customRange') {
                result = scope.config.maximumYValue;
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

        function getNewChart(symbolContainerDiv, scope, stringUnitsFirst, stringUnitsSecond, stringUnitsFourth, dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "theme": "light",
                "creditsPosition": "bottom-right",
                "addClassNames": true,
                "depth3D": .5,
                "angle": 30,
                "marginRight": 1,
                "marginLeft": 1,
                "hideCredits": true,
                "titles": createArrayOfChartTitles(),
                "fontSize": 12,
                "categoryField": "timestamp",
                "backgroundAlpha": 1,
                "precision": scope.config.decimalPlaces,
                "backgroundColor": scope.config.backgroundColor,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "color": scope.config.textColor,
                "plotAreaFillAlphas": 0.1,
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

                    "backgroundColor": scope.config.plotAreaFillColor,
                    "selectedBackgroundAlpha": 0.2
                },
                "valueAxes": [
                    {
                        "id": "Axis1",
                        "stackType": "regular",
                        "gridAlpha": 0,
                        "axisColor": scope.config.seriesColor2,
                        "position": "left",
                        "minimum": scope.config.minimumYValue,
                        "maximum": scope.config.maximumYValue,
                    },
                    {
                        "id": "Axis2",
                        "stackType": "regular",
                        "gridAlpha": 0,
                        "axisColor": scope.config.seriesColor2,
                        "position": "right"
                    }
                ],
                "categoryAxis": {
                    "axisColor": scope.config.seriesColor2,
                    "minPeriod": "ss",
                    "gridAlpha": 0,
                    "gridPosition": "start",
                    "autoWrap": true,
                },
                "graphs": [
                    {
                        "id": "GAcumulado1",
                        "title": "Guardia Día",
                        "type": "column",
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.3,
                        "lineColor": scope.config.seriesColor1,
                        "fontSize": 15,
                        "labelText": "[[turno1]]",
                        "showAllValueLabels": true,
                        "labelRotation": 270,
                        "balloonText": "[[title]]" + "</b><br />[[timestamp]]</b><br />[[turno1]] " + stringUnitsFirst,
                        "valueField": "turno1",
                        "valueAxis": "Axis1"
                    },
                    {
                        "id": "GAcumulado2",
                        "title": "Guardia Noche",
                        "type": "column",
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.3,
                        "fontSize": 15,
                        "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno2]]",
                        "showAllValueLabels": true,
                        "labelRotation": 270,

                        "balloonText": "[[title]]" + "</b><br />[[timestamp]]</b><br />[[turno2]] " + stringUnitsSecond,
                        "valueField": "turno2",
                        "valueAxis": "Axis1"

                    },
                    {
                        "id": "GAcumulado3",
                        "title": "Total",
                        "type": "line",
                        "bulletClass": "lastBullet",
                        "bullet": "bubble",
                        "labelPosition": "top",
                        "labelText": "[[total]]",
                        "bold": true,
                        "fontSize": 17,
                        "labelRotation": -45,
                        "labelOffset": 25,
                        "lineColor": scope.config.seriesColor3,
                        "showAllValueLabels": true,
                        "lineThickness": 1,
                        "balloonText": "[[title]]" + "</b><br />[[timestamp]]</b><br />[[total]] " + stringUnitsFirst,
                        "valueField": "total",
                        "valueAxis": "Axis1",
                        "animationPlayed": true
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
                    "markerSize": 10
                },
                "dataProvider": dataArray
            });
        }

        function createArrayOfChartTitles() {
            var titlesArray = null;
            if (scope.config.useCustomTitle) {
                titlesArray = [
                    {
                        "text": scope.config.customTitle,
                        "size": (scope.config.fontSize + 3)
                    }
                ];
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
                if (chart.plotAreaFillColors !== scope.config.plotAreaFillColor) {
                    chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                }
                if (chart.fontSize !== scope.config.fontSize) {
                    chart.fontSize = scope.config.fontSize;
                }
                if (chart.graphs[0].lineColor !== scope.config.seriesColor1) {
                    chart.graphs[0].lineColor = scope.config.seriesColor1;
                }
                if (chart.graphs[1].lineColor !== scope.config.seriesColor2) {
                    chart.graphs[1].lineColor = scope.config.seriesColor2;
                }
                if (chart.graphs[2].lineColor !== scope.config.seriesColor3) {
                    chart.graphs[2].lineColor = scope.config.seriesColor3;
                }
                if (chart.graphs[3].lineColor !== scope.config.seriesColor4) {
                    chart.graphs[3].lineColor = scope.config.seriesColor4;
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
