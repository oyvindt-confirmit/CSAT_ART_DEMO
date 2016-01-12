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
    var rowExpression = _metricVariableId + MetricVariableQualifiers();
    if(_statistic.Code == "3" || _statistic.Code == "4" || _statistic.Code == "5" || _statistic.Code == "6" || _statistic.Code == "7" || _statistic.Code == "8" ) {
      var topBottomNExpression = CreateTopBottomNExpression();
      rowExpression += "/" + topBottomNExpression;
    }
    else if(_statistic.Code == "9") {
      var npsExpression = CreateNPSExpression();
      if(npsExpression !== null) {
        rowExpression += "/" + npsExpression;
      }
    }
    return rowExpression;
  }
  
  private function MetricVariableQualifiers() {
    if(_statistic.Code == "1") {
      return '{collapsed:true;defaultstatistics:avg}';
    }
    else if(_statistic.Code == "0") {
      return '{collapsed:true;defaultstatistics:count}';
    }
    else {
      return '{collapsed:true;defaultstatistics:stdev}';
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
    var scoredItems = GetScoredItems();
    var sortedScoredItems = scoredItems.sort(Sorting.ByScoreAscending);
    return [sortedScoredItems[0].Code, sortedScoredItems[1].Code, sortedScoredItems[2].Code,
            sortedScoredItems[sortedScoredItems.length-3].Code, sortedScoredItems[sortedScoredItems.length-2].Code, sortedScoredItems[sortedScoredItems.length-1].Code];
  }
  
  private function GetScoredItems() {
    var items;
    if(_question.QuestionType == QuestionType.Grid) {
      items = _question.Scale;
    }
    else {
      items = _question.Answers;
    }
    var scoredItems = [];
    for(var i = 0; i < items.length; ++i) {
      if(items[i].Score != null) {
        scoredItems.push(items[i]);
      }
    }
    return scoredItems;
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
    switch(_statistic.Code) {
      case "3":
        return "(CELLVALUE(col,row-2) + CELLVALUE(col, row-1))/100";
      case "4":
        return "(CELLVALUE(col,row-3) + CELLVALUE(col,row-2) + CELLVALUE(col, row-1))/100";
      case "5":
        return "(CELLVALUE(col,row-6) + CELLVALUE(col, row-5))/100";
      case "6":
        return "(CELLVALUE(col,row-6) + CELLVALUE(col, row-5) + CELLVALUE(col, row-4))/100";
      case "7":
        return "CELLVALUE(col, row-1)/100";
      case "8":
        return "CELLVALUE(col,row-6)/100";
      case "9":
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
  }
  
  private function CreateNPSExpression() {
    var scoredItems = GetScoredItems();
    IsNPSScale(scoredItems);
    if(_npsScaleDetails.IsNPSScale) {
      var sortedScoredItems = scoredItems.sort(Sorting.ByScoreAscending);
      var mask;
      if(sortedScoredItems.length == 11) {
        mask = [sortedScoredItems[0].Code, sortedScoredItems[1].Code, sortedScoredItems[2].Code, sortedScoredItems[3].Code, sortedScoredItems[4].Code, 
                sortedScoredItems[5].Code, sortedScoredItems[6].Code, sortedScoredItems[9].Code, sortedScoredItems[10].Code];
      }
      else if(sortedScoredItems.length == 10) {
        mask = [sortedScoredItems[0].Code, sortedScoredItems[1].Code, sortedScoredItems[2].Code, sortedScoredItems[3].Code, sortedScoredItems[4].Code, 
                sortedScoredItems[5].Code, sortedScoredItems[8].Code, sortedScoredItems[9].Code];
      }
      var rowExpressionSegments = [];
      rowExpressionSegments.push(GetMaskedCategoriesSet(mask, CategoriesId, true, false));
      rowExpressionSegments.push(CreateFormulaHeader(false));
      return "(" + rowExpressionSegments.join("+") + ")";
    }
    return null;
  }
  
  private function IsNPSScale(scoredItems) {  
    if(scoredItems.length == 10) {
      _npsScaleDetails = {ScaleLength: 10};
      _npsScaleDetails.IsNPSScale = true;
      for(var i = 0; i < scoredItems.length; i++) {
        if(scoredItems[i].Score != i+1) {
          _npsScaleDetails.IsNPSScale = false;
          break;
        }
      }  
    }
    else if(scoredItems.length == 11) {
      _npsScaleDetails = {ScaleLength: 11};
      _npsScaleDetails.IsNPSScale = true;
      for(var i = 0; i < scoredItems.length; i++) {
        if(scoredItems[i].Score != i) {
          _npsScaleDetails.IsNPSScale = false;
          break;
        }
      }
    }
    else {
      throw new Exception("Question does not have NPS compatible scores");
    }
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