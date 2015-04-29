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
      autoScroll: true,
      inertia: true,
    // keep the element within the area of it's parent
    //restrict the draggable object inside another object(image)
    restrict: {
      restriction: "parent", 
      //endOnly: true,            //endOnly is used if we want the draggable object to
                                  //automatically move inside the defined bounds in the
                                  //event that it goes out.
      elementRect: { top: -1.2, left: 0, bottom: 1, right: 1 } //define the part of the draggable object
                                                            //  that can go out of the draggable area.
                                                            //In this case the whole object cannot go out
                                                            //  of the area.
    },
    // call this function on every dragmove event
    onmove: function (event) 
    {
      var dive = document.getElementsByClassName("draggable dive");
      var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      var textEl = target.querySelector('p');     //the text that will be rendered in the <p> tag
      // translate the element
      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the position attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);


      //Hacky anchor line that uses borderss. If there is a more preferable way of doing this delete 
      //these lines.
      /////////////////////////////////////////////////////////////////////////////////////////////
      //This is the anchor line that follows the draggable object.
      //It is pretty hacky because it uses css borders instead of lines.
      var line = document.getElementsByClassName("line");
      $(line[target.id-1]).width(x+50); //the width of the border adjust base on the x pos
      $(line[target.id-1]).height(y+50);//the heght of the border adjust base on the y pos
      // x+50 and y+50 so it won't go on top of the diver

      var line2 = document.getElementsByClassName("line2");
      $(line2[target.id-1]).width(x+40); //the width o
      $(line2[target.id-1]).height(y-30);

      //This is the line for the decompression stop or safety stop.
      //Again, it is pretty hacky because it uses css borders.
      var decomp_stop = document.getElementsByClassName("decomp_stop");
      $(decomp_stop[target.id-1]).css('left',x+50+"px"); //Again like the line on top but instead of adjusting the width and height
      //it is always aligned left with values xpos+50 pixels.

      //boat graphics
      var boat2 = document.getElementsByClassName("boat2");
      $(boat2[target.id-1]).css('left',x+75+"px");
      ////////////////////////////////////////////////////////////////////////////////////////


      //minimize the coordinates by diving by 10
      //so the user will have enough room to drag the object or will make it easier.
      //Also the new x and y defined below will be the parameters
      //that will be use in the dive_algo functionalities.
      x = Math.round(x/4.0909090909);           //maximum time of 220mins
      y = Math.round(y/10);
      
      //show the time = x and depth = y coordinates and status of dive
      textEl && (textEl.textContent = 'Time = ' + x + 'min.' + '\n' +
         'Depth = ' + y + 'm');

      //for a more conservative dive status
      x = x + 1;
      y = y + 1;
      //var width = $('#main').width();
      //The logic behind the implementation of multiple dive status
      if(dive.length == 1)  //if there is only ONE dive
      {        
        dive[target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));      //set appropriate pressure group
        Dive_Status(target.id-1,x,y); //get the status of dive
      }
      else
      {
        if(target.id-1 == 0)  //If there is multiple dives and I'm moving the first dive
        {
          dive[target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));
          Dive_Status(target.id-1,x,y);
        }
        else            //else other instances except the first dive
        {
          var previousPG = dive[target.id-2].getAttribute("data-pg");       //get the PG of previous dive
          var surfaceInt = document.getElementsByClassName("surface_interval");
          //reduce pressure group after surface interval
          //Not sure about this:*********************************************************************************************************
          var PGafterSI = Reduce_PG(previousPG, surfaceInt[target.id-2].value); //surfaceInt[this]
          x = x + RNT(PGafterSI,y);
          dive[target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));        //dive[this]
          surfaceInt[target.id-2].setAttribute("data-rpg",PGafterSI);           //surfaceInt[this]
          Dive_Status(target.id-1,x,y);
        }
        Update(target.id);  //update the next dives
      }  
    }
});

