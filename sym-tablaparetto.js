(function(CS) {
    
    var myCustomSymbolDefinition = {
        typeName: 'tablaparetto',
        displayName: 'Tabla Paretto',
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
                subheaderBackgroundColor: "#50555A",
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
            console.log('\t[+]Table Paretto');
            var syContElement1 = elem.find('#container')[0];
            var newUniqueIDString1 = "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
            syContElement1.id = newUniqueIDString1;
            

            function myCustomDataUpdateFunction(data) {
                
                let dataFormat = data.Data[0].Values
        
                let arrayData = [...new Set(dataFormat.map(el => el.Value.split('||')[0])) ].map(element => Object({
                        Label: element,
                        Incidents: dataFormat.map(elem => elem.Value).filter(el => el.includes(element)), 
                    })
                ).map(element => Object({
                        ...element,
                        Incidents: [...new Set(element.Incidents.map(el=> `${el}`.split('||')[1]))] 
                    })
                ).map(element => Object({
                        ...element,
                        Values: element.Incidents.map(elemt => Object({
                            Incidents: elemt,
                            Count: dataFormat.filter(el => (el.Value.includes(`${element.Label}||${elemt}`))).length,
                            Time: dataFormat.filter(el => (el.Value.includes(`${element.Label}||${elemt}`))).reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.Value.split('||')[2]),0)
                        }))
                    })
                ).map(element => Object({
                    ...element,
                    Values: element.Incidents.map(el=> Object({
                        Value: `${el}||${element.Values.filter(elem => elem.Incidents == el)[0].Count}||${element.Values.filter(elem => elem.Incidents == el)[0].Time}`,
                    })),
                    Time: new Date().toLocaleString()
                }))
        
                let data_ = {
                    Data: arrayData,
                    SymbolName: "Symbol1"
                }
                console.log(" ~ file: sym-tablaparetto.js ~ line 94 ~ myCustomDataUpdateFunction ~ data_", data_)

                if (data) {
                    
                    $('#' + syContElement1.id).empty();
                     
                    let zeroHeaders = ['Subtipo de Falla', 'Cantidad', 'Tiempo'];

                    let headersRow = syContElement1.insertRow(-1);
                    
                    generatedRow( 'TIPO DE FALLA', headersRow ,zeroHeaders, 'headerAPCellClass cellAPClass', 'center', true, false);

                    for (let index = 0; index < data_.Data.length; index++) {
                        generatedMultiRow(data_.Data[index].Label, headersRow , dataToPush(data_,index));
                        
                    }

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

            function dataToPush(data, index){
                data = data.Data[index].Values.sort((a,b)=> {
                    return - parseInt(a.Value.split('||')[2]) + parseInt(b.Value.split('||')[2])
                })
                return data.map(element => [element.Value.split('||')[0],element.Value.split('||')[1],element.Value.split('||')[2]])
            };

            function generatedRow(firstElement, insertRow, dataArray, nameClass, align, isHeader, isSubHeader){
                
                insertRow = syContElement1.insertRow(-1);
                let newCell = insertRow.insertCell(-1);
                newCell.innerHTML = firstElement;
                newCell.className = !isSubHeader ? "headerAPCellClass" : "subHeaderAPCellClass"
                 isHeader ? insertRow.className = "headerAPCellClass  cellAPClass" : insertRow.className = "rowAPClass cellAPClass myValueCellClass";
                
                return dataArray.forEach( filasItemCell => {
                    let newRowsInsert = insertRow.insertCell(-1);
                    newRowsInsert.innerHTML= filasItemCell;
                    newRowsInsert.className = nameClass;
                    newRowsInsert.style.textAlign = align;
                });
            }

            function generatedMultiRow(firstElement, insertRow, dataArray){
                dataArray.forEach( filasItemCell => {
                    generatedRow(firstElement, insertRow ,filasItemCell, 'cellAPClass myValueCellClass', 'center', false, true);
                });

                return true
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