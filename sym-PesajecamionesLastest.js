(function(PC) {

    function symbolVis() {}
    PC.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'PesajecamionesLatest',
        displayName: 'Pesaje Camiones latest',
        datasourceBehavior: PC.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        visObjectType: symbolVis,
        supportsCollections: true,

        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: PC.Extensibility.Enums.DataQueryMode.ModeEvents,
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
                axesColor: "#000000",
                seriesColor1: "#1e8449",
                seriesColor2: "#ff0000",
                seriesColor3: "#ff0000",
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                useColumns: false,
                lineThick: 1,
                AxisThick: 2,
                showValues: true,
                decimalPlaces: 1,
                customTitle: "",
                stringLabel1: "",
                stringLabel2: "",
                stringLabel3: "",
                stringUnits: ""
            }
        },

        configOptions: function() {
            return [{
                title: "Format Symbol",
                mode: "format",
            }];
        }
    };

    symbolVis.prototype.init = function(scope, elem) {
        scope.symbol.Configuration.Intervals = 5000;
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
	    console.log('\t[+]Pesaje Camiones latest loaded');
        scope.config.stringLabel1 = "";
        scope.config.stringLabel2 = "";
        scope.config.stringLabel3 = "";
        scope.config.stringUnits = "";

        var chart = initChart();
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {
	    
            if (!data || !chart) return;

            if (data !== null && data.Data) {
                dataArray = [];
                const quantity = -24;

                var itemsValues1 = data.Data[0];
                var itemsValues2 = data.Data[1];
                var itemsValues3 = data.Data[2];
                if (scope.config.stringLabel1 == "")
                    if (itemsValues1.Label) scope.config.stringLabel1 = itemsValues1.Label;
                if (scope.config.stringUnits1 == "")
                    if (itemsValues1.Units) scope.config.stringUnits1 = itemsValues1.Units;

                if (scope.config.stringLabel2 == "")
                    if (itemsValues2.Label) scope.config.stringLabel2 = itemsValues2.Label;
                if (scope.config.stringUnits1 == "")
                    if (itemsValues2.Units) scope.config.stringUnits2 = itemsValues2.Units;

                if (scope.config.stringLabel3 == "")
                    if (itemsValues3.Label) scope.config.stringLabel3 = itemsValues3.Label;
                if (scope.config.stringUnits3 == "")
                    if (itemsValues2.Units) scope.config.stringUnits3 = itemsValues3.Units;


                itemsValues1.Values = itemsValues1.Values.slice(quantity);
                itemsValues2.Values = itemsValues2.Values.slice(quantity);
                itemsValues3.Values = itemsValues3.Values.slice(quantity);

                for (var i = 0; i < itemsValues1.Values.length; i++) {
                    var horas = (new Date(itemsValues1.Values[i].Time)).getHours();
                    var min = (new Date(itemsValues1.Values[i].Time)).getMinutes();

                    var tiempo = new Date(itemsValues1.Values[i].Time).toLocaleString().replace(",", "");
                    var valuesArray1 = parseFloat(("" + itemsValues1.Values[i].Value).replace(",", ""));
                    var valuesArray2 = parseFloat(("" + itemsValues2.Values[i].Value).replace(",", ""));
                    var valuesArray3 = parseFloat(("" + itemsValues3.Values[i].Value).replace(",", ""));

                    if (isNaN(valuesArray1)) valuesArray1 = null;
                    if (isNaN(valuesArray2)) valuesArray2 = null;
                    if (isNaN(valuesArray3)) valuesArray3 = null;
                    if (valuesArray1 != null) valuesArray1 = valuesArray1.toFixed(scope.config.decimalPlaces);
                    if (valuesArray2 != null) valuesArray2 = valuesArray2.toFixed(scope.config.decimalPlaces);
                    if (valuesArray3 != null) valuesArray3 = valuesArray3.toFixed(scope.config.decimalPlaces);


                    var newDataObject = {
                        "timestamp": horas + ":" + min,
                        "tiempo": tiempo,
                        "value0": valuesArray1,
                        "value1": valuesArray2,
                        "value2": valuesArray3,
                    };

                    dataArray.push(newDataObject);
                   
                }
                chart.dataProvider = dataArray;
                chart.validateData();
            }
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
                "theme": "light",
		        "hideCredits": true,
                "depth3D": 15,
                "angle": 30,
                "marginRight": 10,
                "marginLeft": 10,
                "autoMarginOffset": 10,
                "addClassNames": true,
                "titles": createArrayOfChartTitles(),
                "fontSize": scope.config.fontSize,
                "backgroundAlpha": 1,
                "backgroundColor": scope.config.backgroundColor,
                "precision": scope.config.decimalPlaces,
                "plotAreaFillAlphas": 0.1,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "color": scope.config.textColor,
                "pathToImages": "Scripts/app/editor/symbols/ext/images/",
                "thousandsSeparator": "",
                "decimalSeparator": ".",

                "showValues": scope.config.showValues,
                "valueAxes": [{
                    "id": "Axis1",
                    "axisColor": scope.config.textColor,
                    "gridAlpha": 0,
                    "position": "left"
                }],
                "categoryAxis": {
                    "axisColor": scope.config.textColor,
                    "gridAlpha": 0,
                    "autoWrap": true,
                },
                "graphs": [{
                        "id": "PCLine1",
                        "type": "smoothedLine",
                        "balloonText": "[[title]]: <b>[[value0]] " + scope.config.stringUnits + "</b><br/>[[tiempo]]",
                        "fontSize": scope.config.fontSize,
                        "labelPosition": "top",
                        "labelText": "[[value0]]",
                        "bullet": "round",
                        "color": scope.config.seriesColor1,
                        "lineColor": scope.config.seriesColor1,
                        "lineThickness": scope.config.lineThick,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#ffffff",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 2,
                        "fillAlphas": 0,
                        "lineAlpha": 2,
                        "title": scope.config.stringLabel1,
                        "valueAxis": "Axis1",
                        "valueField": "value0",
                        "showBalloon": true,
                        "animationPlayed": true,
                        "dashLengthField": "dashLengthLine"
                    },
                    {
                        "id": "PCLine2",
                        "type": "smoothedLine",
                        "balloonText": "[[title]]: <b>[[value1]] " + scope.config.stringUnits + "</b><br/>[[tiempo]]",
                        "fontSize": scope.config.fontSize,
                        "labelPosition": "top",
                        "labelText": "[[value1]]",
                        "bullet": "round",
                        "color": scope.config.seriesColor2,
                        "lineColor": scope.config.seriesColor2,
                        "lineThickness": scope.config.lineThick,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#ffffff",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 2,
                        "fillAlphas": 0,
                        "lineAlpha": 2,
                        "title": scope.config.stringLabel2,
                        "valueAxis": "Axis1",
                        "valueField": "value1",
                        "showBalloon": true,
                        "animationPlayed": true,
                        "dashLengthField": "dashLengthLine"
                    },
                    {
                        "id": "PCLine3",
                        "type": "smoothedLine",
                        "balloonText": "[[title]]: <b>[[value2]] " + scope.config.stringUnits + "</b><br/>[[tiempo]]",
                        "fontSize": scope.config.fontSize,
                        "labelPosition": "top",
                        "labelText": "[[value2]]",
                        "bullet": "round",
                        "color": scope.config.seriesColor3,
                        "lineColor": scope.config.seriesColor3,
                        "lineThickness": scope.config.lineThick,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#ffffff",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 2,
                        "fillAlphas": 0,
                        "lineAlpha": 2,
                        "title": scope.config.stringLabel3,
                        "valueAxis": "Axis1",
                        "valueField": "value2",
                        "showBalloon": true,
                        "animationPlayed": true,
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
                    "fontSize": scope.config.fontSize + 5,
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
                titlesArray = [{
                    "text": scope.config.customTitle,
                    "size": (scope.config.fontSize + 3)
                }];
            } else {
                titlesArray = [{
                    "text": " ",
                    "bold": true,
                    "size": (scope.config.fontSize + 4)
                }];
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

                if (chart.graphs[0]) {
                    chart.graphs[0].title = scope.config.stringLabel1;
                    chart.graphs[0].balloonText = scope.config.stringLabel1 + ": <b>[[value0]] " + scope.config.stringUnits + "</b><br/>[[tiempo]]";
                }

                if (chart.graphs[1]) {
                    chart.graphs[1].title = scope.config.stringLabel2;
                }

                if (chart.graphs[2]) {
                    chart.graphs[2].title = scope.config.stringLabel3;
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
                    chart.graphs[0].fontSize = scope.config.fontSize - 5;
                    chart.chartScrollbar.fontSize = scope.config.fontSize - 5;
                    chart.legend.fontSize = scope.config.fontSize + 5;
                }

                if (chart.graphs[0].lineColor !== scope.config.seriesColor1) {
                    chart.graphs[0].lineColor = scope.config.seriesColor1;
                    chart.graphs[0].color = scope.config.seriesColor1;
                }

                if (chart.graphs[0].lineThickness !== scope.config.lineThick) {
                    chart.graphs[0].lineThickness = scope.config.lineThick;
                }

                if (chart.graphs[1].lineColor !== scope.config.seriesColor2) {
                    chart.graphs[1].lineColor = scope.config.seriesColor2;
                }

                if (chart.graphs[2].lineColor !== scope.config.seriesColor3) {
                    chart.graphs[2].lineColor = scope.config.seriesColor3;
                }

                if (scope.config.showValues) {
                    chart.graphs[0].labelText = "[[value0]]";
                } else {
                    chart.graphs[0].labelText = "";
                }

                if (chart.precision != scope.config.decimalPlaces) {
                    chart.precision = scope.config.decimalPlaces;
                }
                chart.legend.enabled = scope.config.showLegend;
                chart.legend.fontSize = scope.config.fontSize;
                chart.legend.position = scope.config.legendPosition;

                chart.validateData();
                chart.validateNow();
            }
        }

    };

    PC.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);