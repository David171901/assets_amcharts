(function(CS) {
    var myCustomSymbolDefinition = {
        typeName: 'balMetalAndaychagua',
        displayName: 'Balance Andaychagua',
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

    class objectRow {
        constructor(head, unit, real, plan, mReal, mPlan, decimal){
            this.head = head;
            this.unit = unit;
            this.real = parseFloat(real).toFixed(decimal);
            this.plan = parseFloat(plan).toFixed(decimal);
            this.varRP = parseFloat(this.real - this.plan).toFixed(decimal);
            
            this.mReal = parseFloat(mReal).toFixed(decimal);
            this.mPlan = parseFloat(mPlan).toFixed(decimal);
            this.varMrp = parseFloat(this.mReal - this.mPlan).toFixed(decimal);
           
        }

        get arObject(){
            return [this.head, this.unit, this.real, this.plan, this.varRP, this.mReal, this.mPlan, this.varMrp];
        }
    };

    const getMonthly = (dataValues, acumulated, daysPassed, unid) => {
        let sumator = 0;
        dataValues.forEach(element => { isNaN(element.Value) ? sumator : sumator = (sumator + element.Value) / unid });       
        return acumulated ? sumator : (sumator / daysPassed);
    };
    
    const getValue = (index, data, needTime) => {
        if(needTime) return new Date(data.Data[index][data.Data[index].length-1].Time);
        else return parseFloat(data.Data[index][data.Data[index].length-1].Value);
    };

    const getValueForTime = (dateNow, dateTurn, positionOfValue, data) => {
        if(dateNow.getDate() == dateTurn.getDate() && dateNow.getMonth() == dateTurn.getMonth() && dateTurn.getFullYear() == dateNow.getFullYear()){
            return parseFloat(getValue(positionOfValue, data, false));
        }
        else return 0;
    };

    const getValuesOfTurns = (indexA, indexB, data, unid) => {
        const dateTurnA = getValue(indexA, data, true);
        const dateTurnB = getValue(indexB, data, true);
        const dateNow = dateTurnA.getTime() >= dateTurnB.getTime() ? dateTurnA : dateTurnB;
        return ((getValueForTime(dateNow, dateTurnA, indexA, data) + getValueForTime(dateNow, dateTurnB, indexB, data)) / unid);
    };

    const getDaysPassed = (startDate) => { return Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24))};

    const getDataReal = (indexMin, moreIndex, data, unid) => {
        if(!moreIndex){
            return getValuesOfTurns(indexMin, indexMin+1, data, unid);
        }else{
            return (getValuesOfTurns(indexMin, indexMin+1, data, unid) -
            getValuesOfTurns(indexMin+2, indexMin+3, data, unid));
        } 
    };

    const getMonthlyReal = (moreIndex, indexMin, data, acumulated, daysPassed, unid) => {
        if (!moreIndex) {
            return (getMonthly(data.Data[indexMin], acumulated, daysPassed, unid) 
            + getMonthly(data.Data[indexMin+1], acumulated, daysPassed, unid))
        } else {
            return (
            (getMonthly(data.Data[indexMin], acumulated, daysPassed, unid) 
            + getMonthly(data.Data[indexMin+1], acumulated, daysPassed, unid)) -
            (getMonthly(data.Data[indexMin+2], acumulated, daysPassed, unid) 
            + getMonthly(data.Data[indexMin+3], acumulated, daysPassed, unid)));
        }    
    };

    const firstElement = (indexMin, data, acumulated, daysPassed) => {
        const plan = getValue(indexMin, data, false); 
        const mPlan = getMonthly(data.Data[indexMin], acumulated, daysPassed, 1); 
    
        return [plan, mPlan];
    };

    const getDepuredData = (data) => {
        let depuredData = {'Data':[]};
        data.Data.forEach(value => {
            depuredData.Data.push(value.Values.filter(item => new Date(item.Time).getHours() == 0));
        });
        return depuredData;
    };

    
    symbolVis.prototype.init = function(scope, elem, timeProvider) {
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;
        console.log('\t[+]Balance Andaychagua Loaded');
        var startDate = new Date(timeProvider.displayTime.start);
        var syContElement1 = elem.find('#container')[0];
        var newUniqueIDString1 = 'myCustomSymbol_1' + Math.random().toString(36).substr(2, 16);
        syContElement1.id = newUniqueIDString1;

        function myCustomDataUpdateFunction(data) {


            if (data) {

                $('#' + syContElement1.id).empty();
                const pureData = getDepuredData(data);
                pureData.Data[2].pop();
                console.log('data work ',pureData);
                
                const labels = ['Andaychagua','unit','Trat. Día','Plan Día','Var/D', 'Trat. Mes', 'Plan Mes', 'Var/M'];
                console.log(labels);
                const rowTMS = fillObject('Ore Milled', 'dmt', 0, 0, pureData, true, false, 1);
                console.log('fil Tms', rowTMS);
                /*
                const rowHSilver = fillObject('Plata (oz/t)', 4, 2, pureData, false, false, 1);
                const rowHGold = fillObject('Oro (g/t)', 8, 2, pureData,  false, false, 1);

                const rowMSilver = fillObject('Plata (oz)', 12, 2, pureData, true, true, onzaTroy);
                const rowMGold = fillObject('Oro (oz)', 18, 2, pureData,  true, true, onzaTroy);
            
                const daysPassed = getDaysPassed(startDate);
                
                const silverCab = getValuesOfTurns(14, 15, pureData, onzaTroy);
                const silverMonthly = getMonthly(pureData.Data[14], true, daysPassed, onzaTroy) + 
                getMonthly(pureData.Data[15], true, daysPassed, onzaTroy);
                const silverReal = ((rowMSilver.arObject[3] / silverCab) * 100);
                const silverMReal = ((rowMSilver.arObject[8] / silverMonthly) * 100);
                const listSilver = firstElement(24, pureData, false, daysPassed);
                const rowRSilver = getRecoveryObject('Plata (%)', listSilver, silverReal, silverMReal, 2);
                
               
                const goldCab = getValuesOfTurns(20, 21, pureData, onzaTroy);
                const goldMonthly = getMonthly(pureData.Data[20], true, daysPassed, onzaTroy) + 
                getMonthly(pureData.Data[21], true, daysPassed, onzaTroy);
                console.log(goldMonthly);
                console.log(rowMGold.arObject[3]);
                const goldReal = (((rowMGold.arObject[3] / goldCab) * 100 ));
                const goldMReal = (((rowMGold.arObject[8] / goldMonthly) * 100));
                const listGold = firstElement(26, pureData, false, daysPassed);
                const rowRGold = getRecoveryObject('Oro (%)', listGold, goldReal, goldMReal, 2);
                
                */
                createTable(labels, rowTMS.arObject)
                /*, 
                rowHSilver.arObject, rowHGold.arObject,
                rowRSilver.arObject, rowRGold.arObject,
                rowMSilver.arObject, rowMGold.arObject);*/
            }
        }

        function fillObject (labelHead, uom ,indexMin, decimal, data, acumulated, moreIndex, unid){

            const daysPassed = getDaysPassed(startDate);
            const listOfData = firstElement(indexMin+2, data, acumulated, daysPassed); 
            const real = getDataReal(indexMin, moreIndex, data, unid);
            const mReal = getMonthlyReal(moreIndex, indexMin, data, acumulated, daysPassed, unid);
                
            return new objectRow(labelHead, uom, real, listOfData[0], mReal, listOfData[1], decimal);
        }

        
        function createTable(labels, rowTMS, rowHZinc, rowHLead, rowRZinc, rowRLead, rowMZinc, rowMLead){
            
            let headersRow = syContElement1.insertRow(-1);
            headersRow.className = "balMetalRowClass";

            const separatorHRow = ['Leyes en Cabeza', '', '', '','','','','','','',''];
            const separatorRRow = ['Recuperacion', '', '', '','','','','','','',''];
            const separatorMRow = ['Finos', '', '','','','','','','','',''];
            
            insertRows(labels, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowTMS, headersRow, 'balMetalCellClass balMetalValueCellClass');
            /*
            insertRows(separatorHRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');

            insertRows(rowHZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowHLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorRRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowRZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowRLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorMRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowMZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowMLead, headersRow, 'balMetalCellClass balMetalValueCellClass');*/
            
        };

        function insertRows(rowToPut, cellulla, classToPut){
            cellulla = syContElement1.insertRow(-1);
            cellulla.className = 'balMetalCellClass balMetalRowClass';
            
            for(let indexRow = 0; indexRow<rowToPut.length;indexRow++){
                let rowCellulla = cellulla.insertCell(-1);
                rowCellulla.innerHTML = `<b>${rowToPut[indexRow]}</b>`;
                rowCellulla.className = classToPut;
                if(indexRow == 4 || indexRow == 7){
                    if(rowToPut[indexRow]<=0) rowCellulla.className += ' balMetalNegative';
                    else  rowCellulla.className += ' balMetalPositive';
                } 
                /*
                if(indexRow == rowToPut.length-1 || indexRow == 5 ){
                    if(rowToPut[indexRow] > 100) rowCellulla.className += ' balMCien';
                    else {if (rowToPut[indexRow] >= 90) rowCellulla.className += ' balMNoventa';
                          else rowCellulla.className += ' balMOchenta'}

                }*/
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