(function(FC) {

    function symbolVis() {}
    FC.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'flujometer',
        displayName: 'Medida de Flujos/Caudales',
        datasourceBehavior: FC.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        visObjectType: symbolVis,
        supportsCollections: true,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: FC.Extensibility.Enums.DataQueryMode.ModePlotValues,
                FormatType: null,
                Height: 350,
                Width: 1050,
                Intervals: 1000,
                minimumYValue: 0,
                maximumYValue: 100,
                yAxisRange: 'allSigma',
                showTitle: false,
                textColor: "black",
                fontSize: 13,
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                axesColor: "#000000",
                seriesColor1: "#1e8449",
                seriesColor2: "#ff0000",
                seriesColor3: "#ff0000",
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                useColumns: false,
                lineThick: 1,
                AxisThick: 2,
                showValues: true,
                decimalPlaces: 1,
                customTitle: "",
                stringLabel1: "",
                stringLabel2: "",
                stringLabel3: "",
                stringUnits: ""
            }
        },

        configOptions: function() {
            return [{
                title: "Format Symbol",
                mode: "format",
            }];
        }
    };

    symbolVis.prototype.init = function(scope, elem) {
        scope.symbol.Configuration.Intervals = 5000;
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
	    console.log('\t[+] Flujos/Caudales loaded');
        scope.config.stringLabel1 = "";
        scope.config.stringLabel2 = "";
        scope.config.stringLabel3 = "";
        scope.config.stringUnits = "";

        var chart = null;
        var listStations = elem.find('#selectStation')[0];
        const newUniqueIDStringDays = "listStations" + Math.random().toString(36).substr(2, 16);
        listStations.id = newUniqueIDStringDays;

        var loadStations = true;
        var stationsFlow = [];

        const setGraphs = (data) => {
            let arrayObject = [];
            data.Data.forEach((element , index) => {
                let graph = null;
                if (index <= 13){
                    graph =
                    {
                    "valueAxis": "v1",
                    "bullet": "round",
                    "bulletBorderThickness": 1,
                    "hideBulletsCount": 50,
                    "title": element.Label.split('|')[0],
                    "valueField": element.Label.split('|')[0],
                    "fillAlphas": 0
                    };
                }
                else {
                    graph =
                    {
                    "valueAxis": "v2",
                    "bullet": "round",
                    "bulletBorderThickness": 1,
                    "hideBulletsCount": 50,
                    "title": element.Label,
                    "valueField": element.Label,
                    "fillAlphas": 0
                    };

                }
                
                arrayObject.push(graph);
            });

            return arrayObject;
        };

        
        const getColectTime = (data) => {
            let colectTime = [];
            data.Data.forEach( element => {element.Values.forEach( item => {colectTime.push(item.Time)})});
            colectTime.sort();
            
            let result = colectTime.filter((item, index) => { return colectTime.indexOf(item) === index});
            return result;
        };

        const getLegibleTime = (date) => {
            const time = new Date(date);
            const day = time.getDate().toString();
            const hour = time.getHours().toString();
            const minutes = time.getMinutes().toString();
            const seconds = time.getSeconds().toString();
            
            return  'D'+ day + ' ' + hour + ':' + minutes + ':' + seconds; 
        }

        const getDataProvider = (date, graphs, arrayObjects, init) => {
            const time = getLegibleTime(date);
            let objOfValues = {'date':  time};
            for(index = 0; index < graphs[0].length; index++){
                
                if(graphs[0][index].title.includes(init)){
                    graphs[0][index].hidden = false;  
                }else{
                    graphs[0][index].hidden = true;
                };

                if(graphs[0][index].title.includes('PH')){
                    objOfValues [graphs[0][index].title] = !arrayObjects[index] || isNaN(arrayObjects[index]) ? null : arrayObjects[index].toFixed(1);
                }else{
                    objOfValues [graphs[0][index].title] = !arrayObjects[index] || isNaN(arrayObjects[index]) ? null : arrayObjects[index].toFixed(1) * 3.6;
                }
            };
            return objOfValues;
        };

        const getMatch = (colectTime, data, graphs, init) => {
            let dataProvider = [];
            colectTime.forEach(date => {
                let resultObject = Array(graphs[0].length);
                
                for(i = 0; i < data.Data.length; i++){
                    const reader = data.Data[i].Values.filter( valor => valor.Time == date);
                    reader.length > 0 ? resultObject[i] = reader[0].Value : null;
                };
                
                const  value = getDataProvider(date,  graphs, resultObject, init);
                
                dataProvider.push(value);
            });
            return dataProvider;
        };

        const  insertRows = (rowToPut, cellulla, classToPut) => {
            let count = 0;
            
            rowToPut.forEach( element =>{
                count == 0 ? cellulla.innerHTML += `<option id="${element}" value="${count}"  selected = selected >${element}</option>`:
                cellulla.innerHTML += `<option id="${element}" value="${count}">${element}</option>`;
                cellulla.className = classToPut;
                count++;
            });      
        };

        var graphsArray = []; 

        
        function myCustomDataUpdateFunction(data) {
            
            if(loadStations){
                data.Data.forEach(element => {
                    stationsFlow.push(element.Label.split('|')[0]);
                });
                stationsFlow =  stationsFlow.sort();
                stationsFlow = new Set(stationsFlow);
                
                let headersRow = listStations;
                insertRows(stationsFlow, headersRow, "mttoCellClass mttoHeaderCellClass");
                loadStations = false;
            }

            if (data.Data) {
                console.log('data: ', data);
                let init = (listStations.options[listStations.selectedIndex].id).toString();
                console.log('init: ', init);
                const graphsObject = setGraphs(data);
                
                
                graphsArray.push(graphsObject);
                const colectDates = getColectTime(data);
                const matchData = getMatch(colectDates, data, graphsArray, init);

                console.log(matchData[0]);
                    
                !chart ? chart = initChart(graphsArray[0], matchData) : chart.dataProvider = matchData;
                    
                chart.validateData();
                chart.validateNow();
            }
        };

        function initChart(graphsArray, dataProvider) {
            var symbolContainerDiv = elem.find('#container')[0];
            symbolContainerDiv.id = "amChart_" + scope.symbol.Name;
            var chartconfig = getChartConfig(graphsArray, dataProvider);
            return AmCharts.makeChart(symbolContainerDiv.id, chartconfig);
        };

        function getChartConfig(graphsArray, dataProvider) {
            
            return { 
                "type": "serial",
                "theme": "dark",
                "hideCredits": true,
                "tittle": createArrayOfChartTitles(),
                "legend": {
                    "fontSize" : scope.config.fontSize,
                    "horizontalGap": 10,
                    "maxColumns": 1,
                    "position": "right",
                    "useGraphSettings": true,
                    "markerSize": 10
                },
                "dataProvider": dataProvider,
                "startDuration": 0.5,
                "synchronizeGrid":true,
                "valueAxes": [{
                    "id": "v1",
                    "dashLength": 5,
                    "gridCount": 10,
                    "axisColor": "#FF6600",
                    "axisThickness": 2,
                    "axisAlpha": 1,
                    "position": "right",
                    "title": "Caudal m3/h"
                },{ "id": "v2",
                    "axisAlpha": 1,
                    "position": "left",
                    "title": "pH"
                }],
                "graphs": graphsArray,
                "categoryField": "date",
                "categoryAxis": {
                    "labelRotation": 90,
                    "labelsEnabled": true,
                    "axisColor": "#DADADA",
                    "minorGridEnabled": true,
                    "gridPosition": "start",
                    "axisAlpha": 0,
                    "fillAlpha": 0.05,
                    "fillColor": "#000000",
                    "gridAlpha": 0,
                    "position": "top"
                }
            };
             
        };

        function createArrayOfChartTitles() {
            var titlesArray;
            if (scope.config.useCustomTitle) {
                titlesArray = [{
                    "text": scope.config.customTitle,
                    "size": (scope.config.fontSize + 3)
                }];
            } else {
                titlesArray = [{
                    "text": " ",
                    "bold": true,
                    "size": (scope.config.fontSize + 4)
                }];
            }
            return titlesArray;
        }

        function myCustomConfigurationChangeFunction() {
            if (chart) {
                
                chart.validateData();
                chart.validateNow();
            }
        };
    };

    FC.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);