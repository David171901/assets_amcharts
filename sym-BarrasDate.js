(function (BS) {

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'BarrasDate',
        displayName: 'Barras Fecha',
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
                fontBarrasSize: 14,
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
                columnWidth: 0.9,
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
	    console.log('\t[+] Barra Date Loaded');        

	    this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomChangeFunction;

        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        symbolContainerDiv.id = newUniqueIDString;
        
        var dataArray = [];
        var chart = false;
        var initialTime = 'T19:00:00';
        var startDate = '';
        var isFirtLoad = 'primero';
        var loadAllValues = true;
        var totalData= [];
        var dateEdge = new Date();

        let currentStringTimeED = getStartEndTimeForLoad(dateEdge.getMonth(), dateEdge.getFullYear(), 01);                                
        timeProvider.requestNewTime(currentStringTimeED.startTimeED, currentStringTimeED.endTimeED, true);
        
        function myCustomDataUpdateFunction(data) {
            console.log('data: ',data);
            if(isFirtLoad == 'primero' && data.Data[3]){
                
                let dateInFirstLoad = new Date(data.Data[3].Values[data.Data[3].Values.length-1].Time);
                
                currentStringTimeED = getStartEndTimeForLoad(dateInFirstLoad.getMonth()+1, 
                dateInFirstLoad.getFullYear(), dateInFirstLoad.getDate());

                timeProvider.requestNewTime(currentStringTimeED.startTimeED, currentStringTimeED.endTimeED, true);
                startDate = timeProvider.displayTime.start;
                
                totalData = data;
                
                isFirtLoad = 'segundo';
            }
            
            
            if(isFirtLoad == 'segundo'){ 
                let dateYesterday = new Date();
                dateYesterday.setDate(dateYesterday.getDate()-1);
                
                currentStringTimeED = getStartEndTimeForLoad(dateYesterday.getMonth()+1, dateYesterday.getFullYear(), 
                dateYesterday.getDate());
                
                timeProvider.requestNewTime(currentStringTimeED.startTimeED, currentStringTimeED.endTimeED, true);
                
                isFirtLoad = 'tercero';
            }
                    
            if (isFirtLoad == 'tercero') {

                fillDataObject(totalData, dataArray, data);
                
                if (!chart) chart = getNewChart(dataArray);
                else refreshChart(dataArray);

                chart.validateData();
                chart.validateNow();

                let changeMonth = dateEdge.getDate() == 28 && dateEdge.getMonth()+1 == parseInt(currentStringTimeED.startTimeED.split('-')[1]) 
                && dateEdge.getHours() == 00 && dateEdge.getMinutes() == 00 ? true : false;
            
                changeMonth ? isFirtLoad == 'primero': isFirtLoad; 

            }
                       
        };

        function getStartEndTimeForLoad(month, year, day) {
            
            let startDate = new Date(year, month-1, day);
           
            if (month-1 == 1 && day == 29 && year % 4 > 0) {
                startDate = new Date(year, month - 1, 28);
            }

            let startMonth = startDate.getMonth() + 1;
            
            let startStringMonth = startMonth > 9 ? `${startMonth}` : `0${startMonth}`;
            
            return {
                startTimeED: `${startDate.getFullYear()}-${startStringMonth}-${startDate.getDate()}${initialTime}`,
                endTimeED: "*"
            };
        }

        function fillDataObject(totalData, dataArray, data){

            let iterableDate = new Date(startDate);
            iterableDate.setHours(0); iterableDate.setMinutes(0); iterableDate.setMilliseconds(0);
        
            let todayDate = new Date();
            todayDate.setHours(0); todayDate.setMinutes(0); todayDate.setMilliseconds(0);
           
            let target = totalData.Data[2].Values[totalData.Data[2].Values.length-1].Value;
            
            loadAllValues ? getDataPasDays(iterableDate, todayDate, totalData, dataArray, target) : 
            getDailyData(todayDate, data, dataArray, target) ;
            
            loadAllValues = false;
        };

        function getDataPasDays(iterableDate, todayDate, totalData, dataArray, target){
            
            let daysOfMonth = null;

            if (todayDate.getDate() >= 28){
                daysOfMonth = getDaysOfMonth(todayDate.getMonth()+2, todayDate.getFullYear());
                todayDate.setMonth(todayDate.getMonth()+1);
            }else{
                daysOfMonth = getDaysOfMonth(todayDate.getMonth()+1, todayDate.getFullYear());
            }
            
            todayDate.setDate(daysOfMonth);
            
            while(iterableDate.getTime() <= todayDate.getTime())
            {  
                getDailyData(iterableDate, totalData, dataArray, target);
                iterableDate.setDate(iterableDate.getDate()+1);
            }
        };


        function getDailyData(iterableDate, data, dataArray, target){
           
            if (iterableDate.getDate() == new Date().getDate() &&
                iterableDate.getMonth() == new Date().getMonth() && 
                loadAllValues == false ){
                let accumulated = getAccumulated(data.Data[1], iterableDate);
                
                dataArray.filter(item => item.month == new Date().getMonth()+1 
                && item.category == 'D'+ new Date().getDate())[0].columnOne = accumulated;
                
            }else{
                let accumulated = getAccumulated(data.Data[0], iterableDate);
                let newObject = getDataArray(iterableDate.getMonth()+1,iterableDate.getDate(), accumulated, target);
                dataArray.push(newObject);
            }
        };

        function getAccumulated(data, iterableDate){
            let arrayOfTms = []; 
            let tmsDaily = data.Values.filter(
                item => new Date(item.Time).getDate() == iterableDate.getDate() &&
                    new Date(item.Time).getMonth()+1 == iterableDate.getMonth()+1
            );

            console.log('tons del día', tmsDaily);
    
            tmsDaily.forEach(element => {
                isNaN(element.Value) ? null : arrayOfTms.push(element.Value);
            });
                
            return arrayOfTms.length == 0 ? 0 : Math.max.apply(null, arrayOfTms).toFixed(scope.config.decimalPlaces);
        }

        function getDaysOfMonth(numMonth, numYear) {
            let daysOfMonth = 31;
            numMonth = parseInt(numMonth);
            numYear = parseInt(numYear);
            if (numMonth == 4 || numMonth == 6 || numMonth == 9 || numMonth == 11) {
                daysOfMonth = 30;
            }
            if (numMonth == 2) {
                daysOfMonth = 28;
                if (numYear % 4 == 0) {
                    daysOfMonth = 29;
                }
            }
            return daysOfMonth;
        }

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

        
        function getDataArray(month, labelCategory, tonelaje, target) {
            return {
                    "month": month,
                    "category": 'D'+ labelCategory,
                    "columnOne": tonelaje,
                    "columnTwo": target
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
                
                "valueAxes": [
                    {
                        "id": "ValueAxis-1",
                        "titleFontSize": 32,
                        "axisAlpha": 1,
                        "fillAlpha": 0,
                        "gridAlpha": 1,
                        "stackType": "regular",
                        "color": scope.config.axesColor,
                        "gridColor": scope.config.gridColor,
                        "position": scope.config.axisPosition,
                        "ignoreAxisWidth": false,
                        "labelsEnabled": true,
                        "showLastLabel": true,
                        "fontSize": scope.config.fontSize+3,
                        "bold": true
                    }
                ],
                "categoryAxis": {
                    "titleFontSize": 40,
                    "gridPosition": "start",
                    "minPeriod": "ss",
                    "axisAlpha": 1,
                    "gridAlpha": 1,
                    "color": scope.config.axesColor,
                    "gridColor": scope.config.gridColor,
                    "boldLabels": false,
                    "autoWrap": true,
                    "labelRotation": 0,
                    "fontSize": scope.config.fontSize + 2
                },
                "graphs": [
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]"  + "</b>",
                        "id": "AmGraph-1",
                        "title": "Prod. Diaria",
                        "legendValueText": "[[value]]",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        "labelText": "[[columnOne]]",
                        "color": scope.config.textColor,
                        "fillColors": scope.config.barColor1,
                        "labelRotation": 270,
                        "bold": true,
                        "showAllValueLabels": true,
                        "valueField": "columnOne",
                        "fontSize": scope.config.fontBarsSize+2,
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
                    chart.graphs[1].fontSize = scope.config.fontSize;
                   
                    chart.categoryAxis.fontSize = scope.config.fontSize;
                }

                chart.graphs[0].fontSize = scope.config.fontBarsSize;

                chart.plotAreaFillColors = scope.config.plotAreaFillColor;
                
                chart.categoryAxis.gridColor = scope.config.gridColor;
                chart.categoryAxis.color = scope.config.axesColor;
                chart.categoryAxis.labelsEnabled = scope.config.showCategoryAxisLabels;

                chart.valueAxes[0].gridColor = scope.config.gridColor;
                chart.valueAxes[0].position = scope.config.axisPosition;
                chart.valueAxes[0].color = scope.config.axesColor;

                chart.graphs[0].columnWidth = scope.config.columnWidth;
                chart.graphs[0].color = scope.config.textColor;
            
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