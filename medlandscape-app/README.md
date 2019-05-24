This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Medlandscape Library

The medlandscape library is a simple tool to visualize different operating figures across the swiss landscape, concerning values corresponding with the swiss health sector.

The application allows you to view, search and compare different figures of hospitals and cantons in Switzerland. The different parts of this application let you see these figures in a Map-, Table or Statistics-View. Available in German or French.

## Installation

Before you can do anything with our app you will have to download 

### `node.js`

The newest Version is ready to be downloaded at: https://nodejs.org/en/download/

After installing node.js  and before running the script to this application you have to install the different modules used. Open your desired Terminal and go to the directory, where you have saved the application. Move into the *"medlandscape-app"* folder and enter:

### `npm -g install`

Wait for the terminal to load the different modules.

After the modules have loaded you can start the application by entering:

### `npm start`

This Runs the app in the development mode.<br>

Wait for the code to be compiled and your standard browser to open a new page on [http://localhost:3000](http://localhost:3000). If this does not happen automatically you can enter the address into your browser manually to view the application in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Further available scripts

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Usage

Once you have installed the different modules and have managed to start the application there are many different things you can do.

### Map-View

#### Hospital-Map

##### Initial Site

![1558711354060](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\1558711354060.png)

The initial site will look like this. In the centre there is a map displaying the swiss country boundary and the several canton boundaries. Already showing are the different dots in different colours, which represent the hospitals on their respective position on the map.  In the upper left corner you have a Control-Panel, which gives you various options to chose from. Directly to the right you have an informational text field, depicting the chosen Variable and the chosen year, as well as the number of hospitals that are shown on the map. In the upper right corner there are tools to zoom in and out of the map, a reset button for the map-view and a button to change the language between German and French. On the bottom there is a time bar which let's you switch between the years, to compare the displayed values over the years.

##### Changing the language

To change the language on any view, simply click the small button in the upper right corner displaying either DE (for German) or FR (for French).![Language-Button](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\Language-Button.jpg)



##### Changing the different types of Hospitals

If you want to change what kind of hospitals are display, simply click on the checkbox to your desired hospital type and the map will adjust accordingly, even changing the sizes of the different circles such as to show the size in relation only to the selected types of hospitals.

##### ![1558711473453](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\1558711473453.png)

In the Control-Panel in the upper left corner, there are two dropdown menus, which let you select your desired variable as well as any special filters you want to apply to the map.

![DropdownMenus](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\DropdownMenus.jpg)

##### Changing the displayed Year

Simply click on your desired year on the time bar and see how the circles adjust over the different years.

##### Getting Information about the different hospitals

Simply click on your desired hospital. A small pop-up will appear and show you the information to the selected variable, as well as some basic information about your selected hospital.

![1558714633283](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\1558714633283.png)

##### Changing to the Canton-View

If you want to change to the Canton-View simply press the button labelled "Kanton" or "Canton" in the Control-Panel.

![Kanton-Change](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\Kanton-Change.jpg)



#### Canton-View

##### Initial Site

![1558714323384](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\1558714323384.png)

The Canton-View looks very similar to the Hospital-View. It includes the same tools in the right upper corner as the Hospital-View, as well as the text field in the middle on top, to display the adjusting information.

Choosing a variable works the same way as in the Hospital-View. Simply click on the dropdown and select your desired variable.

##### Understanding the Canton-View

Upon selecting a variable the map will update and show a distribution of your selected variable over the different cantons. The Map functions the same as before and let's you select different years and click on your desired canton to see the specific information concerning your selected variable as well as your selected canton.

New on this page, there is a legend in the bottom right corner, showing you the distribution of the different values and colours used in the map.

![1558714897999](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\1558714897999.png)



### Switching to the Table- or Statistics-Panel

Switching between the different panels functions the same as, switching between the different map-views. Simply click on the desired icon and you will be transferred to the new panel.

![PanelChange](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\PanelChange.jpg)

### Table

The Table view let's you create different tables with hospitals and variables that you decide. After creation you can simply export them to a csv-file with one click.

##### Initial Site

![TableView](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\TableView.JPG)

The table-panel contains many already known buttons in the upper right and left corner which function the same through out the whole application.

##### Adding and removing hospitals and variables

The top row in the table shows your variables. You can simply select your desired Variable, by choosing it in the corresponding dropdown menu. The same way you can choose your hospital in the column to the left.

If you want to add a variable or hospital, simply click on the plus button in the corresponding row or column, to add a new dropdown menu where you can select a variable or hospital again.

You can also use the "Alle Spitäler hinzufügen" button to add all hospitals at once.

If you wish to remove a hospital or variable from your table, simply hover over the dropdown menu and you will see a small cross appear in the top right corner of the dropdown menu. Once you click this the variable or Hospital will disappear.

![TableEntf](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\TableEntf.JPG)

##### Creating the table

Once you have selected your hospitals and your variables simply click the "Tabelle generieren" button in the top left corner of the panel and see how your data appears.

#### Using the created table

##### Choosing different years

Once you create your table there appears a new dropdown beneath your variables, depicting the available different years, so you can compare the same variable for the same hospital over different years. 

![1558717462396](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\1558717462396.png)

##### Sorting your values

Beneath each variable there are two buttons which let you sort the generated table in ascending or descending order in relation to the variable they belong to.

##### Exporting the table to csv

After having created your table and having everything sorted the way you want it, you can simply click on the "CSV-Datei erstellen" button, which then creates and downloads the corresponding table for you.

### Statistics

The statistics-panel let's you create a boxplot to one specific variable or a linear regression with two different or equal variables of your choosing.

#### Boxplot

In the Boxplot you can choose a variable in the Control-Panel to then be display as a boxplot-graph with the corresponding values.

![1558718276304](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\1558718276304.png)

##### Changing to the linear regression

The change to the linear regression follows the same principles as changing from the hospital-view to the canton-view in the Maps-Panel.

### Linear regression

The linear regression shows a simple graph with dropdown menus on the y- and x-axis. By choosing your desired variables in the dropdowns the graph shows you the linear regression to these two variables.

Once the graph has been generated you can safely click the different circles in the graph to show you the corresponding hospitals and their values.

![1558718602459](C:\Users\linoh\GitHub\medlandscape\medlandscape-app\ReadMeGallery\1558718602459.png)



## Authors

This application has been made by CS students of the university Bern in collaboration with the **eonum-AG** in Bern. 

Code written by:

Luca Bulletti

Robin Bürkli

Elio Fritschi

Lino Hess

Roland Widmer

Special thanks to Tim Peter and Tess Hoppler of the eonum-AG for giving us the opportunity to work on this application.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
