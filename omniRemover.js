(function()
{
    // #########################
    // # General use variables #
    // #########################

    var body = document.getElementsByTagName("body")[0];
    var clickRemovesFlag = true; //Default for click element removal
    var preventLinksFlag = true; //Default for preventing URL action on link click
    var minimized = false; //Initialize minimized
    var enableButtonsFlag = false; //Buttons will be 'enabled' first, on menu option click

    // ##########################
    // # Floating Window Styles #
    // ##########################

    var style = document.createElement('style');

    function styleSheet(set)
    {
        if (set === true)
        {
            style.type = 'text/css';
            style.id = 'floatingWindowStyles';

            // ###################################
            // # ID floatingWindow (main window) #
            // ###################################

            style.innerHTML = '#floatingWindow { z-index: 9445656445656; line-height: 1.9vh; position: fixed; overflow: hidden; top: 10%; width: 29vh; height: 31vh;' +
                'background: rgba(0, 0, 0, 0.9); color: #efefef; padding: 1%; border-radius: 10px; border: 1px solid transparent; box-shadow: 0 0 5px rgba(46, 141, 216, 0.5);' +
                 '}';
            // ##########################################################################
            // # ID floatingWindowData (main window's display. Displays element's data) #
            // ##########################################################################

            style.innerHTML += '#floatingWindowData { overflow: hidden; height: 67%; min-height: 60px; font-size: 1.75vh; border-bottom: 1px solid rgba(46, 141, 216, 0.5);}';

            // #######################################################
            // # ID floatingWindowOptions (main window options' div) #
            // #######################################################

            style.innerHTML += '#floatingWindowOptions { z-index: 9445656445657; position: absolute; bottom: 8.8vh; width: 100%; height: 5%; background: transparent;' +
                'color: lightblue; opacity: 0.8; padding: 1%; font-size: 1.5vh; }';

            // #################################################################################
            // # CLASS fWOption (for menu elements, or elements that must be made 'clickable') #
            // #################################################################################

            style.innerHTML += '.fWOption { color: #2E8DD8; cursor: pointer }';

            // # Append style to document
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        else
        {
            style.parentNode.removeChild(style);
        }

    }
    styleSheet(true);

    // ################################################################
    // # Create the floating window, menu elements. Append to window. #
    // ################################################################

    var floatingWindow = document.createElement('div');
    var floatingWindowData = document.createElement('div');
    var floatingWindowOptions = document.createElement('div');

    floatingWindow.setAttribute("id", "floatingWindow");
    floatingWindowData.setAttribute("id", "floatingWindowData");
    floatingWindowOptions.setAttribute("id", "floatingWindowOptions");

    floatingWindowOptions.innerHTML =
        "<span id='clickRemoves' class='fWOption'>Click removes element: YES</span><br/>" +
        "<span id='preventLinks' class='fWOption'>Prevent links: YES</span><br/>" +
        "<span id='enableButtons' class='fWOption'>Enable/disable all buttons</span><br/>" +
        "<span id='displayHidden' class='fWOption'>Display all hidden divs</span><br/>" +
        "<span id='closeDivRem' class='fWOption'>Close</span> | <span id='minimizeDivRem' class='fWOption'>Minimize</span>";
    floatingWindowData.innerHTML = "Hover over any element to get data";

    floatingWindow.appendChild(floatingWindowData);
    floatingWindow.appendChild(floatingWindowOptions);
    body.appendChild(floatingWindow);

    // ##############################################################
    // # Defining floating window functionality (setting listeners) #
    // ##############################################################

    var linksPreventListener = function(e)
    {
        e.preventDefault();
        console.log("Link prevented");
    };

    function preventLinks(boolean)
    {
        var links = document.getElementsByTagName("A");

        if (boolean === true)
        {
            console.log("Link prevention started");
            for (var i = 0; i < links.length; i++)
            {
                links[i].addEventListener("click", linksPreventListener);
            }
        }
        else
        {
            console.log("Link prevention stopped");
            for (var i = 0; i < links.length; i++)
            {
                links[i].removeEventListener("click", linksPreventListener);
            }
        }
    }
    preventLinks(true);

    var mouseoverEventListener = function(e)
    {
        floatingWindowData.innerHTML =
            "<p><b>Type: </b>" + e.target.tagName + "</p>" + 
            "<p><b>ID: </b>" + e.target.getAttribute("id") + "</p>" + 
            "<p><b>Class: </b>" + e.target.getAttribute("class") + "</p>" + 
            "<p><b>Target: </b>" + e.target + "</p>";
    };
    document.addEventListener("mouseover", mouseoverEventListener);

    var documentClickListener = function(e)
    {
        switch (e.target.getAttribute("id"))
        {

            case "clickRemoves":

                switch (clickRemovesFlag)
                {
                    case true:
                        console.log("Element removal by click disabled");
                        e.target.innerHTML = "Click removes element: NO";
                        break;

                    case false:
                        console.log("Element removal by click enabled");
                        e.target.innerHTML = "Click removes element: YES";
                        break;
                }
                clickRemovesFlag = !clickRemovesFlag;
                return false;

            case "preventLinks":

                switch (preventLinksFlag)
                {
                    case true:
                        e.target.innerHTML = "Prevent links: NO";
                        preventLinks(false);
                        break;

                    case false:
                        e.target.innerHTML = "Prevent links: YES";
                        preventLinks(true);
                        break;
                }
                preventLinksFlag = !preventLinksFlag;
                return false;

            case "minimizeDivRem":

                switch (minimized)
                {
                    case false:
                        document.removeEventListener("mouseover", mouseoverEventListener);
                        floatingWindow.style.height = "1%";
                        floatingWindowOptions.style.display = "none";
                        floatingWindowData.innerHTML = "<span id='minimizeDivRem' class='fWOption'>Maximize</span>";
                        console.log("Window minimized");
                        break;

                    case true:
                        document.addEventListener("mouseover", mouseoverEventListener);
                        floatingWindowData.innerHTML = "";
                        floatingWindow.style.height = "38%";
                        floatingWindowOptions.style.display = "block";
                        console.log("Window maximized");
                        break;

                }
                minimized = !minimized;
                return false;

            case "enableButtons":

                var enableButtonsButton = document.getElementsByTagName("button");
                var enableButtonsInput = document.getElementsByTagName("input");
                for (var i = 0; i < enableButtonsButton.length; i++)
                {
                    enableButtonsButton[i].disabled = enableButtonsFlag;
                    console.log("<button>: ", enableButtonsButton[i]);
                }
                for (var i = 0; i < enableButtonsInput.length; i++)
                {
                    enableButtonsInput[i].disabled = enableButtonsFlag;
                    console.log("<input>: ", enableButtonsInput[i]);
                }
                enableButtonsFlag = !enableButtonsFlag;
                return false;

            case "displayHidden":

                var documentElems = document.getElementsByTagName("div");
                for (var i = 0; i < documentElems.length; i++)
                {
                    documentElems[i].style.display = "block";
                    console.log(i, " hidden elements are now visible.");
                }
                return false;

            case "closeDivRem":

                styleSheet("destroy");
                floatingWindow.parentNode.removeChild(floatingWindow);
                preventLinksFlag = false;
                preventLinks(false);
                clickRemovesFlag = false;
                document.removeEventListener("mouseover", mouseoverEventListener);
                document.removeEventListener("click", documentClickListener);
                console.log("Element removal by click disabled");
                console.log("#############################################################");
                console.log("Script stopped, everything back to normal. Please reload page");
                return false;
        }

        if (floatingWindow.contains(e.target))
        {
            return false;
        }

        if (clickRemovesFlag == true)
        {
            var clickedThis = e.target;
            console.log(e.target);
            clickedThis.parentNode.removeChild(clickedThis);
        }
    };
    document.addEventListener("click", documentClickListener);

    function makeItDraggable()
    {
        var offY;
        var offX;

        floatingWindow.addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);

        function mouseUp()
        {
            window.removeEventListener('mousemove', windowMove, true);
        }

        function mouseDown(e)
        {
            offY = e.clientY - parseInt(floatingWindow.offsetTop);
            offX = e.clientX - parseInt(floatingWindow.offsetLeft);
            window.addEventListener('mousemove', windowMove, true);
        }

        function windowMove(e)
        {
            floatingWindow.style.position = 'fixed';
            floatingWindow.style.top = (e.clientY - offY) + 'px';
            floatingWindow.style.left = (e.clientX - offX) + 'px';
        }
    }
    makeItDraggable();

    // ############################
    // # Survey detection methods #
    // ############################

    function surveyTypes()
    {
        var type;
        //Test for gLoader surveys
        for (var i in window)
        {
            if (i.lastIndexOf("gLoaded_", 0) === 0)
            {
                type = "gLoader";
            }
        }

        switch (type)
        {

            case "gLoader":
                console.log("gLoader survey detected! Removing it...");
                var gLoaderIframes = document.getElementsByTagName("iframe");
                gLoaded_24052 = !gLoaded_24052;
                for (var i = 0; i < gLoaderIframes.length; i++)
                {
                    gLoaderIframes[i].parentNode.removeChild(gLoaderIframes[i]);
                }
                break;

            default:
                console.log("Survey type not found... Please remove blockage elements manually");
                break;

        }

    }
    surveyTypes();

})();
