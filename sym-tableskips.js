(function(CS) {
    
    var myCustomSymbolDefinition = {
        typeName: 'tableskips',
        displayName: 'Table Skips',
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
                fontSize: '16',
                unitFontSize: 'px'
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
            console.log('\t[+]Table Skips');
            var syContElement1 = elem.find('#container')[0];
            var newUniqueIDString1 = "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
            syContElement1.id = newUniqueIDString1;
            

            function myCustomDataUpdateFunction(data) {
                if (data) {
                    
                    $('#' + syContElement1.id).empty();
                     
                    let zeroHeaders = ['Ruta', 'Skips A','Skips B','Tot. Skips', ' P. Neto TCH A', 'P. Neto TCH B', ' Tot. TCH','P. Neto TCS' ];

                    let ruteSCAND = ['SCR -> P.AND'] ;
                    ruteSCAND = formatData(dataToPush(ruteSCAND, data, 0, 7));
                    
                    let ruteCARAND = ['CAR -> P.AND'];
                    ruteCARAND = formatData(dataToPush(ruteCARAND, data, 7, 14));

                    let totalMINE = [];
                    totalMINE = getTotalData(totalMINE, ruteSCAND, ruteCARAND);
 
                    let headersRow = syContElement1.insertRow(-1);
                    
                    generatedRow( 'UNIDAD MINERA', headersRow ,zeroHeaders, 'headerAPCellClass cellAPClass', 'center', true);
                    generatedRow('San Cristóbal', headersRow , ruteSCAND, 'cellAPClass myValueCellClass', 'center', false);
                    generatedRow('Carahuacra', headersRow , ruteCARAND, 'cellAPClass myValueCellClass', 'center', false);

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

            function formatData(arrayColector){
                arrayColector[3] =  (parseFloat(arrayColector[1]) + parseFloat(arrayColector[2])).toString();
                arrayColector[6] =  (parseFloat(arrayColector[4]) + parseFloat(arrayColector[5])).toString();
    
                return arrayColector;
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