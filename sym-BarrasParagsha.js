(function (BS) {

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'BarrasParagsha',
        displayName: 'Barras Paragsha',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        inject: ['timeProvider'],
        supportsCollections: true,
        visObjectType: symbolVis,

        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: BS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                FormatType: null,
                Height: 500,
                Width: 1000,
                Intervals: 500,
                minimumYValue: 0,
                maximumYValue: 100,
                fontSize: 10,
                yAxisRange: 'allSigma',
                axisPosition: "left",
                showTitle: false,
                textColor: "black",
                axesColor: "black",
                backgroundColor: "transparent",
                plotAreaFillColor: "transparent",
                useBarsInsteadOfColumns: true,
                barColor1: "#fff200",
                barColor2: "#ff0000",
                showLabels: true,
                columnWidth: 0.7,
                columnOpacity: 1,
                numberOfSigmas: '5',
                showCategoryAxisLabels: true,
                decimalPlaces: 2,
                targetValue: 0,
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
	    console.log('\t[+] Barra Paragsha loaded');        

	    this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomChangeFunction;

        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        symbolContainerDiv.id = newUniqueIDString;
        
        var dataArray = [];
        var chart = false;
        const startDate = timeProvider.displayTime.start;
        var isFirtLoad = true;
        var targetValue = scope.config.targetValue;

        function myCustomDataUpdateFunction(data) {
             
	        if (data !== null) {
                fillDataObject(data, dataArray);
                
                if (!chart) chart = getNewChart(dataArray);
                else refreshChart(dataArray);

                chart.validateData();
                chart.validateNow();
            }
        };

        function fillDataObject(data, dataArray){

            let iterableDate = new Date(startDate);
            iterableDate.setHours(0); iterableDate.setMinutes(0); iterableDate.setMilliseconds(0);
        
            let todayDate = new Date();
            todayDate.setHours(0); todayDate.setMinutes(0); todayDate.setMilliseconds(0);
           
            let target = data.Data[1].Values[data.Data[1].Values.length-1].Value;
            
            isFirtLoad ? getDataPasDays(iterableDate, todayDate,data, dataArray, target) : 
                            getDailyData(todayDate,data, dataArray, target) ;
            
            isFirtLoad = false;
        };

        function getDataPasDays(iterableDate, todayDate,data, dataArray, target){
            while(iterableDate.getTime() <= todayDate.getTime())
            {  
                getDailyData(iterableDate, data, dataArray, target);
                iterableDate.setDate(iterableDate.getDate()+1);
            }
        };


        function getDailyData(iterableDate, data, dataArray, target){
            let arrayOfTms = []; 
            
            let tmsDaily = data.Data[0].Values.filter(
                item => new Date(item.Time).getDate() == iterableDate.getDate() &&
                    new Date(item.Time).getMonth()+1 == iterableDate.getMonth()+1
            );
    
            tmsDaily.forEach(element => {
                arrayOfTms.push(element.Value);
            });
                
            let accumulated = arrayOfTms.length == 0 ? 0 : Math.max.apply(null, arrayOfTms).toFixed(scope.config.decimalPlaces);
            
            if (iterableDate.getDate() == new Date().getDate() &&
                iterableDate.getMonth() == new Date().getMonth() && 
                isFirtLoad == false ){
                // dataArray[dataArray.length-1].columnOne = accumulated;
            
            }else{
                let newObject = getDataArray(iterableDate.getDate(), accumulated, target, targetValue);
                dataArray.push(newObject);
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
            if (chart.graphs[0].lineColor !== scope.config.barColor1) chart.graphs[0].lineColor = scope.config.barColor1;
            if (chart.graphs[1].fillColors !== scope.config.barColor2) chart.graphs[1].fillColors = scope.config.barColor2;
            if (chart.graphs[1].lineColor !== scope.config.barColor2) chart.graphs[1].lineColor = scope.config.barColor2;

            chart.validateData();
            chart.validateNow();
        };

        
        function getDataArray(labelCategory, tonelaje, target, lineValue) {
            return {
                    "category": 'D'+ labelCategory,
                    "columnOne": (labelCategory == new Date().getDate()) ? target.toString() : tonelaje,
                    "columnTwo": lineValue,
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

        function getNewChart(dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "theme": "none",
                "titles": createArrayOfChartTitles(),
                "hideCredits": true,
                "addClassNames": true,
                "categoryField": "category",
                "fontSize": scope.config.fontSize,
                "startDuration": 1,
                "startEffect": "easeOutSine",
                "autoMargin": true,
                "backgroundColor": scope.config.backgroundColor,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "color": scope.config.textColor,
                "valueAxes": [
                    {
                        "id": "ValueAxis-1",
                        "titleFontSize": 32,
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
                        "fontSize": scope.config.fontSize-3,
                        "bold": true
                    }
                ],
                "categoryAxis": {
                    "titleFontSize": 40,
                    "gridPosition": "start",
                    "minPeriod": "ss",
                    "axisAlpha": 1,
                    "gridAlpha": 1,
                    "axisColor": scope.config.axesColor,
                    "gridColor": scope.config.gridColor,
                    "boldLabels": true,
                    "autoWrap": true,
                    "labelRotation":45,
                    "fontSize": scope.config.fontSize - 3
                },
                "graphs": [
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-1",
                        "title": "Real",
                        "legendValueText": "[[value]]",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        "labelText": "[[columnOne]]",
                        "fillColors": scope.config.barColor1,
                        "labelRotation": 270,
                        "labelFontWeight": "bold",
                        "showAllValueLabels": true,
                        "valueField": "columnOne",
                        "fontSize": scope.config.fontSize,
                        "minimum": 0
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-2",
                        "title": "Target",
                        "legendPeriodValueText": "[[value]]",
                        "bullet": "bubble",
                        "bulletBorderColor": "#786c56",
                        "bulletBorderAlpha": 1,
                        "bulletBorderThickness": 2,
                        "bulletSizeField": 2,
                        "fillAlphas": 0,
                        "type": "line",
                        "animationPlayed": true,
                        "lineAlpha": 0.5,
                        "fillColors": scope.config.barColor2,
                        "lineColor": scope.config.barColor2,
                        "lineThickness": 2.5,
                        "labelFontWeight": "bold",
                        "valueField": "columnTwo",
                        "fontSize": scope.config.fontSize,
                    }
                ],
                "plotAreaFillAlphas": 0.3,
                "depth3D": 20,
                "angle": 35,
                "guides": [],
                "allLabels": [],
                "balloon": {},

                "legend": {
                    "bulletType": "round",
                    "fontSize": scope.config.fontSize +5,
                    "labelFontWeight": "bold",
                    "equalWidths": false,
                    "valueText": "[[value]]",
                    "valueWidth": 120,
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
                    chart.graphs[0].fontSize = scope.config.fontSize;
                    chart.graphs[1].fontSize = scope.config.fontSize;
                   
                    chart.categoryAxis.fontSize = scope.config.fontSize;
                }

                chart.color = scope.config.textColor;
                chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                
                chart.categoryAxis.gridColor = scope.config.gridColor;
                chart.categoryAxis.axisColor = scope.config.axesColor;
                chart.categoryAxis.labelsEnabled = scope.config.showCategoryAxisLabels;

                chart.valueAxes[0].gridColor = scope.config.gridColor;
                chart.valueAxes[0].position = scope.config.axisPosition;
                chart.valueAxes[0].axisColor = scope.config.axesColor;

                chart.graphs[0].columnWidth = scope.config.columnWidth;
            
                chart.graphs[0].fillAlphas = scope.config.columnOpacity;
               
                if (chart.graphs[0].fillColors !== scope.config.barColor1) {
                    chart.graphs[0].fillColors = scope.config.barColor1;
                }
                if (chart.graphs[0].lineColor !== scope.config.barColor1) {
                    chart.graphs[0].lineColor = scope.config.barColor1;
                }

                if (chart.graphs[1].lineColor !== scope.config.barColor2){
                    chart.graphs[1].lineColor == scope.config.barColor2;
                }

                if (chart.graphs[1].fillColors !== scope.config.barColor2){
                    chart.graphs[1].fillColors == scope.config.barColor2;
                }
                
                chart.validateData();
                chart.validateNow();
            }
        }
    };

    BS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);