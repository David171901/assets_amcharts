(function(CS) {
    var myGaugeDefinition = {
        typeName: 'graffMantto',
        displayName: 'Mantenimiento',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 800,
                Width: 800,
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                decimalPlaces: 1,
                FormatType: null,
                bandColor1: "#ffc90e",
                bandColor2: "#00a2e8",
                bandColor3: "#ff0000",
                bulletSize: 8,
                
                minimumYValue: 0,
                maximumYValue: 100,
                fontSize: 24,
                legendPosition: "bottom",
                yAxisRange: "allSigma",
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
        console.log('\t[+]Mantenimiento');
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;

        var symbolContainerDiv1 = elem.find('#container1')[0];
        var newUniqueIDString1 = "amChart_Gauge" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv1.id = newUniqueIDString1;
        
        var symbolContainerDiv2 = elem.find('#container2')[0];
        var newUniqueIDString2 = "amChart_BarHori" + scope.symbol.Name+ Math.random().toString(36).substr(2, 16);
        symbolContainerDiv2.id = newUniqueIDString2;

        var symbolContainerDiv3 = elem.find('#container3')[0];
        var newUniqueIDString3 = "amChart_BarPercent" + scope.symbol.Name+ Math.random().toString(36).substr(2, 16);
        symbolContainerDiv3.id = newUniqueIDString3;
        
        var chartGauge;
        var chartBarHorizontal;
        var chartBarPercent;

        
        function myCustomDataUpdateFunction(data) {
            
            if (data !== null) {
                
                var dataArrayGauge = [];
                var dataArrayBarHorizontal = [];
                var dataArrayBarPercent = [];

                let infoCatched = getDataProvider(data);
                
                dataArrayGauge.push(infoCatched[0]);

                infoCatched[1].forEach(infoToBarHorizontal =>{
                    dataArrayBarHorizontal.push(infoToBarHorizontal);
                });

                infoCatched[2].forEach(infoToBarPercent =>{
                    dataArrayBarPercent.push(infoToBarPercent);
                });

                if(dataArrayGauge && dataArrayBarHorizontal && dataArrayBarPercent){

                    !chartGauge ? chartGauge =  generateGaugeChart(dataArrayGauge, scope) : refreshChartGauge(chartGauge, dataArrayGauge);
                    !chartBarHorizontal ? chartBarHorizontal = generateBarHorizontal(dataArrayBarHorizontal): refreshChartBarHorizontal(dataArrayBarHorizontal);
                    !chartBarPercent ? chartBarPercent = generateBarWithPercent(dataArrayBarPercent) : refreshChartBarPercent(dataArrayBarPercent) ;

                }
                
            }

        }

        function getDataProvider(data){

            let flota = data.Data[0].Values[0].Value;
            let stringFlota =  flota.split("||")[6];

            let hInoperaTotal = 0;
            let hOperativasTotales = 0;
            let hDeDemoraTotales = 0;
            let dispMecanica = 0 ;
            let utiTotal = 0;
            let hOpPercent = 0;
            let hDemoraPercent = 0;
            let hInopPercent = 0;

            let providerGauge = [];
            let providerBarH = []; 
            let providerBarPercent = [];
            
            for(var index = 0; index < data.Data.length ; index++){
                let valueOfEquipmentData = data.Data[index] ;
                for(equip = 0; equip < valueOfEquipmentData.Values.length; equip++){
                    let valueOfEquipment = valueOfEquipmentData.Values[equip].Value;

                    console.log('val of e ', valueOfEquipment);
                    
                    if(valueOfEquipment){
                        let labelCategory = valueOfEquipment.split("||")[7] != undefined ? (valueOfEquipment.split("||")[7] + "__").toString() : (data.Data[index].Label.split("|")[0] + "__").toString() ;
                       
                        let hOperativa = getValue(valueOfEquipment.split("||")[23]);
                        let hDemora = getValue(valueOfEquipment.split("||")[24]);           
                        let hInoperativa =  getValue(valueOfEquipment.split("||")[18]);
                        let dMecanica = getValue(valueOfEquipment.split("||")[25]);
                        let utilizacion = getValue(valueOfEquipment.split("||")[26]);
    
                        hInoperaTotal += parseFloat(hInoperativa);
                        hDeDemoraTotales += parseFloat(hDemora);
                        hOperativasTotales += parseFloat(hOperativa);
    
                        var dataArrayBarHoriObject = getDataBarHorArray(labelCategory, hOperativa, hDemora, hInoperativa);
                        providerBarH.push(dataArrayBarHoriObject);
    
                        var dataArrayBarPercentOject = getDataBarPercentArray(labelCategory, utilizacion ,dMecanica);
                        providerBarPercent.push(dataArrayBarPercentOject);
                         
                    }
                }
            }
            
            let sumtorHoras = hOperativasTotales + hDeDemoraTotales + hInoperaTotal;
            
            dispMecanica = sumtorHoras != 0 ? (hOperativasTotales + hDeDemoraTotales) * 100 / sumtorHoras : 0;
            utiTotal = hOperativasTotales + hDeDemoraTotales !=0 ?  (hOperativasTotales*100) / (hOperativasTotales+hDeDemoraTotales) : 0;
    
            hOpPercent = sumtorHoras != 0 ? hOperativasTotales * 100 / sumtorHoras : 0 ;
            hDemoraPercent = sumtorHoras !=0 ? hDeDemoraTotales * 100 / sumtorHoras : 0 ;
            hInopPercent =  sumtorHoras !=0 ? hInoperaTotal * 100 / sumtorHoras : 0;

            providerGauge = {
                "flota": stringFlota,
                "hOperativa": hOperativasTotales ? hOperativasTotales.toFixed(scope.config.decimalPlaces) : hOperativasTotales,
                "hDemora": hDeDemoraTotales ? hDeDemoraTotales.toFixed(scope.config.decimalPlaces) : hDeDemoraTotales,
                "hInoperativa": hInoperaTotal ? hInoperaTotal.toFixed(scope.config.decimalPlaces) : hInoperaTotal,
                "dispMecanica": dispMecanica ? dispMecanica.toFixed(scope.config.decimalPlaces) : dispMecanica,
                "utiTotal": utiTotal ? utiTotal.toFixed(scope.config.decimalPlaces): utiTotal,
                "hOpPercent": hOpPercent ? hOpPercent.toFixed(scope.config.decimalPlaces): hOpPercent,
                "hDemoraPercent": hDemoraPercent ? hDemoraPercent.toFixed(scope.config.decimalPlaces): hDemoraPercent,
                "hInopPercent": hInopPercent ? hInopPercent.toFixed(scope.config.decimalPlaces): hInopPercent
            }
            return [providerGauge, providerBarH, providerBarPercent]; 
        }

        function refreshChartGauge(chartGauge, dataArrayGauge){

            chartGauge.arrows[0].setValue(parseFloat(dataArrayGauge[dataArrayGauge.length-1].hOpPercent));
            chartGauge.arrows[1].setValue(parseFloat(dataArrayGauge[dataArrayGauge.length-1].hOpPercent) + parseFloat(dataArrayGauge[dataArrayGauge.length-1].hDemoraPercent));
            
            chartGauge.axes[0].setTopText(dataArrayGauge[dataArrayGauge.length-1].flota + "\nD.M: " + dataArrayGauge[dataArrayGauge.length-1].dispMecanica + "% " + "\tU.T: "+ dataArrayGauge[dataArrayGauge.length-1].utiTotal +"% ");

            chartGauge.axes[0].bands[0].balloonText = "H Operativa "+ dataArrayGauge[dataArrayGauge.length-1].hOperativa;
            chartGauge.axes[0].bands[1].balloonText = "H Demora "+ dataArrayGauge[dataArrayGauge.length-1].hDemora;
            chartGauge.axes[0].bands[2].balloonText = "H Inoperativa "+ dataArrayGauge[dataArrayGauge.length-1].hInoperativa;

            chartGauge.axes[0].bands[0].setEndValue(parseFloat(dataArrayGauge[dataArrayGauge.length-1].hOpPercent));
            chartGauge.axes[0].bands[1].setStartValue(parseFloat(dataArrayGauge[dataArrayGauge.length-1].hOpPercent));
            chartGauge.axes[0].bands[1].setEndValue(parseFloat(dataArrayGauge[dataArrayGauge.length-1].hOpPercent) + parseFloat(dataArrayGauge[dataArrayGauge.length-1].hDemoraPercent));
            chartGauge.axes[0].bands[2].setStartValue(parseFloat(dataArrayGauge[dataArrayGauge.length-1].hOpPercent) + parseFloat(dataArrayGauge[dataArrayGauge.length-1].hDemoraPercent));
            chartGauge.axes[0].bands[2].setEndValue(parseFloat(dataArrayGauge[dataArrayGauge.length-1].hOpPercent) + parseFloat(dataArrayGauge[dataArrayGauge.length-1].hDemoraPercent) + parseFloat(dataArrayGauge[dataArrayGauge.length-1].hInopPercent));
            
            chartGauge.validateData();
            chartGauge.validateNow();

            return chartGauge;
        }


        function refreshChartBarHorizontal(dataArrayBarHorizontal) {
            
            chartBarHorizontal.dataProvider = dataArrayBarHorizontal;
            if (scope.config.showTitle) {
                chartBarHorizontal.titles = createArrayOfChartTitles(scope.config.useCustomTitle, scope.config.customTitle);
            } else {
                chartBarHorizontal.titles = null;
            }
            if (chartBarHorizontal.graphs[0].fillColors !== scope.config.barColor1) chartBarHorizontal.graphs[0].fillColors = scope.config.barColor1;
            if (chartBarHorizontal.graphs[1].fillColors !== scope.config.barColor2) chartBarHorizontal.graphs[1].fillColors = scope.config.barColor2;
            if (chartBarHorizontal.graphs[2].fillColors !== scope.config.barColor3) chartBarHorizontal.graphs[2].fillColors = scope.config.barColor3;
            
            chartBarHorizontal.validateData();
            chartBarHorizontal.validateNow();
        }

        function refreshChartBarPercent(dataArrayBarPercent){
            chartBarPercent.dataProvider = dataArrayBarPercent;
            chartBarPercent.graphs[0].lineColor = scope.config.bandColor1;
            chartBarPercent.validateData();
            chartBarPercent.validateNow();
        }

        function getValue(attributeValue) {
            return attributeValue  ? parseFloat(attributeValue).toFixed(scope.config.decimalPlaces): 0;
        };

        function getDataBarHorArray(labelCategory, value1, value2, value3) {
            return {
                    "category": labelCategory,
                    "column-1": value1,
                    "column-2": value2,
                    "column-3": value3
                }
        };

        function createArrayOfChartTitles(useTitle, customTitle) {
            var titlesArray = [];
            if (useTitle) {
                titlesArray = [
                    {
                        "text": customTitle,
                        "size": (scope.config.fontSize + 10)
                    }
                ];
            }
            return titlesArray;
        }

        function getDataBarPercentArray(labelCategory, value1, value2) {
            return {
                    "category": labelCategory,
                    "column-1": value1,
                    "column-2": value2
                }
        };

    
        function myCustomConfigurationChangeFunction() {
            if(chartGauge){
                if (scope.config.showGaugeTitle) {
                    chartGauge.titles = createArrayOfChartTitles(scope.config.useCustomGaugeTitle, scope.config.customGaugeTitle);
                } else {
                    chartGauge.titles = null;
                }

                if (chartGauge.axes[0].bands[0].color !== scope.config.bandColor1) chartGauge.axes[0].bands[0].color = scope.config.bandColor1;
                if (chartGauge.axes[0].bands[1].color !== scope.config.bandColor2) chartGauge.axes[0].bands[1].color = scope.config.bandColor2;
                if (chartGauge.axes[0].bands[2].color !== scope.config.bandColor3) chartGauge.axes[0].bands[2].color = scope.config.bandColor3;
                
                if(chartGauge.arrows[0].color != scope.config.bandColor1) chartGauge.arrows[0].color = scope.config.bandColor1;
                if(chartGauge.arrows[1].color != scope.config.bandColor2) chartGauge.arrows[1].color = scope.config.bandColor2;
               
                chartGauge.validateData();
                chartGauge.validateNow();
            }

            if (chartBarHorizontal) {

                if (scope.config.showTitle) {
                    chartBarHorizontal.titles = createArrayOfChartTitles(scope.config.useCustomTitle, scope.config.customTitle);
                } else {
                    chartBarHorizontal.titles = null;
                }

                if (chartBarHorizontal.fontSize !== scope.config.fontSize) {
                    chartBarHorizontal.fontSize = scope.config.fontSize;
                    chartBarHorizontal.titles[0].fontSize = scope.config.fontSize + 10;
                    chartBarHorizontal.legend.fontSize = scope.config.fontSize + 5;
                    chartBarHorizontal.graphs[0].fontSize = scope.config.fontSize - 5;
                    chartBarHorizontal.graphs[1].fontSize = scope.config.fontSize - 5;
                    chartBarHorizontal.graphs[2].fontSize = scope.config.fontSize - 5;
                    chartBarHorizontal.categoryAxis.fontSize = scope.config.fontSize + 5;
                }

                chartBarHorizontal.color = scope.config.textColor;
                chartBarHorizontal.plotAreaFillColors = scope.config.plotAreaFillColor;
                chartBarHorizontal.rotate = scope.config.useBarsInsteadOfColumns;
                chartBarHorizontal.categoryAxis.gridColor = scope.config.gridColor;
                chartBarHorizontal.categoryAxis.axisColor = scope.config.axesColor;
                chartBarHorizontal.categoryAxis.labelsEnabled = scope.config.showCategoryAxisLabels;

                chartBarHorizontal.valueAxes[0].gridColor = scope.config.gridColor;
                chartBarHorizontal.valueAxes[0].position = scope.config.axisPosition;
                chartBarHorizontal.valueAxes[0].axisColor = scope.config.axesColor;

                chartBarHorizontal.graphs[0].columnWidth = scope.config.columnWidth;
                chartBarHorizontal.graphs[1].columnWidth = scope.config.columnWidth;
                chartBarHorizontal.graphs[2].columnWidth = scope.config.columnWidth;

                chartBarHorizontal.graphs[0].fillAlphas = scope.config.columnOpacity;
                chartBarHorizontal.graphs[1].fillAlphas = scope.config.columnOpacity;
                chartBarHorizontal.graphs[2].fillAlphas = scope.config.columnOpacity;

                if (chartBarHorizontal.graphs[0].fillColors !== scope.config.barColor1) {
                    chartBarHorizontal.graphs[0].fillColors = scope.config.barColor1;
                }
                if (chartBarHorizontal.graphs[1].fillColors !== scope.config.barColor2) {
                    chartBarHorizontal.graphs[1].fillColors = scope.config.barColor2;
                }
                if (chartBarHorizontal.graphs[2].fillColors !== scope.config.barColor3) {
                    chartBarHorizontal.graphs[2].fillColors = scope.config.barColor3;
                }

                if (scope.config.showLabels) {
                    chartBarHorizontal.graphs[0].labelText = "[[column-1]]";
                    chartBarHorizontal.graphs[1].labelText = "[[column-2]]";
                    chartBarHorizontal.graphs[2].labelText = "[[column-3]]";
                } else {
                    chartBarHorizontal.graphs[0].labelText = "";
                    chartBarHorizontal.graphs[1].labelText = "";
                    chartBarHorizontal.graphs[2].labelText = "";
                }

                chartBarHorizontal.validateData();
                chartBarHorizontal.validateNow();
            }
        }

        function generateGaugeChart(dataArray, scope){
            chartGauge = AmCharts.makeChart(symbolContainerDiv1.id, {
                "theme": "light",
                "autoMargin": true,
                "autoMarginOffset": 30,
                "hideCredits": true,
                "fontSize": 28,
                "titles": createArrayOfChartTitles(scope.config.useCustomGaugeTitle, scope.config.customGaugeTitle),
                "type": "gauge",
                "axes": [{
                    "topTextFontSize": 48,
                    "topTextYOffset": 150,
                    "axisColor": "#31d6ea",
                    "axisThickness": 1,
                    "endValue": 100,
                    "gridInside": true,
                    "inside": true,
                    "radius": "55%",
                    "valueInterval": 20,
                    "tickColor": "#67b7dc",
                    "startAngle": -90,
                    "endAngle": 90,
                    //"unit": "%",
                    "bandOutlineAlpha": 0,
                    "bands": [ {
                      "color": scope.config.bandColor1,
                      "title": " H operativa ",
                      "balloonText": "H Operativa "+ dataArray[dataArray.length-1].hOperativa,
                      "endValue": parseFloat(dataArray[dataArray.length-1].hOpPercent),
                      "innerRadius": "100%",
                      "radius": "150%",
                      "gradientRatio": [0.5, 0, -0.5],
                      "startValue": 0
                    },{
                      "color": scope.config.bandColor2,
                      "title": " H demora ",
                      "balloonText": "H Demora: "+ dataArray[dataArray.length-1].hDemora,
                      "endValue": parseFloat(dataArray[dataArray.length-1].hDemoraPercent) + parseFloat(dataArray[dataArray.length-1].hOpPercent),
                      "innerRadius": "100%",
                      "radius": "150%",
                      "gradientRatio": [0.5, 0, -0.5],
                      "startValue": 0,
                    },{
                      "color": scope.config.bandColor3,
                      "title": " H inoperativa ",
                      "balloonText": "H Inopeativa: "+ dataArray[dataArray.length-1].hInoperativa ,
                      "endValue": parseFloat(dataArray[dataArray.length-1].hOpPercent) + parseFloat(dataArray[dataArray.length-1].hDemoraPercent) + parseFloat(dataArray[dataArray.length-1].hInopPercent),
                      "innerRadius": "100%",
                      "radius": "150%",
                      "gradientRatio": [0.5, 0, -0.5],
                      "startValue": 0,
                    }]
                  }],
                  "arrows": [{
                    "color": scope.config.bandColor1,
                    "alpha": 1,
                    "innerRadius": "150%",
                    "nailRadius": 0,
                    "radius": "100%"
                  },
                  {
                    "color": scope.config.bandColor2,
                    "alpha": 1,
                    "innerRadius": "150%",
                    "nailRadius": 0,
                    "radius": "100%"
                    }
                ]
            });

            refreshChart(chartGauge, dataArray);
            return chartGauge;
        }

        function generateBarHorizontal(dataArray){
            return AmCharts.makeChart(symbolContainerDiv2.id, {
                "type": "serial",
                "titles": createArrayOfChartTitles(scope.config.useCustomTitle, scope.config.customTitle),
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
                        "title": "",
                        "axisAlpha": 1,
                        "fillAlpha": 0,
                        "gridAlpha": 1,
                        "stackType": "regular",
                        "axisColor": scope.config.axesColor,
                        "gridColor": scope.config.gridColor,
                        "position": scope.config.axisPosition,
                        "maximum": 12
                    },
                    {
                        "id": "ValueAxis-2",
                        "axisAlpha": 1,
                        "fillAlpha": 0,
                        "gridAlpha": 1,
                        "position": "right",
                        "stackType": "regular",
                        "axisColor": scope.config.axesColor,
                        "gridColor": scope.config.gridColor, 
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
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-1",
                        "title": "Hrs Opers",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        "showAllValueLabels": scope.config.showLabels,
                        "labelText": "[[column-1]]",
                        "fillColors": scope.config.barColor1,
                        "labelFontWeight": "bold",
                        "valueField": "column-1",
                        "fontSize": 30
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]] "  + "</b>",
                        "id": "AmGraph-2",
                        "title": "Hrs Demoras",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineThickness": 1,
                        "lineColor": scope.config.barColor2,
                        "showAllValueLabels": scope.config.showLabels,
                        "labelText": "[[column-2]]",
                        "fillColors": scope.config.barColor2,
                        "labelFontWeight": "bold",
                        "valueField": "column-2",
                        "fontSize": 30
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]" + "</b>",
                        "id": "AmGraph-3",
                        "title": "Hrs Inopers",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor3,
                        "lineThickness": 1,
                        "showAllValueLabels": scope.config.showLabels,
                        "labelText": "[[column-3]]",
                        "fillColors": scope.config.barColor3,
                        "labelFontWeight": "bold",
                        "valueField": "column-3",
                        "fontSize": 30
                    }
                ],
                "guides": [],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "position": scope.config.legendPosition,
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

        }
        function generateBarWithPercent(dataArray){
            return AmCharts.makeChart(symbolContainerDiv3.id, {
                "type": "serial",
                "hideCredits": true,
                "precision": scope.config.decimalPlaces,
                "dataProvider": dataArray,
                "bold": true,
                "fontSize": 32,
                "valueAxes": [{
                  "axisAlpha": 0,
                  "position": "left"
                }],
                "startDuration": 1,
                "graphs": [{
                  "alphaField": "alpha",
                  "fillAlphas": 1,
                  "title": "Utilización",
                  "showAllValueLabels": true,
                  "type": "column",
                  "bold": true,
                  "lineColor": scope.config.barColor1, 
                  "columnWidth": 0.5,
                  "valueField": "column-1",
                  "dashLengthField": "dashLengthColumn"
                }, {
                  "id": "graph2",
                  "bullet": "round",
                  "showAllValueLabels": true,
                  "lineThickness": 8,
                  "lineColor": "lightblue",
                  "bulletSize": 7,
                  "bulletBorderAlpha": 1,
                  "bulletColor": "#FFFFFF",
                  "useLineColorForBulletBorder": true,
                  "bulletBorderThickness": 10,
                  "fillAlphas": 0,
                  "bold": true,
                  "lineAlpha": 1,
                  "title": "Disponibilidad Mecánica",
                  "valueField": "column-2"
                }],
                "categoryField": "category",
                "categoryAxis": {
                  "gridPosition": "start",
                  "labelRotation": 90,
                  "bold": true,
                  "axisAlpha": 0,
                  "tickLength": 0
                },
                "legend": {
                    "position": scope.config.legendPosition,
                    "fontSize": scope.config.fontSize + 5,
                    "labelFontWeight": "bold",
                    "enabled": true,
                    "color": "black",
                    "useGraphSettings": true
                },
                "titles": [{
                  "text": "Disp. Mecanica Y Utilización Total por Equipo",
                  "bold" : true
                },]
              });
        }
    };

    CS.symbolCatalog.register(myGaugeDefinition);

})(window.PIVisualization);
