(function(CS) {
    var myGaugeDefinition = {
        typeName: 'graffMantoSearch',
        displayName: 'Mantenimiento Con Busqueda',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        inject: ["timeProvider"],
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
                bulletSize: 20,
                minimumYValue: 0,
                maximumYValue: 100,
                fontSize: 24,
                legendPosition: "bottom",
                yAxisRange: "allSigma",
                axisPosition: "left",
                showTitle: false,
                showGaugeTitle: false,
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
                maximumHorizontal: 24
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
        console.log('\t[+]Mantenimiento con busqueda');
        
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;
        scope.unit = {mine: '', turn:''};

        var listDaysContainer = elem.find('#listDays')[0];
        var newUniqueIDStringDays = "listOfDays" + Math.random().toString(36).substr(2, 16);
        listDaysContainer.id = newUniqueIDStringDays;

        var symbolContainerDiv1 = elem.find('#container1')[0];
        var newUniqueIDString1 = "amChart_Gauge" + Math.random().toString(36).substr(2, 16);
        symbolContainerDiv1.id = newUniqueIDString1;
        
        var symbolContainerDiv2 = elem.find('#container2')[0];
        var newUniqueIDString2 = "amChart_BarHori" + scope.symbol.Name+ Math.random().toString(36).substr(2, 16);
        symbolContainerDiv2.id = newUniqueIDString2;

        var symbolContainerDiv3 = elem.find('#container3')[0];
        var newUniqueIDString3 = "amChart_BarPercent" + scope.symbol.Name+ Math.random().toString(36).substr(2, 16);
        symbolContainerDiv3.id = newUniqueIDString3;

        var monthBtn = elem.find('#monthBtn')[0];  
        var yearBtn = elem.find('#yearBtn')[0];

        const linkFirstPart = './#/Displays/504';
        const linkSecondPart='/Rep-';

        var chartGauge;
        var chartBarHorizontal;
        var chartBarPercent;
        var isFirstLoad = true;

        var currentDate = new Date();
        var monthTime = null;

        if ((currentDate.getMonth()+1) < 10) monthTime = "0" + (currentDate.getMonth() + 1);
        else monthTime = (currentDate.getMonth()+1);
            scope.timeED = {
            month: "",
            year: ""
        }
        setInitSeacrhFilter();

        $('#' + listDaysContainer.id).empty();
                
        var daysOccurs = timeProvider.displayTime.end != '*'? new Date(timeProvider.displayTime.end).getDate() : new Date().getDate();
        var totalDays = [];
                
        for(i=1; i<=daysOccurs;i++){
            totalDays.push(('D'+i).toString());
        }
           
        let headersRow = listDaysContainer.insertRow(-1);
        insertRows(totalDays,headersRow, "mttoCellClass mttoHeaderCellClass");
        
        scope.config.maximumHorizontal = daysOccurs*24;
        
        var daysToFilter = false;

        const getTimeToRequest = (backDay) => {
            const backDate = new Date(new Date().setDate(new Date().getDate() - backDay));
            const year = backDate.getFullYear();
            const month = backDate.getMonth()+1;
            const day = backDate.getDate();
            const initialHour = 'T19:00:00';
            const stringTimeED = {
                start: year +'-'+month+'-'+day+initialHour,
                end: '*'
            };
            return stringTimeED;
        };

        const unCheckedListDays = (totalDays) => {
            totalDays.forEach( day => { elem.find('#'+ day)[0].checked = false});
        };
        
        function myCustomDataUpdateFunction(data) {
            
            const flota = data.Data[0].Path.split('\\')[6];
            
            console.log('data manto:: ',data);
            
            if (isFirstLoad && data !== null) {
                
                var dataArrayGauge = [];
                var dataArrayBarHorizontal = [];
                var dataArrayBarPercent = [];
                
                const uMine = scope.unit.mine ? scope.unit.mine : null;
                const uTurn = scope.unit.turn ? scope.unit.turn : null;

                let infoCatched = getDataProvider(data, uMine, uTurn, daysToFilter, flota);

                dataArrayGauge.push(infoCatched[0]);

                console.log('arrayGauge: ', dataArrayGauge);
              
                infoCatched[1].forEach(infoToBarHorizontal =>{
                    dataArrayBarHorizontal.push(infoToBarHorizontal);
                });
                
                infoCatched[2].forEach(infoToBarPercent => {
                    dataArrayBarPercent.push(infoToBarPercent);
                });
                
                console.log('horizontal: ',dataArrayBarHorizontal);
                console.log('barPercent: ', dataArrayBarPercent);
                setLinks(dataArrayGauge[0].flota);

                !chartGauge? chartGauge = generateGaugeChart(dataArrayGauge, scope) : refreshChartGauge(chartGauge, dataArrayGauge);
                !chartBarHorizontal? chartBarHorizontal = generateBarHorizontal(dataArrayBarHorizontal): refreshChartBarHorizontal(dataArrayBarHorizontal);
                !chartBarPercent? chartBarPercent = generateBarWithPercent(dataArrayBarPercent) : refreshChartBarPercent(dataArrayBarPercent);
                isFirstLoad = false;

                scope.search = function () {
                    var stringTimeED = {
                        start: "",
                        end: ""
                    };
                    var numericValueOfMonth = parseInt(scope.timeED.month);
                    stringTimeED = getStartEndTime(numericValueOfMonth, scope.timeED.year);
                    timeProvider.requestNewTime(stringTimeED.startTimeED, stringTimeED.endTimeED, true);
                    scope.timeED.year = "";
                };

                scope.searchDaySelected = function(){
                    daysToFilter = [];
                    totalDays.forEach(day => {elem.find('#'+ day)[0].checked ? daysToFilter.push(day.split('D')[1]): null});
                    isFirstLoad = true;
                    setInitSeacrhFilter();
                    scope.config.maximumHorizontal = daysToFilter.length*24;
                };

                scope.searchDay = function() {
                    unCheckedListDays(totalDays);
                    isFirstLoad = true;
                    const stringDate = getTimeToRequest(1);
                    timeProvider.requestNewTime(stringDate.start, stringDate.end, true);
                    scope.config.maximumHorizontal = 24;
                };

                scope.searchWeek = function(){
                    unCheckedListDays(totalDays);
                    isFirstLoad = true;
                    const stringDate = getTimeToRequest(7);
                    timeProvider.requestNewTime(stringDate.start, stringDate.end, true);
                    scope.config.maximumHorizontal = 168;
                };
            }
        };


        function setLinks(flota){
            
            switch (flota) {
                case "DUMPER":
                    monthBtn.href = linkFirstPart+19+linkSecondPart+'Mensual---DUMPER';
                    yearBtn.href = linkFirstPart+20+linkSecondPart+'Anual---DUMPER';
                    break;
                case "SCALER":
                    monthBtn.href = linkFirstPart+18+linkSecondPart+'Mensual---SCALER';
                    yearBtn.href = linkFirstPart+21+linkSecondPart+'Anual---SCALER';
                    break;
                case "JUMBO":
                    monthBtn.href = linkFirstPart+13+linkSecondPart+'Mensual---JUMBO';
                    yearBtn.href = linkFirstPart+23+linkSecondPart+'Anual---JUMBO';
                    break;
                case "SCOOP":
                    monthBtn.href = linkFirstPart+17+linkSecondPart+'Mensual---SCOOP';
                    yearBtn.href = linkFirstPart+26+linkSecondPart+'Anual---SCOOP';
                    break;
                case "UTILITARIO":
                    monthBtn.href = linkFirstPart+16+linkSecondPart+'Mensual---UTILITARIO';
                    yearBtn.href = linkFirstPart+25+linkSecondPart+'Anual---UTILITARIO';
                    break;
                case "EMPERNADOR":
                    monthBtn.href = linkFirstPart+15+linkSecondPart+'Mensual---EMPERNADOR';
                    yearBtn.href = linkFirstPart+22+linkSecondPart+'Anual---EMPERNADOR';
                    break;
                case "SIMBA":
                    monthBtn.href = linkFirstPart+14+linkSecondPart+'Mensual---SIMBA';
                    yearBtn.href = linkFirstPart+24+linkSecondPart+'Anual---SIMBA';
                    break;
            }
        };

        function setInitSeacrhFilter() {
            var currentMonth = currentDate.getMonth() + 1;
            var currentYear = currentDate.getFullYear();
            var currentStringTimeED = getStartEndTime(currentMonth, currentYear);
            timeProvider.requestNewTime(currentStringTimeED.startTimeED, currentStringTimeED.endTimeED, true);
            scope.timeED.month = currentMonth.toString();
            scope.timeED.year = currentYear.toString();
        };

        function getStartEndTime(month, year) {
            
            var stringTimeED = {
                startTimeED: null,
                endTimeED: null
            };

            var start = "";
            var end = "";

            if (year < 2018 || year > 2050 || isNaN(year)) {year = 2020;}

            switch (month) {
                case 1:
                    start = "01";
                    end = "01-31"
                    break;
                case 2:
                    start = "02";
                    end = "02-28"
                    break;
                case 3:
                    start = "03";
                    end = "03-31"
                    break;
                case 4:
                    start = "04";
                    end = "04-30"
                    break;
                case 5:
                    start = "05";
                    end = "05-31"
                    break;
                case 6:
                    start = "06";
                    end = "06-30"
                    break;
                case 7:
                    start = "07";
                    end = "07-31"
                    break;
                case 8:
                    start = "08";
                    end = "08-31"
                    break;
                case 9:
                    start = "09";
                    end = "09-30"
                    break;
                case 10:
                    start = "10";
                    end = "10-31"
                    break;
                case 11:
                    start = "11";
                    end = "11-30"
                    break;
                case 12:
                    start = "12";
                    end = "12-31"
                    break;
                default:
                    start = "";
                    end = ""
            }

            stringTimeED.startTimeED = year + "-" + start + "-01T00:00:00";
            if (start == 12) year = parseInt(year);
            if (monthTime.toString() == start) stringTimeED.endTimeED = "*";
            else stringTimeED.endTimeED = year + "-" + end + "T23:59:00";
            return stringTimeED;
        }

        function insertRows(rowToPut, cellulla, classToPut ){
            cellulla = listDaysContainer.insertRow(-1);
            rowToPut.forEach( element =>{
                let rowCellulla = cellulla.insertCell(-1);
                rowCellulla.innerHTML = `<input id="${element}"type="checkbox">${element}</b>`;
                rowCellulla.className = classToPut;
            });        
        };

        function getDataProvider(data, uMine, uTurn, daysToFilter, flota){
            let dataDepure = depuredData(data, uMine, uTurn, daysToFilter); 
            let equipmentGroup = [];
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
            let sumtorHoras = 0;
            
            if(dataDepure.length > 0 ){
                
                for(var index = 0; index < dataDepure.length ; index++){
                    
                    let valueOfEquipment = dataDepure[index].Value ;
                
                    if(valueOfEquipment != null && valueOfEquipment != '#N/D'){
                        const labelCategory = valueOfEquipment.split("||")[7] != undefined ? (valueOfEquipment.split("||")[7]).toString() : (data.Data[index].Label.split("|")[0]).toString() ;
                        const hOperativa = getValue(valueOfEquipment.split("||")[23]) ;
                        const hInoperativa =  getValue(valueOfEquipment.split("||")[18]);
                        const hDemora = 12 - (parseFloat(hOperativa) + parseFloat(hInoperativa)); 
                        //getValue(valueOfEquipment.split("||")[24]);
                        const dMecanica = getValue(valueOfEquipment.split("||")[25]);
                        const utilizacion = getValue(valueOfEquipment.split("||")[26]);
                        
                        equipmentGroup.push(labelCategory);
                        
                        hInoperaTotal += parseFloat(hInoperativa);
                        hDeDemoraTotales += parseFloat(hDemora);
                        hOperativasTotales += parseFloat(hOperativa);

                        var dataArrayBarHoriObject = getDataBarHorArray(labelCategory, hOperativa, hDemora, hInoperativa);
                        providerBarH.push(dataArrayBarHoriObject);

                        var dataArrayBarPercentOject = getDataBarPercentArray(labelCategory, utilizacion ,dMecanica);
                        providerBarPercent.push(dataArrayBarPercentOject);
                    }  
                }

                let objectEquipment = {};
                let arrayOfEquipments = [];
                equipmentGroup.forEach(equip => !(equip in objectEquipment) && (objectEquipment[equip] = true) && arrayOfEquipments.push(equip));
                
                providerBarH = getTotalHours(providerBarH, arrayOfEquipments);
                providerBarPercent = getPercent(providerBarPercent, arrayOfEquipments);

            };

            sumtorHoras = hOperativasTotales + hDeDemoraTotales + hInoperaTotal;
            
            dispMecanica = sumtorHoras != 0 ? (hOperativasTotales + hDeDemoraTotales) * 100 / sumtorHoras : 0;
            utiTotal = hOperativasTotales + hDeDemoraTotales != 0 ?  (hOperativasTotales * 100) / (hOperativasTotales+hDeDemoraTotales) : 0;
                            
            hOpPercent = sumtorHoras != 0 ? hOperativasTotales * 100 / sumtorHoras : 0 ;
            hDemoraPercent = sumtorHoras !=0 ? hDeDemoraTotales * 100 / sumtorHoras : 0 ;
            hInopPercent =  sumtorHoras !=0 ? hInoperaTotal * 100 / sumtorHoras : 0; 
                     
            providerGauge = {
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

            return [providerGauge, providerBarH, providerBarPercent];
        };

        function getPercent(providerBarPercent,arrayOfEquipments){
            let arrayTotalPercent = [];
            arrayOfEquipments.forEach( equipFilter =>{
                let equip = providerBarPercent.filter(item => item.category == equipFilter);
                let totalUtil = 0;
                let totalDisMec = 0;
                equip.forEach(value => {
                    totalUtil += parseFloat(value.util);
                    totalDisMec += parseFloat(value.dispMeca);
                });
                totalUtil = (totalUtil / equip.length).toFixed(scope.config.decimalPlaces);
                totalDisMec =  (totalDisMec / equip.length).toFixed(scope.config.decimalPlaces);
                let objectEquip = getDataBarPercentArray(equipFilter, totalUtil, totalDisMec);
                arrayTotalPercent.push(objectEquip);
            });

            return arrayTotalPercent;
        }

        function getTotalHours(providerBarH, arrayOfEquipments){
            
            let arrayTotalizator = [];
            
            arrayOfEquipments.forEach( equipFilter =>{
                let equip = providerBarH.filter(item => item.category == equipFilter);
                
                let totalOpHours = 0;
                let totalInop = 0;
                let totalDemora = 0;
                equip.forEach(value => {
                    totalOpHours += parseFloat(value.colHoperative);
                    totalInop += parseFloat(value.colHInop);
                    totalDemora += parseFloat(value.colHDemora);
                });
                totalOpHours = totalOpHours.toFixed(scope.config.decimalPlaces);
                totalInop = totalInop.toFixed(scope.config.decimalPlaces);
                totalDemora = totalDemora.toFixed(scope.config.decimalPlaces);
                
                let objectEquip = getDataBarHorArray(equipFilter, totalOpHours, totalDemora, totalInop); 
                arrayTotalizator.push(objectEquip);
            });

            return arrayTotalizator;
        }

        function depuredData(data, uMine, uTurn, daysToFilter){
            
            let dataDepure = [];
            data.Data.forEach(equipment => {
                equipment.Values.forEach(value =>{
                    let valueMine = value.Value.split('||')[0];
                    let valueTurn = value.Value.split('||')[2];
                    
                    if(uMine == null) {
                        if(uTurn == null){
                            value.IsGood != false ? dataDepure.push(value): null;
                        }else{
                            if(uTurn == valueTurn){
                                value.IsGood != false ? dataDepure.push(value): null;
                            }
                        }
                    }else{
                        if(uTurn == null){
                            if(uMine == valueMine){
                                value.IsGood != false ? dataDepure.push(value): null;
                            }  
                        }else{
                            if(uTurn == valueTurn && uMine == valueMine){
                                value.IsGood != false ? dataDepure.push(value): null;
                            }
                        }
                    }
                })
            });

            let dataFilteredDays = [];

            dataDepure = dataDepure.filter(item => new Date(item.Time).getHours() == 7 || new Date(item.Time).getHours() == 19);
            
            if(daysToFilter){
                for(let i = 0; i < daysToFilter.length; i++){
                   dataFilteredDays.push(dataDepure.filter(item => new Date(item.Time).getDate() == daysToFilter[i]));
                }
                
                dataDepure = [];
                dataFilteredDays.forEach(item => {item.forEach(value => {dataDepure.push(value)})});
            }

            return dataDepure;
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
        }


        function refreshChartBarHorizontal(dataArrayBarHorizontal) {
            
            chartBarHorizontal.dataProvider = dataArrayBarHorizontal;
           
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
            return attributeValue && attributeValue > 0 ? parseFloat(attributeValue).toFixed(scope.config.decimalPlaces) : 0;
        };

        function getDataBarHorArray(labelCategory, value1, value2, value3) {
            return {
                "category": labelCategory,
                "colHoperative": value1,
                "colHDemora": value2,
                "colHInop": value3
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
                "util": value1,
                "dispMeca": value2
            }
        };

        function myCustomConfigurationChangeFunction() {
            
            if(chartGauge){
                if (scope.config.showGaugeTitle) chartGauge.titles = createArrayOfChartTitles(scope.config.useCustomGaugeTitle, scope.config.customGaugeTitle);
                else chartGauge.titles = null;
            
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
                } else chartBarHorizontal.titles = null;
                

                if (chartBarHorizontal.fontSize !== scope.config.fontSize) {
                    chartBarHorizontal.fontSize = scope.config.fontSize;
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
                    chartBarHorizontal.graphs[0].labelText = "[[colHoperative]]";
                    chartBarHorizontal.graphs[1].labelText = "[[colHDemora]]";
                    chartBarHorizontal.graphs[2].labelText = "[[colHInop]]";
                } else {
                    chartBarHorizontal.graphs[0].labelText = "";
                    chartBarHorizontal.graphs[1].labelText = "";
                    chartBarHorizontal.graphs[2].labelText = "";
                }
                
                chartBarHorizontal.valueAxes[0].maximum = scope.config.maximumHorizontal;
               
                chartBarHorizontal.validateData();
                chartBarHorizontal.validateNow();
            }
        }

        function generateGaugeChart(dataArray, scope){
            chartGauge = AmCharts.makeChart(symbolContainerDiv1.id, {
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
                    "unit": "%",
                    "bandOutlineAlpha": 0,
                    "bands": [ {
                      "color": scope.config.bandColor1,
                      "title": " H operativa ",
                      "balloonText": "H Operativa "+ dataArray[dataArray.length-1].hOperativa,
		              "fontSize": 28,
                      "endValue": parseFloat(dataArray[dataArray.length-1].hOpPercent),
                      "innerRadius": "100%",
                      "radius": "150%",
                      "gradientRatio": [0.5, 0, -0.5],
                      "startValue": 0
                    },{
                      "color": scope.config.bandColor2,
                      "title": " H demora ",
                      "balloonText": "H Demora: "+ dataArray[dataArray.length-1].hDemora,
	                  "fontSize": 28,
                      "endValue": parseFloat(dataArray[dataArray.length-1].hDemoraPercent) + parseFloat(dataArray[dataArray.length-1].hOpPercent),
                      "innerRadius": "100%",
                      "radius": "150%",
                      "gradientRatio": [0.5, 0, -0.5],
                      "startValue": 0,
                    },{
                      "color": scope.config.bandColor3,
                      "title": " H inoperativa ",
                      "balloonText": "H Inoperativa: "+ dataArray[dataArray.length-1].hInoperativa ,
		              "fontSize": 28,
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
                "bulletSize": 20,
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
                        "unit": "h",
                        "axisAlpha": 1,
                        "fillAlpha": 0,
                        "gridAlpha": 1,
                        "stackType": "regular",
                        "axisColor": scope.config.axesColor,
                        "gridColor": scope.config.gridColor,
                        "position": scope.config.axisPosition,
                        "maximum": scope.config.maximumHorizontal
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
			            "fontSize": 28,
                        "id": "AmGraph-1",
                        "title": "Hrs Opers",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor1,
                        "lineThickness": 1,
                        //"showAllValueLabels": scope.config.showLabels,
                        "labelText": "[[colHoperative]]",
                        "fillColors": scope.config.barColor1,
                        "labelFontWeight": "bold",
                        "valueField": "colHoperative"
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]] "  + "</b>",
			            "fontSize": 28,
                        "id": "AmGraph-2",
                        "title": "Hrs Demoras",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineThickness": 1,
                        "lineColor": scope.config.barColor2,
                        //"showAllValueLabels": scope.config.showLabels,
                        "labelText": "[[colHDemora]]",
                        "fillColors": scope.config.barColor2,
                        "labelFontWeight": "bold",
                        "valueField": "colHDemora"
                    },
                    {
                        "balloonText": "[[title]] de [[category]]: <b>[[value]]" + "</b>",
			            "fontSize": 28,
                        "id": "AmGraph-3",
                        "title": "Hrs Inopers",
                        "fillAlphas": scope.config.columnOpacity,
                        "columnWidth": scope.config.columnWidth,
                        "type": "column",
                        "labelOffset": 10,
                        "lineAlpha": 1,
                        "lineColor": scope.config.barColor3,
                        "lineThickness": 1,
                        //"showAllValueLabels": scope.config.showLabels,
                        "labelText": "[[colHInop]]",
                        "fillColors": scope.config.barColor3,
                        "labelFontWeight": "bold",
                        "valueField": "colHInop"
                    }
                ],
                "guides": [],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "position": scope.config.legendPosition,
                    "fontSize": scope.config.fontSize + 5,
                    "labelFontWeight": "bold",
                    "bold": true,
                    "enabled": true,
                    "color": "black",
                    "useGraphSettings": true
                },
                
                "dataProvider": dataArray
            });
        };

        function generateBarWithPercent(dataArray){
            return AmCharts.makeChart(symbolContainerDiv3.id, {
                "type": "serial",
                "hideCredits": true,
                "bulletSize": 20,
                "precision": scope.config.decimalPlaces,
                "dataProvider": dataArray,
                "bold": true,
                "fontSize": 32,
                "valueAxes": [{
                  "axisAlpha": 0,
                  "unit": "%",
                  "position": "left",
                  "maximum": 110,
                  "showLastLabel": false,
                }],
                "startDuration": 1,
                "graphs": [{
                  "alphaField": "alpha",
                  "fillAlphas": 1,
                  "title": "Utilización",
                  "type": "column",
		          "fontSize": 28,
                  "labelText": "[[util]]",
                  "bold": true,
                  "lineColor": scope.config.barColor1, 
                  "columnWidth": 0.5,
                  "valueField": "util",
                  "dashLengthField": "dashLengthColumn"
                }, {
                  "id": "graph2",
                  "bullet": "circle",
		          "fontSize": 28,
                  "showAllValueLabels": true,
                  "lineThickness": 8,
                  "lineColor": "lightblue",
                  "labelText": "[[dispMeca]]",
                  "labelPosition": "top-middle",
                  "bulletSize": 20,
                  "labelRotation": -45,
                  "bulletBorderAlpha": 1,
                  "bulletColor": "#FFFFFF",
                  "useLineColorForBulletBorder": true,
                  "bulletBorderThickness": 10,
                  "fillAlphas": 0,
                  "bold": true,
                  "lineAlpha": 1,
                  "title": "Disponibilidad Mecánica",
                  "valueField": "dispMeca"
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
                    "bold": true,
                    "enabled": true,
                    "color": "black",
                    "useGraphSettings": true
                },
                "titles": [{
                  "text": "DISP. MEC. Y UTIL. TOTAL POR EQUIPO",
                  "bold" : true
                },]
            });
        }
    };

    CS.symbolCatalog.register(myGaugeDefinition);

})(window.PIVisualization);