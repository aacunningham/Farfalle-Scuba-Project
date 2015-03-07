/*
= Team Farfalle Dive Planner functionalities =
WARNING: This functionalities for calculating
Pressure Group,RNT etc is still a prototype.
It needs more testing and debugging to have
a more accurate results. The values used in 
the computations were based on the data in 
Padi table(metric).
*/
#include <iostream>
#include <math.h>
using namespace std;

bool Bad_Dive(int d,int t)
{
	double a,b;


	a = 105.4459074484564;
	b = -0.4334667424949577;
	
	return (d > (a*(pow(t,b))));
}

bool Warning_Dive(int d, int t)
{
	double a,b;
	a = 113.95854764967993;
	b = -0.48150981158021355;
	if(d>30)	//not sure about the min 30
		return true;	//if depth is over 30meters then return warning
	return ((d > (a*(pow(t,b))))); 
}

char Pressure_Group(double d,int t)
{
	long double s,m,n,q,r,c;
	long double PG;
	char letter;
	s = 2.2648834727001601 * pow(10,160);
	m = 7.0123592040257003;
	n = 1.7946238745730789;
	q = 552.85426276703538;
	r = -20.363335715433173;
	c = -1.0231048129283549;

	//having problems with this:
	//PG is not always accurate
	PG = s*exp(-0.5*(pow(((log(t)-m)/n),2.0) + pow(((log(d)-q)/r),2.0)))+c;
	letter = char(round(PG)+64);	//round off PG and convert it to a letter A=1...Z=26

	//need to compensate with PG, sometimes it goes out of bounds
	if(letter < 'A')
		return 'A';
	else if(letter > 'Z')
		return 'Z';
	else 
		return letter; 
}

char Reduce_PG(char P,int SI)
{
	int R_PG,PG;
	long double s,m,n,q,r,c;
	char letter;

	PG = int(P-64);	//convert PG to int A=1...Z=26
	s = 116.54299853808371;
	m = 33.212036458693376;
	n = -15.10250855396535;
	q = -186.32853553152427;
	r = 112.18008663409428;
	c = 0.82154053080283274;


	//having Pressure_Group not being accurate then Reduce_PG have a huge probability of not being accurate
	R_PG = s*exp(-0.5*(pow(((PG-m)/n),2.0) + pow((SI-q)/r,2.0)))+c;

	letter = char(round(R_PG)+64);	//round off R_PG and convert it to a letter A=1...Z=26
	if(letter < 'A')
		return 'A';
	else if(letter > 'Z')
		return 'Z';
	else 
		return letter; 
}

int RNT(char RPG,int depth)
{
	long double a,b,c,d,f;
	double P,RNT;

	P = int(RPG-64);	//convert P to a letter A=1...Z=26
	a = 7.6081117597706665E+01;
	b = 4.1581576427587992E+00;
	c = -1.9592050053069073E+01;
	d = -5.7085147164947170E-01;
	f = 4.6114751660456582E-01;

	//Reduce_PG not being acurate so does the RNT
	RNT = (a + (b*(log(P))) + (c*(log(depth)))) / (1 + (d*(log(P))) + (f*(log(depth))));
	return round(RNT);	//round off the RNT 
}

int main()
{
	int T,D,SI,i=1;		//T = time, D = depth, SI = Surface Interval
	char P;				//P = pressure group
	char choice;

	//first dive
	cout<<"         Farfalle       "<<endl;
	cout<<"========================"<<endl;
	cout<<"Dive "<<i<<":"<<endl;
	cout<<"Enter Depth in meters: ";cin>>D;
	cout<<"Enter Time in minutes: ";cin>>T;cout<<endl;
	
	if(Bad_Dive(D,T))
		cout<<"Bad Dive"<<endl;
	else if(Warning_Dive(D,T))
		cout<<"Warning Dive"<<endl;
	else
		cout<<"Good Dive"<<endl;

	P = Pressure_Group(D,T);
	cout<<"Pressure Group: "<<P<<endl;
	cout<<"=========================="<<endl;

	//add dive
	cout<<"Another dive?(y/n)"<<endl;
	cout<<"> ";cin>>choice;
	while (tolower(choice) == 'y')
	{
		i++;
		cout<<"=========================="<<endl;
		cout<<"Dive "<<i<<":"<<endl;
		cout<<"Surface time in minutes: ";cin>>SI;
		P = Reduce_PG(P,SI);						//Pressure group after SI
		cout<<"Pressure Group after SI: "<<P<<endl;
		cout<<"Enter Depth in meters: ";cin>>D;
		cout<<"Enter Time in minutes: ";cin>>T;cout<<endl;
		T = T + RNT(P,D);	//get the RNT and add it to actual bottom time
							//to get the total bottom time
		if(Bad_Dive(D,T))
			cout<<"Bad Dive"<<endl;
		else if(Warning_Dive(D,T))
			cout<<"Warning Dive"<<endl;
		else
			cout<<"Good Dive"<<endl;

		P = Pressure_Group(D,T);
		cout<<"Pressure Group: "<<P<<endl;
		cout<<"=========================="<<endl;
		cout<<"Another dive?(y/n)"<<endl;
		cout<<"> ";cin>>choice;
	}

	return 0; 
}