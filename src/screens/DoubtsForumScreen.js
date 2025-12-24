import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const BASE_WIDTH = 390;
const scale = width / BASE_WIDTH;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const getInitials = (name) => {
  const names = name.split(' ');
  return names.map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const initialPosts = [
  {
    id: '1',
    user: 'Alice Wonderland',
    question:
      'What is the most efficient way to use the quadratic formula? Are there any shortcuts?',
    timestamp: '5m ago',
    likes: 12,
    replies: [
      {
        id: 'r1',
        user: 'Bob Builder',
        text: "The shortcut is to check the discriminant (b²-4ac) first — if it’s negative, there are no real solutions!",
      },
    ],
  },
  {
    id: '2',
    user: 'Charlie Chocolate',
    question:
      'Can someone explain the difference between speed and velocity in simple terms?',
    timestamp: '2h ago',
    likes: 8,
    replies: [],
  },
];

export default function DoubtsForumScreen({ route, navigation }) {
  const { studentName } = route.params || { studentName: 'You' };
  const [forumPosts, setForumPosts] = useState(initialPosts);
  const [newQuestion, setNewQuestion] = useState('');

  const addQuestion = () => {
    if (newQuestion.trim() === '') return;
    const newPost = {
      id: Date.now().toString(),
      user: studentName,
      question: newQuestion,
      timestamp: 'Just now',
      likes: 0,
      replies: [],
    };
    setForumPosts([newPost, ...forumPosts]);
    setNewQuestion('');
  };

  const handleLike = (postId) => {
    setForumPosts((posts) =>
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.user)}</Text>
        </View>
        <View style={styles.postHeaderText}>
          <Text style={styles.postUser}>{item.user}</Text>
          <Text style={styles.postTimestamp}>{item.timestamp}</Text>
        </View>
      </View>

      <Text style={styles.postQuestion}>{item.question}</Text>

      {item.replies.map((reply) => (
        <View key={reply.id} style={styles.replyContainer}>
          <View style={styles.replyAvatar}>
            <Text style={styles.replyAvatarText}>{getInitials(reply.user)}</Text>
          </View>
          <View style={styles.replyContent}>
            <Text style={styles.replyUser}>{reply.user}</Text>
            <Text style={styles.replyText}>{reply.text}</Text>
          </View>
        </View>
      ))}

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Text style={styles.actionText}>👍 Like ({item.likes})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            💬 Reply ({item.replies.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#A18DFF', '#6A5AE0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community Forum</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Ask, discuss, and learn together!
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          data={forumPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: normalize(20), paddingBottom: normalize(30) }}
          ListHeaderComponent={
            <View style={styles.inputCard}>
              <TextInput
                style={styles.input}
                placeholder={`Ask a question, ${studentName}...`}
                placeholderTextColor="#94A3B8"
                value={newQuestion}
                onChangeText={setNewQuestion}
                multiline
              />
              <TouchableOpacity style={styles.postButton} onPress={addQuestion}>
                <Text style={styles.postButtonText}>Post Doubt</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FE' },

  headerGradient: {
    paddingVertical: normalize(40),
    paddingHorizontal: normalize(20),
    borderBottomLeftRadius: normalize(30),
    borderBottomRightRadius: normalize(30),
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: normalize(10),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: normalize(8),
  },
  backArrow: {
    fontSize: normalize(30),
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: normalize(6),
  },

  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(20),
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    minHeight: normalize(60),
    fontSize: normalize(16),
    textAlignVertical: 'top',
    color: '#1E293B',
  },
  postButton: {
    backgroundColor: '#6A5AE0',
    borderRadius: normalize(12),
    paddingVertical: normalize(12),
    alignItems: 'center',
    marginTop: normalize(10),
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(16),
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  avatar: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    backgroundColor: '#EAE8FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  avatarText: {
    color: '#6A5AE0',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  postUser: {
    fontSize: normalize(16),
    fontWeight: '700',
    color: '#334155',
  },
  postTimestamp: {
    fontSize: normalize(12),
    color: '#94A3B8',
  },
  postQuestion: {
    fontSize: normalize(16),
    color: '#1E293B',
    lineHeight: normalize(22),
  },

  replyContainer: {
    flexDirection: 'row',
    marginTop: normalize(14),
    backgroundColor: '#F8FAFC',
    padding: normalize(12),
    borderRadius: normalize(12),
  },
  replyAvatar: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(10),
  },
  replyAvatarText: {
    color: '#64748B',
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  replyUser: {
    fontWeight: 'bold',
    color: '#334155',
    fontSize: normalize(14),
  },
  replyText: {
    color: '#475569',
    fontSize: normalize(14),
    marginTop: normalize(2),
    lineHeight: normalize(20),
  },

  actionBar: {
    flexDirection: 'row',
    marginTop: normalize(14),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: normalize(10),
  },
  actionButton: {
    marginRight: normalize(20),
  },
  actionText: {
    color: '#64748B',
    fontWeight: '500',
  },
});
