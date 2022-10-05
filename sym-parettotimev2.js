(function (BS) {

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var definition = {

        typeName: 'parettotimev2',
        displayName: 'Parettotime v2',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        visObjectType: symbolVis,

        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                FormatType: null,
                Height: 500,
                Width: 500,
                fontSize: 22,
                textColor1: "black",
                textColor2: "#000000",
                backgroundColor: "transparent",
                outlineColor: "white",
                useCustomTitle: false,
                customTitle: "",
                showLegend: false,
                colorfill2: "#FC0000",
                fontSizeInside: 12,
                labels: [],
                units: [],
                decimalPlaces: 0,
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
        console.log('\t[+]ParettoTime');
        scope.config.FormatType = null;
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        var symbolContainerDiv = elem.find('#container')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        symbolContainerDiv.id = newUniqueIDString;

        var chart;
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {
            console.log("ParettoChartsTime v2",data);
            let dataFormat = data.Data[0].Values
            // console.log(" ~ file: fecha.html ~ line 174 ~ dataFormat", dataFormat)
    
            let arrayFormat = countTypesFailures(dataFormat)
            // console.log(" ~ file: fecha.html ~ line 180 ~ arrayFormat", arrayFormat)
    
            data = {
                "Rows": arrayFormat
            }
            if (data) {
                dataArray = [];

                let items = data.Rows.sort((a,b)=> parseInt(b.Value)-parseInt(a.Value));
                let sum = items.reduce(
                    (previousValue, currentValue) => previousValue + parseInt(currentValue.Value),
                    0
                );
                let accumulated_average = 0
                let colors = ["#3AB8A8","#34A496","#2F9084","#297C72", "#236960","#1D554F", "#17423D", "#102F2B",  "#0A1C1A", "#030908"]
                for (var i = 0; i < items.length; i++) {
                    if(!i==0) accumulated_average += (parseInt(items[i-1].Value)/sum)*100
                    let item = items[i];

                    let itemHasLabel = !!item.Label;
                    
                    if (itemHasLabel) scope.config.labels.push(item.Label.split('|')[0]);
                    let itemTime = new Date(item.Time).toLocaleTimeString();
                    let itemValue = (parseFloat(("" + (item.Value)).replace(",", "")))
                    let percent = parseFloat((accumulated_average+parseFloat(((item.Value/sum)*100).toFixed(scope.config.decimalPlaces))).toFixed(scope.config.decimalPlaces));

                    let newDataObject = {
                        "Label": item.Label,
                        "Time": itemTime,
                        "Value": itemValue,
                        "percent": percent,
                        "color" : colors[i],
                        "Format": formatTime(itemValue),
                    };
                    dataArray.push(newDataObject);
                }

                if (!chart) chart = getNewChart(dataArray);
                else refreshChart(chart, dataArray)
            }
        }

        function countTypesFailures (data) {
            let array = data.map(el => el.Value.split('||')[0])
            let arrayNumber = data.map(el => el.Value.split('||')[2])
            let arrayLabel = [...new Set(data.map(el => el.Value.split('||')[0])) ]
            let dataArray = []
            arrayLabel.forEach(element => {
                let count = 0
                for (let index = 0; index < array.length; index++) {
                    (element == array[index]) ? count = count + parseInt(arrayNumber[index]) : count = count + 0
                }
                dataArray.push({
                    "Label": element,
                    "Value": count,
                    "DataType": "Float",
                    "Time": new Date().toLocaleString()
                })
            });
            
            return dataArray
        }

        function formatTime(time){
            var day = Math.floor (time / (24*60)); 
            var hour = Math.floor( (time - day*24*60)/60); 
            var minute = Math.floor( (time - day*24*60 - hour*60)); 
            return `${day == 0 ? '': `${day}d `}${hour}:${minute}`
        }

        function getNewChart(dataArray) {
            return AmCharts.makeChart(symbolContainerDiv.id, {
                "type": "serial",
                "titles": createArrayOfChartTitles(),
                "hideCredits": true,
                "colors": ["#3AB8A8",scope.config.colorfill2],
                "dataProvider": dataArray,
                "valueAxes": [{
                    "id": "v1",
                    "title": "Tiempo (dias horas:min )",
                    "axisAlpha": 0,
                    "position": "left",
                    "step": 2,
                    "labelsEnabled": false,
                },{
                    "id": "v2",
                    "axisAlpha": 0,
                    "position": "right",
                    "unit": "%",
                    "gridAlpha": 0,
                    "maximum": 100,
                    "minimum": 0,
                }],
                "startDuration": 1,
                "graphs": [{
                    "fillAlphas": 1,
                    "fillColorsField": "color",
                    "title": "Value",
                    "type": "column",
                    "valueField": "Value",
                    "labelText": "[[Format]]",
                    "fontSize": scope.config.fontSize,
                    "balloonText": "[[Label]]:[[Format]]",
                    "color": scope.config.textColor1,
                }, {
                    "valueAxis": "v2",
                    "bullet": "round",
                    "lineThickness": 3,
                    "bulletSize": 7,
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#FFFFFF",
                    "useLineColorForBulletBorder": true,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Percent",
                    "valueField": "percent",
                    "labelText": "[[percent]]%",
                    "fontSize": scope.config.fontSize,
                    "balloonText": "[[Label]]:[[percent]]%",
                    "precision": scope.config.decimalPlaces,
                    "labelPosition": "bottom",
                    "color": scope.config.textColor2,
                }],
                "categoryField": "Label",
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisAlpha":0,
                    "tickLength":0
                },
                "legend": {
                    "enabled": scope.config.showLegend,
                    "align": "center",
                    "position": "bottom",
                    "color": scope.config.textColor1,
                    "fontSize": scope.config.fontSize,
                    "labelHeight": 150,
                }
            });
        }


        function refreshChart(chart, dataArray) {
            chart.titles = createArrayOfChartTitles();
            chart.dataProvider = dataArray;
            chart.validateData();
            chart.validateNow();
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
            }
            return titlesArray;
        }

        function myCustomConfigurationChangeFunction(data) {
            if (chart) {
                if (chart.fontSize !== scope.config.fontSize) {
                    chart.titles = createArrayOfChartTitles();
                    chart.fontSize = scope.config.fontSize;
                    chart.graphs[0].fontSize = scope.config.fontSize;
                    chart.graphs[1].fontSize = scope.config.fontSize;
                    chart.legend.fontSize = scope.config.fontSize;
                }

                if (chart.graphs[1].precision != scope.config.decimalPlaces) {
                    chart.graphs[1].precision = scope.config.decimalPlaces;
                }

                if (chart.graphs[0].color !== scope.config.textColor1) {
                    chart.graphs[0].color = scope.config.textColor1;
                    chart.legend.color = scope.config.textColor1;
                }

                if (chart.graphs[1].color !== scope.config.textColor2) {
                    chart.graphs[1].color = scope.config.textColor2;
                }

                if (chart.colors[1] != scope.config.colorfill2) {
                    chart.colors[1] = scope.config.colorfill2;
                }

                if (chart.backgroundColor !== scope.config.backgroundColor) chart.backgroundColor = scope.config.backgroundColor;

                if (scope.config.useCustomTitle) chart.titles = createArrayOfChartTitles();
                else chart.titles = null;
                
                chart.legend.enabled = scope.config.showLegend;

                chart.validateData();
                chart.validateNow();
            }
        }
    }

    BS.symbolCatalog.register(definition);

})(window.PIVisualization);