function Dive_Status(i,x,y)
{
  //Dive status updates the diver,anchor line, and decomp_stop line status.
  
    var dive = document.getElementsByClassName("draggable dive");

    ///////////////////////////////////////////////////////////////////////
    var line = document.getElementsByClassName("line");
    var line2 = document.getElementsByClassName("line2");
    var decomp_stop = document.getElementsByClassName("decomp_stop");
    ///////////////////////////////////////////////////////////////////////

      if(Bad_DIVE(x,y))
      {
        //change to represent the bad dive.
        dive[i].style.backgroundColor='#FF3333';
		    dive[i].style.borderColor='#FF3333';
        dive[i].style.backgroundImage="url('static/diver3.png')";

        ///////////////////////////////////////////////////////////////////
        line[i].style.borderColor='#FF3333';
        line2[i].style.borderRightColor='#FF3333';
        decomp_stop[i].style.borderRightColor='#FF3333';
        decomp_stop[i].style.borderBottomColor='#FF3333';
        ///////////////////////////////////////////////////////////////////
      }
      else if(Warning_DIVE(x,y))
      {
         //change to represent the warning dive
         dive[i].style.backgroundColor='#FFCC00';
		     dive[i].style.borderColor='#FFCC00';
         dive[i].style.backgroundImage="url('static/diver2.png')";

         //////////////////////////////////////////////////////////////////
         line[i].style.borderColor='#FFCC00';
         line2[i].style.borderRightColor='#FFCC00';
         decomp_stop[i].style.borderRightColor='#FFCC00';
         decomp_stop[i].style.borderBottomColor='#FFCC00';
         /////////////////////////////////////////////////////////////////
      }
      else
        {
          //change to represent the good dive
          dive[i].style.backgroundColor='#339933';
		  dive[i].style.borderColor='#339933';
          dive[i].style.backgroundImage="url('static/diver1.png')";

          ////////////////////////////////////////////////////////////////
          line[i].style.borderColor='#339933';
          line2[i].style.borderRightColor='#339933';
          decomp_stop[i].style.borderRightColor='#339933';
          decomp_stop[i].style.borderBottomColor='#339933';
          ///////////////////////////////////////////////////////////////
        }

    /////////////////////////////////////////////////////////////////////
    line[i].style.borderTopColor='transparent'; //keep this transparent
    line[i].style.backgroundColor='transparent';//keep this transparent
    line[i].style.borderRightColor='transparent';//keep this transparent
    /////////////////////////////////////////////////////////////////////
}

function Bad_DIVE(time,depth)
{
  var a = 105.4459074484564;
  var b = -0.4437192799;

  return (depth > (a*(Math.pow(time,b))));
}

