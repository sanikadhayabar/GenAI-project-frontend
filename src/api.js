const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Generate Image
export const generateImage = async (params) => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Generation Failed: ${errorText}`);
  }

  return await response.json();
};

// Generate Variations
export const generateVariations = async (params) => {
  const response = await fetch(`${API_BASE_URL}/variations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Variation Generation Failed: ${errorText}`);
  }

  return await response.json();
};

// Fetch Gallery Images
export const fetchImages = async () => {
  const response = await fetch(`${API_BASE_URL}/images`);
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  return await response.json();
};

// Fetch Image Details
export const fetchImageDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/images/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch image details');
  }
  return await response.json();
};

// Submit Feedback
export const submitFeedback = async (imageId, feedback) => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image_id: imageId, feedback })
  });

  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }

  return await response.json();
};
