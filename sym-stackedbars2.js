(function (BS) {
    //'use strict';

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'stackedbars2',
        displayName: 'Stacked Bars 2',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        supportsCollections: true,
        visObjectType: symbolVis,

        getDefaultConfig: function () {
            return {
                DataShape: 'Table',
                FormatType: null,
                Height: 500,
                Width: 1000,
                Intervals: 500,
                minimumYValue: 0,
                maximumYValue: 100,
                fontSize: 22,
                yAxisRange: 'allSigma',
                axisPosition: "left",
                showTitle: false,
                textColor: "black",
                axesColor: "black",
                backgroundColor: "transparent",
                plotAreaFillColor: "transparent",
                useBarsInsteadOfColumns: true,
                bar1Color: "#1B6CA8",
                bar2Color: "#0EB8D3",
                showLabels: true,
                columnWidth: 0.5,
                columnOpacity: 1,
                numberOfSigmas: '5',
                showCategoryAxisLabels: true,
                firstRowLabel: "",
                secondRowLabel: "",
                thirdRowLabel: "",
                fourthRowLabel: "",
                decimalPlaces: 2,
            };
        },

        configOptions: function () {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        }
    };

    symbolVis.prototype.init = function (scope, elem) {
        console.log('stackedbars2');
	
	this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomChangeFunction;

        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        symbolContainerDiv.id = newUniqueIDString;

        var chart = false;
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {

            if (data !== null && data.Rows) {
                var dataArray = [];
                var firstAttribute = data.Rows[0];
                var secondAttribute = data.Rows[1];
                var thirdAttribute = data.Rows[2];
                var fourthAttribute = data.Rows[3];
                var fifthAttribute = data.Rows[4];
                var sixthAttribute = data.Rows[5];
                var seventhAttribute = data.Rows[6];
                var eighthAttribute = data.Rows[7];

                var firstColumnUnits, secondColumnUnits;
                firstColumnUnits = secondColumnUnits = "";

                if (firstAttribute.Label) if (scope.config.firstRowLabel == "") scope.config.firstRowLabel = getLabel(firstAttribute.Label);
                if (thirdAttribute.Label) if (scope.config.secondRowLabel == "") scope.config.secondRowLabel = getLabel(thirdAttribute.Label);
                if (fifthAttribute.Label) if (scope.config.thirdRowLabel == "") scope.config.thirdRowLabel = getLabel(fifthAttribute.Label);
                if (seventhAttribute.Label) if (scope.config.fourthRowLabel == "") scope.config.fourthRowLabel = getLabel(seventhAttribute.Label);

                if (firstAttribute.Units) firstColumnUnits = firstAttribute.Units;
                if (secondAttribute.Units) secondColumnUnits = secondAttribute.Units;

                if (firstAttribute.Value) var stringValue1 = getValue(firstAttribute.Value);
                if (secondAttribute.Value) var stringValue2 = getValue(secondAttribute.Value);
                if (thirdAttribute.Value) var stringValue3 = getValue(thirdAttribute.Value);
                if (fourthAttribute.Value) var stringValue4 = getValue(fourthAttribute.Value);
                if (fifthAttribute.Value) var stringValue5 = getValue(fifthAttribute.Value);
                if (sixthAttribute.Value) var stringValue6 = getValue(sixthAttribute.Value);
                if (seventhAttribute.Value) var stringValue7 = getValue(seventhAttribute.Value);
                if (eighthAttribute.Value) var stringValue8 = getValue(eighthAttribute.Value);

                dataArray = getDataArray(stringValue1, stringValue2, stringValue3, stringValue4, stringValue5, stringValue6,
                    stringValue7, stringValue8);

                if (!chart) chart = getNewChart(firstColumnUnits, secondColumnUnits, dataArray);
                else refreshChart(dataArray);

                chart.validateData();
                chart.validateNow();
            }
        };

        function refreshChart(dataArray) {
            chart.dataProvider = dataArray;
            if (scope.config.showTitle) {
                chart.titles = createArrayOfChartTitles();
            } else {
                chart.titles = null;
            }
            if (chart.graphs[0].fillColors !== scope.config.barColor1) chart.graphs[0].fillColors = scope.config.barColor1;
            if (chart.graphs[1].fillColors !== scope.config.barColor2) chart.graphs[1].fillColors = scope.config.barColor2;
        };

        function getLabel(stringLabel) {
            return stringLabel.split('|')[0];
        };

        function getValue(attributeValue) {
            return parseFloat(attributeValue).toFixed(scope.config.decimalPlaces);
        };

        function getDataArray(value1, value2, value3, value4, value5, value6, value7, value8) {
            return [
                {
                    "category": scope.config.firstRowLabel,
                    "column-1": value1,
                    "column-2": value2
                },
                {
                    "category": scope.config.secondRowLabel,
                    "column-1": value3,
                    "column-2": value4
                },
                {
                    "category": scope.config.thirdRowLabel,
                    "column-1": value5,
                    "column-2": value6
                },
                {
                    "category": scope.config.fourthRowLabel,
                    "column-1": value7,
                    "column-2": value8
                }
            ];
        };

        function createArrayOfChartTitles() {
            var titlesArray = [];
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

        function getNewChart(firstColumnUnits, secondColumnUnits, dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "titles": createArrayOfChartTitles(),
                "theme": "light",
                "categoryField": "category",
                "hideCredits": true,
                "fontSize": scope.config.fontSize,
                "startDuration": 1,
                "startEffect": "easeOutSine",
                "autoMargin": true,
                "backgroundColor": scope.config.backgroundColor,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "color": scope.config.textColor,
                "rotate": scope.config.useBarsInsteadOfColumns,
                "valueAxes": [
                    {
                        "id": "ValueAxis-1",
                        "title": "",
                        "axisAlpha": 1,
                        "fillAlpha": 0,
                        "gridAlpha": 1,
                        "stackType": "regular",
                        "axisColor": scope.config.axesColor,
                        "gridColor": scope.config.gridColor,
                        "position": scope.config.axisPosition,
                    },
                    {
                        "id": "ValueAxis-2",
                        "axisAlpha": 1,
                        "fillAlpha": 0,
                        "gridAlpha": 1,
                        "position": "right",
                        "stackType": "regular",
                        "axisColor": scope.config.axesColor,
                        "gridColor": scope.config.gridColor
                    }
                ],
                "categoryAxis": {
                    "gridPosition": "start",
                    "minPeriod": "ss",
                    "axisAlpha": 1,
                    "gridAlpha": 1,
                    "axisColor": scope.config.axesColor,
                    "gridColor": scope.config.gridColor,
                    "boldLabels": true,
                    "autoWrap": true,
                    "labelsEnabled": scope.config.showCategoryAxisLabels,
                    "fontSize": scope.config.fontSize + 5
                },
                "graphs": [
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]" + firstColumnUnits + "</b>",
                        "id": "AmGraph-1",
                        "title": "Guardia Noche",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.bar1Color,
                        "lineThickness": 1,
                        "showAllValueLabels": scope.config.showLabels,
                        "labelText": "[[column-1]]",
                        "fillColors": scope.config.bar1Color,
                        "labelFontWeight": "bold",
                        "valueField": "column-1",
                        "fontSize": scope.config.fontSize + 5
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]] " + secondColumnUnits + "</b>",
                        "id": "AmGraph-2",
                        "title": "Guardia Dia",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineThickness": 1,
                        "lineColor": scope.config.bar2Color,
                        "showAllValueLabels": scope.config.showLabels,
                        "labelText": "[[column-2]]",
                        "fillColors": scope.config.bar2Color,
                        "labelFontWeight": "bold",
                        "valueField": "column-2",
                        "fontSize": scope.config.fontSize + 5
                    }
                ],
                "guides": [],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "fontSize": scope.config.fontSize + 5,
                    "labelFontWeight": "bold",
                    "enabled": true,
                    "color": "black",
                    "useGraphSettings": true
                },
                "titles": [
                    {
                        "id": "Title-1",
                        "size": scope.config.fontSize + 10,
                        "text": ""
                    }
                ],

                "dataProvider": dataArray
            });
        };

        function myCustomChangeFunction(data) {
            if (chart) {

                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles();
                } else {
                    chart.titles = null;
                }

                if (chart.fontSize !== scope.config.fontSize) {
                    chart.fontSize = scope.config.fontSize;
                    chart.titles[0].fontSize = scope.config.fontSize + 10;
                    chart.legend.fontSize = scope.config.fontSize + 5;
                    chart.graphs[0].fontSize = scope.config.fontSize - 5;
                    chart.graphs[1].fontSize = scope.config.fontSize - 5;
                    chart.categoryAxis.fontSize = scope.config.fontSize + 5;
                }

                chart.color = scope.config.textColor;
                chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                chart.rotate = scope.config.useBarsInsteadOfColumns;
                chart.categoryAxis.gridColor = scope.config.gridColor;
                chart.categoryAxis.axisColor = scope.config.axesColor;
                chart.categoryAxis.labelsEnabled = scope.config.showCategoryAxisLabels;

                chart.valueAxes[0].gridColor = scope.config.gridColor;
                chart.valueAxes[0].position = scope.config.axisPosition;
                chart.valueAxes[0].axisColor = scope.config.axesColor;

                chart.graphs[0].columnWidth = scope.config.columnWidth;
                chart.graphs[1].columnWidth = scope.config.columnWidth;
                chart.graphs[0].fillAlphas = scope.config.columnOpacity;
                chart.graphs[1].fillAlphas = scope.config.columnOpacity;

                if (chart.graphs[0].fillColors !== scope.config.barColor1) {
                    chart.graphs[0].fillColors = scope.config.barColor1;
                }
                if (chart.graphs[1].fillColors !== scope.config.barColor2) {
                    chart.graphs[1].fillColors = scope.config.barColor2;
                }

                if (scope.config.showLabels) {
                    chart.graphs[0].labelText = "[[column-1]]";
                    chart.graphs[1].labelText = "[[column-2]]";
                } else {
                    chart.graphs[0].labelText = "";
                    chart.graphs[1].labelText = "";
                }

                chart.validateData();
                chart.validateNow();
            }
        }
    };

    BS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);