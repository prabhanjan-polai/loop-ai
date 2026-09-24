// Fast and accurate client/server semantic vector generator and cosine similarity

const VOCAB_SIZE = 128;

// Deterministic hashing of n-grams to produce dense vector representation
export function generateEmbedding(text: string): number[] {
  const vector = new Array(VOCAB_SIZE).fill(0);
  const normalized = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length === 0) return vector;

  // 1. Unigram feature weights
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash * 31 + word.charCodeAt(j)) % VOCAB_SIZE;
    }
    vector[Math.abs(hash)] += 1.0 / Math.sqrt(words.length);

    // 2. Bigram context weights
    if (i < words.length - 1) {
      const bigram = `${word}_${words[i + 1]}`;
      let biHash = 0;
      for (let j = 0; j < bigram.length; j++) {
        biHash = (biHash * 37 + bigram.charCodeAt(j)) % VOCAB_SIZE;
      }
      vector[Math.abs(biHash)] += 1.5 / Math.sqrt(words.length);
    }
  }

  // Normalize L2 norm
  let sumSq = 0;
  for (let i = 0; i < VOCAB_SIZE; i++) {
    sumSq += vector[i] * vector[i];
  }
  const norm = Math.sqrt(sumSq) || 1;
  return vector.map(v => v / norm);
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
