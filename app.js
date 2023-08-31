import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url";
import multer from "multer";
// Set up multer for file uploads
const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));






const audioSchema = new mongoose.Schema({
    emotion: String,
    audioUrl: String
  });
  
  // Create a model based on the schema
  const AudioModel = mongoose.model('Audio', audioSchema);
  
  // Set up multer storage for audio uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const upload = multer({ storage });
  
  app.post('/upload', upload.single('audio'), async (req, res) => {
    const { emotion } = req.body;
    const audioFile = req.file;
  
    // Save the audio file to MongoDB and get its URL
    const audioData = new AudioModel({
      emotion: emotion,
      audioUrl: `${req.protocol}://${req.get('host')}/uploads/${audioFile.filename}`
    });
  
    try {
      await audioData.save();
      res.json({ message: 'Audio file uploaded and details saved successfully.' });
    } catch (error) {
      console.error('Error saving audio details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.get('/getAudio', async (req, res) => {
    console.log("got hte ")
    const page = req.query.page || 1;
    console.log(page)
    const limit = 10;
  
    try {
      const audioData = await AudioModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json(audioData);
    } catch (error) {
      console.error('Error fetching audio data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



// ...

app.delete('/deleteAudio/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Find the audio item by id
    const audioItem = await AudioModel.findById(id);

    if (!audioItem) {
      return res.status(404).json({ error: 'Audio item not found' });
    }

    // Delete from MongoDB
    await AudioModel.findByIdAndDelete(id);

    // Delete from the static folder
    // const filePath = path.join(__dirname, 'uploads', audioItem.filename);

    // fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error('Error deleting file:', err);
    //     return res.status(500).json({ error: 'Error deleting file' });
    //   }

      console.log('File deleted successfully');
      res.json({ message: 'Audio deleted successfully' });

  } catch (error) {
    console.error('Error deleting audio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ...

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), (err) => {
    res.status(500).send(err);
  });
});

  

const PORT = process.env.PORT || 5000;



const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(error => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}`));
