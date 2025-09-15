"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Film, TrendingUp, Plus, Edit, Trash2, Eye, BarChart3, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { movieService, userService, analyticsService, slideService, seriesService, type Movie, type User, type Analytics } from "@/lib/firebase-services"

// Remove duplicate interfaces - using imported types from firebase-services

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [movies, setMovies] = useState<Movie[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    rating: 0,
    poster: "",
    videoUrl: "",
    type: "movie" as "movie" | "series",
  })
  const [selectedPosterFile, setSelectedPosterFile] = useState<File | null>(null)
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const [slides, setSlides] = useState<any[]>([])
  const [newSlide, setNewSlide] = useState({ imageUrl: "", caption: "", link: "" })
  const [seriesList, setSeriesList] = useState<any[]>([])
  const [newEpisode, setNewEpisode] = useState({ seriesId: "", title: "", description: "", videoUrl: "", duration: "", episodeNumber: 1 })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    loadData()
  }, [user, router])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load movies, users, and analytics in parallel
      const [moviesData, usersData, analyticsData, slidesData, seriesData] = await Promise.all([
        movieService.getAllMovies(),
        userService.getAllUsers(),
        analyticsService.getAnalytics(),
        slideService.getSlides(),
        seriesService.getAllSeries(),
      ])

      setMovies(moviesData)
      setUsers(usersData)
      setAnalytics(analyticsData)
      setSlides(slidesData)
      setSeriesList(seriesData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMovie = async () => {
    if (!newMovie.title || !newMovie.description || !newMovie.genre || !newMovie.poster) {
      toast({
        title: "Error",
        description: "Please fill in Title, Description, Genre, and Poster URL",
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      // Create movie in Database (links only)
      const movieId = await movieService.addMovie({
        title: newMovie.title,
        description: newMovie.description,
        genre: newMovie.genre,
        duration: newMovie.duration,
        rating: newMovie.rating,
        poster: newMovie.poster,
        videoUrl: newMovie.videoUrl || undefined,
        type: newMovie.type,
        status: "active"
      }, user.id)

      // Reset form
      setNewMovie({
        title: "",
        description: "",
        genre: "",
        duration: "",
        rating: 0,
        poster: "",
        videoUrl: "",
        type: "movie",
      })
      setSelectedPosterFile(null)
      setSelectedVideoFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (videoInputRef.current) videoInputRef.current.value = ""

      // Reload data
      await loadData()

      toast({
        title: "Success",
        description: "Content added successfully",
      })
    } catch (error) {
      console.error('Error adding movie:', error)
      toast({
        title: "Error",
        description: "Failed to add content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMovie = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      return
    }

    try {
      const movie = movies.find(m => m.id === id)
      if (movie) {
        // Delete from Database
        await movieService.deleteMovie(id)
        // Reload data
        await loadData()
        
        toast({
          title: "Success",
          description: "Content deleted successfully",
        })
      }
    } catch (error) {
      console.error('Error deleting movie:', error)
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleMovieStatus = async (id: string) => {
    try {
      const movie = movies.find(m => m.id === id)
      if (movie) {
        const newStatus = movie.status === "active" ? "inactive" : "active"
        await movieService.updateMovie(id, { status: newStatus })
        // Reload data
        await loadData()
        
        toast({
          title: "Success",
          description: "Content status updated",
        })
      }
    } catch (error) {
      console.error('Error updating movie status:', error)
      toast({
        title: "Error",
        description: "Failed to update content status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handlePosterUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file for the poster",
          variant: "destructive",
        })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Poster image must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setSelectedPosterFile(file)
    }
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive",
        })
        return
      }
      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video file must be less than 500MB",
          variant: "destructive",
        })
        return
      }
      setSelectedVideoFile(file)
    }
  }

  const addSlide = async () => {
    if (!newSlide.imageUrl) {
      toast({ title: "Error", description: "Provide slide image URL", variant: "destructive" })
      return
    }
    try {
      const id = await slideService.addSlide({ imageUrl: newSlide.imageUrl, caption: newSlide.caption, link: newSlide.link })
      setNewSlide({ imageUrl: "", caption: "", link: "" })
      await loadData()
      toast({ title: "Slide added" })
    } catch {
      toast({ title: "Error", description: "Failed to add slide", variant: "destructive" })
    }
  }

  const deleteSlide = async (id: string) => {
    try {
      await slideService.deleteSlide(id)
      await loadData()
      toast({ title: "Slide deleted" })
    } catch {
      toast({ title: "Error", description: "Failed to delete slide", variant: "destructive" })
    }
  }

  const addEpisode = async () => {
    if (!newEpisode.seriesId || !newEpisode.title || !newEpisode.videoUrl || !newEpisode.duration) {
      toast({ title: "Error", description: "Fill series, title, video, duration", variant: "destructive" })
      return
    }
    try {
      await seriesService.addEpisode(newEpisode.seriesId, {
        title: newEpisode.title,
        description: newEpisode.description,
        videoUrl: newEpisode.videoUrl,
        duration: newEpisode.duration,
        episodeNumber: Number(newEpisode.episodeNumber),
      })
      setNewEpisode({ seriesId: "", title: "", description: "", videoUrl: "", duration: "", episodeNumber: 1 })
      await loadData()
      toast({ title: "Episode added" })
    } catch {
      toast({ title: "Error", description: "Failed to add episode", variant: "destructive" })
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your Luo Ancient Movies platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movies.length}</div>
            <p className="text-xs text-muted-foreground">
              {movies.filter((m) => m.type === "movie").length} movies,{" "}
              {movies.filter((m) => m.type === "series").length} series
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+{analytics?.newSignups} new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUGX(analytics?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all content</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="movies">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="slides">Slides</TabsTrigger>
          <TabsTrigger value="episodes">Episodes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Popular Genres
                </CardTitle>
                <CardDescription>Most watched content by genre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.popularGenres.map((genre, index) => (
                    <div key={genre.genre} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium">{genre.genre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(genre.count / 50) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{genre.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>View and revenue statistics for your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movies.slice(0, 5).map((movie) => (
                  <div key={movie.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{movie.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{movie.genre}</Badge>
                          <Badge variant={movie.status === "active" ? "default" : "destructive"}>{movie.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{movie.views.toLocaleString()} views</div>
                      <div className="text-sm text-muted-foreground">{formatUGX(movie.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage movies and series on your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movies.map((movie) => (
                  <div key={movie.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{movie.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{movie.genre}</Badge>
                          <Badge variant="outline">{movie.type}</Badge>
                          <Badge variant={movie.status === "active" ? "default" : "destructive"}>{movie.status}</Badge>
                          <span className="text-sm text-muted-foreground">{movie.duration}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{movie.views.toLocaleString()} views</span>
                          <span>{formatUGX(movie.revenue)} revenue</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => toggleMovieStatus(movie.id)}>
                        {movie.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteMovie(movie.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((userData) => (
                    <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{userData.name}</h3>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">{userData.subscription?.plan || "No Subscription"}</Badge>
                          <Badge variant={userData.status === "active" ? "default" : "destructive"}>{userData.status}</Badge>
                          <Badge variant="outline">{userData.role}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Joined: {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}</span>
                          <span>Last active: {userData.lastActive ? new Date(userData.lastActive).toLocaleDateString() : "Unknown"}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newStatus = userData.status === "active" ? "inactive" : "active"
                            userService.updateUser(userData.id!, { status: newStatus })
                              .then(() => {
                                toast({
                                  title: "Success",
                                  description: `User ${newStatus === "active" ? "activated" : "deactivated"}`,
                                })
                                loadData()
                              })
                              .catch(() => {
                                toast({
                                  title: "Error",
                                  description: "Failed to update user status",
                                  variant: "destructive",
                                })
                              })
                          }}
                        >
                          {userData.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Content Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Content</CardTitle>
              <CardDescription>Add new movies or series to your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    placeholder="Enter movie/series title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select value={newMovie.genre} onValueChange={(value) => setNewMovie({ ...newMovie, genre: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Action">Action</SelectItem>
                      <SelectItem value="Drama">Drama</SelectItem>
                      <SelectItem value="Comedy">Comedy</SelectItem>
                      <SelectItem value="Romance">Romance</SelectItem>
                      <SelectItem value="Thriller">Thriller</SelectItem>
                      <SelectItem value="Documentary">Documentary</SelectItem>
                      <SelectItem value="Historical">Historical</SelectItem>
                      <SelectItem value="Supernatural">Supernatural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                    placeholder="e.g., 2h 15m or 8 episodes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newMovie.type}
                    onValueChange={(value: "movie" | "series") => setNewMovie({ ...newMovie, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  placeholder="Enter movie/series description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={newMovie.rating}
                  onChange={(e) => setNewMovie({ ...newMovie, rating: Number.parseFloat(e.target.value) })}
                  placeholder="4.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poster-link">Poster Image URL</Label>
                <Input
                  id="poster-link"
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  value={newMovie.poster}
                  onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-link">Video URL (Optional)</Label>
                <Input
                  id="video-link"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={newMovie.videoUrl}
                  onChange={(e) => setNewMovie({ ...newMovie, videoUrl: e.target.value })}
                />
              </div>

              <Button 
                onClick={handleAddMovie} 
                className="w-full" 
                disabled={uploading || isLoading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slides Tab */}
        <TabsContent value="slides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Slides</CardTitle>
              <CardDescription>Upload and manage homepage slides</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slide-image">Image URL</Label>
                  <Input id="slide-image" value={newSlide.imageUrl} onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })} placeholder="https://.../slide.jpg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slide-caption">Caption</Label>
                  <Input id="slide-caption" value={newSlide.caption} onChange={(e) => setNewSlide({ ...newSlide, caption: e.target.value })} placeholder="Headline" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slide-link">Link (optional)</Label>
                  <Input id="slide-link" value={newSlide.link} onChange={(e) => setNewSlide({ ...newSlide, link: e.target.value })} placeholder="/movie/xyz or https://..." />
                </div>
              </div>
              <Button onClick={addSlide}>Add Slide</Button>
              <div className="grid gap-3 md:grid-cols-3">
                {slides.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <img src={s.imageUrl} alt={s.caption || "slide"} className="w-16 h-10 object-cover rounded" />
                      <div>
                        <div className="font-medium line-clamp-1">{s.caption || "(No caption)"}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{s.link}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => deleteSlide(s.id)}>Delete</Button>
                  </div>
                ))}
                {slides.length === 0 && <div className="text-sm text-muted-foreground">No slides yet</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Episodes Tab */}
        <TabsContent value="episodes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Episode</CardTitle>
              <CardDescription>Select a series then add episode details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Series</Label>
                  <Select value={newEpisode.seriesId} onValueChange={(v) => setNewEpisode({ ...newEpisode, seriesId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesList.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={newEpisode.title} onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea rows={3} value={newEpisode.description} onChange={(e) => setNewEpisode({ ...newEpisode, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input value={newEpisode.videoUrl} onChange={(e) => setNewEpisode({ ...newEpisode, videoUrl: e.target.value })} placeholder="https://.../episode.mp4" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={newEpisode.duration} onChange={(e) => setNewEpisode({ ...newEpisode, duration: e.target.value })} placeholder="45m" />
                </div>
                <div className="space-y-2">
                  <Label>Episode Number</Label>
                  <Input type="number" min="1" value={newEpisode.episodeNumber} onChange={(e) => setNewEpisode({ ...newEpisode, episodeNumber: Number(e.target.value) })} />
                </div>
              </div>
              <Button onClick={addEpisode} disabled={!seriesList.length}>Add Episode</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure your platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Luo Ancient Movies" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" defaultValue="admin@luoancient.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <Select defaultValue="off">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="on">On</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
