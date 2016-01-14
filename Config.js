public class Config 
{ 
  static var DS_Main = "ds0";
  static var CustomDateFormat = 'dd-MMM-yyyy';  
  static var DateVariableId = 'interview_start';
  static var Time = {
    CalendarType: CalendarType.Default
  };
  static public var Colors = {
    DefaultColor: '#233871' 
  };
  static var Include80PctSigTesting = true;
  static var MaxNumberOfQuestionsOnAllQuestionsPage = 100;
  static var VariablesToPutAtEndOfList = ["status","lastchannel","lastdevicetype","lastrenderingmode","first_question_on_last_page_displayed"];
  static var RangeGaps = [{
      Label: "My Range Gap",
      Minuend: {Min: 8, Max: 9},
      Subtrahend: {Min: 0, Max: 4}
    },{
      Label: "My Other Range Gap",
      Minuend: {Min: 4, Max: 5},
      Subtrahend: {Min: 1, Max: 2}     
    }
  ];
  static var Positioning = {
    MinimumResponses: 0,
    Quadrants: {
      UpperLeft: {
        Label: "Upper Left",
        Color: "#F9E9D9"
      },
      UpperRight: {
        Label: "Upper Right",
        Color: "#EFF3DA"
      },
      LowerLeft: {
        Label: "Lower Left",
        Color: "#D8EAF3"
      },
      LowerRight: {
        Label: "Lower Right",
        Color: "#D9F7F2"
      }     
    }
  }
}