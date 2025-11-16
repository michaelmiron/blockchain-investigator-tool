Backend Setup-
cd backend
npm install
npm start
will run at: http://localhost:5000

Frontend Setup
npm install
npm start
will run at:http://localhost:3000

Running Tests
Frontend+Backend tests: npm test

For the graph visualization library, I chose React Flow because its more user-friendly and has great documentation that helped me understand. It supports custom React components that is easer to design nodes and edges that integrate good with the rest of the UI.
I also considered other libraries like Vis.js and D3.js, but they require much more boilerplate and manual DOM manipulation to work with React. D3.js for example demands a lot of custom code for interactions and layout handling.
