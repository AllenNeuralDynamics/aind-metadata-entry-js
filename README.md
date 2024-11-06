# AIND Metadata Entry
User-interface to ease AIND metadata ingest and validation. 

# Overview
This repository contains a React app that renders forms from JSON schemas defined by [aind-data-schema](https://github.com/AllenNeuralDynamics/aind-data-schema). The schemas are fetched from an s3-bucket, defined in environment. On user-selection, the app renders a form from selected schema (defaults to latest version). On submission, it validates the form data, and downloads it as a JSON-file. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Suggested Usage
Browser: Google Chrome.
Machine: Windows or Linux.

# Cloud Deployment
The application is deployed using AWS Amplify. The build configurations can be set in `amplify.yaml`.

# Local Development

## Project organization
The source code for the React app is located in the `/src` directory.

The project is organized as follows:
- components - global shared/reusable components, such as inputs (buttons, dropdowns) and layout (wrappers, navigation)
- contexts - global context providers for state management
- utils - utilities, helpers, constants/ config
- views - main UI components or "pages", such as the the `MetadataEntryPage`
- tests - unit tests and static json resources for test inputs

The entrypoint for the application is `index.js`, and `App.js` sets up the intial Context and View.

```
.
└── /src
    ├── /components
    ├── /services
    ├── /store
    ├── /utils
    ├── /views    
    ├── index.js
    └── App.js
```
## Setup
For local testing and development, you will need to configure the environment variables.
```sh
export REACT_APP_S3_URL="https://s3-url-placeholder"   # change this
export REACT_APP_FILTER_SCHEMAS=['schema1', 'schema2'] # change this if required
```

Then, run `npm install` to install dependencies or `npm start` to start the app. Please see other commands below.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. It is suggested that the app is opened on Google Chrome. 

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run test`, `npm run test:coverage`
This project uses [Jest](https://jestjs.io) as its Node-based test runner. [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) is used to test components in isolation.
- Use `npm run test` to run all tests in watch mode
- Use `npm run test:coverage` to run all tests and get coverage report

See [Create React App - Running Tests](https://create-react-app.dev/docs/running-tests) for more information.

### `npm run lint`, `npm run lint:fix`
This project uses [ESLint](https://eslint.org/docs/latest/use/core-concepts) for React, with [JS Standard Code Style](https://standardjs.com/rules).
- Use `npm run lint` to run the linter
- Use `npm run lint:fix` to auto-fix issues

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the Create React App docs about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
