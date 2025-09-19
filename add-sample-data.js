// Script to add sample data to Firebase for testing
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push } = require('firebase/database');

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project-id",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  databaseURL: "https://demo-project-id-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const sampleMovies = [
  {
    title: "Ancient Warriors",
    description: "Epic tale of Luo warriors defending their homeland",
    genre: "Action",
    duration: "2h 15m",
    rating: 4.8,
    poster: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    type: "movie",
    status: "active",
    views: 1250,
    revenue: 5000,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    createdBy: "admin"
  },
  {
    title: "Legends of the Lake",
    description: "Mysterious stories from the depths of Lake Victoria",
    genre: "Drama",
    duration: "2h 10m",
    rating: 4.6,
    poster: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    type: "movie",
    status: "active",
    views: 980,
    revenue: 4200,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    createdBy: "admin"
  },
  {
    title: "The Sacred Grove",
    description: "A mystical journey through ancient sacred grounds",
    genre: "Mystery",
    duration: "2h 10m",
    rating: 4.6,
    poster: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    type: "movie",
    status: "active",
    views: 750,
    revenue: 3200,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    createdBy: "admin"
  }
];

const sampleSeries = [
  {
    title: "The Fisherman's Legacy",
    description: "Follow the adventures of a legendary fisherman's descendants",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    status: "active",
    genre: "Adventure",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    createdBy: "admin"
  },
  {
    title: "River Tales",
    description: "Stories from communities along the great rivers",
    poster: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    status: "active",
    genre: "Drama",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    createdBy: "admin"
  }
];

const sampleSlides = [
  {
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    caption: "Welcome to Linda Fashions",
    link: "/category/women",
    createdAt: Date.now()
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    caption: "New Collection 2024",
    link: "/category/men",
    createdAt: Date.now() - 24 * 60 * 60 * 1000
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    caption: "Premium Quality Fashion",
    link: "/category/kids",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
  }
];

const sampleUpdates = [
  {
    title: "New Movies Added This Week",
    body: "We've added 3 new movies to our collection including Ancient Warriors and Legends of the Lake.",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    title: "New Series Coming Soon",
    body: "Get ready for The Fisherman's Legacy and River Tales - exciting new series coming to our platform.",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000
  },
  {
    title: "Platform Update",
    body: "We've improved our video player and added new features for a better viewing experience.",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000
  }
];

async function addSampleData() {
  try {
    console.log('Adding sample movies...');
    for (const movie of sampleMovies) {
      const moviesRef = ref(db, 'movies');
      const newMovieRef = push(moviesRef);
      await set(newMovieRef, movie);
      console.log('Added movie:', movie.title);
    }

    console.log('Adding sample series...');
    for (const series of sampleSeries) {
      const seriesRef = ref(db, 'series');
      const newSeriesRef = push(seriesRef);
      await set(newSeriesRef, series);
      console.log('Added series:', series.title);
    }

    console.log('Adding sample slides...');
    for (const slide of sampleSlides) {
      const slidesRef = ref(db, 'slides');
      const newSlideRef = push(slidesRef);
      await set(newSlideRef, slide);
      console.log('Added slide:', slide.caption);
    }

    console.log('Adding sample updates...');
    for (const update of sampleUpdates) {
      const updatesRef = ref(db, 'updates');
      const newUpdateRef = push(updatesRef);
      await set(newUpdateRef, update);
      console.log('Added update:', update.title);
    }

    console.log('All sample data added successfully!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

addSampleData();
