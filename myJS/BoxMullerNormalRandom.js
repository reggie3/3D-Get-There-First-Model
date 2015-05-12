function boxMullerNormalRandom(mean, stdDev)	/* normal random variate generator */
{				        /* mean m, standard deviation s */
	var x1, x2, w, y1;
	var y2;
	var bolUseLast = false;
	mean = Number(mean);
	stdDev = Number(stdDev);
	var normRand = undefined;

	while(!normRand){
		if (bolUseLast)		        /* use value from previous call */
		{
			y1 = y2;
			bolUseLast = false;
		}
		else
		{
			do {
				x1 = 2.0 * Math.random() - 1.0;
				x2 = 2.0 * Math.random() - 1.0;
				w = x1 * x1 + x2 * x2;
			} while ( w >= 1.0 );
	
			w = Math.sqrt( (-2.0 * Math.log( w ) ) / w );
			y1 = x1 * w;
			y2 = x2 * w;
			bolUseLast = true;
		}
		var normRand = Math.round(mean + y1 * stdDev );
		
		if(!normRand)
			console.log("error");
	}
	return normRand;
}