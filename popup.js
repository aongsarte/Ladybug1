var app = angular.module( "Ladybug", [] );
app.controller(
           "AppController",
           function( $scope, timer ) {
               // I am a timer that will invoke the given callback once the timer has
               // finished. The timer can be reset at any time.
               // --
               // NOTE: Is a thin wrapper around $timeout() which will trigger a $digest
               // when the callback is invoked.
               var logClickTimer = timer( logClick, timer.TWO_SECONDS );
               $scope.logExecutedAt = null;
               // When the current scope is destroyed, we want to make sure to stop
               // the current timer (if it's still running). And, give it a chance to
               // clean up its own internal memory structures.
               $scope.$on(
                   "$destroy",
                   function() {
                       logClickTimer.teardown();
                   }
               );
               // ---
               // PUBLIC METHODS.
               // ---
               // I handle the click event. Instead of logging the click right away,
               // we're going to throttle the click through a timer.
               $scope.handleClick = function() {
                   $scope.logExecutedAt = null;
                   logClickTimer.restart();
               };
               // ---
               // PRIVATE METHODS.
               // ---
               // I log the fact that the click happened at this point in time.
               function logClick() {
                   $scope.logExecutedAt = new Date();
               }
           }
       );
       // -------------------------------------------------- //
       // -------------------------------------------------- //
       // I create timers that wrap the $timeout and provide easy ways to cancel and
       // reset the timer.
       app.factory(
           "timer",
           function( $timeout ) {
               // I provide a simple wrapper around the core $timeout that allows for
               // the timer to be easily reset.
               function Timer( callback, duration, invokeApply ) {
                   // Store properties.
                   this._callback = callback;
                   this._duration = ( duration || 0 );
                   this._invokeApply = ( invokeApply !== false );
                   // I hold the $timeout promise. This will only be non-null when the
                   // timer is actively counting down to callback invocation.
                   this._timer = null;
               }
               // Define the instance methods.
               Timer.prototype = {
                   // Set constructor to help with instanceof operations.
                   constructor: Timer,
                   // I determine if the timer is currently counting down.
                   isActive: function() {
                       return( !! this._timer );
                   },
                   // I stop (if it is running) and then start the timer again.
                   restart: function() {
                       this.stop();
                       this.start();
                   },
                   // I start the timer, which will invoke the callback upon timeout.
                   start: function() {
                       var self = this;
                       // NOTE: Instead of passing the callback directly to the timeout,
                       // we're going to wrap it in an anonymous function so we can set
                       // the enable flag. We need to do this approach, rather than
                       // binding to the .then() event since the .then() will initiate a
                       // digest, which the user may not want.
                       this._timer = $timeout(
                           function handleTimeoutResolve() {
                               try {
                                   self._callback.call( null );
                               } finally {
                                   self = self._timer = null;
                               }
                           },
                           this._duration,
                           this._invokeApply
                       );
                   },
                   // I stop the current timer, if it is running, which will prevent the
                   // callback from being invoked.
                   stop: function() {
                       $timeout.cancel( this._timer );
                       this._timer = false;
                   },
                   // I clean up the internal object references to help garbage
                   // collection (hopefully).
                   teardown: function() {
                       this.stop();
                       this._callback = null;
                       this._duration = null;
                       this._invokeApply = null;
                       this._timer = null;
                   }
               };
               // Create a factory that will call the constructor. This will simplify
               // the calling context.
               function timerFactory( callback, duration, invokeApply ) {
                   return( new Timer( callback, duration, invokeApply ) );
               }
               // Store the actual constructor as a factory property so that it is still
               // accessible if anyone wants to use it directly.
               timerFactory.Timer = Timer;
               // Set up some time-based constants to help readability of code.
               timerFactory.ONE_SECOND = ( 1 * 1000 );
               timerFactory.TWO_SECONDS = ( 2 * 1000 );
               timerFactory.THREE_SECONDS = ( 3 * 1000 );
               timerFactory.FOUR_SECONDS = ( 4 * 1000 );
               timerFactory.FIVE_SECONDS = ( 5 * 1000 );
               // Return the factory.
               return( timerFactory );
           }
       );




// chrome.app.runtime.addListener(function(launchData) {
//   chrome.app.window.create('../popup.html', {
//     id: "Ladybug",
//     bounds: {
//       width: 500,
//       height: 600
//     },
//     minWidth: 500,
//     minHeight: 600,
//     frame: 'none'
//   });
// });
//
//

