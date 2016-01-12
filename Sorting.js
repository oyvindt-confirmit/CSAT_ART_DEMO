class Sorting {  
  	static function ByScore(a, b) {
		if (a.Score < b.Score) return 1;
		if (a.Score > b.Score) return -1;
		if (a.Score == b.Score) return 0;
	}
  
    static function ByScoreAscending(a, b) {
		if (a.Score < b.Score) return -1;
		if (a.Score > b.Score) return 1;
		if (a.Score == b.Score) return 0;
	}
  
    static function ByWeightAscending(a, b) {
		if (a.Weight < b.Weight) return -1;
		if (a.Weight > b.Weight) return 1;
		if (a.Weight == b.Weight) return 0;
	} 
}