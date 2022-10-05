(function(CS) {
    var myEDcolumnDefinition = {
        typeName: "tonelajeMonth",
        displayName: 'Tonelaje-Mensual',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: 'Images/chrome.value.svg',
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 100,
                Width: 100,
                Intervals: 1000,
                decimalPlaces: 0,
                textColor: "black",
                backgroundColor: "transparent",
                gridColor: "transparent",
                plotAreaFillColor: "transparent",
                showTitle: false,
                showValues: true,
                fontSize: 12,
                FormatType: null,
                lineThick: 1,
                showLegend: true,
                showChartScrollBar: false,
                legendPosition: "bottom",
                bulletSize: 8,
                customTitle: ""
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
        console.log('load');
        var result = null;
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;

        scope.config.FormatType = null;

        let symbolContainerDiv = elem.find('#container')[0];
        let newUniqueIDString = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        symbolContainerDiv.id = newUniqueIDString;
        
        function myCustomDataUpdateFunction(data) {
            
            if (data !== null && data.Data) {
                let TOTALTMS = 0;
                dataArray = [];

                var firstTurn = data.Data[0];
                var firstTurnDepuredValues = firstTurn.Values.filter(item => new Date(item.Time).getHours() == 0 && new Date(item.Time).getMinutes() == 00);
                firstTurn.Values = firstTurnDepuredValues;
                
                var secondTurn = data.Data[1];
                var secondTurnDepuredValues = secondTurn.Values.filter(item => new Date(item.Time).getHours() == 0 && new Date(item.Time).getMinutes() == 00);
                secondTurn.Values = secondTurnDepuredValues;

                var firstTurnNew = data.Data[2];
                var firstTurnNewDepuredValues = firstTurnNew.Values.filter(item => new Date(item.Time).getHours() == 0 && new Date(item.Time).getMinutes() == 00);
                firstTurnNew.Values = firstTurnNewDepuredValues;

                var secondTurnNew = data.Data[3];
                var secondTurnNewDepuredValues = secondTurnNew.Values.filter(item => new Date(item.Time).getHours() == 0 && new Date(item.Time).getMinutes() == 00);
                secondTurnNew.Values = secondTurnNewDepuredValues;

                var customDate = data.Data[4];
                var customStartDate = customDate.Values[customDate.Values.length - 1];

                firstTurn.Values = getTotalDataTurn(firstTurn, firstTurnNew);
                secondTurn.Values = getTotalDataTurn(secondTurn, secondTurnNew);
                

                var monthNow = 0;
                if (firstTurn.Values.length > 0) {
                    var searchTimeDate = new Date(customStartDate.Value);
                    monthNow = searchTimeDate.getMonth() + 2;
                    var searchYear = searchTimeDate.getFullYear();
                    var daysOfMonth = getDaysOfMonth(monthNow, searchYear);
                    TOTALTMS = fillDataArray(firstTurn, secondTurn, new Date(customStartDate.Value),
                        daysOfMonth, dataArray, firstTurnNew, secondTurnNew);
                }
                
                result = TOTALTMS;
                console.log('tonelaje: ', TOTALTMS);
                let container = $(`#${symbolContainerDiv.id}`);
                container.html(result ? result.toFixed(scope.config.decimalPlaces) : result);
                container.css({ 'color': scope.config.textColor });
                container.css({ 'font-size': scope.config.fontSize }); 
                container.css({ 'text-align': scope.config.TextAlignment});
            }
        }

        function getTotalDataTurn(data1, data2) {
            let depuredComparatedData = [];
            let countData = 0;

            if(data2.Values.length == 0 && data1.Values.length > 0){
                for(let items = 0; items < data1.Values.length; items++){
                    depuredComparatedData.push(data1.Values[items]);
                }
            }
            
            if(data2.Values.length == 1 && data1.Values.length > 0){
                for (let items = 0; items < data1.Values.length; items++){
                    if(new Date(data1.Values[items].Time).getDate() == new Date(data2.Values[0].Time).getDate()&&
                        new Date(data1.Values[items].Time).getMonth() + 1 == new Date(data2.Values[0].Time).getMonth() + 1) {
                    }  
                    else{
                        depuredComparatedData.push(data1.Values[items]); 
                    }
                }
            }

            if(data2.Values.length > 1 && data1.Values.length > 0){
                
                for (let indexd1 = 0; indexd1 < data1.Values.length; indexd1++){
                    for(let indexd2 = 0; indexd2 < data2.Values.length; indexd2++){
                        if(new Date(data1.Values[indexd1].Time).getDate() == new Date(data2.Values[indexd2].Time).getDate()&&
                            new Date(data1.Values[indexd1].Time).getMonth() + 1 == new Date(data2.Values[indexd2].Time).getMonth() + 1) { 
                        }  
                        else{
                            countData +=1;
                            if(countData == data2.Values.length){
                                depuredComparatedData.push(data1.Values[indexd1]);
                            }
                        }
                    }
                    countData = 0;
                }
            }
            /* return totalData ? depuredComparatedData/totalData : 0;*/
            
            return depuredComparatedData;
        }


        function fillDataArray(firstTurn, secondTurn, start, daysOfMonth) {
            var todayDate = new Date();
            var currentDay = todayDate.getDate();
            var currentHour = todayDate.getHours();
            let currentMonth = todayDate.getMonth()+1;
            /**start =  new Date(customStartDate.Value) este es el valor de la fecha.values[ultimo]*/
            var iterableDate = start;
            let moreDays = daysOfMonth - (start.getDate() + 1);
            var totalTMSmonth = 0;
            var total = 0;


            for (var dayIndex = 1; dayIndex <= (daysOfMonth + moreDays); dayIndex++) {
                iterableDate.setDate(iterableDate.getDate() + 1);
                var firstTurnValue = getTurnValue(firstTurn, iterableDate, true, currentDay, currentHour, currentMonth);
                var secondTurnValue = getTurnValue(secondTurn, iterableDate, false, currentDay, currentHour, currentMonth);
                
                var floatFirstTurn = parseFloat(firstTurnValue);
                var floatSecondTurn = parseFloat(secondTurnValue);
                
                total = getTotalTurns(floatFirstTurn, floatSecondTurn);
                totalTMSmonth += total != null ? total : 0;
                console.log('part to part', total);
            }
            return totalTMSmonth ? totalTMSmonth : 0;
        }

    
        function getTurnValue(turnArray, iterableDate) {
            var turnValue = null;
            var originalArrayLength = turnArray.Values.length;
            var hasSavedValues = originalArrayLength != 0;
            var arrayLength = hasSavedValues ? originalArrayLength : 1;

            for (var itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
                if (hasSavedValues) turnValue = getSavedValue(turnValue, turnArray, itemIndex, iterableDate);
                
            }
            return turnValue != null ? turnValue.toString().replace(",", ".") : turnValue;
        }

        function getSavedValue(turnValue, turnArray, itemIndex, iterableDate) {
            var itemDate = new Date(turnArray.Values[itemIndex].Time);

            var itemDay = itemDate.getDate();
            var itemMonth = itemDate.getMonth() + 1;

            var iterableDay = iterableDate.getDate();
            var iterableMonth = iterableDate.getMonth() + 1;

            if (iterableDay == itemDay && itemMonth == iterableMonth)
                turnValue = turnArray.Values[itemIndex].Value;
            return turnValue;
        }

        function getTotalTurns(firstTurnValue, secondTurnValue) {
            var firstTurn = firstTurnValue || 0;
            var secondTurn = secondTurnValue || 0;
            var total = firstTurn + secondTurn;
            return total != 0 ? total : null;
        }

        function getDaysOfMonth(numMonth, numYear) {
            var daysOfMonth = 31;
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

        function myCustomConfigurationChangeFunction() {
            let container = $(`#${symbolContainerDiv.id}`);
            container.html(result ? result.toFixed(scope.config.decimalPlaces) : result );
            container.css({ 'color': scope.config.textColor });
            container.css({ 'font-size': scope.config.fontSize });
            container.css({ 'text-align': scope.config.TextAlignment});
        }
    }
    CS.symbolCatalog.register(myEDcolumnDefinition);
})(window.PIVisualization);