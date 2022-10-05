(function (BS) {
    //'use strict';

    function symbolVis() { }
    BS.deriveVisualizationFromBase(symbolVis);

    var defintion = {
        typeName: 'gaugeliquid',
        displayName: 'Gauge Liquid',
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/comm.png',
        datasourceBehavior: BS.Extensibility.Enums.DatasourceBehaviors.Single,
        visObjectType: symbolVis,

        getDefaultConfig: function () {
            return {
                DataShape: 'Gauge',
                Height: 150,
                Width: 150,
                showValues: true,
                decimalPlaces: 1,
                showTitle: false,
                useCustomTitle: false,                
                titleColor: "#000000",
                textColor: "#091D3A",
                circleColor: "#6ED0F5",
                waveColor: "#6ED0F5",
                lowerLimit: 0,
                upperLimit: 100,
                units: "",
            };
        },
        configOptions: function () {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        }
    };

    symbolVis.prototype.init = function (scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = resize;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        scope.scale = 1;
        scope.config.units = "";
        var config = liquidFillGaugeDefaultSettings();
        var svgContainer = elem.find('svg')[0];
        var newUniqueIDString = "amChart_" + scope.symbol.Name;
        svgContainer.id = newUniqueIDString;

        var gauge = loadLiquidFillGauge(newUniqueIDString, 0, config);
        var cachedIndicator = 0;

        function dataUpdate(data) {
            if (data) {
                if (scope.config.units == "" && data.Units) scope.config.units = data.Units;
                gauge.update(parseFloat((""+data.Value).replace(",", ".")));
                console.log('Data pure ', data.Value);
                console.log('Data ', parseFloat(data.Value));
                console.log('cached data ', data.Indicator);
                cachedIndicator = parseFloat((""+data.Value).replace(",", "."));
            }
        }

        function resize(width, height) {
            scope.scale = Math.min(width / 150, height / 150);
            d3.select('#' + newUniqueIDString).selectAll('*').remove();
            gauge = loadLiquidFillGauge(newUniqueIDString, cachedIndicator, config);
        }

        function myCustomConfigurationChangeFunction() {
            if (gauge) {
                d3.select('#' + newUniqueIDString).selectAll('*').remove();
                gauge = loadLiquidFillGauge(newUniqueIDString, cachedIndicator, liquidFillGaugeDefaultSettings());
            }
        }

        function liquidFillGaugeDefaultSettings() {
            return {
                minValue: scope.config.lowerLimit,
                maxValue: scope.config.upperLimit,
                circleThickness: 0.05,
                circleFillGap: 0.05,
                circleColor: scope.config.circleColor,
                waveHeight: 0.05,
                waveCount: 1,
                waveRiseTime: 1000,
                waveAnimateTime: 18000,
                waveRise: true,
                waveHeightScaling: true,
                waveAnimate: true,
                waveColor: scope.config.waveColor,
                waveOffset: 0,
                textVertPosition: .5,
                textSize: 1,
                valueCountUp: true,
                displayPercent: true,
                textColor: scope.config.textColor,
                waveTextColor: "#FFFFFF"
            };
        }

        function loadLiquidFillGauge(elementId, value, config) {
            if (config == null) config = liquidFillGaugeDefaultSettings();
            var gauge = d3.select("#" + elementId);
            var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height"))) / 2;
            var locationX = parseInt(gauge.style("width")) / 2 - radius;
            var locationY = parseInt(gauge.style("height")) / 2 - radius;
            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

            var waveHeightScale;
            if (config.waveHeightScaling) {
                waveHeightScale = d3.scale.linear()
                    .range([0, config.waveHeight, 0])
                    .domain([0, 50, 100]);
            } else {
                waveHeightScale = d3.scale.linear()
                    .range([config.waveHeight, config.waveHeight])
                    .domain([0, 100]);
            }

            var textPixels = (config.textSize * radius / 2);
            var textFinalValue = parseFloat(value).toFixed(scope.config.decimalPlaces);
            var textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
            var percentText = config.displayPercent ? scope.config.units : "";
            var circleThickness = config.circleThickness * radius;
            var circleFillGap = config.circleFillGap * radius;
            var fillCircleMargin = circleThickness + circleFillGap;
            var fillCircleRadius = radius - fillCircleMargin;
            var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
            var waveLength = fillCircleRadius * 2 / config.waveCount;
            var waveClipCount = 1 + config.waveCount;
            var waveClipWidth = waveLength * waveClipCount;

            // Rounding functions so that the correct number of decimal places is always displayed as the value counts up
            var textRounder = function (value) { return parseFloat(value).toFixed(scope.config.decimalPlaces) };

            // Data for building the clip wave area
            var data = [];
            for (var i = 0; i <= 40 * waveClipCount; i++) {
                data.push({
                    x: i / (40 * waveClipCount), y: (i / (40))
                });
            }
            // Scales for drawing the outer circle
            var gaugeCircleX = d3.scale.linear()
                .range([0, 2 * Math.PI])
                .domain([0, 1]);
            var gaugeCircleY = d3.scale.linear()
                .range([0, radius])
                .domain([0, radius]);

            // Scales for controlling the size of the clipping path
            var waveScaleX = d3.scale.linear()
                .range([0, waveClipWidth])
                .domain([0, 1]);
            var waveScaleY = d3.scale.linear()
                .range([0, waveHeight])
                .domain([0, 1]);

            // Scales for controlling the position of the clipping path
            var waveRiseScale = d3.scale.linear()
                .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
                .domain([0, 1]);
            var waveAnimateScale = d3.scale.linear()
                .range([0, waveClipWidth - fillCircleRadius * 2])
                .domain([0, 1]);

            // Scale for controlling the position of the text within the gauge
            var textRiseScaleY = d3.scale.linear()
                .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
                .domain([0, 1]);

            // Center the gauge within the parent SVG
            var gaugeGroup = gauge.append("g")
                .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

            // Draw the outer circle
            var gaugeCircleArc = d3.svg.arc()
                .startAngle(gaugeCircleX(0))
                .endAngle(gaugeCircleX(1))
                .outerRadius(gaugeCircleY(radius))
                .innerRadius(gaugeCircleY(radius - circleThickness));
            gaugeGroup.append("path")
                .attr("d", gaugeCircleArc)
                .style("fill", config.circleColor)
                .attr('transform', 'translate(' + radius + ',' + radius + ')');

            // Text where the wave does not overlap
            var text1 = gaugeGroup.append("text")
                .text(textRounder(textStartValue) + percentText)
                .attr("class", "liquidFillGaugeText").attr("text-anchor", "middle")
                .attr("font-size", textPixels + "px").style("fill", config.textColor)
                .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

            // The clipping wave area
            var clipArea = d3.svg.area()
                .x(function (d) { return waveScaleX(d.x); })
                .y0(function (d) { return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)); })
                .y1(function (d) { return (fillCircleRadius * 2 + waveHeight); });
            var waveGroup = gaugeGroup.append("defs"
            ).append("clipPath")
                .attr("id", "clipWave" + elementId);
            var wave = waveGroup.append("path")
                .datum(data)
                .attr("d", clipArea)
                .attr("T", 0);

            // The inner circle with the clipping wave attached
            var fillCircleGroup = gaugeGroup.append("g")
                .attr("clip-path", "url(#clipWave" + elementId + ")");
            fillCircleGroup.append("circle")
                .attr("cx", radius)
                .attr("cy", radius)
                .attr("r", fillCircleRadius)
                .style("fill", config.waveColor);

            // Text where the wave does overlap
            var text2 = fillCircleGroup.append("text")
                .text(textRounder(textStartValue) + percentText)
                .attr("class", "liquidFillGaugeText")
                .attr("text-anchor", "middle")
                .attr("font-size", textPixels + "px")
                .style("fill", config.waveTextColor)
                .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

            // Make the value count up
            if (config.valueCountUp) {
                var textTween = function () {
                    var i = d3.interpolate(this.textContent, textFinalValue);
                    return function (t) {
                        this.textContent = textRounder(i(t)) + percentText;
                    }
                };
                text1.transition().duration(config.waveRiseTime).tween("text", textTween);
                text2.transition().duration(config.waveRiseTime).tween("text", textTween);

                if (scope.config.showTitle && scope.config.useCustomTitle) {
                  
                    var middleAxisXPosition = parseInt(parseFloat(gauge.style("width").split("p")[0]) / 2);
                    gauge.append("text")
                        .attr("text-anchor", "middle")
                        .style("fill", scope.config.titleColor)
                        .attr("font-size", (textPixels-2) + "px")
                        .attr("font-weight", "bolder")
                        .attr('transform', 'translate(' + middleAxisXPosition + ',' + -7 + ')')
                        .text(scope.config.customTitle);

                }
            }

            // Make the wave rise: wave and wavegroup are separate so that horizontal and vertical movement can be controlled independently
            var waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
            if (config.waveRise) {
                waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
                    .transition()
                    .duration(config.waveRiseTime)
                    .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')')
                    .each("start", function () {
                        wave.attr('transform', 'translate(1,0)');
                    });
            } else {
                waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
            }
            if (config.waveAnimate) animateWave();
            function animateWave() {
                wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
                wave.transition()
                    .duration(config.waveAnimateTime * (1 - wave.attr('T')))
                    .ease('linear')
                    .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                    .attr('T', 1)
                    .each('end', function () {
                        wave.attr('T', 0);
                        animateWave(config.waveAnimateTime);
                    });
            }

            // Update gauge information
            function GaugeUpdater() {
                this.update = function (value) {
                    var textRounderUpdater = function (value) { return parseFloat(value).toFixed(scope.config.decimalPlaces); };
                    var textTween = function () {
                        var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(scope.config.decimalPlaces));
                        return function (t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
                    };

                    text1.transition().duration(config.waveRiseTime).tween("text", textTween);
                    text2.transition().duration(config.waveRiseTime).tween("text", textTween);

                    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
                    var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
                    var waveRiseScale = d3.scale.linear().range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)]).domain([0, 1]);
                    var newHeight = waveRiseScale(fillPercent);

                    var waveScaleX = d3.scale.linear()
                        .range([0, waveClipWidth])
                        .domain([0, 1]);

                    var waveScaleY = d3.scale.linear()
                        .range([0, waveHeight])
                        .domain([0, 1]);

                    var newClipArea;

                    if (config.waveHeightScaling) {
                        newClipArea = d3.svg.area()
                            .x(function (d) { return waveScaleX(d.x); })
                            .y0(function (d) { return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)); })
                            .y1(function (d) { return (fillCircleRadius * 2 + waveHeight); });
                    } else {
                        newClipArea = clipArea;
                    }

                    var newWavePosition = config.waveAnimate ? waveAnimateScale(1) : 0;

                    wave.transition()
                        .duration(0)
                        .transition()
                        .duration(config.waveAnimate ? (config.waveAnimateTime * (1 - wave.attr('T'))) : (config.waveRiseTime))
                        .ease('linear')
                        .attr('d', newClipArea)
                        .attr('transform', 'translate(' + newWavePosition + ',0)')
                        .attr('T', '1')
                        .each("end", function () {
                            if (config.waveAnimate) {
                                wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
                                animateWave(config.waveAnimateTime);
                            }
                        });
                    waveGroup.transition()
                        .duration(config.waveRiseTime)
                        .attr('transform', 'translate(' + waveGroupXPosition + ',' + newHeight + ')')
                }
            }

            return new GaugeUpdater();
        }
    };

    BS.symbolCatalog.register(defintion);
})(window.PIVisualization);