# 💹 Invest Brighter
Last Updated on 02/11/2024

## 🧪 Run Locally using Node
1. Install NodeJS [here](https://nodejs.org/en/download)
2. Clone repo by running `git clone https://github.com/wobbethan/EGN4912.git`
3. Open a new terminal session inside `EGN4912/`
4. Run `npm install --legacy-peer-deps`
5. Run `npm start dev` to start backend server with nodemon
6. Run `cd frontend`
7. Run `npm install --legacy-peer-deps`
8. Run `npm start` to start the frontend
9. Go to `http://localhost:3000` to view the app

## 🐳 Run Locally using Docker
1. Install Docker Engine [here](https://docs.docker.com/engine/install/)
2. Clone repo by running `git clone https://github.com/wobbethan/EGN4912.git`
3. Open a new terminal session inside `EGN4912/`
4. Run `docker build . -t invest-brighter`
5. Run `docker run -p 3000:8000 invest-brighter`
6. Go to `http://localhost:3000` to view the app
   
## 🚀 Deploy to Heroku using Docker and Heroku CLI
1. Install Docker Engine [here](https://docs.docker.com/engine/install/)
2. Install Heroku CLI [here](https://devcenter.heroku.com/articles/heroku-cli)
3. Run Docker Engine on your machine by opening Docker Desktop. You should see a message when you run `docker ps`
4. Open a new terminal session inside `EGN4912/`
5. Run `heroku login` and login to Heroku
6. Run `heroku container:login`
7. Create a Heroku app in your Heroku dashboard if you don't have one already
8. Run `heroku container:push web --app your-app-name-here` (you'll need a powerful processor for the build step)
9. Run `heroku container:release web --app your-app-name-here`
10. You can view your deployed app by running `heroku open --app your-app-name-here`
11. For more info, read [this](https://devcenter.heroku.com/articles/heroku-cli) guide on deploying Docker containers to Heroku

### ☕ Things to do for fun
1. Download Java SDK [here](
   https://www.oracle.com/java/technologies/downloads/#jdk21-windows) even though this project has nothing to do with Java
