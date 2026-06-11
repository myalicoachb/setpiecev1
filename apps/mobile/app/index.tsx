import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ padding: 24, paddingTop: 60 }}>
        <Text style={{ fontSize: 14, color: '#3B82F6', marginBottom: 8 }}>أول منصة تخصصية في الكرات الثابتة</Text>
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 16 }}>
          أتقن الكرات الثابتة{'\n'}واصنع الفارق
        </Text>
        <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 32, lineHeight: 24 }}>
          منصة تعليمية متكاملة لتحليل وتعلم وتنفيذ الكرات الثابتة
        </Text>
        <Link href="/videos" asChild>
          <TouchableOpacity style={{ backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>ابدأ التعلم مجاناً</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  )
}
