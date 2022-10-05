(function (BS) {
    //'use strict';

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'columnbar',
        displayName: 'Column & Bar',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        visObjectType: symbolVis,

        getDefaultConfig: function () {
            return {
                DataShape: 'Table',
                Height: 300,
                Width: 550,
                textColor: "white",
                backgroundColor: "black",
                gridColor: "darkgray",
                plotAreaFillColor: "black",
                useBarsInsteadOfColumns: false,
                seriesColor: "red",
                useUniqueDataItemColors: true,
                showLabels: true,
                columnWidth: 0.5,
                columnOpacity: 1,
                graphType: "column",
                includeElementName: true,
                axisPosition: "left",
                axesColor: "white",
                showCategoryAxisLabels: true,
                alternateEvenAndOddColors: false,
                evenColor: "yellow",
                oddColor: "orange",
                useFixedAxisRange: false,
                fixedYMin: 0,
                fixedYMax: 1,
                fontSize: 22,
                showTitle: false,
                customTitle: "",
                decimalPlaces: 1,

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
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
	console.log('ColumnBar loaded');
        var chart = initChart();
        var labels = getLabels(scope.symbol.DataSources);
        var units = getLabels(scope.symbol.DataSources);

        function myCustomDataUpdateFunction(data) {
            if (!data || !chart) return;
            if (!labels) labels = getLabels(scope.symbol.DataSources);
            if (!units) units = getLabels(scope.symbol.DataSources);

            if (data.Rows[0].Label) {
                labels = data.Rows.map(
                    function (item) {
                        var label = item.Label;
                        var posicion = label.indexOf('|');
                        label = label.slice(posicion + 1, label.length);
                        return {
                            Label: label
                        };
                    }
                );
            }


            if (data.Rows[0].Units) {
                units = data.Rows.map(
                    function (item) {
                        var units = item.Units;
                        return {
                            Units: units
                        };
                    }
                );
            }

            var dataprovider = convertToChartDataFormat(data, labels, units);
            chart.dataProvider = dataprovider;
            chart.validateData();
        }




        function initChart() {
            var symbolContainerDiv = elem.find('#container')[0];
            symbolContainerDiv.id = "amChart_" + scope.symbol.Name;

            var chartconfig = getChartConfig();
            var customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, chartconfig);

            return customVisualizationObject;
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

        function getLabels(datasources) {
            return datasources.map(function (item) {
                var isAttribute = /af:/.test(item);
                var label = isAttribute ? item.match(/\w*\|.*$/)[0] : item.match(/\w+$/)[0];

                if (!scope.config.includeElementName && (label.indexOf("|") !== -1)) {
                    label = label.split("|")[label.split("|").length - 1];
                }

                return {
                    Label: label
                };
            });
        }

        var chartColors = ["#b8cce4", "#b7dde8", "#41a9c3", "#548dd4", "rgb(11, 100, 126)", "rgb(126, 11, 11)", "rgb(11, 117, 110)", "rgb(19, 38, 110)", "rgb(46, 32, 238)", "rgb(21, 117, 11)"];
        var evenOddColors = [scope.config.evenColor, scope.config.oddColor];
        function convertToChartDataFormat(data, labels, units) {
            var itemsmapped =
                data.Rows.map(
                    function (item, index) {
                        var unit = units[index] ? units[index].Units : "";
                        return {
                            Value: parseFloat("" + item.Value.replace(",", ".")).toFixed(scope.config.decimalPlaces),
                            Time: item.Time,
                            Units: unit,
                            StreamName: labels[index].Label,
                            uniqueColor: chartColors[index],
                            commonColor: scope.config.seriesColor,
                            evenOrOddColor: evenOddColors[(index % 2)],
                        }
                    }
                );
            return itemsmapped;
        }

        function getChartConfig() {
            return {
                "type": "serial",
                "titles": createArrayOfChartTitles(),
                "precision": scope.config.decimalPlaces,
                "theme": "light",
                "backgroundAlpha": 1,
		        "hideCredits": true,
                "backgroundColor": scope.config.backgroundColor,
                "color": scope.config.textColor,
                "plotAreaFillAlphas": 1,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "fontFamily": "arial",
                "creditsPosition": "top-right",
                "rotate": scope.config.useBarsInsteadOfColumns,
                "fontSize": scope.config.fontSize,
                "valueAxes": [
                    {
                        "position": scope.config.axisPosition,
                        "inside": false,
                        "axisAlpha": 1,
                        "axisColor": scope.config.axesColor,
                        "fillAlpha": 0.05,
                        "gridAlpha": 1,
                        "gridColor": scope.config.gridColor,
                        "fontSize": 18
                    }
                ],
                "categoryAxis": {
                    "axisAlpha": 1,
                    "axisColor": scope.config.axesColor,
                    "gridAlpha": 1,
                    "gridColor": scope.config.gridColor,
                    "autoWrap": true,
                    "labelsEnabled": scope.config.showCategoryAxisLabels,
                    "fontSize": scope.config.fontSize
                },
                "graphs": [
                    {
                        "labelRotation": 360,
                        "fontSize": 14,
                        "bold": true,
                        "type": scope.config.graphType,
                        "fillAlphas": scope.config.columnOpacity,
                        "lineAlpha": 10,
                        "lineColorField": "uniqueColor",
                        "balloonText": "<b> [[StreamName]] </b><br/>Value: [[Value]]<br/>Time: [[Time]]",
                        "valueField": "Value",
                        "fillColorsField": "uniqueColor",
                        "fontSize": 16,
                        "showAllValueLabels": true,
                        "labelPosition": "top",
                        "labelText": "[[Value]] [[Units]]",
                        "labelColorField": scope.config.textColor,
                        "columnWidth": scope.config.columnWidth
                    }
                ],
                "dataProvider": "",
                "categoryField": "StreamName",
                "chartCursor": {
                    "cursorColor": "gray",
                    "valueLineBalloonEnabled": true,
                    "valueLineEnabled": true,
                    "valueZoomable": true
                }
            }
        }

        var oldLabelSettings;

        function myCustomConfigurationChangeFunction(data) {
            if (oldLabelSettings != scope.config.includeElementName) {
                oldLabelSettings == scope.config.includeElementName;
                labels = getLabels(scope.symbol.DataSources);
            }

            evenOddColors = [scope.config.evenColor, scope.config.oddColor];

            if (chart) {
                chart.color = scope.config.textColor;
                chart.backgroundColor = scope.config.backgroundColor;
                chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                chart.rotate = scope.config.useBarsInsteadOfColumns;
                chart.categoryAxis.gridColor = scope.config.gridColor;
                chart.categoryAxis.axisColor = scope.config.axesColor;
                chart.categoryAxis.labelsEnabled = scope.config.showCategoryAxisLabels;
                chart.valueAxes[0].gridColor = scope.config.gridColor;
                chart.valueAxes[0].position = scope.config.axisPosition;
                chart.valueAxes[0].axisColor = scope.config.axesColor;
                chart.graphs[0].columnWidth = scope.config.columnWidth;
                chart.graphs[0].fillAlphas = scope.config.columnOpacity;
                chart.graphs[0].type = scope.config.graphType;
                chart.graphs[0].color = scope.config.textColor;

                if (chart.fontSize !== scope.config.fontSize) {
                    chart.fontSize = scope.config.fontSize;
                    chart.categoryAxis.fontSize = scope.config.fontSize;
                    chart.valueAxes[0].fontSize = scope.config.fontSize;
                }

                if (scope.config.showLabels) {
                    chart.graphs[0].labelText = "[[Value]] [[Units]]";
                } else {
                    chart.graphs[0].labelText = null;
                }

                if (scope.config.useUniqueDataItemColors) {
                    chart.graphs[0].fillColorsField = "uniqueColor";
                    chart.graphs[0].lineColorField = "uniqueColor";
                } else if (scope.config.alternateEvenAndOddColors) {
                    chart.graphs[0].fillColorsField = "evenOrOddColor";
                    chart.graphs[0].lineColorField = "evenOrOddColor";
                } else {
                    chart.graphs[0].fillColorsField = "commonColor";
                    chart.graphs[0].lineColorField = "commonColor";
                }

                if (scope.config.useFixedAxisRange) {
                    chart.valueAxes[0].minimum = scope.config.fixedYMin;
                    chart.valueAxes[0].maximum = scope.config.fixedYMax;
                } else {
                    chart.valueAxes[0].minimum = undefined;
                    chart.valueAxes[0].maximum = undefined;
                }
                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles();
                } else {
                    chart.titles = null;
                }
                if (chart.precision != scope.config.decimalPlaces) {
                    chart.precision = scope.config.decimalPlaces;
                }


                chart.validateNow();
            }
        }
    }

    BS.symbolCatalog.register(definition);

})(window.PIVisualization);