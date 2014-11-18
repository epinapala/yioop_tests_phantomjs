var page = require('webpage').create(),
    testindex = 0,
    loadInProgress = false,
    fs = require('fs'),
    path = 'results.json',
    results = {},
    system = require('system'),
    args = system.args,
    DEBUG = false,
    page_url = "http://localhost/yioop/";

if (args[1] === "true") {
    DEBUG = true;
}

/**
 * set viewport for debugging using slimerjs.
 */
page.viewportSize = {
    width: 1440,
    height: 768
};

page.settings.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25';

/**
 * Helper Functions
 */
function l(msg) {
    !DEBUG || console.log("[Debug] : " + msg);
}

function functionName(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}

function writeToFile(filename, contents) {
    try {
        fs.write(filename, contents, 'w');
    } catch (e) {
        console.log(e);
    }
}

function renderTestResults() {
    console.log(JSON.stringify(results));
    //writeToFile(path,JSON.stringify(results));
}

/**
 * PhantomJs Tests setup.
 **/
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
};

page.onLoadFinished = function() {
    loadInProgress = false;
};

page.click = function(selector) {
    l("Clicking Element[ " + selector + "]");
    this.evaluate(function(selector, l) {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        document.querySelector(selector).dispatchEvent(e);
    }, selector, l);
};

page.assertExists = function(selector, message) {
    var res = {};
    res.msg = message;
    res.elm = null;

    res.elm = this.evaluate(function(selector) {
        return document.querySelector(selector);
    }, selector);

    if (res.elm) {
        res.status = "PASS";
        res.ack = true;
    } else {
        res.status = "FAIL";
        res.ack = false;
    }

    return res;
};

var steps = [

    function testHomePage() {
        page.open(page_url, function() {
            return true;
        });
    },
    function testSignInLink() {
        var result = page.assertExists('body > div.landing-top-bar > div.user-nav > ul > li:nth-child(2) > a', "Signin link exists", page);
        if (result.ack) {
            page.render('img/hoem_page.png');
            page.evaluate(function() {
                var ev = document.createEvent("MouseEvents");
                ev.initEvent("click", true, true);
                document.querySelector("a[href='./?c=admin']").dispatchEvent(ev);
            });

        } else {
            l("Failed Test");
        }
        return result;
    },function testManageGroupsPage() {
        page.open(page_url + "?c=admin&a=manageGroups", function() {
            return true;
        });
    },
    function testLoginFormExists() {
        var result = page.assertExists('body > div.landing.non-search > form', "Login Form exists", page);
        if (result.ack) {
            page.render('img/login_page.png');
            //Enter Credentials
            document.location = page_url + "?c=admin&a=manageGroups";
            page.evaluate(function() {
                document.getElementById("username").value = "root";
                document.getElementById("password").value = "Usharani7*";
                document.querySelector('body > div.landing.non-search > form').submit();
                return;
            });
        } else {
            l("Failed Test");
        }
        return result;
    },function testHelpButtonExists() {
        var result = page.assertExists('button[data-pagename="Browse Groups"]', "Help Button exists On Manage groups Page", page);
        document.querySelector('button[data-pagename="Browse Groups"]').click();
        if (result.ack) {
            page.render('img/help_button_exists.png');
            //click on help
            page.click('button[data-pagename="Browse Groups"]');
        } else {
            l("Failed Test");
        }
        return result;
    },
    function testEditLinkForHelpArticlsExists() {
        var result = page.assertExists('#page_name > a', "Edit Link for Help article exists", page);
        if (result.ack) {
            page.render('img/help_open_browse_groups.png');
            page.click('#page_name > a');

        } else {
            l("Failed Test");
        }
        return result;
    },
    function() {
        page.render('img/final.png');
        page.evaluate(function() {
            //console.log(document.querySelectorAll('html')[0].outerHTML);
        });
    }
];


interval = setInterval(function() {
    if (!loadInProgress && typeof steps[testindex] == "function") {
        var func = steps[testindex];
        var result = steps[testindex]();
        var function_name = functionName(func);
        l("Test #" + (testindex + 1) + ": " + function_name);
        if (result) {
            l(result.status + " - " + result.msg);
            delete result.elm;
            results[function_name] = (result);
        }
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        l("All Tests complete!");
        renderTestResults();
        phantom.exit();
    }
}, 2000);