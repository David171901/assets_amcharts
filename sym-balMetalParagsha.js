(function(CS) {
    var myCustomSymbolDefinition = {
        typeName: 'balMetalParagsha',
        displayName: 'Balance Metalúrgico Paragsha',
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
        
    }

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
        };

        get arObject(){
            return [
                this.head, this.budget, this.forecast, this.real, this.varRB, this.toDo,
                this.mbgt, this.mfct, this.mReal, this.varMrb, this.toMdo
            ];
        };
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
        arrayData.forEach(item => isNaN(item) ? sumator +=0 : sumator += item);
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

    const getFinos = (data, indexCabA, indexCabB, indexRelA, indexRelaB, indexDisA, indexDisB, timeProvider) => {
        const finosCabC = getAccumulated(data, indexCabA, indexCabB, false, timeProvider);
        const finosRelave = getAccumulated(data, indexRelA, indexRelaB, false, timeProvider);
        const finosDis = getAccumulated(data, indexDisA, indexDisB, false, timeProvider);
        const dailyFino = finosCabC[0] - finosRelave[0] - finosDis[0];
        const monthlyFino = finosCabC[1] - finosRelave[1] - finosDis[1]
        return [dailyFino, monthlyFino, finosCabC[0], finosCabC[1]];
    };

    const getFinosAG = (data, indexCabA, indexCabB, indexRelA, indexRelB, timeProvider) => {
        const finosCabC = getAccumulated(data, indexCabA, indexCabB, false, timeProvider);
        const finosRelave = getAccumulated(data, indexRelA, indexRelB, false, timeProvider);
        const dailyFino = (finosCabC[0] - finosRelave[0]) / onzaTroy;
        const monthlyFino = (finosCabC[1] - finosRelave[1]) / onzaTroy;
        return [dailyFino, monthlyFino, (finosCabC[0]/onzaTroy), (finosCabC[1]/onzaTroy)];
    };

    const getRecovery = (finos) =>{
        const dailyRecovery = (finos[0]/finos[2])  * 100;
        const monthlyRecovery = (finos[1]/finos[3]) * 100;
        return [dailyRecovery, monthlyRecovery];
    };
    
    const getRecoveryConc = (finosCab, finosConc) => {
        const dailyConc = (finosConc[0] / (finosCab[2] * onzaTroy)) * 100;
        const monthlyConc = (finosConc[1] / (finosCab[3] * onzaTroy)) * 100;
        return [dailyConc, monthlyConc];
    };

    const fillObject = (labelHead, planData, realData , decimal) => {
        return new objectRow(labelHead, planData[0], planData[2], realData[0], planData[1], planData[3], realData[1], decimal);
    };


    symbolVis.prototype.init = function(scope, elem, timeProvider) {
        
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        
        scope.config.FormatType = null;
        console.log('\t[+]Balance Paragsha Loaded');
        
        var syContElement1 = elem.find('#container')[0];
        var newUniqueIDString1 = 'myCustomSymbol_1' + Math.random().toString(36).substr(2, 16);
        syContElement1.id = newUniqueIDString1;

        
        function myCustomDataUpdateFunction(data) {

            if (data.Data.length) {
                $('#' + syContElement1.id).empty();
                
                const pureData = getDepuredData(data);

                const labels = ['P. Paragsha','Bgt','Fct','Real','Var.R/F', '%Cumpl.', 
                'Bgt Mes', 'Fct Mes', 'Real Mes', 'Var Mes', '%Cumpl. Mes'];
                
                const planTms = getPlan(pureData, 0, 1, false);
                
                const tms = getAccumulated(pureData, 2, 3, false, timeProvider); // 0 budget, 1 forecast
                
                const planHeadZinc = getPlan(pureData, 4, 5, true);
                const headZN = getAccumulated(pureData, 6, 7, true, timeProvider); // 4 budget, 5 forecast

                const planHeadLead = getPlan(pureData, 8, 9, true);
                const headPB = getAccumulated(pureData, 10, 11, true, timeProvider); // 8 budget, 9 forecast

                const planHeadSilver = getPlan(pureData, 12, 13, true);
                const headAG = getAccumulated(pureData, 14, 15, true, timeProvider); // 12 budget, 13 forecast

                const planFinosZinc = getPlan(pureData, 16, 17, false);
                const finosZn = getFinos(pureData, 18, 19, 20, 21, 22, 23, timeProvider);

                const planFinosLead = getPlan(pureData, 24,25, false);
                const finosPb = getFinos(pureData, 26, 27, 28, 29, 30, 31,timeProvider);
                
                const planFinosAG = getPlan(pureData, 32, 33, false);
                const finosAg = getFinosAG(pureData, 34, 35, 36, 37, timeProvider);

                const finosAGZN = getAccumulated(pureData, 38, 39, false, timeProvider);
                const finosAGPB = getAccumulated(pureData, 40, 41, false, timeProvider);

                // budget y forecast == de recoveries
                const recuPlanZN = getPlan(pureData, 42, 43, true);
                const recuPlanPB = getPlan(pureData, 44, 45, true);
                const recuPlanAG = getPlan(pureData, 46, 47, true);
                const recuPlanAGZinc = getPlan(pureData, 48, 49, true);
                const recuPlanAGBulk = getPlan(pureData, 50, 51, true);
                
                const recuZN = getRecovery(finosZn);
                const recuPB = getRecovery(finosPb);
                const recuAG = getRecovery(finosAg);
                
                const recuAGZinc = getRecoveryConc(finosAg, finosAGZN);
                const recuAGBulk = getRecoveryConc(finosAg, finosAGPB);


                //Objects filas de cada elemento
                const rowTms = fillObject('Trat. TM', planTms, tms, 0);
                const rowHZinc = fillObject('Zinc(%)', planHeadZinc, headZN, 2);
                const rowHLead = fillObject('Plomo(%)', planHeadLead, headPB, 2);
                const rowHSilver = fillObject('Plata(%)', planHeadSilver, headAG, 2);

                const rowRZinc = fillObject('Rec Zinc(%)', recuPlanZN, recuZN, 1);
                const rowRLead = fillObject('Rec Plomo(%)', recuPlanPB, recuPB, 1);
                const rowRSilver = fillObject('Rec Plata(%)', recuPlanAG, recuAG, 1);

                const rowRSilverZinc = fillObject('R.Plata-ZN(%)', recuPlanAGZinc, recuAGZinc, 1);
                const rowRSilverBulk = fillObject('R.Plata-Bulk(%)', recuPlanAGBulk, recuAGBulk, 1);

                const rowFZinc = fillObject('Zinc(tmf)', planFinosZinc, finosZn, 0);
                const rowFLead = fillObject('Plomo(%)', planFinosLead, finosPb, 0);
                const rowFSilver = fillObject('Plata(oz/t)', planFinosAG, finosAg, 0);
                
                createTable(labels, rowTms.arObject, 
                rowHZinc.arObject, rowHLead.arObject, rowHSilver.arObject,
                rowRZinc.arObject, rowRLead.arObject, rowRSilver.arObject,
                rowRSilverZinc.arObject, rowRSilverBulk.arObject,
                rowFZinc.arObject, rowFLead.arObject, rowFSilver.arObject)

                //let rowQuaZinc = fillDataOnObject('Cld.Conc-Zinc', 36, 2, data, false);
                //let rowQuaPlomo = fillDataOnObject('Cld.Conc-Plomo', 39, 2, data, false);
                //rowQuaZinc.arObject, rowQuaPlomo.arObject);
            };
        };

        function createTable(labels, rowTMS,
            rowHZinc, rowHLead, rowHSilver,
            rowRZinc, rowRLead, rowRSilver, 
            rowRSilverZinc, rowRSilverBulk,
            rowFZinc, rowFLead, rowFSilver
            ){
            
            let headersRow = syContElement1.insertRow(-1);
            headersRow.className = "balMetalRowClass";

            const separatorHRow = ['Leyes en Cabeza', '', '', '','','','','', '','',''];
            const separatorRRow = ['Recuperacion', '', '', '','','','','', '','',''];
            const separatorFRow = ['Finos', '', '','','','','','', '','',''];
            
            insertRows(labels, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            insertRows(rowTMS, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorHRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');

            insertRows(rowHZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowHLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowHSilver, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorRRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowRZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowRLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowRSilver, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(rowRSilverZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowRSilverBulk, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorFRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowFZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowFLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowFSilver, headersRow, 'balMetalCellClass balMetalValueCellClass');
            /*
            insertRows(rowQuaZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowQuaPlomo, headersRow, 'balMetalCellClass balMetalValueCellClass');
                */
        };

        function insertRows(rowToPut, cellulla, classToPut ){
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

        };
    };

    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);