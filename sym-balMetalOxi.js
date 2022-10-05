(function(CS) {
    var myCustomSymbolDefinition = {
        typeName: 'balMetalOxi',
        displayName: 'Balance Oxidos',
        inject: ['timeProvider'],
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 300,
                Width: 400,
                Intervals: 1000,
                FormatType: null,
                showDataItemNameCheckboxValue: true,
                showBalMetalCheckboxValue: true,
                showDataItemNameCheckboxStyle: "table-cell",
                showBalMetalCheckboxStyle: "table-cell",
                numberOfDecimalPlaces: 2,
                valueBalMetalColumnColor: "black",
                hoverBalMetalColor: "lightgreen",
                evenBalMetalRowColor: "darkgray",
                oddBalMetalRowColor: "none",
                outsideBalMetalBorderColor: "none",
                headerBalMetalBackgroundColor: "black",
                balMetalHeaderTextColor: "white",
            };
        },
        configOptions: function() {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        }      
    };

    
    function symbolVis() {}
    CS.deriveVisualizationFromBase(symbolVis);

    const onzaTroy = 31.1034768;

    const separatorMiles = (num, decimal) => {
        num = num.toFixed(decimal);
        if (num > 1000 || num < -1000) {
            const thousandPart = (num / 1000).toString().split('.')[0];
            
            let hundredPart = Math.abs(num % 1000); 

            if (hundredPart <= 99 && hundredPart > 9) hundredPart = '0' + hundredPart.toString();
            else {
                if(hundredPart <= 9 && hundredPart > 0) hundredPart =  '00'+ hundredPart.toString();
                else{
                    if(hundredPart == 0) hundredPart = '000';
                }
            };
            return thousandPart.toString()+','+hundredPart;
        }
        else return num;
    };

    class objectRow {
        constructor(head, budget, forecast, real, mbgt, mfct, mReal, decimal){
            this.head = head;
            this.budget = separatorMiles(budget, decimal);
            this.forecast = separatorMiles(forecast, decimal);
            this.real = separatorMiles(real, decimal);

            this.varRB = separatorMiles(parseFloat(real - forecast), decimal);
            this.toDo = forecast > 0 ? separatorMiles(parseFloat(real / forecast * 100) , 1) : 0;
            
            this.mbgt = separatorMiles(mbgt, decimal);
            this.mfct = separatorMiles(mfct, decimal);
            this.mReal = separatorMiles(mReal, decimal);

            this.varMrb = separatorMiles(parseFloat(mReal - mfct),decimal);
            this.toMdo = mfct > 0 ? separatorMiles(parseFloat(mReal / mfct * 100), 1) : 0;
        }

        get arObject(){
            return [this.head, this.budget, this.forecast, this.real, this.varRB, this.toDo,
                                this.mbgt, this.mfct, this.mReal, this.varMrb, this.toMdo];
        }
    };

    const getDepuredData = (data) => {
        let depuredData = {'Data':[]};
        data.Data.forEach(value => {
            depuredData.Data.push(value.Values.filter(item => new Date(item.Time).getHours() == 0));
        });
        return depuredData;
    };

    const getValue = (index, data, date) => {
        const instance = data.Data[index].filter(item => new Date(item.Time).getDate() == date.getDate() && new Date(item.Time).getMonth() == date.getMonth());
        return instance.length > 0 ? parseFloat(instance[0].Value) : 0;
    };

    const getEndDate = (pureData, indexA, indexB) => {
        const valueTimeA = new Date(pureData.Data[indexA][pureData.Data[indexA].length-1].Time);
        const valueTimeB = new Date(pureData.Data[indexB][pureData.Data[indexB].length-1].Time);
        return valueTimeA.getTime() > valueTimeB.getTime() ? valueTimeA : valueTimeB;
    };

    const getRealData = (arrayData, average) => {
        let sumator = 0; 
        arrayData.forEach(item => isNaN(item) ?  sumator += 0 : sumator += item);
        average && arrayData.length > 0 ? sumator = sumator/arrayData.length : sumator;
        const lastValue = arrayData.length > 0 ? parseFloat(arrayData[arrayData.length-1]) : 0;
        return [lastValue, sumator];
    };

    const getAccumulated = (pureData, indexA , indexB, average, timeProvider) => {
        let iterableDate = new Date (timeProvider.displayTime.start);
        let arrayData = [];
        let endDate = getEndDate(pureData, indexA, indexB);
        endDate.setDate(endDate.getDate()+1);
        
        while (iterableDate.getTime() <= endDate.getTime()){
            const valueTurnA =  getValue(indexA, pureData, iterableDate);
            const valueTurnB =  getValue(indexB, pureData, iterableDate);
            const totalTurn = valueTurnA + valueTurnB;
            let unAvg = 1;
            if(average){
                valueTurnA == 0 || valueTurnB == 0 ? unAvg : unAvg = 2;
                totalTurn != 0 ? arrayData.push(totalTurn / unAvg) : null;
            } else totalTurn != 0 ? arrayData.push(totalTurn) : null;
        
            iterableDate.setDate(iterableDate.getDate()+1);
        };
        arrayData = getRealData(arrayData, average);
        return arrayData;
    };

    const getOnlyValues = (data) => {
        let colectorOnlyValues = [];
        data.forEach(item => { colectorOnlyValues.push(item.Value)});
        return colectorOnlyValues;
    };

    const getPlan = (data, indexBdg, indexFcst, average) => {
        let arrayColector = [];
        const budget = getRealData(getOnlyValues(data.Data[indexBdg]), average);
        const forecast = getRealData(getOnlyValues(data.Data[indexFcst]), average);
        arrayColector.push(budget[0], budget[1]);
        arrayColector.push(forecast[0], forecast[1]);
        return arrayColector;
    };

    const getFinos = (data, indexCabA, indexCabB, indexRelA, indexRelB, timeProvider) => {
        const finosCabC = getAccumulated(data, indexCabA, indexCabB, false, timeProvider);
        const finosRelave = getAccumulated(data, indexRelA, indexRelB, false, timeProvider);
        const dailyFino = (finosCabC[0] - finosRelave[0]) / onzaTroy;
        const monthlyFino = (finosCabC[1] - finosRelave[1]) / onzaTroy;
        return [dailyFino, monthlyFino, (finosCabC[0]), (finosCabC[1])];
    };

    const getRecovery = (finos) => {
        const dailyRecovery = ((finos[0] * onzaTroy) /finos[2]) * 100;
        const monthlyRecovery = ((finos[1] * onzaTroy) /finos[3]) * 100;
        return [dailyRecovery, monthlyRecovery];
    };

    const fillObject = (labelHead, planData, realData , decimal) => {
        return new objectRow(labelHead, planData[0], planData[2], realData[0], planData[1], planData[3], realData[1], decimal);
    };

    symbolVis.prototype.init = function(scope, elem, timeProvider) {
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;
        console.log('\t[+]Balance Oxi Loaded');
        var syContElement1 = elem.find('#container')[0];
        var newUniqueIDString1 = 'myCustomSymbol_1' + Math.random().toString(36).substr(2, 16);
        syContElement1.id = newUniqueIDString1;

        function myCustomDataUpdateFunction(data) {

            if (data.Data) {

                $('#' + syContElement1.id).empty();
                const pureData = getDepuredData(data);

                console.log(pureData);

                const planTms = getPlan(pureData, 0, 1, false);
                console.log('plan tms: ', planTms);
                const tms = getAccumulated(pureData, 2, 3, false, timeProvider); // 0 budget, 1 forecast
                console.log('real tms: ', tms);

                const planHeadSilver = getPlan(pureData, 4, 5, true);
                const headSilver = getAccumulated(pureData, 6, 7, true, timeProvider);

                const planHeadGold = getPlan(pureData, 8, 9, true);
                const headGold = getAccumulated(pureData, 10, 11, true, timeProvider);

                const planFinosAG = getPlan(pureData, 12, 13, false);
                const finosAG = getFinos(pureData, 14, 15, 16, 17, timeProvider);

                const planFinosAU = getPlan(pureData, 18, 19, false);
                const finosAU = getFinos(pureData, 20, 21, 22, 23, timeProvider);

                const planRecoveryAG = getPlan(pureData, 24, 25, true);
                const planRecoveryAU = getPlan(pureData, 26, 27, true);

                const recoveryAG = getRecovery(finosAG);
                const recoveryAU = getRecovery(finosAU);
                
                const labels = ['P. Óxidos','Bgt','Fct','Real','Var.R/F', '%Cumpl.', 'Bgt Mes', 'Fct Mes', 'Real Mes', 'Var Mes', '%Cumpl. Mes'];
                
                const rowTMS = fillObject('Trat. (TM)', planTms, tms, 0);
                const rowHSilver = fillObject('Plata (oz/t)', planHeadSilver, headSilver, 2);
                const rowHGold = fillObject('Oro (g/t)', planHeadGold, headGold, 2);

                const rowMSilver = fillObject('Plata (oz)', planFinosAG, finosAG, 0);
                const rowMGold = fillObject('Oro (oz)', planFinosAU, finosAU, 0);

                const rowRSilver = fillObject('Plata(%)', planRecoveryAG, recoveryAG, 1);
                const rowRGold = fillObject('Oro(%)', planRecoveryAU, recoveryAU, 1);
            
                createTable(labels, rowTMS.arObject, 
                rowHSilver.arObject, rowHGold.arObject,
                rowRSilver.arObject, rowRGold.arObject,
                rowMSilver.arObject, rowMGold.arObject);
            };
        };
 
        function createTable(labels, rowTMS, rowHZinc, rowHLead, rowRZinc, rowRLead, rowMZinc, rowMLead){
            
            let headersRow = syContElement1.insertRow(-1);
            headersRow.className = "balMetalRowClass";

            const separatorHRow = ['Leyes en Cabeza', '', '', '','','','','','','',''];
            const separatorRRow = ['Recuperacion', '', '', '','','','','','','',''];
            const separatorMRow = ['Finos', '', '','','','','','','','',''];
            
            insertRows(labels, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            insertRows(rowTMS, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorHRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');

            insertRows(rowHZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowHLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorRRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowRZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowRLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorMRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowMZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowMLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
        };

        function insertRows(rowToPut, cellulla, classToPut){
            cellulla = syContElement1.insertRow(-1);
            cellulla.className = 'balMetalCellClass balMetalRowClass';
            
            for(let indexRow = 0; indexRow<rowToPut.length;indexRow++){
                let rowCellulla = cellulla.insertCell(-1);
                rowCellulla.innerHTML = `<b>${rowToPut[indexRow]}</b>`;
                rowCellulla.className = classToPut;
                if(indexRow == 4 || indexRow == 9){
                    if(parseFloat(rowToPut[indexRow])<=0) rowCellulla.className += ' balMetalNegative';
                    else  rowCellulla.className += ' balMetalPositive';
                } 

                if(indexRow == rowToPut.length-1 || indexRow == 5 ){
                    if(rowToPut[indexRow] > 100) rowCellulla.className += ' balMCien';
                    else {if (rowToPut[indexRow] >= 90) rowCellulla.className += ' balMNoventa';
                          else rowCellulla.className += ' balMOchenta'}

                }
            }
        };

        function myCustomConfigurationChangeFunction(data) {
            
            document.getElementById(syContElement1.id).style.border = '3px solid ' + scope.config.outsideBalMetalBorderColor;
            document.getElementById(syContElement1.id).style.borderRadius = '20%';
            
            if (scope.config.showBalMetalCheckboxValue) {
                scope.config.showBalMetalCheckboxStyle = 'table-cell';
            } else {
                scope.config.showBalMetalCheckboxStyle = 'none';
            }
            if (scope.config.showDataItemNameCheckboxValue) {
                scope.config.showDataItemNameCheckboxStyle = 'table-cell';
            } else {
                scope.config.showDataItemNameCheckboxStyle = 'none';
            }

        }
    }

    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);