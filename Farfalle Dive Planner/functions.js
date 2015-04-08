/*
draggable was implemented by using interact.js library by:
              Taye Adeyemi ©2014-2015.
        Code released under the MIT License.
*/


//function for dragging feature
// target elements with the "draggable" class
interact('.draggable')
  .draggable(
  {
    // keep the element within the area of it's parent
    //restrict the draggable object inside another object(image)
    restrict: {
      restriction: "parent", 
      //endOnly: true,            //endOnly is used if we want the draggable object to
                                  //automatically move inside the defined bounds in the
                                  //event that it goes out.
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 } //define the part of the draggable object
                                                            //  that can go out of the draggable area.
                                                            //In this case the whole object cannot go out
                                                            //  of the area.
    },

    // call this function on every dragmove event
    onmove: function (event) 
    {
      var div = document.getElementById('dive');     //for changing the element of the <div> tag
                                                        //see comment 4 and 5 below.
      var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      var textEl = event.target.querySelector('p');     //the text that will be rendered in the <p> tag
      // translate the element
      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the position attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

      //minimize the coordinates by diving by 10
      //so the user will have enough room to drag the object or will make it easier.
      //Also the new x and y defined below will be the parameters
      //that will be use in the dive_algo functionalities.
      x = Math.round(x/10);
      y = Math.round(y/10);
      
      //show the time = x and depth = y coordinates and status of dive
      textEl && (textEl.textContent = 'time = ' + x + '\n' +
         'depth = ' + y);

      Dive_Status(event,x,y); //get the status of dive
    }
});

function Dive_Status(event,x,y)
{
  

      if(Bad_DIVE(x,y))
      {
        //change to represent the bad dive.
        event.target.style.backgroundColor='#CC3300';
        event.target.style.backgroundImage="url('diver-octopus.gif')";
      }
      else if(Warning_DIVE(x,y))
      {
         //change to represent the warning dive
         event.target.style.backgroundColor='#CC6600';
         event.target.style.backgroundImage="url('animated-diver-2.gif')";
      }
      else
        {
          //change to represent the good dive
          event.target.style.backgroundColor='#339933';
          event.target.style.backgroundImage="url('animated-diver-2.gif')";
        }
}

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

function Add_Dive()
{
    var newContainer = document.createElement("div");
    var newDive = document.createElement("div");
    var main = document.getElementById("main");
    newContainer.id = "container";
    newDive.id = "dive";
    newDive.className = "draggable";
    newDive.innerHTML = '<strong><p></p></strong>';
    newContainer.align = "left";

    $(main).append(newContainer);     // Append new containers
    $(newContainer).append(newDive);    // Append draggable diver to new container
}

//Future problems:
/*
  1. interact onstart() function does not seem to work?

  2. figure out how to implement multiple dives + done.

  3. surface interval. Possibly by using interact resize?

  4. if multiple dives are in the page the object
    can be drag and the time and depth are updating
    but the status of the dive will not update for 
    all the dives except the first one. Moving the
    dive#2,dive#3... will change the status of the
    dive#1???
    Possible Fix?:
      * does div elements have index(div[i])?if so we can iterate through that
        and update the status of the dives.

  5. make a seperate function for setting the <div> elements
    to show if it is bc
  6. RNT functionality

  *that's it for now...
*/
