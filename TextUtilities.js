class TextUtilities {
  static function CleanText(text) {
    var textWithHtmlRemoved = RemoveHtml(text);
    var textWithHtmlAndPipingRemoved = RemovePipingExpressions(textWithHtmlRemoved);
    return textWithHtmlAndPipingRemoved;
  }
  
  static function RemoveHtml(text) {  
    text = RemoveScriptTagShortcut(text);
    text = ReplaceNoBreakSpaceCodes(text);
    text = TrimText(text);
    text = CollapseMultipleSpaces(text);
    text = ReplaceScriptTags(text);
    text = ReplaceHTMLCharacters(text);     
    return text;
  }
  
  private static function RemoveScriptTagShortcut(text) {
    var scriptRemovedArray = text.split('<script>');
    if (scriptRemovedArray.length > 1) {
      text = scriptRemovedArray[0] + ' ' + scriptRemovedArray[1].split('</script>')[1];
    }
    return text;
  }
  
  private static function ReplaceNoBreakSpaceCodes(text) {
    var nobreakspace_codes = ['&#160;', '&nbsp;', String.fromCharCode(160)];
    for (var i = 0; i < nobreakspace_codes.length; ++i) {
      text = text.split(nobreakspace_codes[i]).join(' ');
    }
    return text;
  }
  
  private static function TrimText(text) {
    return text.replace(/\<.+?\>/g, '');
  }
  
  private static function CollapseMultipleSpaces(text) {
    return text.replace(/^\s+|\s+$/g,'');
  }
  
  private static function ReplaceScriptTags(text) {
    return text.replace(/<script[^>]*>.*?<\/script>/ig, '');
  }
  
  private static function ReplaceHTMLCharacters(text) {
    var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (SCRIPT_REGEX.test(text)) {
      text = text.replace(SCRIPT_REGEX, "");
    }
    return text;
  }
  
  static function RemovePipingExpressions(text) {
    var parts = text.split('^');
    for(var i = 0; i < parts.length; ++i) {
      if(i % 2 == 1) {
        parts[i] = ' [...] '; 
      }
    }
    return parts.join('');
  }
  
  static function TruncateText(text, maxTextLength) {
    if(maxTextLength == null) {
      maxTextLength = 100;
    }
    if(text.length > maxTextLength)
      text = text.substring(0,maxTextLength-4) + " ...";
    return text;
  } 
}