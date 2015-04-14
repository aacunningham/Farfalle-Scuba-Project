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
      var dive = document.getElementsByClassName("draggable dive");
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
      x = Math.round(x/4.0909090909);           //maximum time of 220mins
      y = Math.round(y/10);
      
      //show the time = x and depth = y coordinates and status of dive
      textEl && (textEl.textContent = 'time = ' + x + '\n' +
         'depth = ' + y);

      //for a more conservative dive status
      x = x + 1;
      y = y + 1;

      if(dive.length == 1)  //if there is only ONE dive
      {        
        dive[event.target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));      //set appropriate pressure group
        Dive_Status(event.target.id-1,x,y); //get the status of dive
      }
      else
      {
        if(event.target.id-1 == 0)  //If there is multiple dives and I'm moving the first dive
        {
          dive[event.target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));
          Dive_Status(event.target.id-1,x,y);
        }
        else            //else other instances except the first dive
        {
          var previousPG = dive[event.target.id-2].getAttribute("data-pg");       //get the PG of previous dive
          var surfaceInt = document.getElementsByClassName("surface_interval");
          //reduce pressure group after surface interval
          //Not sure about this:*********************************************************************************************************
          var PGafterSI = Reduce_PG(previousPG, surfaceInt[event.target.id-2].value); //surfaceInt[this]
          x = x + RNT(PGafterSI,y);
          dive[event.target.id-1].setAttribute("data-pg",Pressure_GROUP(x,y));        //dive[this]
          surfaceInt[event.target.id-2].setAttribute("data-rpg",PGafterSI);           //surfaceInt[this]
          Dive_Status(event.target.id-1,x,y);
        }
        Update(event.target.id);  //update the next dives
      }
    
    }
});

function Dive_Status(i,x,y)
{
  
    var dive = document.getElementsByClassName("dive");
      if(Bad_DIVE(x,y))
      {
        //change to represent the bad dive.
        dive[i].style.backgroundColor='#CC3300';
        dive[i].style.backgroundImage="url('diver-octopus.gif')";
      }
      else if(Warning_DIVE(x,y))
      {
         //change to represent the warning dive
         dive[i].style.backgroundColor='#CC6600';
         dive[i].style.backgroundImage="url('animated-diver-2.gif')";
      }
      else
        {
          //change to represent the good dive
          dive[i].style.backgroundColor='#339933';
          dive[i].style.backgroundImage="url('animated-diver-2.gif')";
        }
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
    var newContainer = document.createElement("div");                 //new div tag
    var newDive = document.createElement("div");                     //new div tag
    var newDiveId = document.getElementsByClassName("draggable dive");        //get diver
    var newContainerId = document.getElementsByClassName("container");//get container

    newContainer.id = newContainerId.length + 1;                      //set newContainer id
    newContainer.className = "container";                             //set newContainer class
    newContainer.align = "left";                                      //align the newContainer
    
    newDive.id = newDiveId.length + 1;                              //set newDive id
    newDive.className = "draggable dive";                           //set newDive classNames
    newDive.setAttribute("data-pg","1");
    newDive.innerHTML = '<strong><p></p></strong>';                 //show newDive depth and time

    //***************************Temporary Surface interval interface*******************************
    var SurfaceInt = document.createElement("input")
    /*var S = document.getElementsByClassName("surface_interval");
    SurfaceInt.type = "text";
    SurfaceInt.id = newDive.id;
    SurfaceInt.value = 60;
    SurfaceInt.className = "surface_interval";
    SurfaceInt.setAttribute("data-rpg","");

    
    var SurfaceIntTxt = document.createElement("h2");
    SurfaceIntTxt.innerHTML = "Surface Interval:";

    $(main).append(SurfaceIntTxt, SurfaceInt, newContainer);                    //add the new elements to main*/
    var SurfaceInt = document.createElement("div");
    var label = document.createElement("h2");
    var input = document.createElement("input");
    SurfaceInt.id = "SI";
    label.innerHTML = "Surface Interval: ";

    input.id = newDive.id;
    input.className = "surface_interval";
    input.value = 60;
    input.setAttribute("data-rpg", "1");
    input.type = "text";

    $(SurfaceInt).append(label,input);

    var width = $(main).width();
    $(main).width(width + 1000 + 250);

    $(main).append(SurfaceInt, newContainer);
    $(newContainer).append(newDive);
}

function Update(curr)
{ 
  /*var dive = document.getElementsByClassName("draggable dive");
  var l = document.createElement("h1");
  var a = dive[1].getAttribute("data-y");
  l.innerHTML = a;
  $("body").append(l);*/
  var dive = document.getElementsByClassName("draggable dive");
  var SInt = document.getElementsByClassName("surface_interval");
  var i =0;
  if(curr-1 == dive.length)   //if last dive do nothing
    return;
  else          //first dive
  {
    while(curr < dive.length)
    {
      var pg = dive[curr-1].getAttribute("data-pg");
      var si = SInt[curr-1].value;
      var rpg = Reduce_PG(pg,si);
      var x = dive[curr].getAttribute("data-x");
      var y = dive[curr].getAttribute("data-y");
      x = Math.round(x/4.0909090909)+1;
      y = Math.round(y/10)+1;

      //alert(si);

      x = x + RNT(rpg,y);
      SInt[curr-1].setAttribute("data-rpg",rpg);
      Dive_Status(curr,x,y);
      

      //alert(curr);      alert(dive.length);
      curr++;
    }

  }

}