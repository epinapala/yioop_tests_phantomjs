var page = new WebPage(),
  testindex = 0,
  loadInProgress = false;
var fs = require('fs');
var path = 'output.json';

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
    this.evaluate(function(selector) {
        console.log("clicking - selector: "+selector);

        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        document.querySelector(selector).dispatchEvent(e);
    }, selector);
};

page.assertExists = function(selector,message){
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

  console.log(res.status + " ->>>> " + res.msg);
  return res;
};

var steps = [

  function testHomePage() {
    //Load Login Page
    page.open("http://yioop.com/", function() {
      console.log("PASS Open Home page.");
      return true;
    });
  },
  function testSignInLink() {
    var result = page.assertExists('body > div.landing-top-bar > div.user-nav > ul > li:nth-child(2) > a', "Signin link exists", page);
    if (result.ack) {
      page.render('img/home.png');
      page.evaluate(function() {
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        document.querySelector("a[href='./?c=admin']").dispatchEvent(ev);
      });

    } else {
      console.log("Failed Test");
    }
    return result;
  },
  function testLoginFormExists() {
    var result = page.assertExists('body > div.landing.non-search > form', "Login Form exists", page);
    if (result.ack) {
      page.render('img/login_page.png');
      //Enter Credentials
      page.evaluate(function() {
        document.getElementById("username").value = "epinapala";
        document.getElementById("password").value = "";
        document.querySelector('body > div.landing.non-search > form').submit();
        return;
      });
    } else {
      console.log("Failed Test");
    }
    return result;
  },
  function testHelpButtonExists() {
    var result = page.assertExists('body > div.component-container > div:nth-child(2) > ul > li:nth-child(1) > a', "Manage groups Link exists", page);
    if (result.ack) {
      page.render('img/loggedin.png');
      page.click('body > div.component-container > div:nth-child(2) > ul > li:nth-child(1) > a');
    } else {
      console.log("Failed Test");
    }
  },
  function testHelpButtonExists() {
    var result = page.assertExists('button[data-pagename="Browse Groups"]', "Help Button exists On Manage groups Page", page);
    if (result.ack) {
      page.render('img/help_button_exists.png');
      debugger;
      //click on help
      page.click('button[data-pagename="Browse Groups"]');

      
    } else {
      console.log("Failed Test");
    }
  },
  function() {
    page.render('img/help_open_browse_groups.png');
    // Output content of page to stdout after form has been submitted
    page.evaluate(function() {

      //console.log(document.querySelectorAll('html')[0].outerHTML);
    });
  }
];


function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}


interval = setInterval(function() {
  if (!loadInProgress && typeof steps[testindex] == "function") {
    //console.log(">>>> Step " + (testindex + 1) + " <<<<<<");
    var func = steps[testindex];
    var result = steps[testindex]();
    console.log("step " + (testindex + 1) + ": " + functionName(func));
    if (result) console.log(result.status + " - " + result.msg);
    testindex++;
  }
  if (typeof steps[testindex] != "function") {
    console.log("test complete!");
    phantom.exit();
  }
}, 2000);


var results = [];
/*
var assertExists = function(selector, message, page) {
  var res = {};
  res.msg = message;
  res.elm = null;
  
    res.elm = page.evaluate(function(selector) {
      return document.querySelector(selector);
    }, selector);
  


  if (res.elm) {
    res.status = "PASS";
    res.ack = true;
  } else {
    res.status = "FAIL";
    res.ack = false;
  }

  console.log(res.status + " ->>>> " + res.msg);
  return res;
};







function waitFor(page, selector, expiry, callback) {
  system.stderr.writeLine("- waitFor( " + selector + ", " + expiry + " )");

  // try and fetch the desired element from the page
  var result = page.evaluate(
    function(selector) {
      return document.querySelector(selector);
    }, selector
  );

  // if desired element found then call callback after 50ms
  if (result) {
    system.stderr.writeLine("- trigger " + selector + " found");
    window.setTimeout(
      function() {
        callback(true);
      },
      50
    );
    return;
  }

  // determine whether timeout is triggered
  var finish = (new Date()).getTime();
  if (finish > expiry) {
    system.stderr.writeLine("- timed out");
    callback(false);
    return;
  }

  // haven't timed out, haven't found object, so poll in another 100ms
  window.setTimeout(
    function() {
      waitFor(page, selector, expiry, callback);
    },
    100
  );
}*/