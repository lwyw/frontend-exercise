## Git History ##

I started out lookng for a template that is an alternative to bootstrap and zurb foundation because I have used them before. This is where I found <a href="http://getskeleton.com/" target="_blank">Skeleton</a>, a really simple temple with roughly 200 lines of code. I like the KISS (Keep it simple, stupid) and DRY (Don't repeat yourself) principles and I do my best to adhere to them. In this case, Skeleton is perfect since it is such a simple template.


I used <a href="https://angularjs.org/" target="_blank">Angular</a> for the frontend becaue I am excited about the new Angular 2.0 that is coming up. Although the new Angular 2.0 is suppoed to be radically different and it uses ECMAScript 6, I still enjoying writing frontend applications in Angular. After all the hours put into learning how to write custom directives and the concept of transclusion, it is nice to put those skills in use.

The exercise is really free-form which I enjoyed. Intially, I built a simple Angular web application that performs an API call to get a list of GitHub repositories and hide the details (as required by this exercise) until the "owner/name" link was clicked on. The Skeleton template did a wonderful job of presenting the form and information from GitHub. So I thought to myself, what more can I do with this page.

Upon perusing the API documentation, the maximum number of repositories from a search is 1000 and each page displays a 100 repositories. A while ago, I wrote an Angular directives that calls a function when the page in the browser in scroll all the way down the bottom, I thought why not use it. Like other contemporary web applications, I made this applcation continually expand the list of search result by scrolling to the bottom, until the end of the search result, which is always the 1000th as determined by GitHub.

## Setup ##
Please serve the files in its current folder structure. Bower is used to download and manage the JavaScript libraries, so feel free to re-download them using "bower install".