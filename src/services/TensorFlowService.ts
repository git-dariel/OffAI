import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import malupiton from "../assets/malupiton-bossing-boss-dila.gif";
import galitMalupiton from "../assets/galit-malupiton.jpg";

class TensorFlowService {
  private static model: use.UniversalSentenceEncoder | null = null;
  private static responses: { [key: string]: { text: string; image?: string } } = {
    hello: { text: "Hi there! How can I help you?" },
    "how are you": { text: "I'm doing well, thank you for asking. How about you?" },
    "what is your name": { text: "I'm an AI assistant created to help answer questions." },
    "kupal ka ba?": { text: "mas kupal ka bossing😝", image: malupiton },
    kupal: { text: "kupal ka rin boss😝", image: malupiton },
    "tangina ka": { text: "tangina mo ka, inaano ba kita kupal ka?", image: galitMalupiton },
    tangina: { text: "tangina mo rin boss", image: galitMalupiton },
    gago: { text: "gago ka rin boss", image: galitMalupiton },
    "boss boss": { text: "kumusta ang buhay buhay bossing? mukha ka paring burat bossing😝" },
    "bading ka": { text: "mas bading ka tanga, mukha ka pang burat" },
    // Add more predefined responses here
  };

  static async loadModel() {
    if (!this.model) {
      this.model = await use.load();
    }
  }

  static async getResponse(input: string): Promise<{ text: string; image?: string } | null> {
    await this.loadModel();

    if (!this.model) {
      throw new Error("TensorFlow model not loaded");
    }

    const inputEmbedding = await this.model.embed(input.toLowerCase());
    const responseEmbeddings = await this.model.embed(Object.keys(this.responses));

    const similarities = tf.matMul(inputEmbedding, responseEmbeddings.transpose());
    const maxSimilarityIndex = similarities.argMax(1).dataSync()[0];
    const maxSimilarity = similarities.max().dataSync()[0];

    if (maxSimilarity > 0.7) {
      const selectedResponseKey = Object.keys(this.responses)[maxSimilarityIndex];
      const selectedResponse = this.responses[selectedResponseKey];

      return selectedResponse;
    }

    return null;
  }
}

export default TensorFlowService;
