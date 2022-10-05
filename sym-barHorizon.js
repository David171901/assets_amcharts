(function (BS) {

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'barHorizon',
        displayName: 'Barras Horizontales',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
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

    symbolVis.prototype.init = function (scope, elem) {
	    console.log('\t[+] Barra Horizontal loaded');        

	    this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomChangeFunction;

        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        symbolContainerDiv.id = newUniqueIDString;

        var chart = false;

        function myCustomDataUpdateFunction(data) {
            
            if (data !== null) {
                
                var dataArray = [];
                var concatNameEquip = [];
                
                for(var index = 0; index < data.Data.length; index++){
                    
                    
                    var firstAttribute = data.Data[index].Values[0].Value;
                    var nameEquip = (firstAttribute.split("||")[7]).toString();

                    concatNameEquip.push(nameEquip);

                    var nameFlota = (firstAttribute.split("||")[6]).toString() + "\n";
                    
                    var stringValue1 = firstAttribute ?  getValue(firstAttribute.split("||")[23]): null;
                    var stringValue2 = firstAttribute ?  getValue(firstAttribute.split("||")[24]): null;
                    var stringValue3 = firstAttribute ?  getValue(firstAttribute.split("||")[18]): null;
        
                    var objetcToUse = [
                        stringValue1, stringValue2, stringValue3,
                        stringValue1, stringValue2, stringValue3,
                        stringValue1, stringValue2, stringValue3,
                        stringValue1, stringValue2, stringValue3,
                        stringValue1, stringValue2, stringValue3
                    ];

                    var dataArrayObject = getDataArray(nameEquip, objetcToUse);
                    dataArray.push(dataArrayObject);
                    
                    
                }

                //concatNameEquip.reverse();
               

                //var nameFlota = (firstAttribute.split("||")[6]).toString() + "\n";
                /*
                concatNameEquip.forEach(item=>{
                    nameFlota += ' ' + item +"\t";
                });
                console.log(nameFlota);
                
                */
                console.log('data Array ', dataArray);
                console.log('data array Object ', dataArrayObject);
                

                if (!chart) chart = getNewChart(dataArray, nameFlota);
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
            if (chart.graphs[2].fillColors !== scope.config.barColor3) chart.graphs[2].fillColors = scope.config.barColor3;
        };

        function getValue(attributeValue) {
            return parseFloat(attributeValue).toFixed(scope.config.decimalPlaces);
        };

        function getDataArray(labelCategory, objetcToUse) {
            return {
                    "category": labelCategory,
                    "column-1": objetcToUse[0],
                    "column-2": objetcToUse[1],
                    "column-3": objetcToUse[2],
                    "column-4": objetcToUse[3],
                    "column-5": objetcToUse[4],
                    "column-6": objetcToUse[5],
                    "column-7": objetcToUse[6],
                    "column-8": objetcToUse[7],
                    "column-9": objetcToUse[8],
                    "column-10": objetcToUse[9],
                    "column-11": objetcToUse[10],
                    "column-12": objetcToUse[11],
                    "column-13": objetcToUse[12],
                    "column-14": objetcToUse[13],
                    "column-15": objetcToUse[14],
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
        }

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
                        "title": "Acumulado de horas en la semana",
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
                        "maximum": 168,
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
                    "labelRotation":-90,
                    "labelsEnabled": scope.config.showCategoryAxisLabels,
                    "fontSize": scope.config.fontSize + 5
                },
                "graphs": [
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-1",
                        "title": "Semana 1: Horas Operativas",
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
                        "title": "Semana 1: Horas Demoras",
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
                        "title": "Semana 1: Horas Inoperativas",
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
                    },
                    
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-4",
                        "title": "Semana 2: Horas Operativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        "labelText": "[[column-4]]",
                        "fillColors": scope.config.barColor1,
                        "labelFontWeight": "bold",
                        "valueField": "column-4",
                        "fontSize": scope.config.fontSize + 5,
                        "newStack":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-5",
                        "title": "Semana 2: Horas Demoras",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor2,
                        "lineThickness": 1,
                        "labelText": "[[column-5]]",
                        "fillColors": scope.config.barColor2,
                        "labelFontWeight": "bold",
                        "valueField": "column-5",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-6",
                        "title": "Semana 2: Horas Inoperativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor3,
                        "lineThickness": 1,
                        "labelText": "[[column-6]]",
                        "fillColors": scope.config.barColor3,
                        "labelFontWeight": "bold",
                        "valueField": "column-6",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-7",
                        "title": "Semana 3: Horas Operativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        "labelText": "[[column-7]]",
                        "fillColors": scope.config.barColor1,
                        "labelFontWeight": "bold",
                        "valueField": "column-7",
                        "fontSize": scope.config.fontSize + 5,
                        "newStack":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-8",
                        "title": "Semana 3: Horas Demoras",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor2,
                        "lineThickness": 1,
                        "labelText": "[[column-8]]",
                        "fillColors": scope.config.barColor2,
                        "labelFontWeight": "bold",
                        "valueField": "column-8",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-9",
                        "title": "Semana 3: Horas Inoperativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor3,
                        "lineThickness": 1,
                        "labelText": "[[column-9]]",
                        "fillColors": scope.config.barColor3,
                        "labelFontWeight": "bold",
                        "valueField": "column-9",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-10",
                        "title": "Semana 4: Horas Operativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        "labelText": "[[column-10]]",
                        "fillColors": scope.config.barColor1,
                        "labelFontWeight": "bold",
                        "valueField": "column-10",
                        "fontSize": scope.config.fontSize + 5,
                        "newStack":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-11",
                        "title": "Semana 4: Horas Demoras",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor2,
                        "lineThickness": 1,
                        "labelText": "[[column-11]]",
                        "fillColors": scope.config.barColor2,
                        "labelFontWeight": "bold",
                        "valueField": "column-11",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-12",
                        "title": "Semana 4: Horas Inoperativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor3,
                        "lineThickness": 1,
                        "labelText": "[[column-12]]",
                        "fillColors": scope.config.barColor3,
                        "labelFontWeight": "bold",
                        "valueField": "column-12",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-13",
                        "title": "Semana 5: Horas Operativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        "labelText": "[[column-13]]",
                        "fillColors": scope.config.barColor1,
                        "labelFontWeight": "bold",
                        "valueField": "column-13",
                        "fontSize": scope.config.fontSize + 5,
                        "newStack":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-14",
                        "title": "Semana 5: Horas Demoras",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor2,
                        "lineThickness": 1,
                        "labelText": "[[column-14]]",
                        "fillColors": scope.config.barColor2,
                        "labelFontWeight": "bold",
                        "valueField": "column-14",
                        "fontSize": scope.config.fontSize + 5,
                        "clustered":true
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-15",
                        "title": "Semana 5: Horas Inoperativas",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor3,
                        "lineThickness": 1,
                        "labelText": "[[column-15]]",
                        "fillColors": scope.config.barColor3,
                        "labelFontWeight": "bold",
                        "valueField": "column-15",
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