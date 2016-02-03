class ComparativeRatingSummaryHiddenTable {
  private var _report;
  private var _parameterUtilities;
  private var _metaData;
  private var _log;
  
  function ComparativeRatingSummaryHiddenTable(report, parameterUtilities, metaData, log) {
    _report = report;
    _parameterUtilities = parameterUtilities;
    _metaData = metaData;
    _log = log;
  } 
  
  function GetHiddenTableExpression() {
	var epression = GetHiddenTableRowExpression();
	return epression;
  }
	
  private function GetHiddenTableRowExpression() {
    var summaryCommon = new ComparativeRatingSummaryCommon(_parameterUtilities);
    var metrics = _parameterUtilities.GetParameterCodes('SCORECARD_METRICS');
    var rowsExpression = [];
    for (var i = 0; i < metrics.length; ++i) {
      var nestedHeaders = summaryCommon.CreateNestedHeaders();
	  var statisticsHeaders = CreateStatisticsHeaders(metrics[i]);
      nestedHeaders.push('(' + statisticsHeaders + ')');
      rowsExpression.push( metrics[i] + '{collapsed:true;totals:true;title:true}/' + nestedHeaders.join('/') );
    }
    return rowsExpression.join('+');
  }
  
  private function CreateStatisticsHeaders(metric) {
    var baseExpression = GetBaseExpression();
    var statisticsExpression = GetStatisticsExpression();
    var statisticsHeaders = [];
    if(baseExpression != null) {
      statisticsHeaders.push(baseExpression);
    }
    if (statisticsExpression != null) {
      statisticsHeaders.push(statisticsExpression);
    }
    var questionDetails = GetQuestionDetails(metric);
    statisticsHeaders.push(ScoredItemExpression(questionDetails));
    statisticsHeaders.push(Top1Expression(questionDetails));
    statisticsHeaders.push(Top2Expression(questionDetails));
    statisticsHeaders.push(Top3Expression(questionDetails));
    statisticsHeaders.push(Bottom1Expression(questionDetails));	
    statisticsHeaders.push(Bottom2Expression(questionDetails));	
    statisticsHeaders.push(Bottom3Expression(questionDetails));
    statisticsHeaders.push(NPSExpression(questionDetails));
    var rangeGapExpression = RangeGapExpression(questionDetails);
    if(rangeGapExpression !== null) {
      statisticsHeaders.push(rangeGapExpression);
    }
    var rangeExpression = RangeExpression(questionDetails);
    if(rangeExpression !== null) {
      statisticsHeaders.push(rangeExpression);
    }
    return statisticsHeaders.join('+');
  }
  
  private function GetQuestionDetails(metric) {
    var parts = metric.split('.');
    var questionId = parts[0];
    var code = (parts.length > 1) ? parts[1] : null;
    var question = _metaData.GetQuestion(Config.DS_Main, questionId, true);
    var sortedScoredScales = QuestionProperties.GetSortedScoredScales(question);
    var questionDetails = {
      VariableId: question.QuestionId,
      Question: question,
      Code: code,
      SortedScoredScales: sortedScoredScales
    };
    return questionDetails;    
  }
  
  private function GetCodesFromAnswers(answers) {
    var codes = [];
    for (var i = 0; i < answers.length; ++i) {
      codes.push(answers[i].Code);
    }
    return codes;
  }
  
  private function GetBaseExpression() {
    var baseExpression = [];
    if (_parameterUtilities.Contains('SCORECARD_STATISTICS', '0')) {
      baseExpression.push('[BASE]{decimals:0}');
    }
    else { 
      baseExpression.push(OneDummyRow());
    }
    return baseExpression.join('+');
  }
  
  private function GetStatisticsExpression() {
    var statisticsExpression = [];
    if (_parameterUtilities.Contains('SCORECARD_STATISTICS', '1')) {
      statisticsExpression.push('[STATISTICS]{stats:avg}');
    }
    else {
      statisticsExpression.push(OneDummyRow());
    }
    if (_parameterUtilities.Contains('SCORECARD_STATISTICS', '2')) {
      statisticsExpression.push('[STATISTICS]{stats:stdev}'); 
    }
    else { 
      statisticsExpression.push(OneDummyRow());
    }
    return statisticsExpression.join('+');
  }
  
  private function ScoredItemExpression(questionDetails) {
    var codes = GetCodesFromAnswers(questionDetails.SortedScoredScales);
    return SegmentExpression(questionDetails, 'N (scored)', codes, 1);
  }
  
  private function Top1Expression(questionDetails) {
    if(_parameterUtilities.Contains('SCORECARD_STATISTICS', '7')) {
      var sortedScoredScales = questionDetails.SortedScoredScales;
      var codes = GetCodesFromAnswers(sortedScoredScales.slice(sortedScoredScales.length-1, sortedScoredScales.length));
      return SegmentExpression(questionDetails, 'Top', codes, 3);
    }
    return TwoDummyRows();		
  }
  
  private function Top2Expression(questionDetails) {
    if(_parameterUtilities.Contains('SCORECARD_STATISTICS', '3')) {
      var sortedScoredScales = questionDetails.SortedScoredScales;
      var codes = GetCodesFromAnswers(sortedScoredScales.slice(sortedScoredScales.length-2, sortedScoredScales.length));
      return SegmentExpression(questionDetails, 'Top 2', codes, 5);
    }
    return TwoDummyRows();		
  }

  private function Top3Expression(questionDetails) {
    if(_parameterUtilities.Contains('SCORECARD_STATISTICS', '4')) {
      var sortedScoredScales = questionDetails.SortedScoredScales;
      var codes = GetCodesFromAnswers(sortedScoredScales.slice(sortedScoredScales.length-3, sortedScoredScales.length));
      return SegmentExpression(questionDetails, 'Top 3', codes, 7);
    }
    return TwoDummyRows();		
  }

  private function Bottom1Expression(questionDetails) {
    if(_parameterUtilities.Contains('SCORECARD_STATISTICS', '8')) {
      var sortedScoredScales = questionDetails.SortedScoredScales;
      var codes = GetCodesFromAnswers(sortedScoredScales.slice(0, 1));
      return SegmentExpression(questionDetails, 'Bottom', codes, 9);
    }
    return TwoDummyRows();		
  }

  private function Bottom2Expression(questionDetails) {
    if(_parameterUtilities.Contains('SCORECARD_STATISTICS', '5')) {
      var sortedScoredScales = questionDetails.SortedScoredScales;
      var codes = GetCodesFromAnswers(sortedScoredScales.slice(0, 2));
      return SegmentExpression(questionDetails, 'Bottom 2', codes, 11); 
    }
    return TwoDummyRows();
  }

  private function Bottom3Expression(questionDetails) {
    if(_parameterUtilities.Contains('SCORECARD_STATISTICS', '6')) {
      var sortedScoredScales = questionDetails.SortedScoredScales;
      var codes = GetCodesFromAnswers(sortedScoredScales.slice(0, 3));
      return SegmentExpression(questionDetails, 'Bottom 3', codes, 13);
    }
    return TwoDummyRows();		
  }
  
  private function NPSExpression(questionDetails) {
    if(_parameterUtilities.Contains('SCORECARD_STATISTICS', '9')) {
      var nps = QuestionProperties.IsNPSQuestion(questionDetails.Question);
      if(nps.IsNPSScale) {
        return NPSSegmentExpression(questionDetails, nps);
      }
    }
    return ThreeDummyRows();		
  }
  
  private function RangeGapExpression(questionDetails) {
    if(Config.RangeGaps !== null && Config.RangeGaps.length > 0) {
      var rangeGapExpression = [];
      for(var i = 0; i < Config.RangeGaps.length; ++i) {
        var id = (100 + i).toString();
        var offset = 19 + (i*3);
        if(_parameterUtilities.Contains('SCORECARD_STATISTICS', id)) {
          var rangeGap = Config.RangeGaps[i];
          var rangeGapCodes = QuestionProperties.GetRangeGapDetails(questionDetails.Question, rangeGap, _log);
          if(rangeGapCodes.QuestionMatchesRangeGap) {
            rangeGapExpression.push(RangeGapSegmentExpression(questionDetails, rangeGapCodes, offset));
          }
          else {
            rangeGapExpression.push(ThreeDummyRows());
          }
        }
        else {
          rangeGapExpression.push(ThreeDummyRows());
        }
      }
      return rangeGapExpression.join("+");
    }
    return null;
  }
 
  private function RangeExpression(questionDetails) {
    if(Config.Ranges !== null && Config.Ranges.length > 0) {
      var rangeExpression = [];
      for(var i = 0; i < Config.Ranges.length; ++i) {
        var id = (200 + i).toString();
        var offset;
        if(Config.RangeGaps != null) {
          offset = 18 + (Config.RangeGaps.length*3) + (i*2);
        }
        else {
          offset = 18 + (i*2);
        }
        if(_parameterUtilities.Contains('SCORECARD_STATISTICS', id)) {
          var range = Config.Ranges[i];
          var rangeCodes = QuestionProperties.GetRangeDetails(questionDetails.Question, range, _log);
          if(rangeCodes.QuestionMatchesRange) {
            rangeExpression.push(RangeSegmentExpression(questionDetails, rangeCodes, offset));
          }
          else {
            rangeExpression.push(TwoDummyRows());
          }
        }
        else {
          rangeExpression.push(TwoDummyRows());
        }
      }
      return rangeExpression.join("+");
    }
    return null;
  }
                
  private function SegmentExpression(analysis, label, codes, offset) {
    var segmentExpression = [];
    var filter = CreateFilter(codes, analysis);
    segmentExpression.push('[SEGMENT]{hidedata:false;label:' + _report.TableUtils.EncodeJsString(label) + ';expression:' + _report.TableUtils.EncodeJsString(filter) + '}/[N]{hidedata:false}');
    var expression = 'IF(CELLV(col, row-' + offset + ')=0, EMPTYV(), CELLV(col,row-1)/CELLV(col, row-' + offset + '))';
    segmentExpression.push('[FORMULA]{hidedata:false;percent:true;label:' + _report.TableUtils.EncodeJsString(label) + ';expression:' + _report.TableUtils.EncodeJsString(expression) + '}/[N]{hideheader:true;hidedata:false}');
    return segmentExpression.join('+');		
  }
  
  private function CreateFilter(codes, questionDetails) {
    var quotedCodes = QuoteStringsInArray(codes);		
    var varibaleId = questionDetails.VariableId + (questionDetails.Code == null ? '' : '_' + questionDetails.Code);
    var filter = 'IN(' + varibaleId + ',' + quotedCodes.join(',') + ')';
    return filter
  }
  
  private function NPSSegmentExpression(questionDetails, nps) {
    var detractorFilter = CreateFilter(nps.DetractorCodes, questionDetails);
    var promotorFilter = CreateFilter(nps.PromotorCodes, questionDetails);
    var segmentExpression = [];
    segmentExpression.push('[SEGMENT]{hidedata:false;label:"Detractors";expression:' + _report.TableUtils.EncodeJsString(detractorFilter) + '}/[N]{hidedata:false}');
    segmentExpression.push('[SEGMENT]{hidedata:false;label:"Promotors";expression:' + _report.TableUtils.EncodeJsString(promotorFilter) + '}/[N]{hidedata:false}');
    var formulaExpression = 'IF(CELLV(col, row-16)=0, EMPTYV(), ((CELLVALUE(col,row-1)/CELLVALUE(col,row-16))*100)-((CELLVALUE(col,row-2)/CELLVALUE(col,row-16))*100))';
    segmentExpression.push('[FORMULA]{hidedata:false;percent:false;label:"NPS ®";expression:' + _report.TableUtils.EncodeJsString(formulaExpression) + '}');
    return segmentExpression.join("+");
  }
  
  private function RangeGapSegmentExpression(questionDetails, rangeGap, offset) {
    _log.LogDebug("RangeGapSegmentExpression offset: " + offset);
    var bottomFilter = CreateFilter(rangeGap.BottomCodes, questionDetails);
    var topFilter = CreateFilter(rangeGap.TopCodes, questionDetails);
    var segmentExpression = [];
    segmentExpression.push('[SEGMENT]{hidedata:false;label:"Detractors";expression:' + _report.TableUtils.EncodeJsString(bottomFilter) + '}/[N]{hidedata:false}');
    segmentExpression.push('[SEGMENT]{hidedata:false;label:"Promotors";expression:' + _report.TableUtils.EncodeJsString(topFilter) + '}/[N]{hidedata:false}');
    var formulaExpression = 'IF(CELLV(col, row-' + offset + ')=0, EMPTYV(), ((CELLVALUE(col,row-1)/CELLVALUE(col,row-' + offset + '))*100)-((CELLVALUE(col,row-2)/CELLVALUE(col,row-' + offset + '))*100))';
    segmentExpression.push('[FORMULA]{hidedata:false;percent:false;label:"' + rangeGap.Label + '";expression:' + _report.TableUtils.EncodeJsString(formulaExpression) + '}');
    return segmentExpression.join("+");
  }
  
  private function RangeSegmentExpression(questionDetails, range, offset) {
    _log.LogDebug("RangeSegmentExpression offset: " + offset);
    var filter = CreateFilter(range.Codes, questionDetails);
    var segmentExpression = [];
    segmentExpression.push('[SEGMENT]{hidedata:false;label:"' + range.Label + '";expression:' + _report.TableUtils.EncodeJsString(filter) + '}/[N]{hidedata:false}');
    var formulaExpression = 'IF(CELLV(col, row-' + offset + ')=0, EMPTYV(), ((CELLVALUE(col,row-1)/CELLVALUE(col,row-' + offset + '))))';
    segmentExpression.push('[FORMULA]{hidedata:false;percent:true;label:"' + range.Label + '";expression:' + _report.TableUtils.EncodeJsString(formulaExpression) + '}');
    return segmentExpression.join("+");
  }
  
  
  private function QuoteStringsInArray(inputArray) {
    var quotedArray = [];
    for (var i = 0; i < inputArray.length; ++i) {
      quotedArray.push ('"' + inputArray[i] + '"');
    }
    return quotedArray;
  }
  
  private function OneDummyRow() {         
    return '[CONTENT]{hidedata:false}';
  }	
	
  private function TwoDummyRows() {
    return OneDummyRow() + "+" + OneDummyRow();
  }
  
  private function ThreeDummyRows() {
    return TwoDummyRows() + "+" + OneDummyRow();
  }
}