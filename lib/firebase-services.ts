import { 
  ref as dbRef,
  get,
  set,
  update,
  remove,
  push,
  query as dbQuery,
  orderByChild,
  serverTimestamp
} from 'firebase/database'
import { db } from './firebase'

// Types
export interface Movie {
  id?: string
  title: string
  description: string
  genre: string
  duration: string
  rating: number
  poster: string
  videoUrl?: string
  type: "movie" | "series"
  status: "active" | "inactive"
  views: number
  revenue: number
  createdAt?: number
  updatedAt?: number
  createdBy?: string
}

export interface User {
  id?: string
  name: string
  email: string
  role: "user" | "admin"
  subscription?: {
    plan: string
    expiresAt: number
    isActive: boolean
  }
  createdAt?: number
  lastActive?: number
  status: "active" | "inactive"
}

export interface Analytics {
  totalViews: number
  totalRevenue: number
  activeUsers: number
  newSignups: number
  popularGenres: { genre: string; count: number }[]
  recentActivity: { type: string; description: string; timestamp: number }[]
}

// Series/Episodes/Slides/Updates Types
export interface Series {
  id?: string
  title: string
  description: string
  poster: string
  status: "active" | "inactive"
  createdAt?: number
  updatedAt?: number
}

export interface Episode {
  id?: string
  title: string
  description?: string
  videoUrl: string
  duration: string
  episodeNumber: number
  createdAt?: number
}

export interface Slide {
  id?: string
  imageUrl: string
  caption?: string
  link?: string
  createdAt?: number
}

export interface UpdateItem {
  id?: string
  title: string
  body: string
  createdAt?: number
}

// Movie Services
export const movieService = {
  // Get all movies
  async getAllMovies(): Promise<Movie[]> {
    try {
      const moviesNode = dbRef(db, 'movies')
      const snapshot = await get(moviesNode)
      const data = snapshot.val() || {}
      const movies: Movie[] = Object.entries<any>(data).map(([id, value]) => ({ id, ...(value as Movie) }))
      // sort by createdAt desc
      movies.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      return movies
    } catch (error) {
      console.error('Error getting movies:', error)
      throw error
    }
  },

  // Get movie by ID
  async getMovieById(id: string): Promise<Movie | null> {
    try {
      const movieNode = dbRef(db, `movies/${id}`)
      const snapshot = await get(movieNode)
      if (snapshot.exists()) {
        return { id, ...(snapshot.val() as Movie) }
      }
      return null
    } catch (error) {
      console.error('Error getting movie:', error)
      throw error
    }
  },

  // Add new movie
  async addMovie(movieData: Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'revenue'>, createdBy: string): Promise<string> {
    try {
      const moviesNode = dbRef(db, 'movies')
      const newRef = push(moviesNode)
      const now = Date.now()
      const base: any = {
        title: movieData.title,
        description: movieData.description,
        genre: movieData.genre,
        duration: movieData.duration,
        rating: movieData.rating,
        poster: movieData.poster,
        type: movieData.type,
        status: movieData.status,
        views: 0,
        revenue: 0,
        createdAt: now,
        updatedAt: now,
        createdBy
      }
      if (movieData.videoUrl && movieData.videoUrl.trim() !== '') {
        base.videoUrl = movieData.videoUrl
      }
      await set(newRef, base)
      return newRef.key as string
    } catch (error) {
      console.error('Error adding movie:', error)
      throw error
    }
  },

  // Update movie
  async updateMovie(id: string, movieData: Partial<Movie>): Promise<void> {
    try {
      const movieNode = dbRef(db, `movies/${id}`)
      await update(movieNode, {
        ...movieData,
        updatedAt: Date.now()
      })
    } catch (error) {
      console.error('Error updating movie:', error)
      throw error
    }
  },

  // Delete movie
  async deleteMovie(id: string): Promise<void> {
    try {
      const movieNode = dbRef(db, `movies/${id}`)
      await remove(movieNode)
    } catch (error) {
      console.error('Error deleting movie:', error)
      throw error
    }
  },
  // No storage operations; poster and video are provided as links
}

