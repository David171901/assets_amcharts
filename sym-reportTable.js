(function(CS) {
    	
    var myCustomSymbolDefinition = {
        typeName: 'reportTable',
        displayName: 'Tabla de Reporte',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
       
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 1000,
                Width: 1000,
                Intervals: 1000,
                showRTableDataItemNameCheckboxValue: true,
                showRTableDataItemNameCheckboxStyle: "table-cell",
                numberOfDecimalPlaces: 2,
                FormatType: null,
                dataRTableItemColumnColor: "cyan",
                valueRTableColumnColor: "lightgreen",
                hoverRTableColor: "yellow",
                evenRTableRowColor: "darkgray",
                oddRTableRowColor: "white",
                totalRTableColumnColor: "lightcyan",
                outsideRTableBorderColor: "none",
                headerRTableBackgroundColor: "cyan",
                headerRTableTextColor: "black"
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
    symbolVis.prototype.init = function(scope, elem) {
        console.log('\t[+] Tabla de Reporte loaded');
        scope.config.FormatType = null;
        scope.unit = {mine: '', turn:''};
        
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;

        var symbolContainerElement = elem.find('#container')[0];
        var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
            
        symbolContainerElement.id = newUniqueIDString;
        let isFirstLoad = true;
        let headersTable = ['UNIDAD','GUARDIA','ENCARGADO', 'FLOTA', 'EQUIPO', 'ULTIMA UBICACION', 'OBSERVACION', 'DM%', 'UT%', 'HRS OPER'];
        
            
        function myCustomDataUpdateFunction(data) {
            if (data) {
                isFirstLoad ? getArmTable(data, symbolContainerElement, null, null) : refresh(data, symbolContainerElement);
                isFirstLoad = false;
            }            
        }

        function refresh(data, symbolContainerElement){   
            let uMine = scope.unit.mine ? scope.unit.mine : null;
            let uTurn = scope.unit.turn ? scope.unit.turn : null;
            getArmTable(data, symbolContainerElement, uMine, uTurn);            
        }

        function getArmTable( data, symbolContainerElement, mine, turn){
            $('#' + symbolContainerElement.id).empty();

            let rowValuesToPush = [];
            
            let headersRow = symbolContainerElement.insertRow(-1);
            headersRow.className = "reportTableRowClass";

            headersTable.forEach( element => {
                let rowHeaderCell = headersRow.insertCell(-1);
                rowHeaderCell.innerHTML = `<b>${element}</b>`;
                rowHeaderCell.className = "reportTableCellClass reportTableHeaderCellClass";
            });

            data.Data.forEach(element => {
                element.Values.forEach( daValue =>{
                let arrayToPush = generateObject(daValue.Value, mine, turn);
                arrayToPush ? rowValuesToPush.push(arrayToPush) : null;
                });
            });

            rowValuesToPush.sort();

            let personCharge = depuratedValueEquals(rowValuesToPush, 2);
            let fleetCrew = depuratedValueEquals(rowValuesToPush, 3);
            
           rowValuesToPush = filterToProcess(rowValuesToPush, personCharge, fleetCrew);
            
            rowValuesToPush.forEach( dataOfEquipment =>{
                let newRowe = symbolContainerElement.insertRow(-1);
                newRowe.className = "reportTableRowClass reportTableCellClass";
                            
                dataOfEquipment.forEach(value => {
                    let valueRow = newRowe.insertCell(-1);
                    valueRow.innerHTML=`<b>${value}</b>`;
                    if(dataOfEquipment[0] == "+") valueRow.className = "reportTableCellClass reportTotalClass" ;
                    else valueRow.className = "reportTableCellClass reportTableValueCellClass";
                });          
            });
        }

        function filterToProcess(rowValuesToPush, personCharge, fleetCrew){
            
            let rowsTotalToPush = [];
            
            personCharge.forEach(person =>{
                fleetCrew.forEach(fleet =>{
                    let depuredRowsToProcess = [];
                    depuredRowsToProcess = rowValuesToPush.filter(gotRow => gotRow[2] == person && gotRow[3] == fleet) ? rowValuesToPush.filter(gotRow => gotRow[2] == person && gotRow[3] == fleet): null;
                    
                    if(depuredRowsToProcess){
                        
                        let dispMeca = null;
                        let utTotal = null;
                        let hOperativa = null;
                       
                        for(indexRow = 0; indexRow < depuredRowsToProcess.length; indexRow++){
                            dispMeca +=  parseFloat(depuredRowsToProcess[indexRow][7]);
                            utTotal += parseFloat(depuredRowsToProcess[indexRow][8]);
                            hOperativa += parseFloat(depuredRowsToProcess[indexRow][9]);
                        }
                        
                        dispMeca = dispMeca != null ?  (dispMeca / depuredRowsToProcess.length).toFixed(scope.config.numberOfDecimalPlaces) : null;
                        utTotal = utTotal != null ? (utTotal / depuredRowsToProcess.length).toFixed(scope.config.numberOfDecimalPlaces) : null;
                        hOperativa = hOperativa != null  ? hOperativa.toFixed(scope.config.numberOfDecimalPlaces) : null; 
    
                        let totalArray = [];

                        hOperativa != null ? totalArray.push("+","TOTAL", person, fleet,"","","" ,dispMeca, utTotal, hOperativa) : null ;
                        
                        depuredRowsToProcess.forEach(rows => {
                            rowsTotalToPush.push(rows);
                        });
                        
                        rowsTotalToPush.push(totalArray);
                            
                    }
                });
            });
            return rowsTotalToPush;
        } 

        function depuratedValueEquals( dataFromCatchData, rowPositionData){
            let objectDepurator = {};
            let catchDepuredData = [];
            let catchData = [];
            
            dataFromCatchData.forEach( elementValue =>{
                catchData.push(elementValue[rowPositionData]);
            });
            
            catchData.forEach(dataToDepure => !(dataToDepure in objectDepurator) && (objectDepurator[dataToDepure] = true) && (dataToDepure && dataToDepure!= " ") && catchDepuredData.push(dataToDepure));
            return catchDepuredData;
        }

        function generateObject( stringElement, uMine , uTurn){
            let mine = stringElement.split('||')[0];
            let turn = stringElement.split('||')[2];
            
            if(uMine != null){
                if(uMine == mine){
                    if(uTurn != null){
                        if(uTurn == turn) return returnObject( stringElement, mine , turn);
                    }else return returnObject( stringElement, mine , turn);
                } 
            }
            else return returnObject( stringElement, mine , turn);
        }
        
        function returnObject( stringElement, mine , turn){
            return [
                mine,
                turn,
                stringElement.split('||')[5],
                stringElement.split('||')[6],
                stringElement.split('||')[7],
                stringElement.split('||')[10],
                stringElement.split('||')[12],
                parseFloat(stringElement.split('||')[25]).toFixed(scope.config.numberOfDecimalPlaces), 
                parseFloat(stringElement.split('||')[26]).toFixed(scope.config.numberOfDecimalPlaces),
                parseFloat(stringElement.split('||')[23]).toFixed(scope.config.numberOfDecimalPlaces) 
            ]
        }

        function myCustomConfigurationChangeFunction() {     
            document.getElementById(symbolContainerElement.id).style.border = "3px solid " + scope.config.outsideRTableBorderColor;
            document.getElementById(symbolContainerElement.id).style.borderRadius = "5em";
            
            if (scope.config.showRTableDataItemNameCheckboxValue) scope.config.showRTableDataItemNameCheckboxStyle = "table-cell";
            else scope.config.showRTableDataItemNameCheckboxStyle = "none";
        }
    }
        
    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);