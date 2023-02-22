(function (CS) {
  var myCustomSymbolDefinition = {
    typeName: "tableconteo",
    displayName: "Table Conteo",
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    inject: ["timeProvider"],
    supportsCollections: true,
    supportsDynamicSearchCriteria: true,

    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
        Height: 300,
        Width: 400,
        Intervals: 1000,
        Mode: "Compressed",
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
        fontSize: "16",
        unitFontSize: "px",
      };
    },
    configOptions: function () {
      return [
        {
          title: "Format Symbol",
          mode: "format",
        },
      ];
    },
  };

  function symbolVis() {}
  CS.deriveVisualizationFromBase(symbolVis);
  symbolVis.prototype.init = function (scope, elem, timeProvider) {
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    console.log("\t[+]Table Conteo");
    var syContElement1 = elem.find("#container")[0];
    var newUniqueIDString1 =
      "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
    syContElement1.id = newUniqueIDString1;

    function myCustomDataUpdateFunction(data) {
      if (data) {
        console.log(" ~ file: sym-tableconteo.js:61 ~ myCustomDataUpdateFunction ~ data:", data)
        let url = obtenerURL();
        let urlChungar = "https://pivision.volcan.com.pe/PIVision/#/Displays/50644/RENDIMIENTO-PLANTA-CHUNGAR";
        // Datos iniciales
        let dataDryTons = (url == urlChungar) ? formatTwoArraysInOne(data.Data[0],data.Data[1]).Values : data.Data[0].Values;
        if (url != urlChungar) {
          dataDryTons.shift();
          dataDryTons.shift();
        }
        dataDryTons = dataDryTons.filter((el) => el.Value != 0);
        dataDryTons = dataDryTons.map((el) => el.Value.replace(",", ""));
        let dataTargetUp = (url == urlChungar) ? 5047 : 5623; // data.Data[1].Values[0].Value
        let dataTargetDown = (url == urlChungar) ? 4753 : 5296; // data.Data[2].Values[0].Value

        let dataDryTonsUp = dataDryTons.filter((el) => el > dataTargetUp);
        let dataDryTonsDown = dataDryTons.filter((el) => el < dataTargetDown && el > 100);
        let dataDryTonsRegular = dataDryTons.filter(
          (el) => el > dataTargetDown && el < dataTargetUp
        );

        let cellA1 = dataDryTonsUp.length;
        let cellA2 = dataDryTonsRegular.length;
        let cellA3 = dataDryTonsDown.length;
        let cellB1 = dataDryTonsUp.reduce(
          (accumulator, currentValue, currentIndex, array) =>
            (parseFloat(accumulator) + parseFloat(currentValue)),
          0
        )  / dataDryTonsUp.length;
        if(isNaN(cellB1)) cellB1 = 0;
        let cellB2 = dataDryTonsRegular.reduce(
          (accumulator, currentValue, currentIndex, array) =>
            (parseFloat(accumulator) + parseFloat(currentValue)), 
          0
        )/ dataDryTonsRegular.length;
        if(isNaN(cellB2)) cellB2 = 0;
        let cellB3 = dataDryTonsDown.reduce(
          (accumulator, currentValue, currentIndex, array) =>
            (parseFloat(accumulator) + parseFloat(currentValue)),
          0
        ) / dataDryTonsDown.length;
        if(isNaN(cellB3)) cellB3 = 0;
        let cellC1 = cellB1 - cellB2;
        if(cellC1 < 0) cellC1 = 0;
        let cellC2 = 0;
        let cellC3 = cellB2 - cellB3;

        let cellB4 = cellC3 * cellA3 - cellC1 * cellA1;

        $("#" + syContElement1.id).empty();

        let zeroHeaders = ["Dias", "Prom. TMS", "Diferencia"]; //,Columnas;

        let row1 = [cellA1.toFixed(0), cellB1.toFixed(scope.config.numberOfDecimalPlaces), cellC1.toFixed(scope.config.numberOfDecimalPlaces)];
        let row2 = [cellA2.toFixed(0), cellB2.toFixed(scope.config.numberOfDecimalPlaces), cellC2.toFixed(scope.config.numberOfDecimalPlaces)];
        let row3 = [cellA3.toFixed(0), cellB3.toFixed(scope.config.numberOfDecimalPlaces), cellC3.toFixed(scope.config.numberOfDecimalPlaces)];
        let row4 = ["", cellB4.toFixed(scope.config.numberOfDecimalPlaces), ""];

        //     let totalMINE = [];
        //     totalMINE = getTotalData(totalMINE, ruteSCAND, ruteCARAND);

        let headersRow = syContElement1.insertRow(-1);

        generatedRow(
          "Comportamiento",
          headersRow,
          zeroHeaders,
          "headerAPCellClass cellAPClass",
          "center",
          true
        );
        generatedRow(
          "Por encima del Limite esperado",
          headersRow,
          row1,
          "myValueCellClass",
          false
        ); // 'center', false);// 'cellAPClass myValueCellClass', 'center', false);
        generatedRow(
          "Dentro del Limite esperado",
          headersRow,
          row2,
          "myValueCellClass",
          false
        ); // 'cellAPClass myValueCellClass', 'center', false);
        generatedRow(
          "Por debajo del Limite esperado",
          headersRow,
          row3,
          "myValueCellClass",
          false
        ); 
        generatedRow(
            "Se dejo de producir (TMS)",
            headersRow,
            row4,
            "myValueCellClass",
            false
          );
        // 'cellAPClass myValueCellClass', 'center', false);
        //    // generatedRow('Total', headersRow, totalMINE, 'myCustomRightHeaderCellClass cellAPClass myValueCellClass', 'center', true);
      }
    }

    function formatTwoArraysInOne (value1, value2) {
      // value1 Estatico
      // value2 Real
      let lastValue2 = value2.Values.at(-1);
      return {
        ...value1,
        Values: [...value1.Values, lastValue2]
      }
    }

    function obtenerURL() {
      var url = window.location.href;
      return url;
    }

    function getTotalData(totalOfArrays, arrayUnitOne, arrayUnitTwo) {
      for (let index = 0; index < arrayUnitOne.length; index++) {
        totalOfArrays.push(
          (
            parseFloat(arrayUnitOne[index]) + parseFloat(arrayUnitTwo[index])
          ).toFixed(scope.config.numberOfDecimalPlaces)
        );
      }
      return totalOfArrays;
    }

    function dataToPush(arrayColector, data, indexMin, indexMax) {
      for (let selector = indexMin; selector < indexMax; selector++) {
        arrayColector.push(
          parseFloat(
            data.Data[selector].Values[
              data.Data[selector].Values.length - 1
            ].Value.replace(",", "")
          ).toFixed(scope.config.numberOfDecimalPlaces)
        );
      }
      return arrayColector;
    }

    function generatedRow(
      firstElement,
      insertRow,
      dataArray,
      nameClass,
      align,
      isHeader
    ) {
      insertRow = syContElement1.insertRow(-1);
      let newCell = insertRow.insertCell(-1);
      newCell.innerHTML = firstElement;
      newCell.className = "headerAPCellClass";
      isHeader
        ? (insertRow.className = "headerAPCellClass  cellAPClass")
        : (insertRow.className = "rowAPClass cellAPClass myValueCellClass");

      return dataArray.forEach((filasItemCell) => {
        let newRowsInsert = insertRow.insertCell(-1);
        newRowsInsert.innerHTML = filasItemCell;
        newRowsInsert.className = nameClass;
        newRowsInsert.style.textAlign = align;
      });
    }

    function myCustomConfigurationChangeFunction(data) {
      document.getElementById(syContElement1.id).style.border =
        "3px solid " + scope.config.outsideBorderColor;
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
  };
  CS.symbolCatalog.register(myCustomSymbolDefinition);
})(window.PIVisualization);
