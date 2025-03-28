require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 10000;

// Security Middleware
app.use(helmet());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://social-75.vercel.app'] 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Ratelimit-Limit'] // Optional but recommended
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));

// Database Connection
let db;
// Update the MongoDB connection section
const connectToMongoDB = async () => {
  try {
    // Verify MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

// In connectToMongoDB()
    const client = new MongoClient(process.env.MONGODB_URI, {
      tls: true,
      retryWrites: true,
      w: 'majority',
      serverApi: {
        version: '1',
        // Remove strict mode to allow text indexes
        deprecationErrors: true
      }
    });

    await client.connect();
    db = client.db(process.env.DB_NAME || 'social_cause_platform');
    console.log('Connected to MongoDB');
    
    // Create indexes
    await db.collection('mapData').createIndex({ location: '2dsphere' });
    await db.collection('tedTalks').createIndex(
      { title: "text" },
      { name: "title_text_index" }
    );
    await db.collection('ngos').createIndex(
  { name: "text" },
  { name: "ngo_name_text_index" }
);
    await db.collection('messages').createIndex({ createdAt: 1 });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Pusher Configuration
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER || 'ap2',
  useTLS: true
});

// API Data Fetching Functions
const fetchTEDTalks = async () => {
  try {
    const response = await axios.get('https://ted-talks-api.p.rapidapi.com/talks', {
      params: { from_record_date: '2020-01-01', min_duration: '300' },
      headers: {
        'x-rapidapi-key': process.env.TED_API_KEY,
        'x-rapidapi-host': process.env.TED_API_HOST
      }
    });

    const talks = response.data.result.results.map(talk => ({
      id: talk.id,
      title: talk.title,
      speaker: talk.speaker,
      description: talk.description,
      duration: talk.duration,
      url: talk.url,
      thumbnail: talk.thumbnail,
      type: 'Video',
      createdAt: new Date()
    }));

    await db.collection('tedTalks').deleteMany({});
    await db.collection('tedTalks').insertMany(talks);
    return talks;
  } catch (err) {
    console.error('TED Talks fetch error:', err);
    throw err;
  }
};

const refreshNGOData = async () => {
  try {
    const response = await axios.get(
      'https://projects.propublica.org/nonprofits/api/v2/search.json?q=environment'
    );

    const ngos = response.data.organizations.map(org => ({
      id: org.ein,
      name: org.name,
      type: 'NGO',
      description: org.ntee_code || 'No description available',
      website: org.website || 'Not available',
      location: `${org.city}, ${org.state}`,
      mission: org.ntee_classification || 'No mission statement',
      createdAt: new Date()
    }));

    await db.collection('ngos').deleteMany({});
    await db.collection('ngos').insertMany(ngos);
    return ngos;
  } catch (err) {
    console.error('NGO data fetch error:', err);
    throw err;
  }
};

// API Endpoints

app.get('/', (req, res) => {
  res.json({ 
    status: 'API is running',
    docs: 'https://social-75-39je.onrender.com/api/health' 
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    dbStatus: db ? 'connected' : 'disconnected'
  });
});

// Map Data Endpoints
app.get('/api/map', async (req, res) => {
  try {
    const { category, limit = 100 } = req.query;
    const query = category ? { category } : {};
    const data = await db.collection('mapData')
      .find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .toArray();
    res.json(data);
  } catch (err) {
    console.error('Map data fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch map data' });
  }
});

app.post('/api/map', async (req, res) => {
  try {
    const { location, interest, category = 'general', userId } = req.body;
    if (!location || !interest) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await db.collection('mapData').insertOne({
      location,
      interest,
      category,
      userId,
      createdAt: new Date()
    });

    res.status(201).json(result.ops[0]);
  } catch (err) {
    console.error('Map data save error:', err);
    res.status(500).json({ error: 'Failed to save location' });
  }
});

// Content Endpoints
app.get('/api/content', async (req, res) => {
  try {
    const { search, limit = 20 } = req.query;
    const query = search ? { $text: { $search: search } } : {};
    const talks = await db.collection('tedTalks')
      .find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .toArray();
      
    if (talks.length === 0) {
      const freshTalks = await fetchTEDTalks();
      return res.json(freshTalks.slice(0, limit));
    }
    
    res.json(talks);
  } catch (err) {
    console.error('Content fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Action Hub Endpoints
app.get('/api/action-hub', async (req, res) => {
  try {
    const { search, type, limit = 50 } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (type) query.type = type;

    const ngos = await db.collection('ngos')
      .find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .toArray();

    if (ngos.length === 0) {
      const freshNGOs = await refreshNGOData();
      return res.json(freshNGOs.slice(0, limit));
    }

    res.json(ngos);
  } catch (err) {
    console.error('Action hub fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch NGOs' });
  }
});

// Chat Endpoints
app.get('/api/messages', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const messages = await db.collection('messages')
      .find()
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .toArray();
    res.json(messages);
  } catch (err) {
    console.error('Messages fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/send-message', async (req, res) => {
  try {
    const { text, user, photoURL } = req.body;
    if (!text || !user) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = {
      text,
      user,
      photoURL: photoURL || '',
      createdAt: new Date()
    };

    // Save to database
    const result = await db.collection('messages').insertOne(message);
    const savedMessage = result.ops[0];

    // Trigger Pusher event
    pusher.trigger('chat', 'message', savedMessage);

    res.status(201).json(savedMessage);
  } catch (err) {
    console.error('Message send error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Data Refresh Endpoints (protected in production)
app.post('/api/refresh/ted-talks', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production' && req.headers['x-api-key'] !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const talks = await fetchTEDTalks();
    res.json({ success: true, count: talks.length });
  } catch (err) {
    console.error('TED Talks refresh error:', err);
    res.status(500).json({ error: 'Failed to refresh TED Talks' });
  }
});

app.post('/api/refresh/ngos', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production' && req.headers['x-api-key'] !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const ngos = await refreshNGOData();
    res.json({ success: true, count: ngos.length });
  } catch (err) {
    console.error('NGO refresh error:', err);
    res.status(500).json({ error: 'Failed to refresh NGOs' });
  }
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Server Startup
const startServer = async () => {
  await connectToMongoDB();
  
  // Initial data load
  try {
    await Promise.allSettled([
      fetchTEDTalks(),
      refreshNGOData()
    ]);
  } catch (err) {
    console.error('Initial data load error:', err);
  }

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Schedule regular data refreshes (every 6 hours)
  setInterval(fetchTEDTalks, 6 * 60 * 60 * 1000);
  setInterval(refreshNGOData, 6 * 60 * 60 * 1000);
};

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (db) await db.client.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  if (db) await db.client.close();
  process.exit(0);
});

startServer();