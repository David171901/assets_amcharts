(function(CS) {
    var myGaugeDefinition = {
        typeName: 'barPercent',
        displayName: 'DM y UT',
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

        var symbolContainerDiv3 = elem.find('#container3')[0];
        var newUniqueIDString3 = "amChart_BarPercent" + scope.symbol.Name+ Math.random().toString(36).substr(2, 16);
        symbolContainerDiv3.id = newUniqueIDString3;
        
        var chartBarPercent;

        
        function myCustomDataUpdateFunction(data) {
            
            if (data !== null) {
                
                
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

            let providerBarPercent = [];
            
            for(var index = 0; index < data.Data.length ; index++){
                let valueOfEquipmentData = data.Data[index] ;
                for(equip = 0; equip < valueOfEquipmentData.Values.length; equip++){
                    let valueOfEquipment = valueOfEquipmentData.Values[equip].Value;
 
                    if(valueOfEquipment){
                        let labelCategory = valueOfEquipment.split("||")[7] != undefined ? (valueOfEquipment.split("||")[7] + "__").toString() : (data.Data[index].Label.split("|")[0] + "__").toString() ;
                       
                        let dMecanica = getValue(valueOfEquipment.split("||")[25]);
                        let utilizacion = getValue(valueOfEquipment.split("||")[26]);
    
                        var dataArrayBarPercentOject = getDataBarPercentArray(labelCategory, utilizacion ,dMecanica);
                        providerBarPercent.push(dataArrayBarPercentOject);
                         
                    }
                }
            }
            
            return providerBarPercent; 
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

        function getDataBarPercentArray(labelCategory, value1, value2) {
            return {
                    "category": labelCategory,
                    "column-1": value1,
                    "column-2": value2
                }
        };

    
        function myCustomConfigurationChangeFunction() {
            
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
