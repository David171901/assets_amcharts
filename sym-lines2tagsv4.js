(function (BS) {
    //'use strict';
    var myCustomSymbolDefinition = {
        typeName: 'lines2tagsv4',
        displayName: 'Lines 2 Tags v4',
        inject: ['timeProvider'],
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        visObjectType: symbolVis,
        supportsCollections: true,

        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                // DataQueryMode: BS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                FormatType: null,
                Height: 350,
                Width: 1050,
                // Intervals: 10000,
                minimumYValue: 0,
                maximumYValue: 100,
                yAxisRange: 'allSigma',
                showTitle: false,
                textColor: "black",
                fontSize: 13,
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                textColor: "#000000",
                seriesColor1: "#6bdc67",
                seriesColor2: "#00b1ff",
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                useColumns: false,
                lineThick: 1,
                showValues: true,
                customTitle: "aaa",
                label1: "aaaa",
                label2: "",
                units1: "",
                units2: "",
                searchMonth: 0,
                decimalPlaces: 1,
                // Type
                type: "mtbs",
            };
        },

        configOptions: function () {
            return [{
                title: "Format Symbol",
                mode: "format"
            }];
        }
    };

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    symbolVis.prototype.init = function (scope, elem, timeProvider) {
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;
	    
        console.log('lines2tags v2 loaded');
        var chart = initChart();
        var dataArray = [];

        var fallas = ['Averias de Instrumentos','Averias Electricas','Averias Mecanicas'];
        var paradas = ['Actividad Operacional', 'Influencia Externa','Otros','Funcionamiento','Mantenimiento Planificable','Seguridad','Stand By'];    

        function myCustomDataUpdateFunction(data) {
            console.log(" ~ file: sym-lines2tagsv4.js ~ line 72 ~ myCustomDataUpdateFunction ~ data", data)

            const arrayData = data.Data[0].Values;
            const disponibilidad = data.Data[1].Values.slice(1, data.Data[1].Values.length - 1 );

            let newData;
            switch (scope.config.type) {
                case 'mtbs':
                    newData = formatItem(filterToShutdown(arrayData),disponibilidad);
                    break;
                case 'mttr':
                    newData = formatItem(filterToFaults(arrayData),disponibilidad);
                    break;
                case 'mtbf':
                    newData = formatItem(filterToFaults(arrayData),disponibilidad);
                    break;
                default:
                    break;
            }
            
            console.log(" ~ file: sym-lines2tagsv4.js ~ line 80 ~ myCustomDataUpdateFunction ~ newData", newData)

            if (!newData || !chart) return;

            if (newData !== null && newData.Data) {
                dataArray = [];
                var hasSecondData = newData.Data[1] ? true : false;
                var firstData = newData.Data[0];
                formatDates(firstData);
                
                var searchEndTime = new Date(newData.Data[0].EndTime);
                var monthSearch = getMonthFromTime(searchEndTime);
                scope.config.searchMonth = monthSearch;

                if (scope.config.label1 == "") if (firstData.Label) scope.config.label1 = firstData.Label;
                if (scope.config.units1 == "") if (firstData.Units) scope.config.units1 = firstData.Units;

                if (hasSecondData) {
                    var secondData = newData.Data[1];
                    formatDates(secondData);

                    if (scope.config.label2 == "") if (secondData.Label) scope.config.label2 = secondData.Label;
                    if (scope.config.units2 == "") if (secondData.Units) scope.config.units2 = secondData.Units;
                }

                var startDay = hasSecondData ?
                    getMinDay(getDayFromItem(firstData.Values[0]), getDayFromItem(secondData.Values[0])) :
                    getDayFromItem(firstData.Values[0]);
                
                var endDay = hasSecondData ?
                    getMaxDay(getDayFromItem(firstData.Values[firstData.Values.length - 1]), getDayFromItem(secondData.Values[secondData.Values.length - 1])) :
                    getDayFromItem(firstData.Values[firstData.Values.length - 1]);
                endDay++;
                
                
                let startDate = new Date(timeProvider.displayTime.start);
                const endDate = new Date().addHours(19);
                
                while (startDate.getTime() <= endDate.getTime()){

                    var tiempo1, firstValue, tiempo2, secondValue;
                    tiempo1 = tiempo2 = "";
                    firstValue = secondValue = 0;

                    for (var i = 0; i <= firstData.Values.length; i++) {
                        var item = firstData.Values[i];
                        var dayItem = getDayFromItem(item);
                        if (dayItem != startDate.getDate()) continue;
                        else {
                            tiempo1 = getTime(item.Time);
                            firstValue = (scope.config.type) == 'mttr' ? getValue(item.MTTR) : getValue(item.Result);
                            break;
                        }
                    }

                    if (hasSecondData) {
                        for (var i = 0; i <= secondData.Values.length; i++) {
                            var item = secondData.Values[i];
                            var dayItem = getDayFromItem(item);
                            if (dayItem != startDate.getDate()) continue;
                            else {
                                tiempo2 = getTime(item.Time);
                                secondValue = (scope.config.type) == 'mttr' ? getValue(item.MTTR) : getValue(item.Result);
                                break;
                            }
                        }
                    }
                    
                    var newDataObject = {
                        "tiempo1": tiempo1,
                        "tiempo2": tiempo2,
                        "timestamp": startDate.getDate() + "/" + [startDate.getMonth()+1],
                        "value1": firstValue,
                        "value2": secondValue,
                    };
                    dataArray.push(newDataObject);

                    startDate.setDate(startDate.getDate()+1);
                };

                chart.dataProvider = dataArray;
                chart.validateData();
            }
        }

        Date.prototype.addHours = function(h) {
            this.setTime(this.getTime() + (h*60*60*1000));
            return this;
          }

        function formatDates(itemDataArray) {
            for (var i = 0; i < itemDataArray.Values.length; i++) {
                itemDataArray.Values[i].Time = new Date(itemDataArray.Values[i].Time);
            }
        }

        function getDayFromItem(item) {
            return !!item ? item.Time.getDate() : null;
        }

        function getMonthFromTime(timeValue) {
            return timeValue.getMonth()+1;
        }

        function getMinDay(firstDataDay, secondDataDay) {
            if (firstDataDay == null && secondDataDay == null) return 0;
            if (firstDataDay == null) return secondDataDay;
            if (secondDataDay == null) return firstDataDay;
            return firstDataDay > secondDataDay ? secondDataDay : firstDataDay;
        }

        function getMaxDay(firstDataDay, secondDataDay) {
            if (firstDataDay == null && secondDataDay == null) return 0;
            if (firstDataDay == null) return secondDataDay;
            if (secondDataDay == null) return firstDataDay;
            return firstDataDay < secondDataDay ? secondDataDay : firstDataDay;
        }

        function getTime(time) {
            return time.toLocaleString().replace(",", "");
        }

        function getValue(value) {
            return parseFloat(("" + value).replace(",", "")).toFixed(scope.config.decimalPlaces);
        }

        function initChart() {
            var symbolContainerDiv = elem.find('#container')[0];
            symbolContainerDiv.id = "amChart_" + scope.symbol.Name;
            var chartconfig = getChartConfig();
            return AmCharts.makeChart(symbolContainerDiv.id, chartconfig);
        }

        // NEW FUNCTIONS
        function filterToFaults ( data ) {
            const dataArray = data.filter(element => {
                for (let index = 0; index < fallas.length; index++) {
                    if(element.Value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(fallas[index])) return true;
                }
            });
            return dataArray
        }

        function filterToShutdown ( data ) {
            const dataArray = data.filter(element => {
                for (let index = 0; index < paradas.length; index++) {
                    if(element.Value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(paradas[index])) return true;
                }
            });
            return dataArray
        }

        function filterToTotal ( data ) {
            return data
        }

        function formatDate(year,month,day) {
            return `${ year }-${( month <= 9 ? `0${ month }` : `${ month }`)}-${( day <= 9 ? `0${ day }` : `${ day }`)}`
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

        function addDaysToDate(date, days){
            let res = new Date(date);
            res.setDate(res.getDate() + days);
            return res;
        }
        
        function formatItem (data, disponibilidad) {
            let startTime = new Date('2022-09-30T11:59:59Z')
            let endTime = new Date()
            let daysOfPreviewMonth = getDaysOfMonth(startTime.getMonth() + 1);
            let moreDays = null;
            moreDays = (daysOfPreviewMonth - startTime.getDate());
            
            let items = []
            let counter = []
            for (let index = 0; index < (endTime.getDate() + moreDays + 1) ; index++) {
                let dayStart = startTime.getDate();
                let monthStart = startTime.getMonth() + 1;
                let yearStart = startTime.getFullYear();
                let item = data.filter(element => element.Time.includes(formatDate(yearStart,monthStart,dayStart)))
                .map(element => Object({
                    Value: element.Value.length == 0 ? [] : element.Value,
                    Time: formatDate(yearStart,monthStart,dayStart),
                }));
                items.push(item);
                counter.push(item.length);
                startTime = addDaysToDate(startTime,1);
            }

            startTime = new Date('2022-09-30T11:59:59Z')
            let dataArray = []
            for (let index = 0; index < (endTime.getDate() + moreDays + 1); index++) {
                let dayStart = startTime.getDate()
                let monthStart = startTime.getMonth() + 1
                let yearStart = startTime.getFullYear()
                let item = (items.length == 0) 
                ? dataArray.push(Object({
                    Value: 0,
                    Time: formatDate(yearStart,monthStart,dayStart),
                })) 
                : dataArray.push(Object({
                    Value: (items[index].reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.Value.split('||')[2]),
                    0))/60,
                    Time: new Date(formatDate(yearStart,monthStart,dayStart)).toISOString().replace('.000',''),
                })); 

                startTime = addDaysToDate(startTime,1);
            }

            let arrayData = dataArray.map((element,index,array) => {
                return Object({
                    Values: array.slice(0, index).reduce(
                        (previousValue, currentValue) => previousValue + currentValue.Value,
                        0
                    ),
                    Counter: counter.slice(0,index).reduce(
                        (previousValue, currentValue) => previousValue + currentValue,
                        0
                    ),
                    Disponibilidad: disponibilidad.slice(0,index).reduce(
                        (previousValue, currentValue) => previousValue + currentValue.Value,
                        0
                    ),
                    ...element
                })
            })

            return Object({
                Data:[{
                    DataType: "Float",
                    DisplayDigits: -5,
                    EndTime: "2022-10-14T13:46:24.766Z",
                    Label: "MOLINO PRIMARIO|DISPONIBILIDAD GUARDIA DIA (A)",
                    Maximum: 100,
                    Minimum: 0,
                    Path: "af:\\\\YAUMS26\\BASE DE DATOS  PIAF - UM YAULI\\PLANTA CONCENTRADORA VICTORIA\\00 EQUIPOS CRITICOS\\MOLINOS\\MOLINO PRIMARIO|DISPONIBILIDAD GUARDIA DIA (A)",
                    StartTime: "2022-10-01T00:00:00Z",
                    Units: "%",
                    Values: arrayData.map(element => Object({
                        ...element,
                        Result: ((element.Disponibilidad/ element.Counter == 'Infinity') || isNaN(element.Disponibilidad/ element.Counter)) ? 0 : element.Disponibilidad/ element.Counter,
                        MTTR: ((element.Values/ element.Counter == 'Infinity') || isNaN(element.Values/ element.Counter)) ? 0 : element.Values/ element.Counter,
                    })),
                }],
                SymbolName: "Symbol0"
            })
        }

        function getChartConfig() {
            return {
                "type": "serial",
                "titles": createArrayOfChartTitles(),
                "precision": scope.config.decimalPlaces,
		        "hideCredits": true,
                "theme": "light",
                "depth3D": 15,
                "angle": 30,
                "marginRight": 10,
                "marginLeft": 10,
                "autoMarginOffset": 10,
                "addClassNames": true,
                "fontSize": scope.config.fontSize,
                "backgroundAlpha": 1,
                "backgroundColor": scope.config.backgroundColor,
                "plotAreaFillAlphas": 0.1,
                "plotAreaFillColors": scope.config.plotAreaFillColor,
                "color": scope.config.textColor,
                "showValues": scope.config.showValues,
                "pathToImages": "Scripts/app/editor/symbols/ext/images/",
                "valueAxes": [
                    {
                        "id": "Axis1",
                        "axisColor": scope.config.textColor,
                        "gridAlpha": 0,
                        "position": "left"
                    }
                ],
                "categoryAxis": {
                    "axisColor": scope.config.textColor,
                    "gridAlpha": 0,
                    "autoWrap": true,
                },
                "graphs": [
                    {
                        "id": "Line1",
                        "type": "smoothedLine",
                        "balloonText": "[[title]]" + ": <b>[[value1]] [[units1]] </b><br/>[[tiempo1]]",
                        "fontSize": scope.config.fontSize,
                        "labelPosition": "top",
                        "labelText": "[[value1]]",
                        "bullet": "round",
                        "color": scope.config.seriesColor1,
                        "lineThickness": scope.config.lineThick,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#ffffff",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 2,
                        "fillAlphas": 0,
                        "lineAlpha": 1,
                        "lineColor": scope.config.seriesColor1,
                        "title":"TMS ANIMON",
                        "valueAxis": "Axis1",
                        "valueField": "value1",
                        "showBalloon": true,
                        "dashLengthField": "dashLengthLine"
                    }
                ],
                "dataProvider": "",
                "categoryField": "timestamp",
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
                        "size": (scope.config.fontSize + 5)
                    }
                ];
            } else {
                titlesArray = [
                    {
                        "text": "VALORES DEL MES DE " + getMonthbyIndex(scope.config.searchMonth),
                        "bold": true,
                        "size": (scope.config.fontSize + 5)
                    }];
            }

            return titlesArray;
        }

        function getMonthbyIndex(numMonth) {
            var months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
            return numMonth - 1 > 0 ? months[numMonth - 1] : "";
        }


        function myCustomConfigurationChangeFunction() {
            if (chart) {
                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles();
                } else {
                    chart.titles = null;
                }

                if (chart.graphs[0]) {
                    chart.graphs[0].title = "TMS ANIMON";
                    chart.graphs[0].balloonText = scope.config.label1 + ": <b>[[value1]] " + scope.config.units1 + " </b><br/>[[tiempo1]]";
                }

                if (chart.graphs[1]) {
                    chart.graphs[1].title = "TMS ISLAY";
                    chart.graphs[1].balloonText = scope.config.label2 + ": <b>[[value2]] " + scope.config.units2 + " </b><br/>[[tiempo2]]";
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
                    chart.graphs[0].fontSize = scope.config.fontSize;
                    chart.graphs[1].fontSize = scope.config.fontSize;
                    chart.chartScrollbar.fontSize = scope.config.fontSize;
                    chart.legend.fontSize = scope.config.fontSize;
                }
                if (chart.graphs[0].lineThickness !== scope.config.lineThick) {
                    chart.graphs[0].lineThickness = scope.config.lineThick;                    
                }

                if (chart.graphs[0].lineColor !== scope.config.seriesColor1) {
                    chart.graphs[0].lineColor = scope.config.seriesColor1;
                    chart.graphs[0].color = scope.config.seriesColor1;
                }

                if (chart.graphs[1].lineColor !== scope.config.seriesColor2) {
                    chart.graphs[1].lineColor = scope.config.seriesColor2;
                    chart.graphs[1].color = scope.config.seriesColor2;
                }

                if (scope.config.showValues) {
                    chart.graphs[0].labelText = "[[value1]]";
                    chart.graphs[1].labelText = "[[value2]]";
                } else {
                    chart.graphs[0].labelText = "";
                    chart.graphs[1].labelText = "";
                }

                if (chart.chartScrollbar.enabled != scope.config.showChartScrollBar) {
                    chart.chartScrollbar.enabled = scope.config.showChartScrollBar;
                }

                chart.legend.enabled = scope.config.showLegend;
                chart.legend.position = scope.config.legendPosition;

                chart.validateData();
                chart.validateNow();
            }
        }
    };

    BS.symbolCatalog.register(myCustomSymbolDefinition);


})(window.PIVisualization);