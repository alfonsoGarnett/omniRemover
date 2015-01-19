
    // #########################
    // # General use variables #
    // #########################

    var body = document.body, i,
        clickRemovesFlag = true, //Default for click element removal
        preventLinksFlag = true, //Default for preventing URL action on link click
        highlightElem = false, //Hover highlights elements
        maximized = true; //Initialize minimized

    // ##########################
    // # Floating Window Styles #
    // ##########################

    var style = document.createElement('style');

    function styleSheet(set) {
        if (set) {
            style.type = 'text/css';
            style.id = 'floatingWindowStyles';

            // ###################################
            // # ID floatingWindow (main window) #
            // ###################################

            style.innerHTML = '.floatingWindowWindow { z-index: 9445656445656; overflow: hidden; line-height: 1.9vh; position: fixed; top: 10%; width: 29vh;' +
                'background: rgba(0, 0, 0, 0.8); color: #D9D9D9; padding: 1%; border-radius: 10px; border: 1px solid transparent; box-shadow: 0 0 5px rgba(46, 141, 216, 0.5);' +
                'transition: width 500ms, height 500ms, background-color 250ms ease-in-out, box-shadow 500ms; font-family: "Lato", "Droid", "sans-serif"; }' +
                '.floatingWindow:hover { background: rgba(0, 0, 0, 0.88); box-shadow: 0 0 5px rgba(0, 148, 181, 0.8); color: #FAFAFA }' +
                '.floatingWindow p { margin: 0; padding-bottom: 2.5%; }' +
                '.floatingWindow span { margin: 0; padding-bottom: 1%; }';
            // ##########################################################################
            // # ID floatingWindowData (main window's display. Displays element's data) #
            // ##########################################################################

            style.innerHTML += '.floatingWindowData { overflow: hidden; height: 67%; font-size: 1.75vh; border-bottom: 1px solid rgba(46, 141, 216, 0.5);' +
                'transition: color 350ms ease-in-out; }';

            // #######################################################
            // # ID floatingWindowOptions (main window options' div) #
            // #######################################################

            style.innerHTML += '.floatingWindowOptions { z-index: 9445656445657; width: 100%; background: transparent;' +
                'color: lightblue; opacity: 0.8; font-size: 1.5vh; }';

            // ####################################################################
            // # Styles for menu elements (each element must be inside a SPAN tag #
            // ####################################################################

            style.innerHTML += '.floatingWindowOptions > div { color: #2E8DD8; cursor: pointer; transition: color 350ms ease-in-out; float: left; clear: left; }' +
                '.floatingWindowOptions > span:hover { color: #36A8FF; }';

            // ###################################
            // # Styles for the window title bar #
            // ###################################

            style.innerHTML += '.floatingWindowTitleBar { left: 0; top: 0; padding: 0; position: absolute; color: #2E8DD8; cursor: grabbing; transition: color 350ms ease-in-out; width: 100%;' +
                'height: 5%; border: 0px solid white; border-radius: 10px 10px 0 0; cursor: -webkit-grabbing }' +
                '.floatingWindowTitleBarContain { width: auto; height: auto; padding: 1.4% 1.4% 1.4% 1.4%;}' +
                '.floatingWindowTitleBarContain > div { cursor: pointer; display: block; width: auto; float: right; transition: color 350ms ease-in-out;' +
                'font-size: 1.4vh; font-weight: bold; margin: 1%; }' +
                '.floatingWindowTitleBarContain > div:hover { color: #36A8FF; }';

            // # Append style to document
            document.getElementsByTagName('head')[0].appendChild(style);
        } else {
            style.parentNode.removeChild(style);
        }

    }
    styleSheet(true);

    // ##############################################################
    // # Create the floating window, menu elements. Append to body. #
    // ##############################################################
    var elems = ['Window', 'TitleBar', 'TitleBarContain', 'Data', 'Options', 'closeWindow', 'maximized'],
        options = ['clickRemoves', 'preventLinks', 'buttonsToggle', 'displayToggle', 'highlightElem'],
        allElems = elems.concat(options),
        FloatingWindow = function (id) {
            for (i = 0; i < allElems.length; i++) {
                FloatingWindow.prototype[allElems[i]] = document.createElement("div");
                FloatingWindow.prototype[allElems[i]].setAttribute("class", "floatingWindow" + allElems[i]);
            }

            function appendor(parent, children) {
                if (toString.call(children) === "[object String]") {
                    children = children.split(", ");
                }
                for (i = 0; i < children.length; i++) {
                    FloatingWindow.prototype[parent].appendChild(FloatingWindow.prototype[children[i]]);
                }
            }

            function makeItDraggable(Window) {
                var offY,
                    offX;

                function windowMove(e) {
                    Window.style.position = 'fixed';
                    Window.style.top = (e.clientY - offY) + 'px';
                    Window.style.left = (e.clientX - offX) + 'px';
                }

                function mouseDown(e) {
                    body.style.cssText += "user-select: none; -moz-user-select: none;-webkit-user-select: none;";
                    Window.style.cssText += "user-select: none; -moz-user-select: none;-webkit-user-select: none;";
                    Window.style.cssText += "cursor: grabbing; cursor: -webkit-grabbing;";
                    offY = e.clientY - parseInt(Window.offsetTop, 10);
                    offX = e.clientX - parseInt(Window.offsetLeft, 10);
                    window.addEventListener('mousemove', windowMove, true);
                }

                function mouseUp() {
                    body.style.cssText += "user-select: text; -moz-user-select: text;-webkit-user-select: text;";
                    Window.style.cssText += "user-select: text; -moz-user-select: text;-webkit-user-select: text;";
                    Window.style.cursor = "initial";
                    window.removeEventListener('mousemove', windowMove, true);
                }

                Window.addEventListener('mousedown', mouseDown, false);
                Window.addEventListener('mouseup', mouseUp, false);
            }
            appendor("TitleBar", "TitleBarContain");
            appendor("TitleBarContain", "closeWindow, maximized");
            appendor("Options", options);
            appendor("Window", "TitleBar, Data, Options");
            this.Window.setAttribute("id", id);
            document.body.appendChild(this.Window);
            makeItDraggable(this.Window);
        };

    var omniRemover = new FloatingWindow("omniRemoverWindow");

    // ##############################################################
    // # Defining floating window functionality (setting listeners) #
    // ##############################################################

    var buttonsToggleFlag = false, //Buttons will be 'enabled' first, on menu option click
        displayToggleFlag = true, //Display all divs that are hidden, hide them again on click.
        hoverData = true,
        hiddenTemp = [], //Collection of found hidden elements
        closeWindow;

    function preventLinksP() {
        var preventLink = function (e) {
            var target = e.target;
            while (target) {
                if (target.tagName === "A" || target.tagName === "BUTTON") {
                    e.preventDefault();
                    console.log("Link prevented: ", target.getAttribute("href") || "button");
                    break;
                }
                target = target.parentNode;
            }
        };

        this.toggle = function () {
            if (preventLinksFlag) {
                omniRemover.preventLinks.innerHTML = "Prevent links: YES";
                console.log("Link prevention started");
                body.addEventListener("click", preventLink);
            } else {
                omniRemover.preventLinks.innerHTML = "Prevent links: NO";
                console.log("Link prevention stopped");
                body.removeEventListener("click", preventLink);
            }
            preventLinksFlag = !preventLinksFlag;
        };

        this.unsetListeners = function () {
            body.removeEventListener("click", preventLink);
        };

        //Init
        this.toggle();
    }
    var preventLinks = new preventLinksP();

    function hoverFunctionsP() {
        var oldOp,
            oldBorder;

        this.highlightToggle = function () {
            if (highlightElem) {
                omniRemover.highlightElem.innerHTML = "Highlight: ON";
                console.log("Highlight elems on");
            } else {
                omniRemover.highlightElem.innerHTML = "Highlight: OFF";
                console.log("Highlight elems off");
            }
            highlightElem = !highlightElem;
        };
        var mouseoverEventListener = function (e) {
            var target = e.target;
            if (hoverData) {
                omniRemover.Data.innerHTML =
                    "<p><b>Type: </b>" + target.tagName + "</p>" +
                    "<p><b>ID: </b>" + target.id + "</p>" +
                    "<p><b>Class: </b>" + target.getAttribute("class") + "</p>" +
                    "<p><b>Target: </b>" + target + "</p>";
            }

            if (omniRemover.Window.contains(target) || highlightElem) {
                return false;
            }

            oldOp = target.style.opacity;
            oldBorder = target.style.border;
            target.style.opacity = "0.75";
            target.style.border = "1px dotted #2E8DD8";
        };

        var mouseoutEventListener = function (e) {
            var target = e.target;
            if (omniRemover.Window.contains(target) || highlightElem) {
                return false;
            }

            target.style.opacity = oldOp;
            target.style.border = oldBorder;
        };

        this.startListeners = function () {
            document.addEventListener("mouseover", mouseoverEventListener);
            document.addEventListener("mouseout", mouseoutEventListener);
            console.log("Hover listeners on");
        };
        this.unsetListeners = function () {
            document.removeEventListener("mouseover", mouseoverEventListener);
            document.removeEventListener("moseout", mouseoutEventListener);
            console.log("Hover listeners off");
        };
        //Init
        this.startListeners();
        this.highlightToggle();
    }
    var hoverFunctions = new hoverFunctionsP();

    function clickRemovesP() {
        var elementRemover = function (e) {
            var clickedThis = e.target;
            if (omniRemover.Window.contains(clickedThis)) {
                return false;
            }
            console.log("Removed: ", e.target);
            clickedThis.parentNode.removeChild(clickedThis);
        };

        this.toggle = function () {
            if (clickRemovesFlag) {
                console.log("Element removal by click enabled");
                omniRemover.clickRemoves.innerHTML = "Click removes element: YES";
                document.addEventListener("click", elementRemover);
            } else {
                console.log("Element removal by click disabled");
                omniRemover.clickRemoves.innerHTML = "Click removes element: NO";
                document.removeEventListener("click", elementRemover);
            }
            clickRemovesFlag = !clickRemovesFlag;
        };

        this.unsetListeners = function () {
            document.removeEventListener("click", elementRemover);
        };
        this.toggle();
    }
    var clickRemoves = new clickRemovesP();

    function buttonsToggleP() {
        this.toggle = function () {
            var documentButtons = document.getElementsByTagName("*"),
                tempButtons = [],
                currentButton;
            for (i = 0; i < documentButtons.length; i++) {
                if (documentButtons[i].nodeName === "BUTTON" || documentButtons[i].nodeName === "INPUT") {
                    currentButton = documentButtons[i];
                    tempButtons.push(currentButton);
                    currentButton.disabled = buttonsToggleFlag;
                }
            }
            if (buttonsToggleFlag) {
                console.log(tempButtons.length, " buttons were disabled");
            } else {
                console.log(tempButtons.length, " buttons were enabled");
            }

            buttonsToggleFlag = !buttonsToggleFlag;
        };
        omniRemover.buttonsToggle.innerHTML = "Enable/disable buttons and inputs";
    }
    var buttonsToggle = new buttonsToggleP();

    function displayToggleP() {
        this.toggle = function () {
            if (displayToggleFlag) {
                hiddenTemp = [];
                var documentElems = body.getElementsByTagName("*"),
                    currentElem,
                    computed;
                for (i = 0; i < documentElems.length; i++) {
                    currentElem = documentElems[i];
                    computed = window.getComputedStyle(currentElem);
                    if (computed.display === 'none' || computed.visibility === 'hidden') {
                        hiddenTemp.push(currentElem);
                        currentElem.style.display = "block";
                        currentElem.style.visibility = "visible";
                    }
                }
                if (hiddenTemp.length > 0) {
                    console.log(hiddenTemp.length, " hidden elements are now visible.");
                } else {
                    console.log(hiddenTemp.length, "No hidden elements found");
                    return false;
                }

            } else {
                for (i = 0; i < hiddenTemp.length; i++) {
                    hiddenTemp[i].style.display = "none";
                    hiddenTemp[i].style.visibility = "hidden";
                }
                if (hiddenTemp.length > 0) {
                    console.log(hiddenTemp.length, " hidden elements are back to being hidden.");
                } else {
                    console.log(hiddenTemp.length, "No hidden elements to push back to obscurity");
                }
            }

            displayToggleFlag = !displayToggleFlag;
        };
        omniRemover.displayToggle.innerHTML = "Show/hide initially hidden elements";
    }
    var displayToggle = new displayToggleP();

    function maximizedToggleP() {
        this.toggle = function () {
            if (maximized) {
                omniRemover.Data.innerHTML = "";
                omniRemover.Window.style.height = "38%";
                omniRemover.Options.style.display = "block";
                console.log("Window maximized");
                omniRemover.maximized.innerHTML = "Min";
                hoverData = true;
            } else {
                omniRemover.Data.innerHTML = "";
                omniRemover.Window.style.height = "1%";
                omniRemover.Options.style.display = "none";
                console.log("Window minimized");
                omniRemover.maximized.innerHTML = "Max";
                hoverData = false;
            }
            maximized = !maximized;
        };
        this.toggle();
    }
    var maximizedToggle = new maximizedToggleP();

    var floatingWindowListener = function (e) {
        switch (e.target) {

        case omniRemover.clickRemoves:

            clickRemoves.toggle();
            return false;

        case omniRemover.preventLinks:

            preventLinks.toggle();
            return false;

        case omniRemover.maximized:

            maximizedToggle.toggle();
            return false;

        case omniRemover.buttonsToggle:

            buttonsToggle.toggle();
            return false;

        case omniRemover.displayToggle:

            displayToggle.toggle();
            return false;

        case omniRemover.highlightElem:

            hoverFunctions.highlightToggle();
            return false;

        case omniRemover.closeWindow:

            closeWindow.constructor(true);
            return false;
        }
    };
    omniRemover.Window.addEventListener("click", floatingWindowListener);

    function closeP(boolean) {
        if (boolean) {
            styleSheet("destroy");
            omniRemover.Window.removeEventListener("click", floatingWindowListener);
            preventLinks.unsetListeners();
            hoverFunctions.unsetListeners();
            clickRemoves.unsetListeners();
            preventLinks = undefined;
            hoverFunctions = undefined;
            clickRemoves = undefined;
            maximized = undefined;
            buttonsToggle = undefined;
            displayToggle = undefined;
            closeWindow = undefined;
            omniRemover.Window.parentNode.removeChild(omniRemover.Window);
            console.log("Element removal by click disabled");
            console.log("#############################################################");
            console.log("Script stopped, everything back to normal. Please reload page");
        } else {
            omniRemover.closeWindow.innerHTML = "Close";
        }
    }
    closeWindow = new closeP(false);

    // ############################
    // # Survey detection methods #
    // ############################

    function surveyTypes() {
        var type,
            //Test for gLoader surveys
            windowVars = [];
        for (i in window) {
            if (i.lastIndexOf("gLoad", 0) === 0) {
                windowVars.push(i);
                type = "gLoader";
            }
        }
        switch (type) {

        case "gLoader":
            console.log("gLoader survey detected! Removing it...");
            var gLoaderIframes = document.getElementsByTagName("iframe"),
                gLoaderVar;
            for (i = 0; i < gLoaderIframes.length; i++) {
                gLoaderIframes[i].parentNode.removeChild(gLoaderIframes[i]);
                console.log("Removing iframes...");
            }
            for (i in windowVars) {
                if (windowVars[i].lastIndexOf("gLoad", 0) === 0) {
                    gLoaderVar = windowVars[i];
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


