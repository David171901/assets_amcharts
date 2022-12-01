(function (BS) {

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'Disponibilidad',
        displayName: 'Disponibilidad Fisica',
        inject: ['timeProvider'],
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/parettoCOMM.png',
        visObjectType: symbolVis,

        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                FormatType: null,
                Height: 500,
                Width: 500,
                fontSize: 22,
                textColor1: "black",
                textColor2: "#000000",
                colorfill2: "#FC0000",
                backgroundColor: "transparent",
                outlineColor: "white",
                useCustomTitle: false,
                customTitle: "",
                showLegend: false,
                fontSizeInside: 12,
                labels: [],
                units: [],
                decimalPlaces: 0,
            };
        },

        configOptions: function () {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        }
    };

    symbolVis.prototype.init = function (scope, elem, timeProvider) {
        console.log('\t[+]Disponibilidad Fisica');
        scope.config.FormatType = null;
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        symbolContainerDiv.id = newUniqueIDString;

        var chart;
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {
            // console.log(" ~ file: sym-disponibilidad.js ~ line 59 ~ myCustomDataUpdateFunction ~ data", data)
            let startDay = timeProvider.displayTime.start;   
            console.log(" ~ file: sym-gaugev3.js ~ line 120 ~ getCalendarTime ~ startDay", startDay)
            let endDay = timeProvider.displayTime.end != "*" ? new Date(timeProvider.displayTime.end) : new Date();
            console.log(" ~ file: sym-gaugev3.js ~ line 122 ~ getCalendarTime ~ endDay", endDay)
            if (data) {
                dataArray = [];

                if (!chart) chart = getNewChart(dataArray);
                else refreshChart(chart, dataArray)
            }
        }

        function getNewChart(dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "titles": createArrayOfChartTitles(),
                "hideCredits": true,
                "colors": ["",scope.config.colorfill2],
                "dataProvider": dataArray,
                "color": scope.config.textColor1,
                "valueAxes": [{
                    "id": "v1",
                    "axisAlpha": 0,
                    "position": "left",
                    "step": 2,
                },{
                    "id": "v2",
                    "axisAlpha": 0,
                    "position": "right",
                    "unit": "%",
                    "gridAlpha": 0,
                    "maximum": 100,
                    "minimum": 0,
                }],
                "startDuration": 1,
                "graphs": [{
                    "fillAlphas": 1,
                    "fillColorsField": "color",
                    "title": "Value",
                    "type": "column",
                    "valueField": "Value",
                    "labelText": "[[Value]]",
                    "fontSize": scope.config.fontSize,
                    "balloonText": "[[Label]]:[[Value]]",
                }, {
                    "valueAxis": "v2",
                    "bullet": "round",
                    "lineThickness": 3,
                    "bulletSize": 7,
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#FFFFFF",
                    "useLineColorForBulletBorder": true,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Percent",
                    "valueField": "percent",
                    "labelText": "[[percent]]%",
                    "fontSize": scope.config.fontSize,
                    "balloonText": "[[Label]]:[[percent]]%",
                    "precision": scope.config.decimalPlaces,
                    "labelPosition": "bottom",
                    "color": scope.config.textColor2,
                }],
                "categoryField": "Label",
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisAlpha":0,
                    "tickLength":0
                },
                "legend": {
                    "enabled": scope.config.showLegend,
                    "align": "center",
                    "position": "bottom",
                    "color": scope.config.textColor1,
                    "fontSize": scope.config.fontSize,
                    "labelHeight": 150,
                }
            });
        }


        function refreshChart(chart, dataArray) {
            chart.titles = createArrayOfChartTitles();
            chart.dataProvider = dataArray;
            chart.validateData();
            chart.validateNow();
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
            }
            return titlesArray;
        }

        function myCustomConfigurationChangeFunction(data) {
            if (chart) {
                if (chart.fontSize !== scope.config.fontSize) {
                    chart.titles = createArrayOfChartTitles();
                    chart.fontSize = scope.config.fontSize;
                    chart.graphs[0].fontSize = scope.config.fontSize;
                    chart.graphs[1].fontSize = scope.config.fontSize;
                    chart.legend.fontSize = scope.config.fontSize;
                }

                if (chart.graphs[1].precision != scope.config.decimalPlaces) {
                    chart.graphs[1].precision = scope.config.decimalPlaces;
                }

                if (chart.graphs[0].color !== scope.config.textColor1) {
                    chart.graphs[0].color = scope.config.textColor1;
                    chart.legend.color = scope.config.textColor1;
                }

                if (chart.graphs[1].color !== scope.config.textColor2) {
                    chart.graphs[1].color = scope.config.textColor2;
                }

                if (chart.colors[1] != scope.config.colorfill2) {
                    chart.colors[1] = scope.config.colorfill2;
                }

                if (chart.backgroundColor !== scope.config.backgroundColor) chart.backgroundColor = scope.config.backgroundColor;

                if (scope.config.useCustomTitle) chart.titles = createArrayOfChartTitles();
                else chart.titles = null;
                
                chart.legend.enabled = scope.config.showLegend;

                chart.validateData();
                chart.validateNow();
            }
        }
    }

    BS.symbolCatalog.register(definition);

})(window.PIVisualization);