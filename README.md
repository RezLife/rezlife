# RezLife
Web App for Resident Life Staff/Residents 

The programming languages/frameworks that will be used in this web app: 
1. **Front-end/Client-side**: HTML, CSS, JavaScript 
2. **Back-end/Server-side**: Node.js, Express.js
3. **Database**: MySQL

HTML, CSS, and Javascript should be already installed in your systems (unless you somehow never needed a browser.)

Below are instructions to set up your own local server and start serving/displaying your web app. 

### A. Development Environment Installation
First, we need to install/download all the tools needed for start creating our web app! Detailed instructions for each system is provided below. 

### Windows

##### 1. Node.js and NPM

1. Download the Windows installer from the [Nodes.js website](https://nodejs.org/en/download/).
2. Run the installer and accept default installation settings. 

More details can be found [here](http://blog.teamtreehouse.com/install-node-js-npm-windows).

##### 2. Express.js
Before we install express, we would need to get our repository ready.
1. Using command line, clone the repo: `git clone https://github.com/RezLife/rezlife.git`.
2. Then install a *package.json* file and *node_module* folder (which contains express.js) by following the instructions [here](https://expressjs.com/en/starter/installing.html). 

**Note about the installation:** 
1. What the instruction means by "entry point" is which "main file" does the app start in. In Java, it's like the file where the "main" method is located.  
2. *node_module* is a folder containing various packages handy for web app development. Its like the java library containing things like HashMap, Math, etc. 

Now you're ready to start your server!

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

##### 4. Express.js
Before we install express, we would need to get our repository ready.
1. Using command line, clone the repo: `git clone https://github.com/RezLife/rezlife.git`.
2. Then install a *package.json* file and *node_module* folder (which contains express.js) by following the instructions [here](https://expressjs.com/en/starter/installing.html). 

**Note about the installation:** 
1. What the instruction means by "entry point" is which "main file" does the app start in. In Java, it's like the file where the "main" method is located.  
2. *node_module* is a folder containing various packages handy for web app development. Its like the java library containing things like HashMap, Math, etc. 

Now you're ready to start your server!

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

##### 4. Express.js
Before we install express, we would need to get our repository ready.
1. Using command line, clone the repo: `git clone https://github.com/RezLife/rezlife.git`.
2. Then install a *package.json* file and *node_module* folder (which contains express.js) by following the instructions [here](https://expressjs.com/en/starter/installing.html). 

**Note about the installation:** 
1. What the instruction means by "entry point" is which "main file" does the app start in. In Java, it's like the file where the "main" method is located.  
2. *node_module* is a folder containing various packages handy for web app development. Its like the java library containing things like HashMap, Math, etc. 

Now you're ready to start your server!

### B. Server Creation
Below are instructions to start a server on your local machine and display it on your own browser:

1. First, you would need to create a main .js file from which the server runs. An example script is written in [helloworld.js](https://github.com/RezLife/rezlife/blob/master/src/helloworld.js), which is in the script. Currently, helloworld.js serves an html file (index.html) included in the folder *views*. Details of how it works is commented in the script. 
2. In the same directory of the main script, execute `node helloworld.js` in command line. In the console, `Listening on port 3000....` should be displayed.
3. Go to browser and go to `localhost:3000`, and a static html file should be displayed!

