import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { Link } from 'expo-router'

export default function VideosScreen() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3000/api/videos')
      .then(r => r.json())
      .then(d => { setVideos(d.videos); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: '#000' }} color="#3B82F6" />

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ padding: 24, paddingTop: 60 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 24 }}>الفيديوهات</Text>
        {videos.map(v => (
          <Link key={v.id} href={`/video/${v.id}`} asChild>
            <TouchableOpacity style={{ marginBottom: 16, backgroundColor: '#111', borderRadius: 12, overflow: 'hidden' }}>
              <View style={{ height: 180, backgroundColor: '#1f2937', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 40, opacity: 0.3 }}>▶</Text>
              </View>
              <View style={{ padding: 12 }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{v.title}</Text>
                <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>{Math.floor(v.duration / 60)} دقيقة</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  )
}
