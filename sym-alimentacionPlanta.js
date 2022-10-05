(function(CS) {
    
    var myCustomSymbolDefinition = {
        typeName: 'alimentacionPlanta',
        displayName: 'Alimentación Planta',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        inject: ['timeProvider'],
        supportsCollections: true,
        supportsDynamicSearchCriteria: true,
        
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 300,
                Width: 400,
                Intervals: 1000,
                Mode: 'Compressed',
                showDataItemNameCheckboxValue: true,
                showHeaderRightCheckboxValue: true,
                showDataItemNameCheckboxStyle: "table-cell",
                showTimestampCheckboxStyle: "table-cell",
                numberOfDecimalPlaces: 0,
                dataItemColumnColor: "black",
                headerRightTextColor: "black",
		        headerRightColumnColor: "white",
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
    symbolVis.prototype.init = function(scope, elem, timeProvider) {
            
            this.onDataUpdate = myCustomDataUpdateFunction;
            this.onConfigChange = myCustomConfigurationChangeFunction;
            console.log('\t[+]Food Plant Loaded');
            var syContElement1 = elem.find('#container')[0];
            var newUniqueIDString1 = "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
            syContElement1.id = newUniqueIDString1;
            

            function myCustomDataUpdateFunction(data) {
                if (data) {
                    
                    $('#' + syContElement1.id).empty();
                     
                    let zeroHeaders = ['Ruta', 'Tickets A','Tickets B','Tot. Tickets', ' P. Neto TCH A', 'P. Neto TCH B', ' Tot. TCH','P. Neto TCS' ];
                    
                    let ruteSCPVIC = ['SCR -> P.VIC'];
                    ruteSCPVIC = dataToPush(ruteSCPVIC, data, 0, 7);

                    let ruteSCAND = ['SCR -> P.AND'] ;
                    ruteSCAND = dataToPush(ruteSCAND, data, 7, 14);
                    
                    let subTotalSC = [];
                    subTotalSC = getTotalData(subTotalSC, ruteSCPVIC, ruteSCAND);

                    let ruteCARPVIC = ['CAR -> P.VIC'];
                    ruteCARPVIC = dataToPush(ruteCARPVIC, data, 14, 21);
                    
                    let ruteCARAND = ['CAR -> P.AND'];
                    ruteCARAND = dataToPush(ruteCARAND, data, 21, 28);
                    
                    let subTotalCAR = [];
                    subTotalCAR = getTotalData(subTotalCAR, ruteCARPVIC, ruteCARAND);

                    let totalMINE = [];
                    totalMINE = getTotalData(totalMINE, subTotalSC, subTotalCAR);

 
                    let headersRow = syContElement1.insertRow(-1);
                    
                    generatedRow( 'UNIDAD MINERA', headersRow ,zeroHeaders, 'headerAPCellClass cellAPClass', 'center', true);
                    
                    generatedRow('San Cristóbal', headersRow , ruteSCPVIC, 'cellAPClass myValueCellClass', 'center', false);
                    generatedRow('San Cristóbal', headersRow , ruteSCAND, 'cellAPClass myValueCellClass', 'center', false);
                    generatedRow('Sub-Total', headersRow, subTotalSC, 'myCustomRightHeaderCellClass cellAPClass myValueCellClass', 'center', true);
                    
                    generatedRow('Carahuacra', headersRow , ruteCARPVIC, 'cellAPClass myValueCellClass', 'center', false);
                    generatedRow('Carahuacra', headersRow , ruteCARAND, 'cellAPClass myValueCellClass', 'center', false);
                    generatedRow('Sub-Total', headersRow, subTotalCAR, 'myCustomRightHeaderCellClass cellAPClass myValueCellClass', 'center', true);

                    generatedRow('Total de Mina', headersRow, totalMINE, 'myCustomRightHeaderCellClass cellAPClass myValueCellClass', 'center', true);
                   
                }
                   
            }

            function getTotalData(totalOfArrays , arrayUnitOne , arrayUnitTwo){
                totalOfArrays.push('+');
                for(let index = 1 ; index < arrayUnitOne.length; index++){
                    index == 3|| index ==6 || index == 7 ?  
                    totalOfArrays.push((parseFloat(arrayUnitOne[index])+parseFloat(arrayUnitTwo[index])).toFixed(scope.config.numberOfDecimalPlaces)):
                    totalOfArrays.push(' ');
                };
                return totalOfArrays;
            }

            function dataToPush(arrayColector,data, indexMin, indexMax){
                
                for(let selector = indexMin; selector < indexMax; selector++){
                    arrayColector.push(parseFloat((data.Data[selector].Values[data.Data[selector].Values.length-1].Value).replace(',','')).toFixed(scope.config.numberOfDecimalPlaces));
                }
                return arrayColector;
            };

            function generatedRow(firstElement, insertRow, dataArray, nameClass, align, isHeader){
                
                insertRow = syContElement1.insertRow(-1);
               
                let newCell = insertRow.insertCell(-1);
                newCell.innerHTML = firstElement;
                newCell.className = "headerAPCellClass"
                isHeader ? insertRow.className = "headerAPCellClass  cellAPClass" : insertRow.className = "rowAPClass cellAPClass myValueCellClass";
                
                return dataArray.forEach( filasItemCell => {
                    let newRowsInsert = insertRow.insertCell(-1);
                    newRowsInsert.innerHTML= filasItemCell;
                    newRowsInsert.className = nameClass;
                    newRowsInsert.style.textAlign = align;
                });
            }

            function myCustomConfigurationChangeFunction(data) {
                document.getElementById(syContElement1.id).style.border = "3px solid " + scope.config.outsideBorderColor;
                if (scope.config.showHeaderRightCheckboxValue) {
                    scope.config.showHeaderRightCheckboxStyle = "table-cell";
                } else {
                    scope.config.showHeaderRightCheckboxStyle = "none";
                }
                if (scope.config.showDataItemNameCheckboxValue) {
                    scope.config.showDataItemNameCheckboxStyle = "table-cell";
                } else {
                    scope.config.showDataItemNameCheckboxStyle = "none";
                }
            }
        }
    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);