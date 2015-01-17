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
    var displayHideHidden = true; //Display all divs that are hidden, hide them again on click.

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
                'background: rgba(0, 0, 0, 0.8); color: #D9D9D9; padding: 1%; border-radius: 10px; border: 1px solid transparent; box-shadow: 0 0 5px rgba(46, 141, 216, 0.5);' +
                'transition: width 500ms, height 500ms, background-color 250ms ease-in-out, box-shadow 500ms; font-family: "Lato", "Droid", "sans-serif"; box-sizing: content-box }' +
                '#floatingWindow:hover { background: rgba(0, 0, 0, 0.88); box-shadow: 0 0 5px rgba(0, 148, 181, 0.8); color: #FAFAFA }' +
                '#floatingWindow p { margin: 0; padding-bottom: 2.5%; }' +
                '#floatingWindow span { margin: 0; padding-bottom: 1%; }';
            // ##########################################################################
            // # ID floatingWindowData (main window's display. Displays element's data) #
            // ##########################################################################

            style.innerHTML += '#floatingWindowData { overflow: hidden; height: 67%; min-height: 60px; font-size: 1.75vh; border-bottom: 1px solid rgba(46, 141, 216, 0.5);' +
                'transition: color 350ms ease-in-out; }';

            // #######################################################
            // # ID floatingWindowOptions (main window options' div) #
            // #######################################################

            style.innerHTML += '#floatingWindowOptions { z-index: 9445656445657; position: absolute; bottom: 8.8vh; width: 100%; height: 5%; background: transparent;' +
                'color: lightblue; opacity: 0.8; padding: 1%; font-size: 1.5vh; }';

            // #################################################################################
            // # CLASS fWOption (for menu elements, or elements that must be made 'clickable') #
            // #################################################################################

            style.innerHTML += '.fWOption { color: #2E8DD8; cursor: pointer; transition: color 350ms ease-in-out; }' +
                '.fWOption:hover { color: #36A8FF; }';

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
        "<span id='enableButtons' class='fWOption'>Enable/disable all buttons, inputs</span><br/>" +
        "<span id='displayHidden' class='fWOption'>Display/hide all hidden divs</span><br/>" +
        "<span id='closeDivRem' class='fWOption'>Close</span> | <span id='minimizeDivRem' class='fWOption'>Minimize</span>";
    floatingWindowData.innerHTML = "Hover over any element to get data";

    floatingWindow.appendChild(floatingWindowData);
    floatingWindow.appendChild(floatingWindowOptions);
    body.appendChild(floatingWindow);

    // ##############################################################
    // # Defining floating window functionality (setting listeners) #
    // ##############################################################

    var hiddenTemp = []; //Collection of found hidden elements
    var linksPreventListener = function(e)
    {
        var target = e.target;
        while (target)
        {
            if (target.tagName == "A" || target.tagName == "BUTTON")
            {
                e.preventDefault();
                console.log("Link prevented: ", target.getAttribute("href") || "button");
                return false;
            }
            target = target.parentNode;
        }
    }

    function preventLinks(boolean)
    {
        if (boolean === true)
        {
            console.log("Link prevention started");
            body.addEventListener("click", linksPreventListener);
        }
        else
        {
            console.log("Link prevention stopped");
            body.removeEventListener("click", linksPreventListener);
        }
    }
    preventLinks(preventLinksFlag);

    var mouseoverEventListener = function(e)
    {
        floatingWindowData.innerHTML =
            "<p><b>Type: </b>" + e.target.tagName + "</p>" +
            "<p><b>ID: </b>" + e.target.id + "</p>" +
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

                var documentButtons = document.getElementsByTagName("*");
                var tempButtons = [];
                for (var i = 0; i < documentButtons.length; i++)
                {
                    if (documentButtons[i].nodeName == "BUTTON" || documentButtons[i].nodeName == "INPUT")
                    {
                        var currentButton = documentButtons[i];
                        tempButtons.push(currentButton);
                        currentButton.disabled = enableButtonsFlag;
                    }
                }
                if (enableButtonsFlag)
                    console.log(tempButtons.length, " buttons were disabled");
                else
                    console.log(tempButtons.length, " buttons were enabled");

                enableButtonsFlag = !enableButtonsFlag;
                return false;

            case "displayHidden":

                switch (displayHideHidden)
                {
                    case true:
                        hiddenTemp = [];
                        var documentElems = body.getElementsByTagName("*");
                        for (var i = 0; i < documentElems.length; i++)
                        {
                            var currentElem = documentElems[i];
                            var computed = window.getComputedStyle(currentElem);
                            if (computed.display == 'none' || computed.visibility == 'hidden')
                            {
                                hiddenTemp.push(currentElem);
                                currentElem.style.display = "block";
                                currentElem.style.visibility = "visible";
                            }
                        }
                        if (hiddenTemp.length > 0)
                        {
                            console.log(hiddenTemp.length, " hidden elements are now visible.");
                        }
                        else
                        {
                            console.log(hiddenTemp.length, "No hidden elements found")
                            return false;
                        }
                        break;
                    case false:
                        for (var i = 0; i < hiddenTemp.length; i++)
                        {
                            hiddenTemp[i].style.display = "none";
                            hiddenTemp[i].style.visibility = "hidden";
                        }
                        if (hiddenTemp.length > 0)
                            console.log(hiddenTemp.length, " hidden elements are back to being hidden.");
                        else
                            console.log(hiddenTemp.length, "No hidden elements to push back to obscurity")
                        break;
                }
                displayHideHidden = !displayHideHidden;
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
            console.log("Removed: ", e.target);
            clickedThis.parentNode.removeChild(clickedThis);
        }
    };
    document.addEventListener("click", documentClickListener);

    function makeItDraggable()
    {
        var offY;
        var offX;

        floatingWindow.addEventListener('mousedown', mouseDown, false);
        floatingWindow.addEventListener('mouseup', mouseUp, false);

        function mouseDown(e)
        {
            body.style.cssText += "user-select: none; -moz-user-select: none;-webkit-user-select: none;";
            floatingWindow.style.cssText += "user-select: none; -moz-user-select: none;-webkit-user-select: none;";
            floatingWindow.style.cssText += "cursor: grabbing; cursor: -webkit-grabbing;";
            offY = e.clientY - parseInt(floatingWindow.offsetTop);
            offX = e.clientX - parseInt(floatingWindow.offsetLeft);
            window.addEventListener('mousemove', windowMove, true);
        }

        function mouseUp()
        {
            body.style.cssText += "user-select: text; -moz-user-select: text;-webkit-user-select: text;";
            floatingWindow.style.cssText += "user-select: text; -moz-user-select: text;-webkit-user-select: text;";
            floatingWindow.style.cursor = "initial";
            window.removeEventListener('mousemove', windowMove, true);
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
        var windowVars = [];
        for (var i in window)
        {
            if (i.lastIndexOf("gLoad", 0) === 0)
            {
                windowVars.push(i);
                type = "gLoader";
            }
        }
        switch (type)
        {

            case "gLoader":
                console.log("gLoader survey detected! Removing it...");
                var gLoaderIframes = document.getElementsByTagName("iframe");
                for (var i = 0; i < gLoaderIframes.length; i++)
                {
                    gLoaderIframes[i].parentNode.removeChild(gLoaderIframes[i]);
                    console.log("Removing iframes...");
                }
                for (var i in windowVars)
                {
                    if(windowVars[i].lastIndexOf("gLoad", 0) === 0)
                    {
                        var gLoaderVar = windowVars[i];
                        window[gLoaderVar] = false;
                        console.log("Done removing gLoader survey!");
                    }
                }
                break;

            default:
                console.log("Survey type not found... Please remove blockage elements manually");
                break;

        }

        windowVars = [];
    }
    surveyTypes();

})();
