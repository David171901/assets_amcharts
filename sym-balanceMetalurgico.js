(function(CS) {
    var myCustomSymbolDefinition = {
        typeName: 'balanceMetalurgico',
        displayName: 'Balance Metalúrgico Chungar',
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
                showDataItemNameCheckboxValue: true,
                showTimestampCheckboxValue: true,
                showDataItemNameCheckboxStyle: "table-cell",
                showTimestampCheckboxStyle: "table-cell",
                numberOfDecimalPlaces: 2,
                dataItemColumnColor: "black",
                timestampColumnColor: "lightgray",
                valueColumnColor: "black",
                hoverColor: "lightgreen",
                evenRowColor: "darkgray",
                oddRowColor: "none",
                outsideBorderColor: "none",
                headerBackgroundColor: "black",
                headerTextColor: "white",
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
    
    class objectRow {
        constructor(head, tms, cu, pb, zn, ag, decimal){
            this.head = head;
            this.tms = parseFloat(tms).toFixed(decimal);
            this.cu = cu.toFixed(decimal);
            this.pb = pb.toFixed(decimal);
            this.zn = zn.toFixed(decimal);
            this.ag = ag.toFixed(decimal);
        };

        get arObject(){
            return [this.head, this.tms, this.cu, this.pb, this.zn, this.ag];
        };
    };

    const armDate = (date) => {
        const partHours = date.split(' ')[1];
        const partDate = date.split(' ')[0];
        return new Date(partDate.split('/')[2], (parseFloat(partDate.split('/')[1]) - 1), partDate.split('/')[0], partHours.split(':')[0], partHours.split(':')[1], partHours.split(':')[2]);
    };

    const findEndDate = (dateA, dateB) => {
        const timeA = armDate(dateA);
        const timeB = armDate(dateB);
        if (timeA.getTime() > timeB.getTime()) return timeA;
        else return timeB;
    };

    const getValue = (elementToGetValue, endDateToCompare) => {
        let valueDepurated = elementToGetValue.Values.filter(item => item.Time.split('/')[0] == endDateToCompare.getDate() && item.Time.split('/')[1] == endDateToCompare.getMonth()+1);
        return valueDepurated = valueDepurated.length != 0 ? parseFloat(valueDepurated[0].Value.replace(',','')) : 0;
    };

    const getRealData = (arrayData, average) => {
        let sumator = 0; 
        arrayData.forEach(item => isNaN(item) ?  sumator += 0 : sumator += item);
        average && arrayData.length > 0 ? sumator = sumator/arrayData.length : sumator;
        const lastValue = arrayData.length > 0 ? parseFloat(arrayData.at(-1)) : 0;
        return [lastValue, sumator];
    };

    const getElement = (elementA, elementB, tmsA, tmsB, iterableDate, arrayElement) => {
        
        const turnA = getValue(elementA, iterableDate);
        const turnB = getValue(elementB, iterableDate);
        const element = tmsA + tmsB != 0 ? ((turnA * tmsA) + (turnB * tmsB)) / (tmsA + tmsB) : 0;
        element != 0 ? arrayElement.push(element) : null;
    };

    const getAccumulated = (tmsA , tmsB, cuA, cuB, pbA, pbB, znA, znB, agA, agB, timeProvider) => {
        let endDateToCompare = new Date();
        
        let iterableDate = new Date(timeProvider.displayTime.start);
        iterableDate.setHours(0);
        iterableDate.setDate(iterableDate.getDate()+1);
        
        let arrayTms = [];
        let arrayCu = [];
        let arrayPb = [];
        let arrayZn = [];
        let arrayAg = [];
        
        while (iterableDate.getTime() <= endDateToCompare.getTime()){
            const tmsTunrA =  getValue(tmsA, iterableDate);
            const tmsTurnB =  getValue(tmsB, iterableDate);

            getElement(cuA, cuB, tmsTunrA, tmsTurnB, iterableDate, arrayCu);
            getElement(pbA, pbB, tmsTunrA, tmsTurnB, iterableDate, arrayPb);
            getElement(znA, znB, tmsTunrA, tmsTurnB, iterableDate, arrayZn);
            getElement(agA, agB, tmsTunrA, tmsTurnB, iterableDate, arrayAg);
            
            arrayTms.push(tmsTunrA + tmsTurnB);
            iterableDate.setDate(iterableDate.getDate()+1);
        };
        // console.log("🚀 ~ file: sym-balanceMetalurgico.js ~ line 119 ~ getAccumulated ~ arrayTms", arrayTms)
        arrayTms = arrayTms.filter(e=>e!=0)
        arrayTms = getRealData(arrayTms, false);
        arrayCu = getRealData(arrayCu, true);
        arrayPb = getRealData(arrayPb, true);
        arrayZn = getRealData(arrayZn, true);
        arrayAg = getRealData(arrayAg, true);

        return {'tms': arrayTms, 'CU': arrayCu, 'PB': arrayPb, 'ZN': arrayZn, 'AG': arrayAg};
    };

    const fillObject = (labelHead, array, index, decimal) => {
        return new objectRow(labelHead, array.tms[index], array.CU[index], array.PB[index], array.ZN[index], array.AG[index], decimal);
    };
    
    symbolVis.prototype.init = function(scope, elem, timeProvider) {
            console.log('[+] Chungarcito');
            this.onDataUpdate = myCustomDataUpdateFunction;
            this.onConfigChange = myCustomConfigurationChangeFunction;

            var syContElement1 = elem.find('#container')[0];
            var newUniqueIDString1 = "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
            syContElement1.id = newUniqueIDString1;

            function myCustomDataUpdateFunction(data) {
                console.log(" ~ file: sym-balanceMetalurgico.js ~ line 142 ~ myCustomDataUpdateFunction ~ data", data)

                if (data) {
                    
                    $('#' + syContElement1.id).empty();

                    const tonelajeA = data.Data[0];
                    const tonelajeB = data.Data[1];
                    const endDate = findEndDate(tonelajeA.Values.at(-1).Time, tonelajeB.Values.at(-1).Time);
                    const cuTurnA = data.Data[6];
                    const cuTurnB = data.Data[7];
                    const pbTurnA = data.Data[2];
                    const pbTurnB = data.Data[3];
                    const znTurnA = data.Data[4];
                    const znTurnB = data.Data[5];
                    const agTurnA = data.Data[8];
                    const agTurnB = data.Data[9];
                    const heads = getAccumulated(tonelajeA, tonelajeB, cuTurnA, cuTurnB, pbTurnA, pbTurnB, znTurnA, znTurnB, agTurnA, agTurnB, timeProvider);
                    // console.log("🚀 ~ file: sym-balanceMetalurgico.js ~ line 160 ~ myCustomDataUpdateFunction ~ heads", heads)

                    const tmsBulkA = data.Data[16];
                    const tmsBulkB = data.Data[17];
                    const bulkCUA = data.Data[20];
                    const bulkCUB = data.Data[21];
                    const bulkPBA = data.Data[18];
                    const bulkPBB = data.Data[19];
                    const bulkZincA = data.Data[36];
                    const bulkZincB = data.Data[37];
                    const bulkAGA = data.Data[22];
                    const bulkAGB = data.Data[23];
                    const bulks = getAccumulated(tmsBulkA, tmsBulkB, bulkCUA, bulkCUB, bulkPBA, bulkPBB, bulkZincA, bulkZincB, bulkAGA, bulkAGB, timeProvider); 
                    
                    const tmsZnA = data.Data[10];
                    const tmsZnB = data.Data[11];
                    const znCuA = data.Data[40];
                    const znCuB = data.Data[41];
                    const znPbA = data.Data[38];
                    const znPbB = data.Data[39];
                    const zincZnA = data.Data[12];
                    const zincZnB = data.Data[13];
                    const znAgA = data.Data[14];
                    const znAgB = data.Data[15];
                    const zincs = getAccumulated(tmsZnA, tmsZnB, znCuA, znCuB, znPbA, znPbB, zincZnA, zincZnB, znAgA, znAgB, timeProvider);
                    
                    const tmsRelaveA = data.Data[24];
                    const tmsRelaveB = data.Data[25];
                    const relaveCUA = data.Data[30];
                    const relaveCUB = data.Data[31];
                    const relavePBA = data.Data[26];
                    const relavePBB = data.Data[27];
                    const relaveZNA = data.Data[28];
                    const relaveZNB = data.Data[29];
                    const relaveAGA = data.Data[32];
                    const relaveAGB = data.Data[33];
                    const relaves = getAccumulated(tmsRelaveA, tmsRelaveB, relaveCUA, relaveCUB, relavePBA, relavePBB, relaveZNA, relaveZNB, relaveAGA, relaveAGB ,timeProvider);
                    
                    const labels = ['Animon', 'TMS', '%Cu', '%Pb', '%Zn', 'ozAg/T'];
                    const dCobre = fillObject('Cabeza', heads, 0, 2);
                    const dBulk = fillObject('Bulk', bulks, 0, 2);
                    const dZinc = fillObject('Zinc', zincs, 0, 2);
                    const dRealve =  fillObject('Relave', relaves ,0 ,2);

                    const mCobre = fillObject('Cabeza', heads, 1, 2);
                    const mBulk = fillObject('Bulk', bulks, 1, 2);
                    const mZinc = fillObject('Zinc', zincs, 1, 2);
                    const mRealve =  fillObject('Relave', relaves , 1, 2);

                    createTable(labels, dCobre.arObject, dBulk.arObject, dZinc.arObject, dRealve.arObject, mCobre.arObject, mBulk.arObject, mZinc.arObject, mRealve.arObject);
                };
            };

            function createTable(labels, dCobre, dBulk, dZinc, dRealve, mCobre, mBulk, mZinc, mRealve){
            
                let headersRow = syContElement1.insertRow(-1);
                headersRow.className = "myCustomRowClass";
    
                const separatorDRow = ['Diario', '', '', '','',''];
                const separatorMRow = ['Mensual', '', '', '','',''];

                insertRows(labels, headersRow, 'myCustomCellClass myCustomHeaderCellClass');
                
                insertRows(separatorDRow, headersRow, 'myCustomCellClass myCustomSecondHeaderCellClass');
                insertRows(dCobre, headersRow, 'myCustomCellClass myCustomValueCellClass');
                insertRows(dBulk, headersRow, 'myCustomCellClass myCustomValueCellClass');
                insertRows(dZinc, headersRow, 'myCustomCellClass myCustomValueCellClass');
                insertRows(dRealve, headersRow, 'myCustomCellClass myCustomValueCellClass');

                insertRows(separatorMRow, headersRow, 'myCustomCellClass myCustomSecondHeaderCellClass');
                insertRows(mCobre, headersRow, 'myCustomCellClass myCustomValueCellClass');
                insertRows(mBulk, headersRow, 'myCustomCellClass myCustomValueCellClass');
                insertRows(mZinc, headersRow, 'myCustomCellClass myCustomValueCellClass');
                insertRows(mRealve, headersRow, 'myCustomCellClass myCustomValueCellClass');
            };
    
            function insertRows(rowToPut, cellulla, classToPut){
                cellulla = syContElement1.insertRow(-1);
                cellulla.className = 'myCustomCellClass myCustomRowClass';
                
                for(let indexRow = 0; indexRow<rowToPut.length;indexRow++){
                    let rowCellulla = cellulla.insertCell(-1);
                    rowCellulla.innerHTML = `<b>${rowToPut[indexRow]}</b>`;
                    rowCellulla.className = classToPut;
                }
            };

            function myCustomConfigurationChangeFunction(data) {
                document.getElementById(syContElement1.id).style.border = "3px solid " + scope.config.outsideBorderColor;
                document.getElementById(syContElement1.id).style.borderRadius = "20%";
                if (scope.config.showTimestampCheckboxValue) {
                    scope.config.showTimestampCheckboxStyle = "table-cell";
                } else {
                    scope.config.showTimestampCheckboxStyle = "none";
                }
                if (scope.config.showDataItemNameCheckboxValue) {
                    scope.config.showDataItemNameCheckboxStyle = "table-cell";
                } else {
                    scope.config.showDataItemNameCheckboxStyle = "none";
                }
            };
        }
    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);