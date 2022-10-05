(function(CS) {
    var myGaugeDefinition = {
        typeName: 'GaugeGeneric',
        displayName: 'GaugeGeneric',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                //DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 800,
                Width: 600,
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                decimalPlaces: 1,
                FormatType: null,
                showTitle: true,
                fontSize: 20,
                customTitle: "",
                //color para las bandas
                bandColor1: "#ea3838",
                bandColor2: "#ffac29",
                bandColor3: "#00CC00",
                bulletSize: 8,
                // Axis
                startAxis: 0,
                limitAxis1: 30, 
                limitAxis2: 60,
                endAxis: 100,
                // Others
                bottomTextYOffset: -175,
                labelOffset: 90,
                unit: '',
                valueInterval: 10, 
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
    symbolVis.prototype.init = function(scope, elem) {
        console.log('\t[+]GaugeGeneric');
        // INIT ATRIBUTES
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;

        // DOM
        var symbolContainerDiv1 = elem.find('#container1')[0];
        var newUniqueIDString1 = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv1.id = newUniqueIDString1;
        var chart;
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {
            console.log(" ~ file: sym-GaugeGeneric.js ~ line 64 ~ myCustomDataUpdateFunction ~ data", data)
            const datainfo = getDataProvider(data);
            dataArray.push(datainfo);
            !chart ? chart =  generateChart(dataArray, scope) : refreshChart(chart, dataArray);
            
        }

        function getDataProvider(data){
            var lastValue = data.Data[0].Values.at(-1)?.Value
            return lastValue
        };

        function refreshChart(chart, dataArray){
            chart.arrows[0].setValue(parseInt((dataArray.at(-1) || 0.0).toFixed(2)));
            chart.axes[0].bottomText = dataArray.at(-1).toFixed(2) + '' + scope.config.unit;
            chart.validateData();
            chart.validateNow();
            return chart;
        }

        function createArrayOfChartTitles() {
            var titlesArray = null;
            if (scope.config.useCustomTitle) {
                titlesArray = [{
                    "text": scope.config.customTitle,
                    "size": scope.config.fontSize + 10,
                }];
            }
            return titlesArray;
        }

    
        function myCustomConfigurationChangeFunction() {
            if(chart){
                // set colors
                if (chart.axes[0].bands[0].color !== scope.config.bandColor1) chart.axes[0].bands[0].color = scope.config.bandColor1;
                if (chart.axes[0].bands[1].color !== scope.config.bandColor2) chart.axes[0].bands[1].color = scope.config.bandColor2;
                if (chart.axes[0].bands[2].color !== scope.config.bandColor3) chart.axes[0].bands[2].color = scope.config.bandColor3;
                // set title
                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles();
                }
                if (scope.config.fontSize) {
                    chart.titles = createArrayOfChartTitles();
                    chart.axes[0].fontSize =  scope.config.fontSize;
                    chart.axes[0].bottomTextFontSize =  scope.config.fontSize + 10;
                }

                if(chart.axes[0].bottomTextYOffset != scope.config.bottomTextYOffset) chart.axes[0].bottomTextYOffset = scope.config.bottomTextYOffset;
                if(chart.axes[0].labelOffset != scope.config.labelOffset) chart.axes[0].labelOffset = scope.config.labelOffset;

                if(chart.axes[0].startValue != scope.config.startAxis) chart.axes[0].startValue = scope.config.startAxis;
                if(chart.axes[0].endValue != scope.config.endAxis) chart.axes[0].endValue = scope.config.endAxis;

                if(chart.axes[0].bands[0].startValue != scope.config.startAxis) chart.axes[0].bands[0].startValue = scope.config.startAxis;
                if(chart.axes[0].bands[1].startValue != scope.config.limitAxis1) chart.axes[0].bands[1].startValue = scope.config.limitAxis1;
                if(chart.axes[0].bands[2].startValue != scope.config.limitAxis2) chart.axes[0].bands[2].startValue = scope.config.limitAxis2;

                if(chart.axes[0].bands[0].endValue != scope.config.limitAxis1) chart.axes[0].bands[0].endValue = scope.config.limitAxis1;
                if(chart.axes[0].bands[1].endValue != scope.config.limitAxis2) chart.axes[0].bands[1].endValue = scope.config.limitAxis2;
                if(chart.axes[0].bands[2].endValue != scope.config.endAxis) chart.axes[0].bands[2].endValue = scope.config.endAxis;

                if (scope.config.valueInterval) {
                    chart.axes[0].valueInterval =  scope.config.valueInterval;
                }

                chart.validateData();
                chart.validateNow();
            }
        }


        function generateChart(dataArray, scope){
            chart = AmCharts.makeChart(symbolContainerDiv1.id,{
                "type": "gauge",
                "theme": "light",
                "hideCredits": true,
                "arrows": [
                    {
                        "value": dataArray.at(-1).toFixed(2),
                        "alpha": 0.7,
                        "borderAlpha": 0.7,
                    }
                ],
                "titles": [
                    {
                        "text": scope.config.customTitle,
                        "size": scope.config.fontSize + 10,
                    }
                ],
                "axes": [
                    {
                        // General
                        "radius": "105%",
                        "fontSize": scope.config.fontSize,
                        "valueInterval": scope.config.valueInterval,
                        "startValue": scope.config.startAxis,
                        "endValue": scope.config.endAxis,
                        "axisColor": "#000000",
                        "tickColor": "#000000",
                        "startAngle": -90,
                        "endAngle": 90,
                        // Botton Text
                        "bottomText": dataArray.at(-1).toFixed(2) + '' + scope.config.unit,
                        "bottomTextFontSize": scope.config.fontSize + 10,
                        "bottomTextBold": false,
                        "bottomTextYOffset": scope.config.bottomTextYOffset,
                        // Axes
                        "labelOffset":scope.config.labelOffset,
                        "bands": [
                            {
                                "color": scope.config.bandColor1,
                                "endValue": scope.config.limitAxis1,
                                "startValue": scope.config.startAxis,
                                "radius": "100%",
                                "innerRadius": "70%"
                            },
                            {
                                "color": scope.config.bandColor2,
                                "endValue": scope.config.limitAxis2,
                                "startValue": scope.config.limitAxis1,
                                "radius": "100%",
                                "innerRadius": "70%"
                            },
                            {
                                "color": scope.config.bandColor3,
                                "endValue":scope.config.endAxis,
                                "startValue": scope.config.limitAxis2,
                                "radius": "100%",
                                "innerRadius": "70%"
                            }
                        ]
                    }
                ],
            });
            refreshChart(chart, dataArray);
            return chart;
        }

    };

    CS.symbolCatalog.register(myGaugeDefinition);

})(window.PIVisualization);
