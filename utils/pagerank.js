const User = require('../database/Follow')
const communicationGraphFromUserFollow =  async () => {
    const communicationGraph = {};
    const doctors = await User.find({ profession : "Doctor"});
    doctors.forEach((doctor) => {
      communicationGraph[doctor.name] = doctor.friends;
    });
  
    return communicationGraph;
  };

const pageRank = (graph, iterations = 10, dampingFactor = 0.85) =>  {
    const nodes = Object.keys(graph);
    const initialRank = 1 / nodes.length;
  
    let ranks = nodes.reduce((acc, node) => {
      acc[node] = initialRank;
      return acc;
    }, {});
  
    for (let iteration = 0; iteration < iterations; iteration++) {
      const newRanks = {};
  
      nodes.forEach((node) => {
        newRanks[node] = (1 - dampingFactor) / nodes.length;
  
        Object.keys(graph).forEach((otherNode) => {
          if (graph[otherNode].includes(node)) {
            newRanks[node] += dampingFactor * (ranks[otherNode] / graph[otherNode].length);
          }
        });
      });
  
      ranks = { ...newRanks };
    }
  
    return ranks;
  }
   
  communicationGraphFromUserFollow()
  .then((result) => {
    const doctorRanks =  pageRank(result);
    module.exports = doctorRanks;
  })
 

  
  
  
  
