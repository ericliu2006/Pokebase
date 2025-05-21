require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const cv = require('opencv4nodejs');
const sharp = require('sharp');

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin initialization
const serviceAccount = require('./firebase-admin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const auth = admin.auth();

// Multer configuration for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to evaluate card centering
async function evaluateCardCentering(imagePath) {
  try {
    // Read and process the image
    const image = await cv.imreadAsync(imagePath);
    const gray = image.bgrToGray();
    
    // Find card edges using Canny edge detection
    const edges = gray.canny(50, 150);
    const contours = edges.findContours();
    
    // Find the largest contour (should be the card)
    let maxArea = 0;
    let cardContour = null;
    
    contours.forEach(contour => {
      const area = contour.area();
      if (area > maxArea) {
        maxArea = area;
        cardContour = contour;
      }
    });

    if (!cardContour) {
      throw new Error('Card not detected in image');
    }

    // Get the bounding box of the card
    const [x, y, width, height] = cardContour.boundingRect();
    
    // Calculate centering score
    const imageCenterX = image.cols / 2;
    const imageCenterY = image.rows / 2;
    const cardCenterX = x + width / 2;
    const cardCenterY = y + height / 2;

    // Calculate offset from center
    const offsetX = Math.abs(imageCenterX - cardCenterX);
    const offsetY = Math.abs(imageCenterY - cardCenterY);

    // Calculate score (0-1, where 1 is perfectly centered)
    const maxOffsetX = image.cols / 2;
    const maxOffsetY = image.rows / 2;
    const scoreX = 1 - (offsetX / maxOffsetX);
    const scoreY = 1 - (offsetY / maxOffsetY);
    const centeringScore = (scoreX + scoreY) / 2;

    return {
      centering_score: parseFloat(centeringScore.toFixed(2)),
      card_position: {
        x,
        y,
        width,
        height
      },
      image_size: {
        width: image.cols,
        height: image.rows
      }
    };
  } catch (error) {
    throw error;
  }
}

// User Authentication
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await auth.createUser({
      email,
      password
    });
    
    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName: '',
      bio: '',
      profilePicture: ''
    });
    
    res.status(201).json({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await auth.getUserByEmail(email);
    res.json({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Collection Management
app.post('/api/collection', async (req, res) => {
  try {
    const { user_id, card } = req.body;
    const collectionRef = db.collection('users').doc(user_id).collection('collection');
    await collectionRef.add({
      ...card,
      addedAt: admin.firestore.FieldValue.serverTimestamp(),
      condition: card.condition || 'NM',
      notes: card.notes || ''
    });
    res.json({ message: 'Card added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/collection/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const collectionRef = db.collection('users').doc(user_id).collection('collection');
    const snapshot = await collectionRef.orderBy('addedAt', 'desc').get();
    const cards = [];
    snapshot.forEach(doc => cards.push({
      id: doc.id,
      ...doc.data()
    }));
    res.json({ collection: cards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Centering Evaluation
app.post('/api/centering', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No image uploaded');
    }
    
    const result = await evaluateCardCentering(req.file.path);
    
    // Clean up the uploaded file
    setTimeout(() => {
      try {
        require('fs').unlinkSync(req.file.path);
      } catch (error) {
        console.error('Error cleaning up uploaded file:', error);
      }
    }, 1000);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Profile
app.get('/api/users/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const userDoc = await db.collection('users').doc(user_id).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Get user's collection size
    const collectionRef = db.collection('users').doc(user_id).collection('collection');
    const collectionSize = await collectionRef.count().get();
    
    res.json({
      ...userDoc.data(),
      collectionSize: collectionSize.data().count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.put('/api/users/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const updates = req.body;
    
    await db.collection('users').doc(user_id).update(updates);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
