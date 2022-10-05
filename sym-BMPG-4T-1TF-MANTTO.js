
(function(CS) {
    var myEDcolumnDefinition = {
        typeName: "BMPG-4T-1TF-MANTTO",
        displayName: 'BMPG-4T-1TF-MANTTO',
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
                plotAreaFillColor: "transparent",
                showTitle: false,
                showValues: true,
                fontSize: 12,
                FormatType: null,
                lineThick: 1,
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
        console.log('\t[+]BMPG-4T-1TF-MANTTO');
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;

        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv.id = newUniqueIDString;
        var chart = false;
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {

            if (data !== null && data.Data) {

                dataArray = [];
                console.log(' [+] data: ',data.Data);

                let firstTurn = data.Data[0];
                let secondTurn = data.Data[1];

                let firstTurnReal = data.Data[2];
                let secondTurnReal = data.Data[3];

                let customDate = data.Data[4];
                let customStartDate = timeProvider.displayTime.start;

                let fechaInicio = timeProvider.displayTime.start;
                               
                let stringUnitsFirst, stringUnitsSecond;
                stringUnitsFirst = stringUnitsSecond= "";
                if (firstTurn.Units) stringUnitsFirst = firstTurn.Units;
                if (secondTurn.Units) stringUnitsSecond = secondTurn.Units;
         
                let monthNow = 0;
                
                let searchTimeDate = new Date(customStartDate);
                
                monthNow = searchTimeDate.getMonth() + 2;

                let searchYear = searchTimeDate.getFullYear();
                let daysOfMonth = getDaysOfMonth(monthNow, searchYear);
                    
                fillDataArray(firstTurn, secondTurn, firstTurnReal, secondTurnReal, new Date(customStartDate), daysOfMonth, dataArray)
                setValueAxisYToMargin(dataArray);
                
                if (!chart)
                    chart = getNewChart(symbolContainerDiv, monthNow, scope, stringUnitsFirst, stringUnitsSecond, dataArray);
                else
                    refreshChart(chart, scope, monthNow);
                    
            }
        }

        

        function fillDataArray(firstTurn, secondTurn, firstTurnReal, secondTurnReal, start, daysOfMonth, dataArray) {
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
                //traen el ultimo si no tiene un valor registrado x requerimiento(getTurnValue)
                let firstTurnValue = getTurnValue(firstTurn, iterableDate, true, firstTurnReal, secondTurnReal, currentDay, currentHour, currentMonth);
                let secondTurnValue = getTurnValue(secondTurn, iterableDate, false, firstTurnReal, secondTurnReal, currentDay, currentHour, currentMonth);
                
                //no escribe nada si no hay valor registrado(getTurnValueForNews)
                let floatFirstTurn = parseFloat(firstTurnValue);
                let floatSecondTurn = parseFloat(secondTurnValue);
                let total = getTotalTurns(floatFirstTurn, floatSecondTurn);
                

                let newDataObject = getNewDataObject(iterableDate.getDate(), floatFirstTurn, floatSecondTurn, total);
                dataArray.push(newDataObject);
                }
                else{
                    let newDataObject = getNewDataObject(iterableDate.getDate(), null, null, null);
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

        function getNewDataObject(dayIndex, firstTurnValue, secondTurnValue, total ) {
            
            return {
                "timestamp": "D" + dayIndex,
                "turno1": firstTurnValue ? firstTurnValue.toFixed(scope.config.decimalPlaces) : firstTurnValue,
                "turno2": secondTurnValue ? secondTurnValue.toFixed(scope.config.decimalPlaces) : secondTurnValue,
                    
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

        function getTurnValue(turnArray, iterableDate, isFirstTurn, firstTurnReal, secondTurnReal, currentDay, currentHour, currentMonth) {
            let turnValue = null;
            let originalArrayLength = turnArray.Values.length;
            let hasSavedValues = originalArrayLength != 0;
            let arrayLength = hasSavedValues ? originalArrayLength : 1;

            for (let itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
                if (hasSavedValues) turnValue = getSavedValue(turnValue, turnArray, itemIndex, iterableDate);
                if (turnValue != null) continue;

                turnValue = getRealValue(turnValue, iterableDate, currentDay, currentHour, firstTurnReal, secondTurnReal, isFirstTurn, currentMonth);
                if (turnValue != null) break;

                if (hasSavedValues && itemIndex == (originalArrayLength - 1) && (currentDay == iterableDate.getDate()) && (currentMonth == iterableDate.getMonth()+1))
                    turnValue = getLastUnsavedTemporal(firstTurnReal, secondTurnReal, isFirstTurn, currentMonth);
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


        function getRealValue(turnValue, iterableDate, currentDay, currentHour, firstTurnReal, secondTurnReal, isFirstTurn, currentMonth) {
            if (isFirstTurn)
                return getFirstTurnRealValue(turnValue, iterableDate, currentDay, currentHour, firstTurnReal, currentMonth);
            else
                return getSecondTurnRealValue(turnValue, iterableDate, currentDay, currentHour, secondTurnReal, currentMonth);
        }

        function getLastUnsavedTemporal(firstTurnReal, secondTurnReal, isFirstTurn) {
            if (isFirstTurn)
                return firstTurnReal.Values[firstTurnReal.Values.length - 1].Value;
            else
                return secondTurnReal.Values[secondTurnReal.Values.length - 1].Value;
        }

        function getFirstTurnRealValue(turnValue, iterableDate, currentDay, currentHour, firstTurnReal, currentMonth) {

            let iterableDay = iterableDate.getDate();

            if (iterableDay == currentDay && (currentHour >= 0 && currentHour < 7) && (iterableDate.getMonth()+1) == currentMonth)
                return firstTurnReal.Values[firstTurnReal.Values.length - 1].Value;
            else if ((iterableDay - 1) == currentDay && (currentHour >= 19 && currentHour < 24) && (iterableDate.getMonth()+1) == currentMonth)
                return firstTurnReal.Values[firstTurnReal.Values.length - 1].Value;
            else return turnValue;
        }

        function getSecondTurnRealValue(turnValue, iterableDate, currentDay, currentHour, secondTurnReal, currentMonth) {
            let iterableDay = iterableDate.getDate();

            if (iterableDay == currentDay && (currentHour >= 7 && currentHour < 19) && (iterableDate.getMonth()+1) == currentMonth)
                return secondTurnReal.Values[secondTurnReal.Values.length - 1].Value;
            else if ((iterableDay - 1) == currentDay && (currentHour >= 19 && currentHour < 24) && (iterableDate.getMonth()+1) == currentMonth)
                return 0;
            else return turnValue;
        }

        function getTotalTurns(firstTurnValue, secondTurnValue) {
            let firstTurn = firstTurnValue || 0;
            let secondTurn = secondTurnValue || 0;
            let total = firstTurn + secondTurn;
            return total != 0 ? total : null;
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

        function getNewChart(symbolContainerDiv, monthNow, scope, stringUnitsFirst, stringUnitsSecond, dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "theme": "none",
                "hideCredits": true,
                "creditsPosition": "bottom-right",
                "addClassNames": true,
                "depth3D": 0,
                "angle": 90,
                "marginRight": 1,
                "marginLeft": 1,
                "titles": createArrayOfChartTitles(),
                "fontSize": scope.config.fontSize,
                "categoryField": "timestamp",
                "backgroundAlpha": 1,
                "precision": scope.config.decimalPlaces,
                "backgroundColor": scope.config.backgroundColor,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "color": scope.config.textColor,
                "rotate": scope.config.useBarsInsteadOfColumns,
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
                    "rotate": scope.config.useBarsInsteadOfColumns,
                    "backgroundColor": scope.config.plotAreaFillColor,
                    "selectedBackgroundAlpha": 0.2
                },
                "valueAxes": [{
                        "id": "Axis1",
                        "stackType": "regular",
                        "gridAlpha": 0,
                        "axisColor": scope.config.seriesColor2,
                        "position": "left",
                        "minimum": scope.config.minimumYValue,
                        "maximum": scope.config.maximumYValue,
                        "labelRotation":90,
                    },
                    {
                        "id": "Axis2",
                        "stackType": "regular",
                        "gridAlpha": 0,
                        "axisColor": scope.config.seriesColor2,
                        "position": "left",
                        "minimum": scope.config.minimumYValue,
                        "maximum": scope.config.maximumYValue,
                        "labelRotation":90,
                    }
                ],
                "categoryAxis": {
                    "axisColor": scope.config.seriesColor2,
                    "minPeriod": "ss",
                    "gridAlpha": 0,
                    "gridPosition": "start",
                    "autoWrap": true,
                    "labelRotation":+90,
                },
                "graphs": [{
                        "id": "GAcumulado1",
                        "clustered": false,
                        "title": "TURNO NOCHE",
                        "type": "column",
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.3,
                        "lineColor": scope.config.seriesColor1,
                        "fontSize": 20,
                        "opacity": 0.2,
                        "labelText": "[[turno1]]",
                        "showAllValueLabels": true,
                        "labelRotation": 0,
                        "balloonText": "[[title]]" + "</b><br />[[timestamp]]</b><br />[[turno1]] " + stringUnitsFirst,
                        "valueField": "turno1",
                        "valueAxis": "Axis1"
                    },
                    {
                        "id": "GAcumulado2",
                        "clustered": false,
                        "title": "TURNO DIA",
                        "type": "column",
                        "fillAlphas": 0.8,
                        "opacity": 0.2,
                        "fontSize": 20,
                        "lineColor": scope.config.seriesColor2,
                        "labelText": "[[turno2]]",
                        "showAllValueLabels": true,
                        "labelRotation": 0,
                        "backgroundcolor": 'transparent',
                        "balloonText": "[[title]]" + "</b><br />[[timestamp]]</b><br />[[turno2]] " + stringUnitsSecond,
                        "valueField": "turno2",
                        "valueAxis": "Axis2"
                    },
                    
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
                    "size": (scope.config.fontSize + 3)
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
                if (chart.plotAreaFillColors !== scope.config.plotAreaFillColor) {
                    chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                }
                if (chart.fontSize !== scope.config.fontSize) {
                    chart.fontSize = scope.config.fontSize;
                }
                if (chart.graphs[0].lineThickness !== scope.config.lineThick) {
                    chart.graphs[0].lineThickness = scope.config.lineThick;
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
                if (chart.graphs[4].lineColor !== scope.config.seriesColor5) {
                    chart.graphs[4].lineColor = scope.config.seriesColor5;
                }
                if (chart.graphs[5].lineColor !== scope.config.seriesColor6) {
                    chart.graphs[5].lineColor = scope.config.seriesColor6;
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