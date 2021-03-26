# Covid Vaccine Finder

Chrome Extension to help find available covid vaccine appointments.  This currently only supports vaccination sites in San Diego County as of Jan 28, 2021.  This can be set to retry at user-defined intervals (in minutes) until available appointments are found.

### Development
- `npm run dev` to build src files in development mode
- `npm run build` to build src files in production mode

### Install
- Open Chrome and go to the "Manage Extensions" page
- In the top right corner, enable "Developer mode"
- In the top left corner, click the "Load unpacked" button
- Point the file input dialog to the `dist` directory

### Usage
Click on the Google Chrome Extension widget then pin the "Covid Vaccine Finder" to your toolbar.
Click on Add Patient Details and fill in your Patient Details. If you are trying to get your first vaccine appointment select "First Covid Vaccine" and skip the checkbox for type of vaccine.
Submit your Patient Details
Then CLICK on your name to turn it GREEN.
Lastly click on the Find Appointment button for your location.
This will trigger the tool to start.
Tabs will open and any tabs that do not automatically close will have appointments available.
If the automation is working properly it will show you a list of appointments. If it's not working select a time slot and submit the page manually.
The Personal Information page will auto fill and submit.
Continue the process.
The Sign page was not working when I tried it so I manually signed and submitted.
