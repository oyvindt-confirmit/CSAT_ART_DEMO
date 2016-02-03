class TrendTable {
  private var _table;
  private var _log;
  private var _statistic;
  private var _question;
  private var _metricVariableId;
  private var _timeSeriesHeader;
  private var _npsScaleDetails;
  const TimeVariableHeaderId = "dt";
  const CategoriesId = "cat";

  function TrendTable(table, parameterValues, metaData, timeSeriesHeader, log)   {
    _table = table;
    _timeSeriesHeader = timeSeriesHeader;
    _statistic = parameterValues.Statistic;
    _metricVariableId = parameterValues.MetricVariableId;
    var questionId = _metricVariableId.split(".")[0];
    _question = metaData.GetQuestion(Config.DS_Main, questionId, true);
    _log = log;
  }
  
  function CreateBaseTableExpression() {
    return [CreateBaseRowExpression(), _timeSeriesHeader.CreateBaseTimeseriesExpression(false)].join('^');
  }
  
  function CreateBaseRowExpression() {
    var numericStatisticsCode = parseInt(_statistic.Code);
    var rowExpression = _metricVariableId + MetricVariableQualifiers();
    if(numericStatisticsCode >= 3 && numericStatisticsCode <= 8) {
      var topBottomNExpression = CreateTopBottomNExpression();
      rowExpression += "/" + topBottomNExpression;
    }
    else if(numericStatisticsCode == 9) {
      var npsExpression = CreateNPSExpression();
      if(npsExpression !== null) {
        rowExpression += "/" + npsExpression;
      }
    }
    else if(numericStatisticsCode >= 100 && numericStatisticsCode < 200) {
      var rangeGapNumber = numericStatisticsCode - 100;
      var questionDetails = GetQuestionDetails();
      var rangeGap = Config.RangeGaps[rangeGapNumber];
      var rangeGapDetails = QuestionProperties.GetRangeGapDetails(_question, rangeGap);
      if(rangeGapDetails.QuestionMatchesRangeGap) {
        var mask = rangeGapDetails.BottomCodes.concat(rangeGapDetails.TopCodes);
        var rowExpressionSegments = [];
        rowExpressionSegments.push(GetMaskedCategoriesSet(mask, CategoriesId, true, false));
        rowExpressionSegments.push(CreateFormulaHeader(false));
        rowExpression += "/" + "(" + rowExpressionSegments.join("+") + ")"; 
      }
      else {
       	throw new Exception("Question does not have scores compatible with the range gap. Table cannot be produced."); 
      }
    }
    else if(numericStatisticsCode >= 200 && numericStatisticsCode < 300) {
      var rangeNumber = numericStatisticsCode - 200;
      var questionDetails = GetQuestionDetails();
      var range = Config.Ranges[rangeNumber];
      var rangeDetails = QuestionProperties.GetRangeDetails(_question, range);
      if(rangeDetails.QuestionMatchesRange) {
        var mask = rangeDetails.Codes;
        var rowExpressionSegments = [];
        rowExpressionSegments.push(GetMaskedCategoriesSet(mask, CategoriesId, true, false));
        rowExpressionSegments.push(CreateFormulaHeader(true));
        rowExpression += "/" + "(" + rowExpressionSegments.join("+") + ")";
      }
      else {
       	throw new Exception("Question does not have scores compatible with the range. Table cannot be produced."); 
      }
    }
    return rowExpression;
  }
  
  private function GetQuestionDetails() {
    var parts = _metricVariableId.split('.');
    var code = (parts.length > 1) ? parts[1] : null;
    var sortedScoredScales = QuestionProperties.GetSortedScoredScales(_question);
    var questionDetails = {
      VariableId: _question.QuestionId,
      Question: _question,
      Code: code,
      SortedScoredScales: sortedScoredScales
    };
    return questionDetails;    
  }
  
  private function MetricVariableQualifiers() {
    if(_statistic.Code == 1) {
      return '{collapsed:true;defaultstatistics:avg}';
    }
    else if(_statistic.Code == 0) {
      return '{collapsed:true;defaultstatistics:count}';
    }
    else if(_statistic.Code == 2) {
      return '{collapsed:true;defaultstatistics:stdev}';
    }
    else {
      return '{collapsed:true}';
    }
  }
    
  private function CreateTopBottomNExpression() {
    var topAndBottomScales = FindTopAndBottom3ScoredItems();
    var rowExpressionSegments = [];
    rowExpressionSegments.push(GetMaskedCategoriesSet(topAndBottomScales, CategoriesId, true, false))
    rowExpressionSegments.push(CreateFormulaHeader(true));
    return "(" + rowExpressionSegments.join("+") + ")";
  }               
  
  private function FindTopAndBottom3ScoredItems() {
    var scoredItems = QuestionProperties.GetScoredItems(_question);
    var sortedScoredItems = scoredItems.sort(Sorting.ByScoreAscending);
    return [sortedScoredItems[0].Code, sortedScoredItems[1].Code, sortedScoredItems[2].Code,
            sortedScoredItems[sortedScoredItems.length-3].Code, sortedScoredItems[sortedScoredItems.length-2].Code, sortedScoredItems[sortedScoredItems.length-1].Code];
  }
   
  private function GetMaskedCategoriesSet(codeSet, id, hideData, totals) {
    var maskedCategories = [];
    for(var i = 0; i < codeSet.length; i++) {
      maskedCategories.push("[CATEGORIES]{totals:" + totals + ";id:" + id + ";hidedata:" + hideData + ";mask:" + codeSet[i] + "}");
    }
    return maskedCategories.join("+");
  }
  
  private function CreateFormulaHeader(percent) {
    if(percent) {
      return "[FORMULA]{percent:true;expression:\"" + GetFormulaExpression() + "\"}";
    }
    else {
      return "[FORMULA]{percent:false;expression:\"" + GetFormulaExpression() + "\"}";
    }
  }
  
  private function GetFormulaExpression() {
    _log.LogDebug("_statistic.Code: " + _statistic.Code);
    switch(_statistic.Code) {
      case 3:
        return "(CELLVALUE(col,row-2) + CELLVALUE(col, row-1))/100";
      case 4:
        return "(CELLVALUE(col,row-3) + CELLVALUE(col,row-2) + CELLVALUE(col, row-1))/100";
      case 5:
        return "(CELLVALUE(col,row-6) + CELLVALUE(col, row-5))/100";
      case 6:
        return "(CELLVALUE(col,row-6) + CELLVALUE(col, row-5) + CELLVALUE(col, row-4))/100";
      case 7:
        return "CELLVALUE(col, row-1)/100";
      case 8:
        return "CELLVALUE(col,row-6)/100";
      case 9:
        if(_npsScaleDetails.IsNPSScale) {
          if(_npsScaleDetails.ScaleLength == 10) {
            return "(CELLVALUE(col,row-1)+CELLVALUE(col,row-2))-(CELLVALUE(col,row-3)+CELLVALUE(col,row-4)+CELLVALUE(col,row-5)+CELLVALUE(col,row-6)+CELLVALUE(col,row-7)+CELLVALUE(col,row-8))";
          }
          else {
            return "(CELLVALUE(col,row-1)+CELLVALUE(col,row-2))-(CELLVALUE(col,row-3)+CELLVALUE(col,row-4)+CELLVALUE(col,row-5)+CELLVALUE(col,row-6)+CELLVALUE(col,row-7)+CELLVALUE(col,row-8)+CELLVALUE(col,row-9))";
          }
        }
        break;
    }
    if(_statistic.Code >= 100 && _statistic.Code < 200) {
      var rangeGap = Config.RangeGaps[_statistic.Code - 100];
      var offset = 1;
      var topFormula = [];
      var bottomFormula = [];
      var topLength = rangeGap.Top.Max - rangeGap.Top.Min;
      for(var i = 0; i <= topLength; ++i) {
        topFormula.push("CELLVALUE(col,row-" + offset + ")");
        offset += 1;
      }
      var bottomLength = rangeGap.Bottom.Max - rangeGap.Bottom.Min;
      for(var i = 0; i <= bottomLength; ++i) {
        bottomFormula.push("CELLVALUE(col,row-" + offset + ")");
        offset += 1;
      }      
      return "(" + topFormula.join("+") + ")-(" + bottomFormula.join("+") + ")";
    }    
    else if(_statistic.Code >= 200 && _statistic.Code < 300) {
      var range = Config.Ranges[_statistic.Code - 200];
      var offset = 1;
      var formula = [];
      var topLength = range.Max - range.Min;
      for(var i = 0; i <= topLength; ++i) {
        formula.push("CELLVALUE(col,row-" + offset + ")");
        offset += 1;
      }     
      return "(" + formula.join("+") + ")/100";
    }
  }
  
  private function CreateNPSExpression() {
    _npsScaleDetails = QuestionProperties.IsNPSQuestion(_question);
    if(_npsScaleDetails.IsNPSScale) {
      var mask = _npsScaleDetails.DetractorCodes.concat(_npsScaleDetails.PromotorCodes);
      var rowExpressionSegments = [];
      rowExpressionSegments.push(GetMaskedCategoriesSet(mask, CategoriesId, true, false));
      rowExpressionSegments.push(CreateFormulaHeader(false));
      return "(" + rowExpressionSegments.join("+") + ")";
    }
    else {
       	throw new Exception("Question does not have NPS compatible scores. Table cannot be produced."); 
    }
    return null;
  }
  
  function SetFormulasFirstOnCategories(formulasFirst) {
    SetFormulasFirst(_table.RowHeaders, formulasFirst);
  }
  
  private function SetFormulasFirst(headersCollection, formulasFirst) {
	for (var i = 0; i < headersCollection.Count; ++i) {
	  if (headersCollection[i].HeaderId == CategoriesId) {
        headersCollection[i].Mask.ApplyAfterFormulas = formulasFirst;
      }
	  // See if there's a match in that header's Child Branches
      if(headersCollection[i].SubHeaders != null) {
        SetFormulasFirst(headersCollection[i].SubHeaders, formulasFirst);
      }
    }
  }
}