function Warning_DIVE(time,depth)
{
  var a = 113.95854764967993;
  var b = -0.48150981158021355;
  if(depth>=30)   
    return true;  //if depth is over 30meters then return warning
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
    var number = Math.round(PG)-1;

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
    var number = Math.round(reducedPG)-1;

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
//Add_Dive creates all elements that is required to create another dive. Once all the elements are created 
//it adds it to the "main" div to be rendered in the screen.
//This uses JQuery.
    var newContainer = document.createElement("div");                    //new div tag
    var newDive = document.createElement("div");                        //new div tag
    var newDiveId = document.getElementsByClassName("draggable dive");  //get diver

    newContainer.className = "container";                             //set newContainer class
    newContainer.align = "left";                                      //align the newContainer
    
    newDive.id = newDiveId.length + 1;                              //set newDive id
    newDive.className = "draggable dive";                           //set newDive classNames
    newDive.setAttribute("data-pg","1");
    newDive.innerHTML = '<div id="time_depth"><strong><p class="depth_time_txt"></p></strong></div>';  //show newDive depth and time

    //If going to change how the anchor line works, better delete this lines
    /////////////////////////////////////////////////////////////////////////////////////////////
    //Anchor line that uses bordersss
    var newline = document.createElement("div");                        //create new dynamic anchor line
    var newline2 = document.createElement("div");
    var newdecomp_stop = document.createElement("div");
    newdecomp_stop.innerHTML = '<h3>Time: 3min. Depth: 5m</h3>';

    newline.className = "line"; //set the class of the anchor line
    newline2.className = "line2"

    newdecomp_stop.className = "decomp_stop";   //set the class of decomp_stop (a transparent box with colored borders)

    var boat1 = document.createElement("div");
    var boat2 = document.createElement("div");
    boat1.className = "boat1";
    boat2.className = "boat2";

    $(newline).append(newline2,boat2,newdecomp_stop);          //add decomp_stop to line
    ////////////////////////////////////////////////////////////////////////////////////////////


    //***************************Temporary Surface interval interface*******************************
    var SurfaceInt = document.createElement("input")
    
    var SurfaceInt = document.createElement("div");
    var label = document.createElement("h2");
    var input = document.createElement("input");
    var confirm = document.createElement("button");
    var t = document.createTextNode("Confirm");
    SurfaceInt.className = "SI";
    label.className = "SItxt";

    input.className = "surface_interval";
    input.value = 60;
    input.setAttribute("data-rpg", "1");
    input.type = "number";
    input.style.display = 'none';


    confirm.id = "confirm";
    $(confirm).append(t);
    confirm.style.display = 'none';
    label.innerHTML = "Surface Interval: " + input.value + "min.";

    label.onclick = function() { input.style.display = 'block';
                                 confirm.style.display = 'block'; }

    confirm.onclick = function() {  if(input.value<=0)
                                    {alert("Surface Interval cannot be 0min.");}
                                    else
                                    {
                                      input.style.display = 'none';
                                      confirm.style.display = 'none'; 
                                      label.innerHTML = "Surface Interval: " + input.value + "min.";
                                      Update(newDive.id-1);
                                    }
                                  }
    

    $(SurfaceInt).append(label,input,confirm);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    var width = $(main).width();
    $(main).width(width + 980 + 500);
    $('#sky').width(width + 980 + 500);

    $(newContainer).append(boat1, newline, newDive);    ///newline = anchor line that uses bordersss
    $(main).append(SurfaceInt, newContainer);
    
	  Set_Dive(newDive.id,0,10,input.value);
    //for automatic scrolling when adding dive
   $('html, body').animate({
            scrollLeft: width+980+500});
}

function Delete_Dive()
{
  var dive = document.getElementsByClassName("draggable dive");
  var container = document.getElementsByClassName("container");
  var si = document.getElementsByClassName("SI")
  var last = dive.length;
  if(dive.length != 1)
  {
    $(container[last-1]).remove();
    $(si[last-2]).remove();
    var width = $(main).width();
    $(main).width(width - 980 - 500);
  }
}

function Update(curr)
{ 
  var dive = document.getElementsByClassName("draggable dive");
  var SInt = document.getElementsByClassName("surface_interval");
  var i = curr;
  {
    while(curr < dive.length)
    {
      var pg = dive[curr-1].getAttribute("data-pg");
      var si = SInt[curr-1].value;
      var rpg = Reduce_PG(pg,si);
      var x = dive[curr].getAttribute("data-x");
      var y = dive[curr].getAttribute("data-y");

      //for a more conservative results
      x = Math.round(x/4.0909090909)+1;
      y = Math.round(y/10)+1;

      x = x + RNT(rpg,y);
      dive[curr].setAttribute("data-pg",Pressure_GROUP(x,y))
      SInt[curr-1].setAttribute("data-rpg",rpg);
      Dive_Status(curr,x+1,y);
      curr++;
    }
  }
}

function Load_Dive()
{
    var DiveObjects = [{"fields": {"diveplan": 1, "dive_id": 1, "depth": 10, "surface_interval": 6, "time": 40}, "model": "Dives.dive", "pk": 26}, {"fields": {"diveplan": 1, "dive_id": 2, "depth": 20, "surface_interval": 13, "time": 100}, "model": "Dives.dive", "pk": 27}, {"fields": {"diveplan": 1, "dive_id": 3, "depth": 30, "surface_interval": 13, "time": 160}, "model": "Dives.dive", "pk": 27}, {"fields": {"diveplan": 1, "dive_id": 4, "depth": 40, "surface_interval": 13, "time": 200}, "model": "Dives.dive", "pk": 27}];
    Set_Dive(DiveObjects[0].fields.dive_id, DiveObjects[0].fields.time, DiveObjects[0].fields.depth, DiveObjects[0].fields.surface_interval);
    for (i = 1; i < DiveObjects.length; i++){
        Add_Dive();
        Set_Dive(DiveObjects[i].fields.dive_id, DiveObjects[i].fields.time, DiveObjects[i].fields.depth, DiveObjects[i].fields.surface_interval)
    }

}


