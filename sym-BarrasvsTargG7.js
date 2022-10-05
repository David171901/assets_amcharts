(function (CS) {
    //"use strict";
    var myEDcolumnDefinition = {
        typeName: "BarrasvsTargG7",
        displayName: 'Barras vs TargetG7',
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
                decimalPlaces: 2,
                textColor: "black",
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                showTitle: false,
                showValues: true,
                fontSize: 12,
                FormatType: null,
                seriesColor1: "#ffc90e",
                seriesColor2: "#ffc90e",
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
        console.log('Barras vs TagrG7 loaded');
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

                var realTimeItem = data.Data[1];
                var targetItem = data.Data[2];
                var target = parseFloat(("" + targetItem.Values[targetItem.Values.length - 1].Value).replace(",", "."));
                var stringUnitsFirst = dailyItems.Units ? dailyItems.Units : "";
                var todayDate = new Date();
                var dailyItemsValues = dailyItems.Values;
                var dailyItemsLength = dailyItemsValues.length;
                var hasDailyValues = dailyItemsValues.length > 0;

                var searchTimeDate = hasDailyValues ? new Date(dailyItems.Values[dailyItems.Values.length - 1].Time) : todayDate;
                var searchMonth = searchTimeDate.getMonth() + 1;
                var searchYear = searchTimeDate.getFullYear();
                var daysOfMonth = getDaysOfMonth(searchMonth, searchYear);
                var isDataPastToHour = verifyDataPastToTheHour(todayDate);

                for (var dayIndex = 1; dayIndex < daysOfMonth + 1; dayIndex++) {
                    var dailyItemValue = null;
                    var color = null;
                    var itemTime = null;

                    if (!hasDailyValues && isCurrentDate(todayDate, dayIndex, searchMonth, searchYear)) {
                        dailyItemValue = parseFloat(("" + realTimeItem.Values[realTimeItem.Values.length - 1].Value).replace(",", "."));
                        itemTime = todayDate.toLocaleTimeString();
                        color = getColorByValueAndTarget(dailyItemValue, target);
                    }

                    for (var j = 0; j < dailyItemsLength; j++) {

                        var itemTime = new Date(dailyItems.Values[j].Time)
                        var itemDate = itemTime.getDate();
                        var itemMonth = itemTime.getMonth() + 1;

                        if (dayIndex == itemDate && searchMonth == itemMonth) {
                            dailyItemValue = parseFloat(("" + dailyItemsValues[j].Value).replace(",", "."));
                            itemTime = new Date(dailyItemsValues[j].Time).toLocaleString().replace(",", ".");
                            color = getColorByValueAndTarget(dailyItemValue, target);
                            continue;
                        }

                        if (isCurrentDate(todayDate, dayIndex, searchMonth, searchYear)) {
                            if (isDataPastToHour) {
                                if (dayIndex != itemDate) continue;
                                dailyItemValue = parseFloat(("" + dailyItemsValues[j].Value).replace(",", "."));
                                itemTime = new Date(dailyItemsValues[j].Time).toLocaleString().replace(",", ".");
                            } else {
                                dailyItemValue = parseFloat(("" + realTimeItem.Values[realTimeItem.Values.length - 1].Value).replace(",", "."));
                                itemTime = todayDate.toLocaleTimeString();
                            }
                            color = getColorByValueAndTarget(dailyItemValue, target);
                            break;
                        }

                        if (isTomorrowDate(todayDate, dayIndex, searchMonth, searchYear) && isDataPastToHour) {
                            dailyItemValue = parseFloat(("" + realTimeItem.Values[realTimeItem.Values.length - 1].Value).replace(",", "."));
                            itemTime = todayDate.toLocaleTimeString();
                            color = getColorByValueAndTarget(dailyItemValue, target);
                            break;
                        }
                    }



                    if (dailyItemValue) {
                        dailyItemValue.toFixed(scope.config.decimalPlaces);
                    }

                    var newDataObject = {
                        "timestamp": "D" + dayIndex,
                        "turno1": dailyItemValue ? dailyItemValue.toFixed(scope.config.decimalPlaces) : dailyItemValue,
                        "tiempo": itemTime,
                        "color": color,
                    }
                    dataArray.push(newDataObject);
                }


                if (!chart) {
                    chart = getNewChart(stringUnitsFirst, dataArray);
                } else {
                    refreshChart(chart, dataArray);
                }
            }
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


        function createArrayOfChartTitles() {
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

        function getColorByValueAndTarget(value, target) {
            if (value >= target)
                return scope.config.seriesColor1;
            else
                return scope.config.seriesColor2;
        };

        function refreshChart(chart, dataArray) {
            if (!chart.chartScrollbar.enabled) {
                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles();
                } else {
                    chart.titles = null;
                }
                chart.dataProvider = dataArray;
                chart.validateData();
                chart.validateNow();
            }
        };

        function getNewChart(stringUnitsFirst, dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "theme": "light",
                "creditsPosition": "bottom-right",
                "addClassNames": true,
                "depth3D": 20,
                "angle": 30,
                "marginRight": 1,
                "marginLeft": 1,

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
                    "color": scope.config.seriesColor1,
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
                        "axisColor": "none",
                        "position": "left"
                    },
                    {
                        "id": "Axis2",
                        "stackType": "regular",
                        "gridAlpha": 0,
                        "axisColor": "none",
                        "position": "right"
                    }
                ],
                "categoryAxis": {
                    "axisColor": "none",
                    "minPeriod": "ss",
                    "gridAlpha": 0,
                    "gridPosition": "start",
                    "autoWrap": true,
                },
                "graphs": [
                    {
                        "id": "GAcumulado1",
                        "title": "Barra",
                        "type": "column",
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.3,
                        "lineColor": "color",
                        "colorField": "color",
                        "fontSize": 16,
                        "labelText": "[[turno1]]",
                        "showAllValueLabels": true,
                        "labelRotation": 270,
                        "balloonText": "[[title]]" + "</b><br />[[tiempo]]</b><br />[[turno1]] " + stringUnitsFirst,
                        "valueField": "turno1",
                        "valueAxis": "Axis1"
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
        };


        function myCustomConfigurationChangeFunction() {
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
                if (chart.plotAreaFillColors !== scope.config.plotAreaFillColor) {
                    chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                }
                if (chart.fontSize !== scope.config.fontSize) {
                    chart.fontSize = scope.config.fontSize;
                }
                if (chart.graphs[0].lineColor !== scope.config.seriesColor1) {
                    chart.graphs[0].lineColor = scope.config.seriesColor1;
                }

                if (scope.config.showValues) {
                    chart.graphs[0].labelText = "[[value]]";

                } else {
                    chart.graphs[0].labelText = "";
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
