(function (CS) {
    //"use strict";

    var myEDcolumnDefinition = {
        typeName: "LineaDiaVsTargetG19",
        displayName: 'Linea diaria vs Target G19',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        //iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
        visObjectType: symbolVis,
        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 300,
                Width: 1600,
                Intervals: 1000,
                decimalPlaces: 1,
                textColor: "black",
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                showTitle: false,
                showValues: true,
                fontSize: 12,
                FormatType: null,
                seriesColor1: "#ffc90e",
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                bulletSize: 8,
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

                var dailyItems = data.Data[0];
                var dailyDepuredValues = dailyItems.Values.filter(item => new Date(item.Time).getHours() == 19 && new Date(item.Time).getMinutes() == 00);
                dailyItems.Values = dailyDepuredValues;
                var realItems = data.Data[1];

                var valTarget = getValTarjet(data);
                var monthNow = 0;
                var stringLabelFirst = dailyItems.Label;

                var stringUnitsFirst = "";

                if (dailyItems.Units)
                    stringUnitsFirst = dailyItems.Units;

                createArrayDataObjects(dailyItems, realItems, dataArray, monthNow, valTarget);
                if (!chart)
                    chart = getNewChart(symbolContainerDiv, monthNow, scope, stringLabelFirst, stringUnitsFirst, dataArray)
                else {
                    refreshTheGraph(chart, dataArray)
                }
            }
        }
        function refreshTheGraph(chart, dataArray) {
            if (!chart.chartScrollbar.enabled) {
                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles();
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

        function createArrayDataObjects(dailyItems, realItems, dataArray, monthNow, valTarget) {
            var todayDate = new Date();
            monthNow = todayDate.getMonth() + 1;
            var hasValues = dailyItems.Values.length > 0;
            var searchTimedate = hasValues ? new Date(dailyItems.Values[dailyItems.Values.length - 1].Time) : todayDate;
            var searchMonth = searchTimedate.getMonth() + 1;
            var searchYear = searchTimedate.getFullYear();
            var daysOfMonth = getDaysOfMonth(searchMonth, searchYear);
            obtainDataForDays(dailyItems, realItems, daysOfMonth, todayDate, valTarget, dataArray, searchMonth, searchYear, hasValues);
        }

        function getValTarjet(data) {
            return parseFloat(("" + data.Data[2].Values[data.Data[2].Values.length - 1].Value).replace(",", "."));
        }

        function obtainDataForDays(dailyItems, realItems, daysOfMonth, todayDate, valTarget, dataArray, searchMonth, searchYear, hasValues) {
            for (var dayNumber = 1; dayNumber < daysOfMonth + 1; dayNumber++) {
                var fluxValue = getFluxValue(dailyItems, realItems, dayNumber, todayDate, searchMonth, searchYear, hasValues);
                var localTime = new Date().toLocaleTimeString();
                var customColor = getCustomColor(fluxValue, valTarget);
                var newDataObject = getNewDataObject(localTime, dayNumber, fluxValue, valTarget, customColor);
                dataArray.push(newDataObject);
            }
        }

        function getFluxValue(dailyItems, realItems, dayIndex, todayDate, searchMonth, searchYear, hasValues) {
            var isDataPastToHour = verifyDataPastToTheHour(todayDate);

            var fluxValue = null;

            if (!hasValues && isCurrentDate(todayDate, dayIndex, searchMonth, searchYear))
                fluxValue = parseFloat(("" + realItems.Values[realItems.Values.length - 1].Value).replace(",", "."));

            for (var j = 0; j < dailyItems.Values.length; j++) {

                var itemTime = new Date(dailyItems.Values[j].Time);
                var itemDate = itemTime.getDate();
                var itemMonth = itemTime.getMonth() + 1;

                if (dayIndex == itemDate && itemMonth == searchMonth) {
                    fluxValue = parseFloat(("" + dailyItems.Values[j].Value).replace(",", "."));
                    continue;
                }

                if (isCurrentDate(todayDate, dayIndex, searchMonth, searchYear)) {
                    if (isDataPastToHour) {
                        if (dayIndex != itemDate) continue;
                        else if (dayIndex == itemDate && itemMonth == searchMonth) fluxValue = parseFloat(("" + dailyItems.Values[j].Value).replace(",", "."));
                    } else {
                        fluxValue = parseFloat(("" + realItems.Values[realItems.Values.length - 1].Value).replace(",", "."));
                    }
                    break;
                }

                if (isTomorrowDate(todayDate, dayIndex, searchMonth, searchYear) && isDataPastToHour) {
                    fluxValue = parseFloat(("" + realItems.Values[realItems.Values.length - 1].Value).replace(",", "."));
                    break;
                }

            }

            return fluxValue;
        }

        function isCurrentDate(todayDate, dayIndex, firstItemMonth, firstItemYear) {
            return dayIndex == todayDate.getDate() &&
                firstItemMonth == (todayDate.getMonth() + 1)
                && firstItemYear == todayDate.getFullYear();
        }

        function isTomorrowDate(todayDate, dayIndex, firstItemMonth, firstItemYear) {
            return dayIndex - 1 == todayDate.getDate() &&
                firstItemMonth == (todayDate.getMonth() + 1)
                && firstItemYear == todayDate.getFullYear();
        }

        function verifyDataPastToTheHour(todayDate) {
            var currentHour = todayDate.getHours();
            var currentMinute = todayDate.getMinutes();
            return currentHour > 19 || (currentHour == 19 && currentMinute > 0);
        }

        function getCustomColor(valTurno, valTarget) {
            if (valTurno >= valTarget)
                return scope.config.seriesColor2;
            return scope.config.seriesColor1;
        }

        function getNewDataObject(localTime, dayNumber, valTurno, valTarget, customColor) {
            return {
                "tiempo": localTime,
                "timestamp": "D" + dayNumber,
                "turno1": valTurno ? valTurno.toFixed(scope.config.decimalPlaces) : valTurno,
                "target": valTarget,
                "customColor": customColor,
            };
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

        function createArrayOfChartTitles(monthNow) {
            var titlesArray;
            if (scope.config.useCustomTitle) {
                titlesArray = [
                    {
                        "text": scope.config.customTitle,
                        "size": (scope.config.fontSize + 3)
                    }
                ];
            } else {
                titlesArray = [
                    {
                        "text": " ",
                        "bold": true,
                        "size": (scope.config.fontSize + 4)
                    }];
            }
            return titlesArray;
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
        };

        function getNewChart(symbolContainerDiv, monthNow, scope, stringLabelFirst, stringUnitsFirst, dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "theme": "light",
                "creditsPosition": "bottom-right",
                "addClassNames": true,
                "depth3D": 20,
                "angle": 30,
                "marginRight": 1,
                "marginLeft": 1,
                "hideCredits": true,
                "titles": createArrayOfChartTitles(monthNow),
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
                "decimalPlaces": 1,
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
                        "position": "left"
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
                        "title": stringLabelFirst,
                        "type": "line",
                        "bullet": "round",
                        "bulletColor": "#00a2e8",
                        "fillAlphas": 0.4,
                        "decimalPlaces": 1,
                        "lineAlpha": 0.3,
                        "lineColor": scope.config.seriesColor1,
                        "fontSize": 16,
                        "labelText": "[[turno1]]",
                        "showAllValueLabels": true,
                        "labelRotation": 270,
                        "balloonText": "[[title]]" + "</b><br />[[tiempo]]</b><br />[[turno1]] " + stringUnitsFirst,
                        "valueField": "turno1",
                        "valueAxis": "Axis1"
                    },
                    {
                        "id": "Target",
                        "type": "smoothedLine",
                        "lineThickness": 2,
                        "lineColor": "#F04200",
                        "title": "Target",
                        "valueAxis": "Axis1",
                        "valueField": "target",
                        "animationPlayed": true,
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
                if (chart.chartScrollbar.enabled != scope.config.showChartScrollBar) {
                    chart.chartScrollbar.enabled = scope.config.showChartScrollBar;
                }
                if (scope.config.showValues) {
                    chart.graphs[0].labelText = "[[value]]";
                    chart.graphs[1].labelText = "";
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
