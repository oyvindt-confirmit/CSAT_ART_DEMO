class VerbatimHitlist {
  private var _project;
  private var _parameterUtilities;
  private var _log;
  
  function VerbatimHitlist(project, parameterUtilities, log) {
    _project = project;
    _parameterUtilities = parameterUtilities;
    _log = log;
  }
  
  function AddHitlistColumns() {
    var segmentColumns = AddSegmentHitlistColumns();
    var verbatimColumns = AddVerbatimHitlistColumns();
    return segmentColumns.concat(verbatimColumns);
  }
  
  private function AddSegmentHitlistColumns() {
    var demographicQuestionIds = _parameterUtilities.GetParameterCodes("VERBATIM_DEMOGRAPHICS");
    var demographicHitlistColumns = [];
    if(demographicQuestionIds != null && demographicQuestionIds.length > 0) {
      for(var i = 0; i < demographicQuestionIds.length; i++) {
        demographicHitlistColumns.push(CreateHitlistColumn(demographicQuestionIds[i]))
      }
    }
    return demographicHitlistColumns;
  }

  private function AddVerbatimHitlistColumns() { 
    var verbatimQuestionIds = _parameterUtilities.GetParameterCodes("VERBATIM");
    var verbatimHitlistColumns = [];
    if(verbatimQuestionIds != null) {
      for(var i = 0; i < verbatimQuestionIds.length; i++) {
        verbatimHitlistColumns.push(CreateHitlistColumn(verbatimQuestionIds[i]));
      }
    }
    return verbatimHitlistColumns;
  }
  
  private function CreateHitlistColumn(questionId) {
    var questionnaireElement = _project.CreateQuestionnaireElement(questionId);
    var hitListColumn : HitListColumn = new HitListColumn();
    hitListColumn.QuestionnaireElement = questionnaireElement;
    hitListColumn.IsSearchable = YesNoDefaultValue.Yes;
    hitListColumn.IsSortable = YesNoDefaultValue.Yes;
    return hitListColumn;
  }
  
  function CreateVerbatimFilterExpression() {
    var verbatimQuestionIds = _parameterUtilities.GetParameterCodes("VERBATIM");
    var filterExpressionSegments = [];
    if(verbatimQuestionIds != null) {
      for(var i = 0; i < verbatimQuestionIds.length; ++i) {
        filterExpressionSegments.push("(NOT ISNULL(" + verbatimQuestionIds[i] + "))");
      }
    }
    return filterExpressionSegments.join(" OR ");
  }
}