// // Copyright (c) 2014 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.
//
// /**
//  * Get the current URL.
//  *
//  * @param {function(string)} callback - called when the URL of the current tab
//  *   is found.
//  */
// function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };
//
//   chrome.tabs.query(queryInfo, function(tabs) {
//     // chrome.tabs.query invokes the callback with a list of tabs that match the
//     // query. When the popup is opened, there is certainly a window and at least
//     // one tab, so we can safely assume that |tabs| is a non-empty array.
//     // A window can only have one active tab at a time, so the array consists of
//     // exactly one tab.
//     var tab = tabs[0];
//
//     // A tab is a plain object that provides information about the tab.
//     // See https://developer.chrome.com/extensions/tabs#type-Tab
//     var url = tab.url;
//
//     // tab.url is only available if the "activeTab" permission is declared.
//     // If you want to see the URL of other tabs (e.g. after removing active:true
//     // from |queryInfo|), then the "tabs" permission is required to see their
//     // "url" properties.
//     console.assert(typeof url == 'string', 'tab.url should be a string');
//
//     callback(url);
//   });
//
//   // Most methods of the Chrome extension APIs are asynchronous. This means that
//   // you CANNOT do something like this:
//   //
//   // var url;
//   // chrome.tabs.query(queryInfo, function(tabs) {
//   //   url = tabs[0].url;
//   // });
//   // alert(url); // Shows "undefined", because chrome.tabs.query is async.
// }
//
// /**
//  * @param {string} searchTerm - Search term for Google Image search.
//  * @param {function(string,number,number)} callback - Called when an image has
//  *   been found. The callback gets the URL, width and height of the image.
//  * @param {function(string)} errorCallback - Called when the image is not found.
//  *   The callback gets a string that describes the failure reason.
//  */
// function getImageUrl(searchTerm, callback, errorCallback) {
//   // Google image search - 100 searches per day.
//   // https://developers.google.com/image-search/
//    var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
//      '?v=1.0&q=' + encodeURIComponent(searchTerm);
//   var x = new XMLHttpRequest();
//   x.open('GET', searchUrl);
//   // The Google image search API responds with JSON, so let Chrome parse it.
//   x.responseType = 'json';
//   x.onload = function() {
//     // Parse and process the response from Google Image Search.
//     var response = x.response;
//     if (!response || !response.responseData || !response.responseData.results ||
//         response.responseData.results.length === 0) {
//       errorCallback('No response from Google Image search!');
//       return;
//     }
//     var firstResult = response.responseData.results[0];
//     // Take the thumbnail instead of the full image to get an approximately
//     // consistent image size.
//     var imageUrl = firstResult.tbUrl;
//     var width = parseInt(firstResult.tbWidth);
//     var height = parseInt(firstResult.tbHeight);
//     console.assert(
//         typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//         'Unexpected respose from the Google Image Search API!');
//     callback(imageUrl, width, height);
//   };
//   x.onerror = function() {
//     errorCallback('Network error.');
//   };
//   x.send();
// }
//
// function renderStatus(statusText) {
//   document.getElementById('status').textContent = statusText;
// }
//
// // document.addEventListener('DOMContentLoaded', function() {
// //   getCurrentTabUrl(function(url) {
// //     // Put the image URL in Google search.
// //     renderStatus('Performing Google Image search for ' + url);
// //
// //     getImageUrl(url, function(imageUrl, width, height) {
// //
// //       renderStatus('Search term: ' + url + '\n' +
// //           'Google image search result: ' + imageUrl);
// //       var imageResult = document.getElementById('image-result');
// //       // Explicitly set the width/height to minimize the number of reflows. For
// //       // a single image, this does not matter, but if you're going to embed
// //       // multiple external images in your page, then the absence of width/height
// //       // attributes causes the popup to resize multiple times.
// //       imageResult.width = width;
// //       imageResult.height = height;
// //       imageResult.src = imageUrl;
// //       imageResult.hidden = false;
// //
// //     }, function(errorMessage) {
// //       renderStatus('Cannot display image. ' + errorMessage);
// //     });
// //   });
// // });
// document.addEventListener('DOMContentLoaded', function() {
//   renderStatus('This will work');
// })
