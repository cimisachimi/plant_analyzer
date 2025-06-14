export interface DiseaseInfo {
  name: string;
  care: string;
}

// Updated keys to match your custom model's exact labels
export const diseaseData: { [key: string]: DiseaseInfo } = {
  'A healthy tomato leaf': {
    name: 'Healthy',
    care: 'Your tomato plant looks healthy! Keep up the good work. Ensure consistent watering, proper nutrients, and good sunlight exposure.',
  },
  'A tomato leaf with Leaf Mold': {
    name: 'Leaf Mold',
    care: 'Improve air circulation and reduce humidity. Use resistant tomato varieties. Apply fungicides if necessary. Water early in the day so leaves can dry.',
  },
  'A tomato leaf with Target Spot': {
    name: 'Target Spot',
    care: 'Apply fungicides. Improve air circulation. Remove and destroy infected leaves and fruit. Water at the base of the plant.',
  },
  'A tomato leaf with Late Blight': {
    name: 'Late Blight',
    care: 'This is a serious disease. Apply fungicides preventively. Ensure proper spacing for air flow. Water at the base of the plant, not on the leaves. Destroy infected plants immediately.',
  },
  'A tomato leaf with Early Blight': {
    name: 'Early Blight',
    care: 'Apply fungicides containing mancozeb or chlorothalonil. Mulch around the base of the plants and practice crop rotation. Remove and destroy infected plant debris.',
  },
  'A tomato leaf with Bacterial Spot': {
    name: 'Bacterial Spot',
    care: 'Use copper-based fungicides. Prune affected leaves and avoid overhead watering to reduce humidity. Ensure good air circulation around plants.',
  },
  'A tomato leaf with Septoria Leaf Spot': {
    name: 'Septoria Leaf Spot',
    care: 'Remove infected lower leaves. Use fungicides like chlorothalonil. Practice crop rotation and keep weeds under control.',
  },
  'A tomato leaf with Tomato Mosaic Virus': {
    name: 'Mosaic Virus',
    care: 'No cure. Remove and destroy infected plants. Wash hands and tools thoroughly after handling infected plants to prevent transmission.',
  },
  'A tomato leaf with Tomato Yellow Leaf Curl Virus': {
    name: 'Yellow Leaf Curl Virus',
    care: 'There is no cure for this virus. Remove and destroy infected plants immediately to prevent spread. Control whiteflies, which transmit the virus, using insecticides or reflective mulch.',
  },
  'A tomato leaf with Spider Mites Two-spotted Spider Mite': {
    name: 'Spider Mites (Two-spotted)',
    care: 'Use insecticidal soap or neem oil. Increase humidity as mites thrive in dry conditions. Introduce natural predators like ladybugs.',
  },
};