// User Services
export const userService = {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const usersNode = dbRef(db, 'users')
      const snapshot = await get(usersNode)
      const data = snapshot.val() || {}
      const users: User[] = Object.entries<any>(data).map(([id, value]) => ({ id, ...(value as User) }))
      users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      return users
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const userNode = dbRef(db, `users/${id}`)
      const snapshot = await get(userNode)
      if (snapshot.exists()) {
        return { id, ...(snapshot.val() as User) }
      }
      return null
    } catch (error) {
      console.error('Error getting user:', error)
      throw error
    }
  },

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<void> {
    try {
      const userNode = dbRef(db, `users/${id}`)
      await update(userNode, {
        ...userData,
        updatedAt: Date.now()
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Create user profile (called after Firebase Auth registration)
  async createUserProfile(userId: string, userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): Promise<void> {
    try {
      const userNode = dbRef(db, `users/${userId}`)
      const now = Date.now()
      await set(userNode, {
        ...userData,
        createdAt: now,
        lastActive: now
      })
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }
}

// Analytics Services
export const analyticsService = {
  // Get platform analytics
  async getAnalytics(): Promise<Analytics> {
    try {
      // Get total views and revenue from movies
      const movies = await movieService.getAllMovies()
      const totalViews = movies.reduce((sum, movie) => sum + movie.views, 0)
      const totalRevenue = movies.reduce((sum, movie) => sum + movie.revenue, 0)

      // Get user statistics
      const users = await userService.getAllUsers()
      const activeUsers = users.filter(user => user.status === 'active').length
      
      // Get new signups (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const newSignups = users.filter(user => 
        user.createdAt && user.createdAt > weekAgo.getTime()
      ).length

      // Get popular genres
      const genreCount: { [key: string]: number } = {}
      movies.forEach(movie => {
        genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1
      })
      const popularGenres = Object.entries(genreCount)
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Get recent activity (mock data for now)
      const recentActivity = [
        { 
          type: "New User", 
          description: "New user registered", 
          timestamp: Date.now()
        },
        { 
          type: "Content Upload", 
          description: "New movie uploaded", 
          timestamp: Date.now()
        }
      ]

      return {
        totalViews,
        totalRevenue,
        activeUsers,
        newSignups,
        popularGenres,
        recentActivity
      }
    } catch (error) {
      console.error('Error getting analytics:', error)
      throw error
    }
  }
}

// Series Services
export const seriesService = {
  async getAllSeries(): Promise<Series[]> {
    const seriesNode = dbRef(db, 'series')
    const snapshot = await get(seriesNode)
    const data = snapshot.val() || {}
    const series: Series[] = Object.entries<any>(data).map(([id, value]) => ({ id, ...(value as Series) }))
    series.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    return series
  },
  async addSeries(seriesData: Omit<Series, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const seriesNode = dbRef(db, 'series')
    const newRef = push(seriesNode)
    const now = Date.now()
    await set(newRef, { ...seriesData, createdAt: now, updatedAt: now })
    return newRef.key as string
  },
  async updateSeries(id: string, data: Partial<Series>): Promise<void> {
    await update(dbRef(db, `series/${id}`), { ...data, updatedAt: Date.now() })
  },
  async deleteSeries(id: string): Promise<void> {
    await remove(dbRef(db, `series/${id}`))
  },
  async getEpisodes(seriesId: string): Promise<Episode[]> {
    const node = dbRef(db, `series/${seriesId}/episodes`)
    const snapshot = await get(node)
    const data = snapshot.val() || {}
    const episodes: Episode[] = Object.entries<any>(data).map(([id, value]) => ({ id, ...(value as Episode) }))
    episodes.sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0))
    return episodes
  },
  async addEpisode(seriesId: string, episodeData: Omit<Episode, 'id' | 'createdAt'>): Promise<string> {
    const node = dbRef(db, `series/${seriesId}/episodes`)
    const newRef = push(node)
    await set(newRef, { ...episodeData, createdAt: Date.now() })
    return newRef.key as string
  },
  async deleteEpisode(seriesId: string, episodeId: string): Promise<void> {
    await remove(dbRef(db, `series/${seriesId}/episodes/${episodeId}`))
  }
}

// Slides Services
export const slideService = {
  async getSlides(): Promise<Slide[]> {
    const node = dbRef(db, 'slides')
    const snapshot = await get(node)
    const data = snapshot.val() || {}
    const slides: Slide[] = Object.entries<any>(data).map(([id, value]) => ({ id, ...(value as Slide) }))
    slides.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    return slides
  },
  async addSlide(slide: Omit<Slide, 'id' | 'createdAt'>): Promise<string> {
    const node = dbRef(db, 'slides')
    const newRef = push(node)
    await set(newRef, { ...slide, createdAt: Date.now() })
    return newRef.key as string
  },
  async deleteSlide(id: string): Promise<void> {
    await remove(dbRef(db, `slides/${id}`))
  }
}

// Updates/News Services
export const updatesService = {
  async getUpdates(): Promise<UpdateItem[]> {
    const node = dbRef(db, 'updates')
    const snapshot = await get(node)
    const data = snapshot.val() || {}
    const updates: UpdateItem[] = Object.entries<any>(data).map(([id, value]) => ({ id, ...(value as UpdateItem) }))
    updates.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    return updates
  },
  async addUpdate(item: Omit<UpdateItem, 'id' | 'createdAt'>): Promise<string> {
    const node = dbRef(db, 'updates')
    const newRef = push(node)
    await set(newRef, { ...item, createdAt: Date.now() })
    return newRef.key as string
  },
  async deleteUpdate(id: string): Promise<void> {
    await remove(dbRef(db, `updates/${id}`))
  }
}
