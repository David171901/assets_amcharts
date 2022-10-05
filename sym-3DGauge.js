(function(CS) {
    var myGaugeDefinition = {
        typeName: '3DGauge',
        displayName: '3Gauge',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                //DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 800,
                Width: 600,
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                decimalPlaces: 1,
                FormatType: null,
                //color para las bandas
                bandColor1: "#ffc90e",
                bandColor2: "#00a2e8",
                bandColor3: "#ff0000",
                bulletSize: 8
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
        console.log('\t[+]3DGauge');
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;

        var symbolContainerDiv1 = elem.find('#container1')[0];
        var newUniqueIDString1 = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv1.id = newUniqueIDString1;
        var chart;
        var dataArray = [];

        function myCustomDataUpdateFunction(data) {
            const flota = data.Data[0].Path.split('\\')[6];
            const datainfo = getDataProvider(data, flota);
            
            dataArray.push(datainfo);
           
            !chart ? chart =  generateChart(dataArray, scope) : refreshChart(chart, dataArray);
            
        }

        function getDataProvider(data, flota){

            let hInoperaTotal = 0;
            let hOperativasTotales = 0;
            let hDeDemoraTotales = 0;
            let dispMecanica = 0;
            let utiTotal = 0;

            for(var index = 0; index < data.Data.length ; index++){

                data.Data[index].Values.forEach(equipment => {
                    const valueOfEquipment = equipment.Value ;
                    
                    const hOperativa = parseFloat(valueOfEquipment.split("||")[23]) && parseFloat(valueOfEquipment.split("||")[23]) > 0 ? 
                    parseFloat(valueOfEquipment.split("||")[23]) : 0;
                
                    const hInoperativa =  parseFloat(valueOfEquipment.split("||")[18]) && parseFloat(valueOfEquipment.split("||")[18]) > 0 ? 
                    parseFloat(valueOfEquipment.split("||")[18]) : 0;

                    const hDemora = 12 - (parseFloat(hOperativa) + parseFloat(hInoperativa));

                    hInoperaTotal += hInoperativa;
                    hDeDemoraTotales += hDemora;
                    hOperativasTotales += hOperativa;
                });
            };

            const sumtorHoras = hOperativasTotales + hDeDemoraTotales + hInoperaTotal;
            
            dispMecanica = (hOperativasTotales + hDeDemoraTotales) * 100 / sumtorHoras;
            utiTotal =  (hOperativasTotales*100) / (hOperativasTotales+hDeDemoraTotales);
            
            const hOpPercent = hOperativasTotales * 100 / sumtorHoras;
            const hDemoraPercent = hDeDemoraTotales * 100 / sumtorHoras ;
            const hInopPercent =  hInoperaTotal * 100 / sumtorHoras;
            
            return{
                "flota": flota,
                "hOperativa": hOperativasTotales ? hOperativasTotales.toFixed(scope.config.decimalPlaces) : hOperativasTotales,
                "hDemora": hDeDemoraTotales ? hDeDemoraTotales.toFixed(scope.config.decimalPlaces) : hDeDemoraTotales,
                "hInoperativa": hInoperaTotal ? hInoperaTotal.toFixed(scope.config.decimalPlaces) : hInoperaTotal,
                "dispMecanica": dispMecanica ? dispMecanica.toFixed(scope.config.decimalPlaces) : dispMecanica,
                "utiTotal": utiTotal ? utiTotal.toFixed(scope.config.decimalPlaces): utiTotal,
                "hOpPercent": hOpPercent ? hOpPercent.toFixed(scope.config.decimalPlaces): hOpPercent,
                "hDemoraPercent": hDemoraPercent ? hDemoraPercent.toFixed(scope.config.decimalPlaces): hDemoraPercent,
                "hInopPercent": hInopPercent ? hInopPercent.toFixed(scope.config.decimalPlaces): hInopPercent
            }
        };

        function refreshChart(chart, dataArray){

            chart.arrows[0].setValue(parseFloat(dataArray[dataArray.length-1].hOpPercent));
            chart.arrows[1].setValue(parseFloat(dataArray[dataArray.length-1].hOpPercent) + parseFloat(dataArray[dataArray.length-1].hDemoraPercent));
            
            chart.axes[0].setTopText(dataArray[dataArray.length-1].flota + "\nD.M: " + dataArray[dataArray.length-1].dispMecanica + "% " + "\tU.T: "+ dataArray[dataArray.length-1].utiTotal +"% ");

            chart.axes[0].bands[0].setEndValue(parseFloat(dataArray[dataArray.length-1].hOpPercent));
            chart.axes[0].bands[1].setStartValue(parseFloat(dataArray[dataArray.length-1].hOpPercent));
            chart.axes[0].bands[1].setEndValue(parseFloat(dataArray[dataArray.length-1].hOpPercent) + parseFloat(dataArray[dataArray.length-1].hDemoraPercent));
            chart.axes[0].bands[2].setStartValue(parseFloat(dataArray[dataArray.length-1].hOpPercent) + parseFloat(dataArray[dataArray.length-1].hDemoraPercent));
            chart.axes[0].bands[2].setEndValue(parseFloat(dataArray[dataArray.length-1].hOpPercent) + parseFloat(dataArray[dataArray.length-1].hDemoraPercent) + parseFloat(dataArray[dataArray.length-1].hInopPercent));
            
            chart.validateData();
            chart.validateNow();
            
            return chart;
          }

    
        function myCustomConfigurationChangeFunction() {
            if(chart){
                if (chart.axes[0].bands[0].color !== scope.config.bandColor1) chart.axes[0].bands[0].color = scope.config.bandColor1;
                if (chart.axes[0].bands[1].color !== scope.config.bandColor2) chart.axes[0].bands[1].color = scope.config.bandColor2;
                if (chart.axes[0].bands[2].color !== scope.config.bandColor3) chart.axes[0].bands[2].color = scope.config.bandColor3;
                
                if(chart.arrows[0].color != scope.config.bandColor1) chart.arrows[0].color = scope.config.bandColor1;
                if(chart.arrows[1].color != scope.config.bandColor2) chart.arrows[1].color = scope.config.bandColor2;
               
                chart.validateData();
                chart.validateNow();
            }
        }

        function generateChart(dataArray, scope){
            chart = AmCharts.makeChart(symbolContainerDiv1.id, {
                "theme": "light",
                "autoMargin": true,
                "autoMarginOffset": 10,
                "hideCredits": true,
                "fontSize": 11,
                "type": "gauge",
                "axes": [{
                    "topTextFontSize": 20,
                    "topTextYOffset": 85,
                    "axisColor": "#31d6ea",
                    "axisThickness": 1,
                    "endValue": 100,
                    "gridInside": true,
                    "inside": true,
                    "radius": "50%",
                    "valueInterval": 10,
                    "tickColor": "#67b7dc",
                    "startAngle": -90,
                    "endAngle": 90,
                    "unit": "%",
                    "bandOutlineAlpha": 0,
                    "bands": [ {
                      "color": scope.config.bandColor1,
                      "title": " H operativa ",
                      "balloonText": "H Operativa "+ dataArray[dataArray.length-1].hOperativa,
                      "endValue": parseFloat(dataArray[dataArray.length-1].hOpPercent),
                      "innerRadius": "105%",
                      "radius": "170%",
                      "gradientRatio": [0.5, 0, -0.5],
                      "startValue": 0
                    },{
                    
                      "color": scope.config.bandColor2,
                      "title": " H demora ",
                      "balloonText": "H Demora: "+ dataArray[dataArray.length-1].hDemora,
                      "endValue": parseFloat(dataArray[dataArray.length-1].hDemoraPercent) + parseFloat(dataArray[dataArray.length-1].hOpPercent),
                      "innerRadius": "105%",
                      "radius": "170%",
                      "gradientRatio": [0.5, 0, -0.5],
                      "startValue": 0,
                    },{
                      
                      "color": scope.config.bandColor3,
                      "title": " H inoperativa ",
                      "balloonText": "H Inopeativa: "+ dataArray[dataArray.length-1].hInoperativa ,
                      "endValue": parseFloat(dataArray[dataArray.length-1].hOpPercent) + parseFloat(dataArray[dataArray.length-1].hDemoraPercent) + parseFloat(dataArray[dataArray.length-1].hInopPercent),
                      "innerRadius": "105%",
                      "radius": "170%",
                      "gradientRatio": [0.5, 0, -0.5],
                      "startValue": 0,
                    }]
                  }],
                  "arrows": [{
                    "color": scope.config.bandColor1,
                    "alpha": 1,
                    "innerRadius": "170%",
                    "nailRadius": 0,
                    "radius": "100%"
                  },
                  {
                    "color": scope.config.bandColor2,
                    "alpha": 1,
                    "innerRadius": "170%",
                    "nailRadius": 0,
                    "radius": "100%"
                    }
                ]
               
            });

            refreshChart(chart, dataArray);
            return chart;
        }
    };

    CS.symbolCatalog.register(myGaugeDefinition);

})(window.PIVisualization);
