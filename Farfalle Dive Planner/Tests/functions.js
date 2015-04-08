
function Bad_DIVE(time,depth)
{
	var a = 108.9022305174;
	var b = -0.4437192799;

	return (depth > (a*(Math.pow(time,b))));
}

function Warning_DIVE(time,depth)
{
	var a = 113.95854764967993;
	var b = -0.48150981158021355;
	if(depth>=30)		
		return true;	//if depth is over 30meters then return warning
	return ((depth > (a*(Math.pow(time,b))))); 
}

function Pressure_GROUP(time,depth)
{
    var s = 2.2648834727001601 * Math.pow(10,160);
    var m = 7.0123592040257003;
    var n = 1.7946238745730789;
    var q = 552.85426276703538;
    var r = -20.363335715433173;
    var c = -1.0231048129283549;

    var PG = s * Math.exp(-0.5 * (Math.pow(((Math.log(time) - m) / n), 2) + Math.pow(((Math.log(depth) - q) / r), 2))) + c;
    var number = Math.round(PG);

    if (number < 1) {
        return 1;
    } else if (number > 26) {
        return 26;
    }
    return number;
}

function Reduce_PG(previousPG,surface_Interval)
{
    var s = 116.54299853808371;
    var m = 33.212036458693376;
    var n = -15.10250855396535;
    var q = -186.32853553152427;
    var r = 112.18008663409428;
    var c = 0.82154053080283274;

    var reducedPG = s * Math.exp(-0.5 * (Math.pow(((previousPG - m) / n), 2) + Math.pow((surface_Interval - q) / r, 2))) + c;
    var number = Math.round(reducedPG);

    if (number < 1) {
        return 1;
    } else if (number > 26) {
        return 26;
    }
    return number;
}

function RNT(reducedPG,depth)
{
    var a = 76.081117597706665;
    var b = 4.1581576427587992;
    var c = -19.592050053069073;
    var d = -0.57085147164947170;
    var f = 0.46114751660456582;

    var residualNT = (a + (b * (Math.log(reducedPG))) + (c * (Math.log(depth)))) / (1 + (d * (Math.log(reducedPG))) + (f * (Math.log(depth))));
    return Math.round(residualNT);
}