function Set_Dive(dive_id, x, y,si)
{
  var x = Math.round(x*4.0909090909);
  var y = y*10;
  var dive = document.getElementsByClassName("draggable dive");
  var target = document.getElementById(dive_id);

  var textEl = target.querySelector('p');     //the text that will be rendered in the <p> tag
  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the position attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);


  //Hacky anchor line that uses borderss. If there is a more preferable way of doing this delete 
  //these lines.
  /////////////////////////////////////////////////////////////////////////////////////////////
  //This is the anchor line that follows the draggable object.
  //It is pretty hacky because it uses css borders instead of lines.
  var line = document.getElementsByClassName("line");
  $(line[target.id-1]).width(x+50); //the width of the border adjust base on the x pos
  $(line[target.id-1]).height(y+50);//the heght of the border adjust base on the y pos
  // x+50 and y+50 so it won't go on top of the diver

  var line2 = document.getElementsByClassName("line2");
  $(line2[target.id-1]).width(x+40); //the width o
  $(line2[target.id-1]).height(y-30);

  //This is the line for the decompression stop or safety stop.
  //Again, it is pretty hacky because it uses css borders.
  var decomp_stop = document.getElementsByClassName("decomp_stop");
  $(decomp_stop[target.id-1]).css('left',x+50+"px"); //Again like the line on top but instead of adjusting the width and height
  //it is always aligned left with values xpos+50 pixels.

  //boat graphics
  var boat2 = document.getElementsByClassName("boat2");
  $(boat2[target.id-1]).css('left',x+75+"px");
  ///////////////////////////////////////////////////////////////////////////////////////////////  


  //minimize the coordinates by diving by 10
  //so the user will have enough room to drag the object or will make it easier.
  //Also the new x and y defined below will be the parameters
  //that will be use in the dive_algo functionalities.
  x = Math.round(x/4.0909090909);           //maximum time of 220mins
  y = Math.round(y/10);
  
  //show the time = x and depth = y coordinates and status of dive
  textEl && (textEl.textContent = 'Time = ' + x + 'min.' + '\n' +
     'Depth = ' + y + 'm');

  //for a more conservative dive status
  x = x + 1;
  y = y + 1;
  //var width = $('#main').width();
  //The logic behind the implementation of multiple dive status
  if(dive.length == 1)  //if there is only ONE dive
  {        
    dive[target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));      //set appropriate pressure group
    Dive_Status(target.id-1,x,y); //get the status of dive
  }
  else
  {
    if(target.id-1 == 0)  //If there is multiple dives and I'm moving the first dive
    {
      dive[target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));
      Dive_Status(target.id-1,x,y);
    }
    else            //else other instances except the first dive
    {
      var previousPG = dive[target.id-2].getAttribute("data-pg");       //get the PG of previous dive
      var surfaceInt = document.getElementsByClassName("surface_interval");
      //reduce pressure group after surface interval
      //Not sure about this:*********************************************************************************************************

      var label = document.getElementsByClassName("SItxt");
      surfaceInt[target.id-2].value = si;
      label[target.id-2].innerHTML = "Surface Interval: " + surfaceInt[target.id-2].value + "min.";

      var PGafterSI = Reduce_PG(previousPG, surfaceInt[target.id-2].value); //surfaceInt[this]
      x = x + RNT(PGafterSI,y);
      dive[target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));        //dive[this]
      surfaceInt[target.id-2].setAttribute("data-rpg",PGafterSI);           //surfaceInt[this]
      Dive_Status(target.id-1,x,y);
    }
    Update(target.id);  //update the next dives
  }  
}
