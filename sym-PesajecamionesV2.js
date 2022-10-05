(function (BS) {
    //'use strict';

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'PesajecamionesV2',
        displayName: 'Pesaje camionesV2',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        visObjectType: symbolVis,
        supportsCollections: true,

        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: BS.Extensibility.Enums.DataQueryMode.ModeEvents,
                FormatType: null,
                Height: 350,
                Width: 1050,
                Intervals: 1000,
                minimumYValue: 0,
                maximumYValue: 100,
                yAxisRange: 'allSigma',
                showTitle: false,
                textColor: "black",
                fontSize: 13,
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                textColor: "#000000",
                seriesColor1: "#6bdc67",
                seriesColor2: "#00b1ff",
                seriesColor3: "#0000ff",
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                useColumns: false,
                lineThick: 1,
                showValues: true,
                customTitle: "",
                label1: "",
                label2: "",
                label3: "",
                units1: "",
                units2: "",
                units3: "",
                searchMonth: 0,
                decimalPlaces: 1,
            };
        },

        configOptions: function () {
            return [{
                title: "Format Symbol",
                mode: "format"
            }];
        }
    };

    symbolVis.prototype.init = function (scope, elem) {
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;
	console.log('v2 pesaje camiones loaded');
        var chart = initChart();
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {
            if (!data || !chart) return;

            if (data !== null && data.Data) {
                dataArray = [];
                var firstData = data.Data[0];
                var hasSecondData = data.Data[1] ? true : false;
                var hasThirdData = data.Data[2] ? true : false;
                formatDates(firstData);
                console.log("data",data.Data)
                var searchEndTime = new Date(data.Data[0].EndTime);
                var monthSearch = getMonthFromTime(searchEndTime);
                scope.config.searchMonth = monthSearch;

                if (scope.config.label1 == "") if (firstData.Label) scope.config.label1 = firstData.Label;
                if (scope.config.units1 == "") if (firstData.Units) scope.config.units1 = firstData.Units;
                var currentMonthFirstData = firstData.Values.filter(item => item.Time.getMonth() + 1 == monthSearch);
                firstData.Values = currentMonthFirstData;

                if (hasSecondData) {
                    var secondData = data.Data[1];
                    formatDates(secondData);

                    if (scope.config.label2 == "") if (secondData.Label) scope.config.label2 = secondData.Label;
                    if (scope.config.units2 == "") if (secondData.Units) scope.config.units2 = secondData.Units;
                    var currentMonthSecondData = secondData.Values.filter(item => item.Time.getMonth() + 1 == monthSearch);
                    secondData.Values = currentMonthSecondData;
                }

                if (hasThirdData) {
                    var thirdData = data.Data[2];
                    formatDates(thirdData);

                    if (scope.config.label3 == "") if (thirdData.Label) scope.config.label3 = thirdData.Label;
                    if (scope.config.units3 == "") if (thirdData.Units) scope.config.units3 = thirdData.Units;
                    var currentMonthThirdData = thirdData.Values.filter(item => item.Time.getMonth() + 1 == monthSearch);
                    thirdData.Values = currentMonthThirdData;
                }

                var startDay = hasSecondData ?
                    getMinDay(getDayFromItem(firstData.Values[0]), getDayFromItem(secondData.Values[0])) :
                    getDayFromItem(firstData.Values[0]);
                
                var endDay = hasSecondData ?
                    getMaxDay(getDayFromItem(firstData.Values[firstData.Values.length - 1]), getDayFromItem(secondData.Values[secondData.Values.length - 1])) :
                    getDayFromItem(firstData.Values[firstData.Values.length - 1]);

                
                endDay++;
                

                for (var dayIndex = startDay; dayIndex < endDay; dayIndex++) {

                    var tiempo1, firstValue, tiempo2, secondValue, tiempo3, thirdValue;
                    tiempo1 = tiempo2 = tiempo3 = "";
                    firstValue = secondValue = thirdValue = null;

                    for (var i = 0; i < firstData.Values.length; i++) {
                        var item = firstData.Values[i];
                        var dayItem = getDayFromItem(item);
                        if (dayItem != dayIndex) continue;
                        else {
                            tiempo1 = getTime(item.Time);
                            firstValue = getValue(item.Value);
                            break;
                        }
                    }

                    if (hasSecondData) {
                        for (var i = 0; i < secondData.Values.length; i++) {
                            var item = secondData.Values[i];
                            var dayItem = getDayFromItem(item);
                            if (dayItem != dayIndex) continue;
                            else {
                                tiempo2 = getTime(item.Time);
                                secondValue = getValue(item.Value);
                                break;
                            }
                        }
                    }
                    if (hasThirdData) {
                        for (var i = 0; i < thirdData.Values.length; i++) {
                            var item = thirdData.Values[i];
                            var dayItem = getDayFromItem(item);
                            if (dayItem != dayIndex) continue;
                            else {
                                tiempo3 = getTime(item.Time);
                                thirdValue = getValue(item.Value);
                                break;
                            }
                        }
                    }

                    var newDataObject = {
                        "tiempo1": tiempo1,
                        "tiempo2": tiempo2,
                        "tiempo3": tiempo3,
                        "timestamp": dayIndex,
                        "value1": firstValue,
                        "value2": secondValue,
                        "value3": thirdValue,
                    };
                    dataArray.push(newDataObject);
                }

                chart.dataProvider = dataArray;
                chart.validateData();
            }
        }

        function formatDates(itemDataArray) {
            for (var i = 0; i < itemDataArray.Values.length; i++) {
                itemDataArray.Values[i].Time = new Date(itemDataArray.Values[i].Time);
            }
        }

        function getDayFromItem(item) {
            return !!item ? item.Time.getDate() : null;
        }

        function getMonthFromTime(timeValue) {
            return timeValue.getMonth()+1;
        }

        function getMinDay(firstDataDay, secondDataDay, thirdDataDay) {
            if (firstDataDay == null && secondDataDay == null && thirdDataDay == null) return 0;
            if (firstDataDay == null) return secondDataDay;
            if (secondDataDay == null) return thirdDataDay;
            if (thirdDataDay == null) return firstDataDay;
            return firstDataDay > secondDataDay ? secondDataDay : firstDataDay;
        }

        function getMaxDay(firstDataDay, secondDataDay, thirdDataDay) {
            if (firstDataDay == null && secondDataDay && thirdDataDay == null) return 0;
            if (firstDataDay == null) return secondDataDay;
            if (secondDataDay == null) return thirdDataDay;
            if (thirdDataDay == null) return firstDataDay;
            return firstDataDay < secondDataDay ? secondDataDay : firstDataDay;
        }

        function getTime(time) {
            return time.toLocaleString().replace(",", "");
        }

        function getValue(value) {
            return parseFloat(("" + value).replace(",", "")).toFixed(scope.config.decimalPlaces);
        }

        function initChart() {
            var symbolContainerDiv = elem.find('#container')[0];
            symbolContainerDiv.id = "amChart_" + scope.symbol.Name;
            var chartconfig = getChartConfig();
            return AmCharts.makeChart(symbolContainerDiv.id, chartconfig);
        }

        function getChartConfig() {
            return {
                "type": "serial",
                "titles": createArrayOfChartTitles(),
                "precision": scope.config.decimalPlaces,
		        "hideCredits": true,
                "theme": "light",
                "depth3D": 15,
                "angle": 30,
                "marginRight": 10,
                "marginLeft": 10,
                "autoMarginOffset": 10,
                "addClassNames": true,
                "fontSize": scope.config.fontSize,
                "backgroundAlpha": 1,
                "backgroundColor": scope.config.backgroundColor,
                "plotAreaFillAlphas": 0.1,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "color": scope.config.textColor,
                "showValues": scope.config.showValues,
                "pathToImages": "Scripts/app/editor/symbols/ext/images/",
                "valueAxes": [
                    {
                        "id": "Axis1",
                        "axisColor": scope.config.textColor,
                        "gridAlpha": 0,
                        "position": "left"
                    }
                ],
                "categoryAxis": {
                    "axisColor": scope.config.textColor,
                    "gridAlpha": 0,
                    "autoWrap": true,
                },
                "graphs": [
                    {
                        "id": "PCLine3",
                        "type": "smoothedLine",
                        "balloonText": scope.config.label1 + ": <b>[[value1]] [[units1]] </b><br/>[[tiempo1]]",
                        "fontSize": scope.config.fontSize,
                        "labelPosition": "top",
                        "labelText": "[[value1]]",
                        "bullet": "round",
                        "color": scope.config.seriesColor1,
                        "lineThickness": scope.config.lineThick,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#ffffff",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 2,
                        "fillAlphas": 0,
                        "lineAlpha": 1,
                        "lineColor": scope.config.seriesColor1,
                        "title": scope.config.label1,
                        "valueAxis": "Axis1",
                        "valueField": "value1",
                        "showBalloon": true,
                        "dashLengthField": "dashLengthLine"
                    },
                    {
                        "id": "PCLine2",
                        "type": "smoothedLine",
                        "balloonText": scope.config.label2 + ": <b>[[value2]] [[units2]] </b><br/>[[tiempo2]]",
                        "fontSize": scope.config.fontSize,
                        "labelPosition": "top",
                        "labelText": "[[value2]]",
                        "bullet": "round",
                        "color": scope.config.seriesColor2,
                        "lineThickness": scope.config.lineThick,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#ffffff",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 2,
                        "fillAlphas": 0,
                        "lineAlpha": 1,
                        "lineColor": scope.config.seriesColor2,
                        "title": scope.config.label2,
                        "valueAxis": "Axis1",
                        "valueField": "value2",
                        "showBalloon": true,
                        "dashLengthField": "dashLengthLine"
                    },
                    {
                        "id": "PCLine3",
                        "type": "smoothedLine",
                        "balloonText": scope.config.label3 + ": <b>[[value3]] [[units3]] </b><br/>[[tiempo3]]",
                        "fontSize": scope.config.fontSize,
                        "labelPosition": "top",
                        "labelText": "[[value3]]",
                        "bullet": "round",
                        "color": scope.config.seriesColor3,
                        "lineThickness": 1,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#ffffff",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 2,
                        "fillAlphas": 0,
                        "lineAlpha": 1,
                        "lineColor": scope.config.seriesColor3,
                        "title": scope.config.label3,
                        "valueAxis": "Axis1",
                        "valueField": "value3",
                        "showBalloon": true,
                        "dashLengthField": "dashLengthLine"
                    }

                ],
                "dataProvider": "",
                "categoryField": "timestamp",
                "chartScrollbar": {
                    "graphType": "line",
                    "position": "bottom",
                    "scrollbarHeight": 20,
                    "autoGridCount": true,
                    "enabled": scope.config.showChartScrollBar,
                    "dragIcon": "dragIconRectSmall",
                    "backgroundAlpha": 1,
                    "backgroundColor": scope.config.plotAreaFillColor,
                    "color": scope.config.textColor,
                    "fontSize": scope.config.fontSize,
                    "selectedBackgroundAlpha": 0.2
                },
                "legend": {
                    "position": scope.config.legendPosition,
                    "equalWidths": false,
                    "color": scope.config.textColor,
                    "fontSize": scope.config.fontSize,
                    "enabled": scope.config.showLegend,
                    "valueAlign": "right",
                    "horizontalGap": 10,
                    "useGraphSettings": true,
                    "markerSize": 10
                },
                "dataDateFormat": "YYYY-MM-DD",
                "zoomOutButtonImage": ""
            }
        }


        function createArrayOfChartTitles() {
            var titlesArray;
            if (scope.config.useCustomTitle) {
                titlesArray = [
                    {
                        "text": scope.config.customTitle,
                        "size": (scope.config.fontSize + 5)
                    }
                ];
            } else {
                titlesArray = [
                    {
                        "text": "VALORES DEL MES DE " + getMonthbyIndex(scope.config.searchMonth),
                        "bold": true,
                        "size": (scope.config.fontSize + 5)
                    }];
            }

            return titlesArray;
        }

        function getMonthbyIndex(numMonth) {
            var months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
            return numMonth - 1 > 0 ? months[numMonth - 1] : "";
        }

        function myCustomConfigurationChangeFunction() {
            if (chart) {
                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles();
                } else {
                    chart.titles = null;
                }

                if (chart.graphs[0]) {
                    chart.graphs[0].title = scope.config.label1;
                    chart.graphs[0].balloonText = scope.config.label1 + ": <b>[[value1]] " + scope.config.units1 + " </b><br/>[[tiempo1]]";
                }

                if (chart.graphs[1]) {
                    chart.graphs[1].title = scope.config.label2;
                    chart.graphs[1].balloonText = scope.config.label2 + ": <b>[[value2]] " + scope.config.units2 + " </b><br/>[[tiempo2]]";
                }
                if (chart.graphs[2]) {
                    chart.graphs[2].title = scope.config.label3;
                    chart.graphs[2].balloonText = scope.config.label3 + ": <b>[[value3]] " + scope.config.units3 + " </b><br/>[[tiempo3]]";
                }

                if (chart.color !== scope.config.textColor) {
                    chart.color = scope.config.textColor;
                    chart.categoryAxis.axisColor = scope.config.textColor;
                    chart.chartScrollbar.color = scope.config.textColor;
                    chart.legend.color = scope.config.textColor;
                }

                if (chart.backgroundColor !== scope.config.backgroundColor) {
                    chart.backgroundColor = scope.config.backgroundColor;
                }

                if (chart.plotAreaFillColors !== scope.config.plotAreaFillColor) {
                    chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                }

                if (chart.fontSize !== scope.config.fontSize) {
                    chart.graphs[0].fontSize = scope.config.fontSize;
                    chart.graphs[1].fontSize = scope.config.fontSize;
                    chart.graphs[2].fontSize = scope.config.fontSize;
                    chart.chartScrollbar.fontSize = scope.config.fontSize;
                    chart.legend.fontSize = scope.config.fontSize;
                }
                if (chart.graphs[0].lineThickness !== scope.config.lineThick) {
                    chart.graphs[0].lineThickness = scope.config.lineThick;                    
                }

                if (chart.graphs[0].lineColor !== scope.config.seriesColor1) {
                    chart.graphs[0].lineColor = scope.config.seriesColor1;
                    chart.graphs[0].color = scope.config.seriesColor1;
                }

                if (chart.graphs[1].lineColor !== scope.config.seriesColor2) {
                    chart.graphs[1].lineColor = scope.config.seriesColor2;
                    chart.graphs[1].color = scope.config.seriesColor2;
                }
                if (chart.graphs[2].lineColor !== scope.config.seriesColor3) {
                    chart.graphs[2].lineColor = scope.config.seriesColor3;
                    chart.graphs[2].color = scope.config.seriesColor3;
                }

                if (scope.config.showValues) {
                    chart.graphs[0].labelText = "[[value1]]";
                    chart.graphs[1].labelText = "[[value2]]";
                    chart.graphs[2].labelText = "[[value3]]";
                } else {
                    chart.graphs[0].labelText = "";
                    chart.graphs[1].labelText = "";
                    chart.graphs[2].labelText = "";
                }

                if (chart.chartScrollbar.enabled != scope.config.showChartScrollBar) {
                    chart.chartScrollbar.enabled = scope.config.showChartScrollBar;
                }

                chart.legend.enabled = scope.config.showLegend;
                chart.legend.position = scope.config.legendPosition;

                chart.validateData();
                chart.validateNow();
            }
        }
    };

    BS.symbolCatalog.register(myCustomSymbolDefinition);


})(window.PIVisualization);