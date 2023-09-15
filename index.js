const axios = require("axios");
const readline = require("readline");
const terminalInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let data;

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addNode(node) {
    if (!this.adjacencyList[node]) {
      this.adjacencyList[node] = [];
    }
  }

  addEdge(node1, node2) {
    this.adjacencyList[node1].push(node2);
  }

  findAllPaths(startNode, visited = new Set(), path = [], paths = []) {
    visited.add(startNode);
    path.push(startNode);

    if (this.adjacencyList[startNode]) {
      for (const neighbor of this.adjacencyList[startNode]) {
        if (!visited.has(neighbor)) {
          this.findAllPaths(neighbor, visited, path, paths);
        }
      }
    }

    if (this.adjacencyList[startNode].length === 0) {
      paths.push([...path]);
    }

    visited.delete(startNode);
    path.pop();
  }

  printGraph() {
    const vertices = Object.keys(this.adjacencyList);

    for (const vertex of vertices) {
      const neighbors = this.adjacencyList[vertex];
      const conc = neighbors.join(" ");
      console.log(vertex + " -> " + conc);
    }
  }
}

const graph = new Graph();

const customHeaders = {
  Token: "10941392-a080-44c4-8cf2-a97011bc6b81",
};

const url =
  "https://backend.qa.fieldtwin.com/API/v1.9/-MA1551S-odms4rVbJ8A/subProject/-MA1551S-odms4rVbJ8B/";

axios
  .get(url, {
    headers: customHeaders,
  })
  .then((response) => {
    data = response.data;

    for (const key in data.stagedAssets) {
      graph.addNode(key);
    }

    for (const key in data.connections) {
      graph.addEdge(data.connections[key].from, data.connections[key].to);
    }

    console.log("----Adjacency list------\n");
    graph.printGraph();

    terminalInput.question("\nEnter staged asset to find paths: ", (startNode) => {
      console.log(`\n----All possible paths from ${startNode} ------\n`);

      findPathsForEnteredNode(startNode);
      terminalInput.close();
    });
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

function findPathsForEnteredNode(startNode) {
  const paths = [];
  graph.findAllPaths(startNode, new Set(), [], paths);

  for (const path of paths) {
    const concPath = path.join(" > ");
    console.log(concPath);
  }
}
