const express = require("express");

const server = express();

const projects = [];
let requests = 0;

// Middlewares

server.use(express.json());

server.use((req, res, next) => {
	requests++;
	console.time("Request time");
	console.log(`Request type: ${req.method}`);
	console.log(`URL: ${req.url}`);

	next();
	console.timeEnd("Request time");
	console.log("Number of requests: " + requests);
});

const checkProjectExists = (req, res, next) => {
	const { id } = req.params;

	const project = projects.findIndex(p => p.id === id);

	if (project === -1) {
		return res.status(400).json({
			error: `The project with Id '${id}' does not exist!`
		});
	}

	req.projectIdex = project;

	return next();
};

// Routes

server.post("/projects", (req, res) => {
	const { id, title } = req.body;
	const project = {
		id,
		title,
		tasks: []
	};

	projects.push(project);

	return res.json(project);
});

server.get("/projects", (req, res) => {
	return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
	const { title } = req.body;
	projects[req.projectIdex].title = title;
	return res.json(projects[req.projectIdex]);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
	projects.splice(req.projectIdex, 1);
	return res.json({
		message: "The project has been successfully deleted!"
	});
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
	const { title } = req.body;
	projects[req.projectIdex].tasks.push(title);
	return res.json(projects[req.projectIdex]);
});

server.listen(3000);
