(function (BS) {

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'barHorizonYear',
        displayName: 'Barras Horizontales Anuales mtto',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        inject: ['timeProvider'],
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        supportsCollections: true,
        visObjectType: symbolVis,

        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                FormatType: null,
                Height: 500,
                Width: 1000,
                Intervals: 500,
                minimumYValue: 0,
                maximumYValue: 100,
                fontSize: 28,
                yAxisRange: 'allSigma',
                axisPosition: "left",
                showTitle: false,
                textColor: "black",
                axesColor: "black",
                backgroundColor: "transparent",
                plotAreaFillColor: "transparent",
                useBarsInsteadOfColumns: true,
                barColor1: "#1B6CA8",
                barColor2: "#0EB8D3",
                barColor3: "#E2062C",
                showLabels: true,
                columnWidth: 0.5,
                columnOpacity: 1,
                numberOfSigmas: '5',
                showCategoryAxisLabels: true,
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

    symbolVis.prototype.init = function (scope, elem, timeProvider) {
	    console.log('\t[+] Barra Horizontal - Year loaded');        

	    this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomChangeFunction;

        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        symbolContainerDiv.id = newUniqueIDString;
        var initialTime = 'T00:00:00';
        let todayDate = new Date();
        var chart = false;

        let stringTimeED = getStartEndTimeForLoad(1, parseInt(todayDate.getFullYear()), 1);
        //getStartEndTimeForLoad(parseInt(todayDate.getMonth()+1), parseInt(todayDate.getFullYear()), 1);
        timeProvider.requestNewTime(stringTimeED.startTimeED, stringTimeED.endTimeED, true);

        function myCustomDataUpdateFunction(data) {
            
            if (data !== null) {
                const months=['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO','SET', 'OCT', 'NOV', 'DIC'];
                var dataArray = [];
                const nameEquip = (data.Data[0].Values[0].Value.split("||")[7]).toString();
                let valuesOfData = data.Data[0].Values;
            
                getDataOfMonth(dataArray , valuesOfData, months[0], 1);
                getDataOfMonth(dataArray , valuesOfData, months[1], 2);
                getDataOfMonth(dataArray , valuesOfData, months[2], 3);
                getDataOfMonth(dataArray , valuesOfData, months[3], 4);
                getDataOfMonth(dataArray , valuesOfData, months[4], 5);
                getDataOfMonth(dataArray , valuesOfData, months[5], 6);
                getDataOfMonth(dataArray , valuesOfData, months[6], 7);
                getDataOfMonth(dataArray , valuesOfData, months[7], 8);
                getDataOfMonth(dataArray , valuesOfData, months[8], 9);
                getDataOfMonth(dataArray , valuesOfData, months[9], 10);
                getDataOfMonth(dataArray , valuesOfData, months[10], 11);
                getDataOfMonth(dataArray , valuesOfData, months[11], 12);

                if (!chart) chart = getNewChart(dataArray, nameEquip);
                else refreshChart(dataArray);

                chart.validateData();
                chart.validateNow();
            }
        };

        function getDataOfMonth(dataArray ,data, monthLabel, numMonth){
            var opHours = 0; 
            var demHours = 0;
            var inopHours = 0;
            if (data.length > 0){
                for(let init = 0; init < data.length; init++){
                    if (new Date(data[init].Time).getMonth()+1 == numMonth){
                        let valueAttrib = data[init].Value;
                        opHours += parseFloat(valueAttrib.split("||")[23]);
                        demHours += parseFloat(valueAttrib.split("||")[24]);
                        inopHours += parseFloat(valueAttrib.split("||")[18]);
                    }
                };
                opHours = opHours.toFixed(scope.config.decimalPlaces);
                demHours = demHours.toFixed(scope.config.decimalPlaces);
                inopHours = inopHours.toFixed(scope.config.decimalPlaces);
            }
            var objectToUse = [opHours, demHours, inopHours];
            var dataArrayObject = getDataArray(monthLabel, objectToUse);
            dataArray.push(dataArrayObject);
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
            if (chart.graphs[2].fillColors !== scope.config.barColor3) chart.graphs[2].fillColors = scope.config.barColor3;
        };

        function getDataArray(monthLabel, objetcToUse) {
            return {
                "category": monthLabel,
                "column-1": objetcToUse[0],
                "column-2": objetcToUse[1],
                "column-3": objetcToUse[2]
            }
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
        };

        function getStartEndTimeForLoad(month, year, day) {
            let startDate = new Date(year, month, day);

            if (month - 1 == 1 && day == 29 && year % 4 > 0) {
                startDate = new Date(year, month - 1, 28);
            }
    
            startDate.setMonth(startDate.getMonth() - 1);

            let startMonth = startDate.getMonth() + 1;
            let startStringMonth = startMonth > 9 ? `${startMonth}` : `0${startMonth}`;
            
            return {
                startTimeED: `${startDate.getFullYear()}-${startStringMonth}-${startDate.getDate()}${initialTime}`,
                endTimeED: "*"
            };
        };

        function getNewChart(dataArray, nameTitle) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "titles": createArrayOfChartTitles(),
                "theme": "light",
                "hideCredits": true,
                "categoryField": "category",
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
                        //"title": "Acumulado de Horas en el Mes",
                        "titleFontSize": 32,
                        "unit": 'h',
                        "axisAlpha": 1,
                        "fillAlpha": 0,
                        "gridAlpha": 1,
                        "stackType": "regular",
                        "axisColor": scope.config.axesColor,
                        "gridColor": scope.config.gridColor,
                        "position": scope.config.axisPosition,
                        "ignoreAxisWidth": false,
                        "labelsEnabled": true,
                        "showLastLabel": true,
                        "maximum": 744,
                        "minimum":0,
                        "labelRotation":90,
                        "centerRotatedLabels": true,
                        "fontSize": 28,
                        "bold": true
                    }
                ],
                "categoryAxis": {
                    "title": nameTitle,
                    "titleFontSize": 40,
                    "gridPosition": "start",
                    "minPeriod": "ss",
                    "axisAlpha": 1,
                    "gridAlpha": 1,
                    "axisColor": scope.config.axesColor,
                    "gridColor": scope.config.gridColor,
                    "boldLabels": true,
                    "autoWrap": true,
                    "labelsEnabled": scope.config.showCategoryAxisLabels,
                    "labelRotation":-90,
                    "fontSize": scope.config.fontSize-2
                },
                "graphs": [
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-1",
                        "title": "Enero: Horas Operativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        "labelText": "[[column-1]]",
                        "fillColors": scope.config.barColor1,
                        "labelFontWeight": "bold",
                        "valueField": "column-1",
                        "fontSize": scope.config.fontSize + 5,
                        "newStack":true,
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]] "  + "</b>",
                        "id": "AmGraph-2",
                        "title": "Enero: Horas Demoras",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineThickness": 1,
                        "lineColor": scope.config.barColor2,
                        "labelText": "[[column-2]]",
                        "fillColors": scope.config.barColor2,
                        "labelFontWeight": "bold",
                        "valueField": "column-2",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]" + "</b>",
                        "id": "AmGraph-3",
                        "title": "Enero: Horas Inoperativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor3,
                        "lineThickness": 1,
                        "labelText": "[[column-3]]",
                        "fillColors": scope.config.barColor3,
                        "labelFontWeight": "bold",
                        "valueField": "column-3",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    }
                ],
                "guides": [],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "fontSize": scope.config.fontSize + 5,
                    "labelFontWeight": "bold",
                    "enabled": false,
                    "color": "black",
                    "useGraphSettings": false
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
                    chart.graphs[2].fontSize = scope.config.fontSize - 5;
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
                chart.graphs[2].columnWidth = scope.config.columnWidth;

                chart.graphs[0].fillAlphas = scope.config.columnOpacity;
                chart.graphs[1].fillAlphas = scope.config.columnOpacity;
                chart.graphs[2].fillAlphas = scope.config.columnOpacity;

                if (chart.graphs[0].fillColors !== scope.config.barColor1) {
                    chart.graphs[0].fillColors = scope.config.barColor1;
                }
                if (chart.graphs[1].fillColors !== scope.config.barColor2) {
                    chart.graphs[1].fillColors = scope.config.barColor2;
                }
                if (chart.graphs[2].fillColors !== scope.config.barColor3) {
                    chart.graphs[2].fillColors = scope.config.barColor3;
                }

                if (scope.config.showLabels) {
                    chart.graphs[0].labelText = "[[column-1]]";
                    chart.graphs[1].labelText = "[[column-2]]";
                    chart.graphs[2].labelText = "[[column-3]]";
                } else {
                    chart.graphs[0].labelText = "";
                    chart.graphs[1].labelText = "";
                    chart.graphs[2].labelText = "";
                }

                chart.validateData();
                chart.validateNow();
            }
        }
    };

    BS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);