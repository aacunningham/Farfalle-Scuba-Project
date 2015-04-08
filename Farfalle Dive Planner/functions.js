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
	var a = 105.4459074484564;
	var b = -0.4334667424949577;

	return (depth > (a*(Math.pow(time,b))));
}

function Warning_DIVE(time,depth)
{
	var a = 113.95854764967993;
	var b = -0.48150981158021355;
	if(depth>30)		
		return true;	//if depth is over 30meters then return warning
	return ((depth > (a*(Math.pow(time,b))))); 
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
