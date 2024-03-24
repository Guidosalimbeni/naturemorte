import { calculateBalanceScore } from "./balance.js";

class GeneticAlgorithm {
  constructor(populationSize) {
    this.populationSize = populationSize;
    this.population = [];
    this.fitnessScores = [];
    this.mutationRate = 0.01; // Adjust as necessary
    this.geneLength = 0; // Will be set based on the number of objects
  }

  initializePopulation(geneLength) {
    this.geneLength = geneLength;
    this.population = this.createInitialPopulation();
    this.fitnessScores = new Array(this.populationSize).fill(0);
  }

  createInitialPopulation() {
    let population = [];
    for (let i = 0; i < this.populationSize; i++) {
      let individual = [];
      for (let j = 0; j < this.geneLength; j++) {
        individual.push(this.randomGene());
      }
      population.push(individual);
    }
    return population;
  }

  randomGene() {
    return {
      x: Math.random() * 2 - 1, // x between -1 and 1
      y: -0.5, // y is fixed
      z: Math.random(), // z between 0 and 1
      rotation: Math.random() * 2 * Math.PI, // Rotation between 0 and 2π
    };
  }

  async calculateFitness(imageData) {
    for (let i = 0; i < this.populationSize; i++) {
      // Calculate balance score
      const score = await calculateBalanceScore(imageData);
      this.fitnessScores[i] = score; // Assuming higher balance score means better fitness
    }
  }

  selectParent() {
    // Tournament selection
    let tournamentSize = 3; // Adjust as necessary
    let best = Math.floor(Math.random() * this.populationSize);
    for (let i = 1; i < tournamentSize; i++) {
      let ind = Math.floor(Math.random() * this.populationSize);
      if (this.fitnessScores[ind] > this.fitnessScores[best]) {
        best = ind;
      }
    }
    return this.population[best];
  }

  crossover(parent1, parent2) {
    let child = [];
    let crossoverPoint = Math.floor(Math.random() * this.geneLength);
    for (let i = 0; i < this.geneLength; i++) {
      child[i] = i < crossoverPoint ? parent1[i] : parent2[i];
    }
    return child;
  }

  mutate(individual) {
    return individual.map((gene) => {
      if (Math.random() < this.mutationRate) {
        return this.randomGene(); // Simple mutation: replace with a new random gene
      }
      return gene;
    });
  }

  generateNextGeneration(nextimgData) {
    let newPopulation = [];
    for (let i = 0; i < this.populationSize; i++) {
      let parent1 = this.selectParent();
      let parent2 = this.selectParent();
      let child = this.crossover(parent1, parent2);
      child = this.mutate(child);
      newPopulation.push(child);
    }
    this.population = newPopulation;
    this.calculateFitness(nextimgData); // Calculate fitness for the new population
  }
}

// Export an instance of GeneticAlgorithm
export const GA = new GeneticAlgorithm(10);
