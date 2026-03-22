// YouTube Video Fetching Module
export async function fetchYouTubeVideos(topic) {
  const YOUTUBE_API_KEY = "AIzaSyDWiry8VJd0_A_SATVks5XG3KUaihT07eU";

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&type=video&maxResults=3&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      console.error("YouTube API error:", response.status);
      return [];
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("YouTube API returned error:", data.error);
      return [];
    }

    return data.items || [];
  } catch (err) {
    console.error("Error fetching YouTube videos:", err);
    return [];
  }
}