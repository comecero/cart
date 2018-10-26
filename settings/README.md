# Settings folder

Custom apps rely on dynamic data about the account they are operating within and user settings that cannot be known until runtime, such as currencies the account supports, and user preferences.

The settings folder is used during local development to provide “mock” data to your app. When you package your app for deployment within the hosted environment, you won’t include the “settings” folder (in fact, if you attempt to upload an app package with a “settings” folder in the root, an error will occur that asks you to remove it). In the hosted environment, the settings folder is injected automatically at runtime and includes the values for the account your app is running within at the time the app launches.

There are three settings files: account, app and style. Account settings give “global” information about the account, meaning general settings that are independent of any app. App and style settings are specific to an app and are based on data the app requests from the user.

The app source code provides sample account, app and style settings for use in local development. Rename the sample files to account.js, app.js and style.js in your local development to change and test app behavior. **The app will not run correctly in your local development environment unless you make copies of the rename the sample files and renaming them by removing `-SAMPLE` from the filename.** For example, `account-SAMPLE.js` should be copied and the copy should be named `account.js`. Do this for each sample file.

We have included a gulp task to create local copies of your settings files easy. Just run the command below, replacing `{account_id}` with the account_id of the account you are using for testing.
`gulp copy-settings --account_id {account_id}`

You can also include the API host you would like to target within your app during local development, if you want to target an API host other than the default API host.
`gulp copy-settings --account_id {account_id} --api_host {api_host}`

For example:
`gulp copy-settings --account_id AB1234 --api_host api-dev.comecero.com`

_Note that there is no need to provide the API host if you want to target the default API of `api.comecero.com`._

The settings files in the hosted environment are provided in both JavaScript and JSON formats. Both formats contain the same data but are available in different formats for your convenience. The local "mock" data is provided in JavaScript only.

#### Account Settings

If you would like to see a preview of the account settings, just load one of the URLs below. These endpoint are public and don't required any authentication. _Look under Administration> Account Info to obtain your account_id_.

For live account settings:
https://api.comecero.com/api/v1/app_installations/public_settings/{account_id}/live/account.js
https://api.comecero.com/api/v1/app_installations/public_settings/{account_id}/live/account.json

For test account settings:
https://api.comecero.com/api/v1/app_installations/public_settings/{account_id}/test/account.js
https://api.comecero.com/api/v1/app_installations/public_settings/{account_id}/test/account.json

#### App Settings

App settings includes data that allows custom app behavior, based on user preferences. Preferences are collected from the user based on a JSON file that describes the information that should be colleced from the user. See the fields/settings.json folder to view what data is collected from the user. The data in this JSON document is used to create a form that is presented to the user after the app is installed.

#### Style Settings
Style settings includes data that allows a custom app style, based on user preferences. Preferences are collected from the user based on a JSON file that describes teh information that should be collected from the user. See the fields/style.json folder to view what data is collected from the user. The data in this JSON document is used to create a form that is presented to the user after the app is installed.

Further, the app is designed to inject the style values collected from the user to build a dynamic and custom CSS document using Sass. The user style selections are injected into the sass/variables.sass, and then compiled into the sass/style.css file at the time the app is installed, and whenever the uesr updates their style preferences. Each installed app has its own version of sass/style.css, built based on the unique preferences of the user.

#### Custom JavaScript & Custom CSS ####

If the app is configured to allow the user to provide custom JavaScript and CSS, you can test including custom JavaScript and CSS to the application by including it in `settings/script.js` and `settings/style.css`, respectively.
