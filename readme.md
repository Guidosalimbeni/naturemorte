Here's a summary of the steps I've taken to set up and run your Three.js web application:

### Objectives

I want to create an web application. it will have a scene taking almost the entire screen.
the scene should have a 3d cube actiing as a stage and the background should be a 3d plane.
on top of the 3d cube I want to be able to place uploaded 3d objects like vases, jars, cups, bottles. I can make those 3d objects.
I want to have a system that can move these 3d objects on the surface of the stage, a camera that looks at the setup of these 3d objects. IMagine the camera as the artist looking at the 3d objects as they were items for a still life painting and the camera frame is the composition frame of the painting.
the camera would feed the images to machine learning system that would assess the quality of the composition.
the goal of the system is to find an optimal composition.
I want the system to use a genetic algorithm to find the best location of the 3d objects that will use the output of the machine learning system as the score to optimise the genetic algorithm.

### Project Setup

1. **Created a new project directory** and initialized a Git repository.

2. **Opened the project in Visual Studio Code.**

3. **Initialized the project with npm** to create a `package.json` file:

   ```
   npm init -y
   ```

4. **Installed Three.js** as a dependency using npm:
   ```
   npm install three
   ```

### Project Structure

1. **Created the main files** for the project within a `code` subdirectory:
   - `index.html` for the HTML structure.
   - `app.js` for the Three.js application logic.
   - `style.css` for the styles.

### Web Application Code

1. **Wrote the Three.js code** in `app.js` to set up a basic 3D scene:

   - Initialized a scene, camera, and WebGL renderer.
   - Created a cube with a mesh and basic material.
   - Added an animation loop to rotate the cube.

2. **Set up the HTML file** (`index.html`) to link to the `style.css` and `app.js` files.

3. **Configured the `package.json` file** with scripts to run the project using Parcel as a module bundler and development server.

### Running the Application

1. **Installed Parcel** as a development dependency to bundle the application and serve it during development:

   ```
   npm install -D parcel
   ```

2. **Added start and build scripts** to `package.json` to use Parcel for running a local development server and for building the application for production, respectively.

3. **Started the application** using Parcel, which automatically bundled the JavaScript and served the application on a local web server:

   ```
   npm run start
   ```

4. **Accessed the web application** through the local web server provided by Parcel (usually `http://localhost:1234`).

![Alt text]('naturemorte/snap_v1.png')
