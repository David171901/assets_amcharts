(function(CS) {
    	
    var myCustomSymbolDefinition = {
        typeName: 'genericTable',
        displayName: 'generic Table',
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

    class objectRow {
        constructor(header, budget, real, mbgt, mReal, decimal){
            this.header = header;
            this.budget = parseFloat(budget).toFixed(decimal);
            this.real = parseFloat(real).toFixed(decimal);
            this.varRB = parseFloat(this.real - this.budget).toFixed(decimal);
            this.toDo = this.budget != 0 ? parseFloat(this.real/this.budget*100).toFixed(1) : 0;

            this.mbgt = parseFloat(mbgt).toFixed(decimal);
            this.mReal = parseFloat(mReal).toFixed(decimal);
            this.varMrb = parseFloat(this.mReal - this.mbgt).toFixed(decimal);
            this.toMdo = this.mbgt != 0 ? parseFloat(this.mReal/this.mbgt*100).toFixed(1) : 0;
        };

        get arObject(){
            return [this.header, this.budget, this.real, this.varRB, this.toDo,
            this.mbgt, this.mReal, this.varMrb, this.toMdo];
        };
    };

    const getValue = (element) => {
        const value = isNaN(element.Values.at(-1).Value) ? 0 : element.Values.at(-1).Value;
        return value;
    };

    const getLabels = (data) => {
        let arrayLabels = [];
        for (let i = 0; i < data.Data.length-1; i++) {
            const auxLabel = data.Data[i].Label.split('|')[1].split('-')[0];
            arrayLabels.push(auxLabel);
        };
        return arrayLabels;
    };

    const preparedFillObject = (labelsHeads, data, decimal) => {
        let arrayObjects = []
        for (let index = 0 ; index < data.length-1; index+=4) { 
            const obj = fillObject(labelsHeads[index], data, index, decimal);
            arrayObjects.push(obj.arObject);
        };
        return arrayObjects;
    };

    const fillObject = (label, data, index, decimal) => {
        const bgt = getValue(data[index]);
        const real = getValue(data[index+1]);
        const mbgt = getValue(data[index+2]);
        const mreal = getValue(data[index+3]);
        return new objectRow (label, bgt, real, mbgt, mreal, decimal);
    };

    symbolVis.prototype.init = function(scope, elem) {
        console.log('[+] Tabla genérica loaded');
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.config.FormatType = null;
        var symbolContainerElement = elem.find('#container')[0];
        var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        var isfirstLoad = true;
        var labelsHeads = null;
        symbolContainerElement.id = newUniqueIDString;
            
        function myCustomDataUpdateFunction(data) {
            
            if (isfirstLoad){
                labelsHeads = getLabels(data);
                isfirstLoad = false;
            };
            
            if (data.Data) {
                $('#' + symbolContainerElement.id).empty();
                const dataToLoad = preparedFillObject(labelsHeads, data.Data, 1);
                const headTitle = data.Data.at(-1).Values[0].Value;
                const labels = [headTitle, 'Bgt', 'Real', 'Var Bgt/Real', 'Cumplimiento', 'bgt', 'Real', 'Var Bgt/real', 'Cumplimiento'];
                createTable(labels, dataToLoad);
            };
        };

        function createTable(labels, arrayObjt){
            let headersRow = symbolContainerElement.insertRow(-1);
            headersRow.className = "balMetalRowClass";
            insertRows(labels, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            arrayObjt.forEach( element => {
                insertRows(element, headersRow, 'balMetalCellClass balMetalValueCellClass')
            });
        };

        function insertRows(rowToPut, cellulla, classToPut){
            cellulla = symbolContainerElement.insertRow(-1);
            cellulla.className = 'balMetalCellClass balMetalRowClass';
            
            for(let indexRow = 0; indexRow<rowToPut.length; indexRow++){
                let rowCellulla = cellulla.insertCell(-1);
                rowCellulla.innerHTML = `<b>${rowToPut[indexRow]}</b>`;
                rowCellulla.className = classToPut;
                
                if(indexRow == 3 || indexRow == 7){
                    if(rowToPut[indexRow]<=0) rowCellulla.className += ' balMetalNegative';
                    else  rowCellulla.className += ' balMetalPositive';
                } 

                if(indexRow == rowToPut.length-1 || indexRow == 4 ){
                    if(rowToPut[indexRow] > 100) rowCellulla.className += ' balMCien';
                    else {if (rowToPut[indexRow] >= 90) rowCellulla.className += ' balMNoventa';
                          else rowCellulla.className += ' balMOchenta'}

                }
            };
        };

           
        function myCustomConfigurationChangeFunction(data) {
                
            document.getElementById(symbolContainerElement.id).style.border = "3px solid " + scope.config.outsideBorderColor;
            document.getElementById(symbolContainerElement.id).style.borderRadius = "2em";
                
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
          		
    };

 
    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);