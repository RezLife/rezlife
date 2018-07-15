# ResApp

## What's ResApp?

ResApp is a Web App developed by Wheaton CS students to assist Resident Life staff in doing day-to-day tasks. 

As many former RAs and RDs have shared, working in ResLife can be daunting. They have to organize event, respond to emergencies, clean up facilities, undergo training, facilitate storage, keep quiet hours, and many, many more tasks. It is easy to be overwhelmed by all the moving pieces.

As a team, we wanted to provide a solution. Our main goal is to help ResLife staff focus less on the logistics and more on what's important: their students. 

## Features 
Below is a high-level overview of the existing features in ResApp: 

### 1. Emergency Manual: 

**This feature provides access to the emergency procedures that is in the official ResLife Manual.**

Reslife Staff is often the number one responders when a crisis happens in the dorms and apartments. Currently, all the emergency procedures are located in a heavy, thick binder and often out of reach when these emergencies occur. With this feature, staff can access crucial information anywhere, anytime. 

### 2. Phonebook: Access important phone numbers 

**This feature provides access to all the phone numbers important to a ResLife staff.** 

From Public Safety to the Counseling center, any number can be quickly looked up and called. In mobile, users can simply click on a number and it will dial automatically.

### 3. Calendar:

**This feature allows staff to view events going on in the dorms on their devices.**

Usually, the staff keeps track of dorm events (floor raids, training times, etc) in a physical calendar, located in the staff lounge. With this feature, staff can view the dorm calendar anywhere and anytime.

This feature of the app is integrated with Google Calendar, thus the ARDs, who is tasked with keeping track of events, can simply login to the Google Calendar account and edit the events on the Google Calendar UI, instead of having to keep track of the calendar in multiple physical locations. 

### 4. Roster 

**This feature allows staff to upload the entire student roster to an online database, print rosters by floor number, and search students by their ID, name, and room number**

Every beginning of the semester, RDs receives a large Excel file containing resident information. During orientation week, the RDs would then have to manually (in Excel) categorize the residents by floor/dorm and print out these lists, since new students need a reference in finding their designated room.

During the semester, RDs would have to update these Excel files whenever a student transfers in or out of the dorm: find the person in the Excel file, erase their information, reformat the table, add the new student, etc. 

Often, RDs would also have to look through these Excel files to find a student by their ID, room number, so that the student can be notified of emergencies, policy violations, or a lost ID. RDs often have to communicate with other dorms in finding these students, since at the time they only have access to their dorm's roster.

With this feature, Reslife staff can do all of the above with only a few button clicks. We have streamlined the process so that all Reslife needs to do is upload a .csv file, then they can print student information by floor, search students on any dorms, and delete the roster whenever the year ends. 

### 5. Account Management

**This feature allows admins (RDs, GRAs) to control who has access to the Web App.**

Only those with access to the Wheaton network and those given permission by the Admin can access the app. RDs and GRAs can simply submit and delete email addresses that can access the app.


## Installation Instructions

Follow the steps below to host the web app on your local machine. 

### Prerequisites

1. Node.js
2. npm 
3. Command line / Shell
4. Connection to Wheaton College network/database
5. Browser

Refer to the Not-so-Quickstart for installation guides for the tools above.

### Step-by-Step Instructions

1. Clone the source code to your working directory: `git clone https://github.com/RezLife/rezlife.git`.
2. Open up the command line tool / shell.
3. Navigate to the `rezlife` folder within your working directory (top level of the source code) and install all dependencies by executing `npm install` in the command line.
4. After installing, run `node app.js` in the command line. The terminal should output: `Listening on port 3000...`.
5. Open up your browser and type in `localhost:3000` and the landing page of the web app should load.
6. Congratulations! You've successfully loaded the web app.

## Developer Notes

### General Notes

1. A file named `errors.log` will be created during production, which will log all errors occurring within the app for debugging purposes.
2. `package.json` lists all the dependencies used in this app, which can be installed using `npm install`. The dependencies are then stored in the `node_modules` folder.
3. **DO NOT** commit and push `package-lock.json`, `node_modules` and `errors.log` as this will cause many merge conflicts and chaos for others. **Tip:** These are included in the `.gitignore` to prevent accidental commits.
4. If you're not connected to the Wheaton Network, you would not be able to login since the database containing login information is only accessible through the Wheaton Network. **To change database configurations,** go to `model/api.js` and change the variables within the `con` variable. **Tip:** If you're off-campus, use Wheaton's GlobalProtect VPN to access the network. 

### Tips and Tricks

1. Use a package manager like `nvm` or `homebrew` to make installation a whole lot easier. 
2. Install `nodemon` when developing, as it will stop and start the server automatically as you make changes. 

### Understanding the Code
1. `app.js` is the entrypoint of the app, acting as the controller of the web app.
2. `model` contains code and services that interact with the database.
2. `views` contains all the HTML / Handlebars files.
3. `public` contains all the static content of the web app.
4. `controller` contains functions that is used within `app.js`

## Not-so-Quickstart

The programming languages/frameworks that will be used in this web app: 
1. **Front-end/Client-side**: HTML, CSS, JQuery, JavaScript 
2. **Back-end/Server-side**: Node.js, Express.js
3. **Database**: MySQL

HTML, CSS, and Javascript should be already installed in your systems (unless you somehow never used a browser in your life.)

Below are instructions to set up your own local server and start serving/displaying your web app. 

### A. Development Environment Installation
First, we need to install/download all the tools needed for start creating our web app! Detailed instructions for each system is provided below. 

### Windows

##### 1. Node.js and NPM

1. Download the Windows installer from the [Nodes.js website](https://nodejs.org/en/download/).
2. Run the installer and accept default installation settings. 

More details can be found [here](http://blog.teamtreehouse.com/install-node-js-npm-windows).

### MacOS

##### 1. Homebrew
Homebrew is a package installer that makes installing packages easier in MacOS. 

Install brew [here](https://brew.sh/).

##### 2. XCode
XCode is a development software to build Mac apps, but will have the tools needed to compile software for Mac. You can find it in the [Apple Mac Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12).

##### 3. Node.js and NPM
Node.js is a JavaScript framework that allows Javascript use in the server. 

Install Node.js using brew: `brew install node`. 

This should also install npm, which is the package manager for JavaScript.

### Linux

##### 1. Linuxbrew
Linux is a package installer that makes installing packages easier in Linux, an extension of Homebrew for MacOS. 

Install it [here](http://linuxbrew.sh/).

##### 2. Ruby and GCC
- For **Ubuntu** or **Debian**-based, run the following command in terminal to install: 
`sudo apt-get install build-essential curl git m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev`
- For **Fedora** based, run the following command in terminal to install:
`sudo yum groupinstall 'Development Tools' && sudo yum install curl git m4 ruby texinfo bzip2-devel curl-devel expat-devel ncurses-devel zlib-devel`

These installation details can be found [here](http://blog.teamtreehouse.com/install-node-js-npm-linux).

##### 3. Node.js and NPM
Node.js is a JavaScript framework that allows Javascript use in the server. 

Install Node.js using brew: `brew install node`. 

This should also install npm, which is the package manager for JavaScript.


