(function (BS) {

    function symbolVis() {}
    BS.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'linestasa',
        displayName: 'Line Tasa',
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
                axesColor: "#000000",
                seriesColor1: "#1e8449",
                seriesColor2: "#ff0000",
                seriesColor3: "#ff0000",
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                useColumns: false,
                lineThick: 3,
                AxisThick: 2,
                showValues: true,
                decimalPlaces: 1,
                customTitle: "",
                stringLabel1: "",
                stringLabel2: "",
                stringLabel3: "",
                stringUnits: "",
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
        console.log('[+] LineTasa');
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;

        scope.config.stringLabel1 = "";
        scope.config.stringLabel2 = "";
        scope.config.stringLabel3 = "";
        scope.config.stringUnits = "";

        var chart = initChart();
        var dataArray = [];
        const quantity = -((new Date).getDate())+1;
        // var itemsValuesReal;

        function myCustomDataUpdateFunction(data) {
            if (!data || !chart) return;

            if (data !== null && data.Data) {
                dataArray = [];

                var itemsValues = data.Data[0];
                if (scope.config.stringLabel1 == "") if (itemsValues.Label) scope.config.stringLabel1 = itemsValues.Label;
                if (scope.config.stringUnits == "") if (itemsValues.Units) scope.config.stringUnits = itemsValues.Units;
                
                // itemsValuesReal = data.Data[1];

                
                itemsValues.Values = itemsValues.Values.slice(quantity);

                var firstLimit, secondLimit;
                firstLimit = secondLimit = null;

                for (var i = 0; i < itemsValues.Values.length; i++) {                                        
                    var horas = (new Date(itemsValues.Values[i].Time)).getHours();
                    var tiempo = new Date(itemsValues.Values[i].Time).toLocaleString('es-pe', { day :"numeric", month:"numeric"}).replace(",", "");       
                    var valuesArray1 = parseFloat(("" + itemsValues.Values[i].Value).replace(",", ""));
                    if (isNaN(valuesArray1)) valuesArray1 = null;

                    if (valuesArray1 != null ) valuesArray1 = valuesArray1.toFixed(scope.config.decimalPlaces);

                    var newDataObject = {
                        "timestamp": horas,
                        "tiempo": tiempo,
                        "value0": valuesArray1,
                        "value1": firstLimit,
                        "value2": secondLimit,
                    };

                    dataArray.push(newDataObject);
                }
                chart.dataProvider = dataArray;
                chart.validateData();

                // document.querySelector('#linetasa__value').innerHTML = itemsValuesReal.Values[itemsValuesReal.Values.length-1].Value.toFixed(scope.config.decimalPlaces) + '%';
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
                "titles": createArrayOfChartTitles(),
                "fontSize": scope.config.fontSize,
                "backgroundAlpha": 1,
                "backgroundColor": scope.config.backgroundColor,
                "precision": scope.config.decimalPlaces,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "color": scope.config.textColor,
                "thousandsSeparator": "",
                "decimalSeparator": ".",
                "hideCredits": true,
                "showValues": scope.config.showValues,
                "categoryAxis": {
                    "axisColor": scope.config.textColor,
                    "gridAlpha": 0,
                    "autoWrap": true,
                },
                "chartCursor": {
                    "pan": true,
                    "valueLineEnabled": true,
                    "cursorAlpha": 0,
                    "categoryBalloonEnabled": false,
                    "cursorColor": "#102F2B",
                },
                "graphs": [
                    {
                        "id": "Line1",
                        "balloonText": "<b>[[value0]] " + scope.config.stringUnits + "</b><br/> [[tiempo]]",
                        "fontSize": scope.config.fontSize,
                        "labelPosition": "top",
                        "labelText": "[[value0]]",
                        "bullet": "round",
                        "color": scope.config.seriesColor1,
                        "lineColor": scope.config.seriesColor1,
                        "lineThickness": scope.config.lineThick,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#FFFFFF",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 2,
                        "bulletSize": 5,
                        "hideBulletsCount": 50,
                        "fillAlphas": 0.3,
                        "lineAlpha": 2,
                        "title": scope.config.stringLabel1,
                        "valueAxis": "Axis1",
                        "valueField": "value0",
                        "showBalloon": true,
                        "animationPlayed": true,
                        "dashLengthField": "dashLengthLine"
                    },
                    {
                        "id": "ImpCriticos1",
                        "type": "smoothedLine",
                        "lineThickness": 2,
                        "lineColor": scope.config.seriesColor2,
                        "title": scope.config.stringLabel2,
                        "valueAxis": "Axis1",
                        "valueField": "value1",
                        "animationPlayed": true,
                    },
                    {
                        "id": "ImpCriticos2",
                        "type": "smoothedLine",
                        "lineThickness": 2,
                        "lineColor": scope.config.seriesColor3,
                        "title": scope.config.stringLabel3,
                        "valueAxis": "Axis1",
                        "valueField": "value2",
                        "animationPlayed": true,
                    }],
                "dataProvider": "",
                "categoryField": "tiempo",
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
                titlesArray = [
                    {
                        "text": scope.config.customTitle,
                        "size": (scope.config.fontSize + 10)
                    }
                ];
            } else {
                titlesArray = [
                    {
                        "text": " ",
                        "bold": true,
                        "size": (scope.config.fontSize + 10)
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
                    chart.graphs[0].balloonText = "<b>[[value0]] " + scope.config.stringUnits + "</b><br/>[[tiempo]]";
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

    BS.symbolCatalog.register(myCustomSymbolDefinition);

}) (window.PIVisualization);