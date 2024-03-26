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

  async calculateFitness(imageData, currentObjects) {
    for (let i = 0; i < this.populationSize; i++) {
      const score = await calculateBalanceScore(imageData, currentObjects);
      this.fitnessScores[i] = score;
    }
  }

  getCurrentFitnessScore() {
    let highestScore = this.fitnessScores[0];
    for (let i = 1; i < this.populationSize; i++) {
      if (this.fitnessScores[i] > highestScore) {
        highestScore = this.fitnessScores[i];
      }
      return highestScore;
    }
  }

  selectParent() {
    let tournamentSize = 3;
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

  async generateNextGeneration(nextimgData, currentObjects) {
    let newPopulation = [];
    for (let i = 0; i < this.populationSize; i++) {
      let parent1 = this.selectParent();
      let parent2 = this.selectParent();
      let child = this.crossover(parent1, parent2);
      child = this.mutate(child);
      newPopulation.push(child);
    }
    this.population = newPopulation;
    this.calculateFitness(nextimgData, currentObjects);
  }

  findBestIndividual() {
    let highestScoreIndex = 0;
    let highestScore = this.fitnessScores[0];

    for (let i = 1; i < this.populationSize; i++) {
      if (this.fitnessScores[i] > highestScore) {
        highestScore = this.fitnessScores[i];
        highestScoreIndex = i;
      }
    }

    return this.population[highestScoreIndex];
  }

  printFinalScore() {
    let highestScore = this.fitnessScores[0];

    for (let i = 1; i < this.populationSize; i++) {
      if (this.fitnessScores[i] > highestScore) {
        highestScore = this.fitnessScores[i];
      }
    }

    console.log("final score: ", highestScore);
  }
}

// Export an instance of GeneticAlgorithm
export const GA = new GeneticAlgorithm(50);
