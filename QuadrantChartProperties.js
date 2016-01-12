public class QuadrantChartProperties
{
  var properties
  
  function QuadrantChartProperties(metaData, parameterUtilities, log) {
    var xAxisSelected = parameterUtilities.Selected(PositioningParameters.Metric1);
    var yAxisSelected = parameterUtilities.Selected(PositioningParameters.Metric2);
    var xAxisQuestion = metaData.GetQuestion(Config.DS_Main, xAxisSelected.Code.split(".")[0], true);
    var xAxisMaxAndMin = QuestionProperties.MaxAndMinScores(xAxisQuestion);
    var yAxisQuestion = metaData.GetQuestion(Config.DS_Main, yAxisSelected.Code.split(".")[0], true);
    var yAxisMaxAndMin = QuestionProperties.MaxAndMinScores(yAxisQuestion);
    var xAxisCrossingPoint = (xAxisMaxAndMin.Max + xAxisMaxAndMin.Min)/2;
    var yAxisCrossingPoint = (yAxisMaxAndMin.Max + yAxisMaxAndMin.Min)/2;
    log.LogDebug("xAxisMaxAndMin.Min: " + xAxisMaxAndMin.Min);
    log.LogDebug("xAxisMaxAndMin.Max: " + xAxisMaxAndMin.Max);
    log.LogDebug("yAxisMaxAndMin.Min: " + yAxisMaxAndMin.Min);
    log.LogDebug("yAxisMaxAndMin.Max: " + yAxisMaxAndMin.Max);
    var xAxisMin = parameterUtilities.GetParameterDecimal(PositioningParameters.XAxisMin, xAxisMaxAndMin.Min);
    var xAxisMax = parameterUtilities.GetParameterDecimal(PositioningParameters.XAxisMax, xAxisMaxAndMin.Max);
    var yAxisMin = parameterUtilities.GetParameterDecimal(PositioningParameters.YAxisMin, yAxisMaxAndMin.Min);
    var yAxisMax = parameterUtilities.GetParameterDecimal(PositioningParameters.YAxisMax, yAxisMaxAndMin.Max);
    log.LogDebug("xAxisMin: " + xAxisMin);
    log.LogDebug("xAxisMax: " + xAxisMax);
    log.LogDebug("yAxisMin: " + yAxisMin);
    log.LogDebug("yAxisMax: " + yAxisMax);
    var positioningDefaults = Config.Positioning;
    var quadrantDefaults = Config.Positioning.Quadrants;
    var minimumResponses = parameterUtilities.GetParameterDecimal(PositioningParameters.MinimumResponses, positioningDefaults.MinimumResponses);
    var xAxisCrossingPoint = (xAxisMax + xAxisMin)/2;
    var yAxisCrossingPoint = (yAxisMax + yAxisMin)/2;
    var upperLeftLabel = parameterUtilities.GetParameterString(PositioningParameters.UpperLeftLabel, quadrantDefaults.UpperLeft.Label);
    var upperRightLabel = parameterUtilities.GetParameterString(PositioningParameters.UpperRightLabel, quadrantDefaults.UpperRight.Label);
    var lowerLeftLabel = parameterUtilities.GetParameterString(PositioningParameters.LowerLeftLabel, quadrantDefaults.LowerLeft.Label);
    var lowerRightLabel = parameterUtilities.GetParameterString(PositioningParameters.LowerRightLabel, quadrantDefaults.LowerRight.Label);
    var upperLeftColor = parameterUtilities.GetParameterString(PositioningParameters.UpperLeftColor, quadrantDefaults.UpperLeft.Color);
    var upperRightColor = parameterUtilities.GetParameterString(PositioningParameters.UpperRightColor, quadrantDefaults.UpperRight.Color);
    var lowerLeftColor = parameterUtilities.GetParameterString(PositioningParameters.LowerLeftColor, quadrantDefaults.LowerLeft.Color);
    var lowerRightColor = parameterUtilities.GetParameterString(PositioningParameters.LowerRightColor, quadrantDefaults.LowerRight.Color);
    properties = {
      minimumResponses : minimumResponses,
      xAxis : {
        label: xAxisSelected.Label,
        max: xAxisMax,
        min: xAxisMin,
        crossingPoint: xAxisCrossingPoint
      },
      yAxis : {
        label: TextUtilities.TruncateText(yAxisSelected.Label, 60),
        max: yAxisMax,
        min: yAxisMin,
        crossingPoint: yAxisCrossingPoint
      },
      quadrants: {
        upperLeft: {
          label: upperLeftLabel,
          color: upperLeftColor
        },
        upperRight: {
          label: upperRightLabel,
          color: upperRightColor
        },
        lowerLeft: {
          label: lowerLeftLabel,
          color: lowerLeftColor 
        },
        lowerRight: {
          label: lowerRightLabel,
          color: lowerRightColor
        }
      }
    };
  }
}