(function(CS) {
    var myGaugeDefinition = {
        typeName: 'gaugev3',
        displayName: 'Nuevos KPIs',
        inject: ['timeProvider'],
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/gaugeCOMM.png',
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
                showTitle: true,
                fontSize: 20,
                customTitle: "",
                //color para las bandas
                bandColor1: "#ea3838",
                bandColor2: "#ffac29",
                bandColor3: "#00CC00",
                bulletSize: 8,
                // Axis
                startAxis: 0,
                limitAxis1: 30, 
                limitAxis2: 60,
                endAxis: 100,
                // Others
                bottomTextYOffset: -175,
                labelOffset: 90,
                unit: '',
                valueInterval: 10,
                // Type
                type: 'utilizacion',
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
    symbolVis.prototype.init = function(scope, elem, timeProvider) {
        console.log('\t[+]GaugeGeneric v3');
        // INIT ATRIBUTES
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;
  
        // DOM
        var symbolContainerDiv1 = elem.find('#container1')[0];
        var newUniqueIDString1 = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv1.id = newUniqueIDString1;
        var chart;
        var dataArray = [];
  
        function myCustomDataUpdateFunction(data) {
            const datainfo = getDataProvider(data);
            dataArray.push(datainfo);
            !chart ? chart =  generateChart(dataArray, scope) : refreshChart(chart, dataArray);
        }
  
        function getDataProvider(data){
            console.log(" ~ file: sym-gaugev3.js ~ line 73 ~ getDataProvider ~ data", data)
            // Events - Lista de eventos
            let eventArray = data.Data[0].Values || [];
            // Operating Time (OT) - Disponibilidad por dias
            let availabilityPerDayArray = data.Data[1].Values || [];
            availabilityPerDayArray = eliminarValoresEnListaRepetidas(availabilityPerDayArray);

            // PROCESSED VARIABLES
            // Time Models Vars
            let { IE, IM, IO, IP, MP, RE, RG, RM, RnP, RP, TF, TnP } = timeModels ( eventArray );
            // Operating Time (OT)
            let availabilityPerDay = availabilityPerDayArray.reduce(
                (previousValue, currentValue) => previousValue + (currentValue.Value || 0),
                0
            )*60;
            // Scheduled Time (ST) - Tiempo calendario (TC)
            let TC = getCalendarTime (); 
            // Tiempo de retraso externo
            let TRE = (IE + IM + IO + IP);
            // Tiempo de mantenimiento
            let TM = (RE + RM + MP);
            switch (scope.config.type) {
                case 'utilizacion':
                    result = availabilityPerDay / (TC - TnP);
                    break;
  
                case 'disponibilidad_fisica':
                    result = ((TC - TnP - TRE - TM) * 100) / (TC - TnP - TRE);
                    
                    break;
                case 'disponibilidad_mecanica':
                    result = (TC - TM) * 100 / (TC);
                    break;
            
                default:
                    result = 0;
                    break;
            }
  
            return result;
        };

        function generarFechasIntermedias(fechaInicio, fechaFin) {
            const fechas = [];
            
            // Convertir las fechas a objetos Date
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            
            // Iterar sobre el rango de fechas y agregar cada fecha al array
            let fechaActual = new Date(fechaInicioObj);
            while (fechaActual <= fechaFinObj) {
                fechas.push(new Date(fechaActual));
                fechaActual.setDate(fechaActual.getDate() + 1);
            }
            
            // Convertir las fechas en formato ISO 8601
            const fechasISO = fechas.map((fecha) => fecha.toISOString().split('T')[0]);
            return fechasISO;
        }

        function eliminarValoresEnListaRepetidas (value) {
            console.log(" ~ file: sym-gaugev3.js:136 ~ eliminarValoresEnListaRepetidas ~ value:", value)
            let startDate = timeProvider.displayTime.start;
            let endDate = timeProvider.displayTime.end != "*"
              ? new Date(timeProvider.displayTime.end)
              : new Date();
            const fechasIntermedias = generarFechasIntermedias(startDate, endDate);
            let arrayValues = [];
            fechasIntermedias.forEach(el => {
                arrayValues.push({
                    Value: Math.max(...value.filter(elem => elem.Time.includes(el)).map(elem => elem.Value)),
                    Time: `${el}T19:00:00Z`
                })
            })
            return arrayValues;
        }
  
        function timeModels ( data ) {
            return {
                IE: filterToModelTime('IE',data),
                IM: filterToModelTime('IM',data),
                IO: filterToModelTime('IO',data),
                IP: filterToModelTime('IP',data),
                MP: filterToModelTime('MP',data),
                RE: filterToModelTime('RE',data),
                RG: filterToModelTime('RG',data),
                RM: filterToModelTime('RM',data),
                RnP: filterToModelTime('RnP',data),
                RP: filterToModelTime('RP',data),
                TF: filterToModelTime('TF',data),
                TnP: filterToModelTime('TnP',data),
            }
        }
        
        function filterToModelTime ( key, array ) {
            return array.filter((element, index) => element.Value.includes(key)).reduce(
                (previousValue, currentValue) => previousValue + (parseInt(currentValue.Value.split('||').at(-1)) || 0),
                0
            );
        }
  
        function getCalendarTime () {
            let startDay = new Date(timeProvider.displayTime.start);   
            let endDay = timeProvider.displayTime.end != "*" ? new Date(timeProvider.displayTime.end) : new Date();
            let firtsDay = addDay(startDay, 1).getDate();
            let numberOfDays = endDay.getDate();
            let numberOfHours = endDay.getHours();
            return ((numberOfDays - (31 - firtsDay) + 1 ) * 24 + numberOfHours)*60;
        }
  
        function refreshChart(chart, dataArray){
            chart.arrows[0].setValue(parseFloat((dataArray.at(-1) || 0.0).toFixed(2)));
            chart.axes[0].bottomText = dataArray.at(-1).toFixed(2) + '' + scope.config.unit;
            chart.validateData();
            chart.validateNow();
            return chart;
        }
  
        function addDay(fecha, dias){
            fecha.setDate(fecha.getDate() + dias);
            return fecha;
        }
  
        function createArrayOfChartTitles() {
            var titlesArray = null;
            if (scope.config.useCustomTitle) {
                titlesArray = [{
                    "text": scope.config.customTitle,
                    "size": scope.config.fontSize + 10,
                }];
            }
            return titlesArray;
        }
    
        function myCustomConfigurationChangeFunction() {
            if(chart){
                // set colors
                if (chart.axes[0].bands[0].color !== scope.config.bandColor1) chart.axes[0].bands[0].color = scope.config.bandColor1;
                if (chart.axes[0].bands[1].color !== scope.config.bandColor2) chart.axes[0].bands[1].color = scope.config.bandColor2;
                if (chart.axes[0].bands[2].color !== scope.config.bandColor3) chart.axes[0].bands[2].color = scope.config.bandColor3;
                // set title
                if (scope.config.showTitle) {
                    chart.titles = createArrayOfChartTitles();
                }
                if (scope.config.fontSize) {
                    chart.titles = createArrayOfChartTitles();
                    chart.axes[0].fontSize =  scope.config.fontSize;
                    chart.axes[0].bottomTextFontSize =  scope.config.fontSize + 10;
                }
  
                if(chart.axes[0].bottomTextYOffset != scope.config.bottomTextYOffset) chart.axes[0].bottomTextYOffset = scope.config.bottomTextYOffset;
                if(chart.axes[0].labelOffset != scope.config.labelOffset) chart.axes[0].labelOffset = scope.config.labelOffset;
  
                if(chart.axes[0].startValue != scope.config.startAxis) chart.axes[0].startValue = scope.config.startAxis;
                if(chart.axes[0].endValue != scope.config.endAxis) chart.axes[0].endValue = scope.config.endAxis;
  
                if(chart.axes[0].bands[0].startValue != scope.config.startAxis) chart.axes[0].bands[0].startValue = scope.config.startAxis;
                if(chart.axes[0].bands[1].startValue != scope.config.limitAxis1) chart.axes[0].bands[1].startValue = scope.config.limitAxis1;
                if(chart.axes[0].bands[2].startValue != scope.config.limitAxis2) chart.axes[0].bands[2].startValue = scope.config.limitAxis2;
  
                if(chart.axes[0].bands[0].endValue != scope.config.limitAxis1) chart.axes[0].bands[0].endValue = scope.config.limitAxis1;
                if(chart.axes[0].bands[1].endValue != scope.config.limitAxis2) chart.axes[0].bands[1].endValue = scope.config.limitAxis2;
                if(chart.axes[0].bands[2].endValue != scope.config.endAxis) chart.axes[0].bands[2].endValue = scope.config.endAxis;
  
                if (scope.config.valueInterval) {
                    chart.axes[0].valueInterval =  scope.config.valueInterval;
                }
  
                chart.validateData();
                chart.validateNow();
            }
        }
  
  
        function generateChart(dataArray, scope){
            chart = AmCharts.makeChart(symbolContainerDiv1.id,{
                "type": "gauge",
                "theme": "light",
                "hideCredits": true,
                "arrows": [
                    {
                        "value": dataArray.at(-1).toFixed(2),
                        "alpha": 0.7,
                        "borderAlpha": 0.7,
                    }
                ],
                "titles": [
                    {
                        "text": scope.config.customTitle,
                        "size": scope.config.fontSize + 10,
                    }
                ],
                "axes": [
                    {
                        // General
                        "radius": "105%",
                        "fontSize": scope.config.fontSize,
                        "valueInterval": scope.config.valueInterval,
                        "startValue": scope.config.startAxis,
                        "endValue": scope.config.endAxis,
                        "axisColor": "#000000",
                        "tickColor": "#000000",
                        "startAngle": -90,
                        "endAngle": 90,
                        // Botton Text
                        "bottomText": dataArray.at(-1).toFixed(2) + '' + scope.config.unit,
                        "bottomTextFontSize": scope.config.fontSize + 10,
                        "bottomTextBold": false,
                        "bottomTextYOffset": scope.config.bottomTextYOffset,
                        // Axes
                        "labelOffset":scope.config.labelOffset,
                        "bands": [
                            {
                                "color": scope.config.bandColor1,
                                "endValue": scope.config.limitAxis1,
                                "startValue": scope.config.startAxis,
                                "radius": "100%",
                                "innerRadius": "70%"
                            },
                            {
                                "color": scope.config.bandColor2,
                                "endValue": scope.config.limitAxis2,
                                "startValue": scope.config.limitAxis1,
                                "radius": "100%",
                                "innerRadius": "70%"
                            },
                            {
                                "color": scope.config.bandColor3,
                                "endValue":scope.config.endAxis,
                                "startValue": scope.config.limitAxis2,
                                "radius": "100%",
                                "innerRadius": "70%"
                            }
                        ]
                    }
                ],
            });
            refreshChart(chart, dataArray);
            return chart;
        }
  
    };
  
    CS.symbolCatalog.register(myGaugeDefinition);
  
  })(window.PIVisualization);