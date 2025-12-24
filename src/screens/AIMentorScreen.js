import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { updateProgress } from '../utils/ProgressTracker';

const colors = {
  background: '#F9F9FB',
  purple: '#6A5AE0',
  purpleLight: '#E6E0FF',
  text: '#333333',
  white: '#FFFFFF',
};

const subjectKeywords = {
  physics: 'Physics',
  mechanics: 'Physics',
  electrostatics: 'Physics',
  magnetism: 'Physics',
  waves: 'Physics',

  chemistry: 'Chemistry',
  organic: 'Chemistry',
  inorganic: 'Chemistry',

  biology: 'Biology',
  genetics: 'Biology',
  cell: 'Biology',

  math: 'Mathematics I',
  maths: 'Mathematics I',
  mathematics: 'Mathematics I',
  algebra: 'Mathematics I',
  probability: 'Mathematics I',

  calculus: 'Mathematics II',
  integration: 'Mathematics II',
  differentiation: 'Mathematics II',
};

// Suggested learning topics
const suggestedTopics = [
  'Physics - Mechanics',
  'Chemistry - Organic',
  'Mathematics - Algebra',
  'Biology - Genetics',
  'Electrostatics (Physics)',
  'Probability (Math)',
];

// Detect subject from user input
const detectSubject = (text) => {
  if (!text) return null;

  const t = text.toLowerCase();

  for (const key of Object.keys(subjectKeywords)) {
    if (t.includes(key)) return subjectKeywords[key];
  }
  return null;
};

export default function AIMentorScreen({ route }) {
  const navigation = useNavigation();
  const studentName = route.params?.studentName || 'User';

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'AI',
      content: `Hello ${studentName}! What topic shall we study today? 🤖`,
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const scrollToBottom = (delay = 80) =>
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), delay);

  // Handle user sending a message
  const sendMessage = async (txt) => {
    if (!txt.trim()) return;

    const message = txt.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'You', content: message },
    ]);

    setInput('');
    scrollToBottom();
    setLoading(true);

    // Detect subject → save AI progress
    const detected = detectSubject(message);
    if (detected) {
      await updateProgress(detected, 'ai');
    }

    // AI Reply Simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'AI',
          content: `Here’s something helpful about "${message}" 📘  
Ask another question or choose a topic.`,
        },
      ]);
      setLoading(false);
      scrollToBottom();
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient colors={['#A18DFF', '#6A5AE0']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>AI Mentor</Text>
          </View>
          <Text style={styles.headerSub}>Ask anything or pick a topic below</Text>
        </LinearGradient>

        {/* Chat List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          renderItem={({ item }) => (
            <View
              style={[
                styles.msgBubble,
                item.sender === 'You' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={item.sender === 'You' ? styles.userText : styles.aiText}>
                {item.content}
              </Text>
            </View>
          )}
        />

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#6A5AE0" />
          </View>
        )}

        {/* Footer (moves above keyboard) */}
        <View style={styles.footer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.topicScroll}
          >
            {suggestedTopics.map((topic) => (
              <TouchableOpacity
                key={topic}
                onPress={() => sendMessage(topic)}
                style={styles.topicBtn}
              >
                <LinearGradient
                  colors={['#A18DFF', '#6A5AE0']}
                  style={styles.topicGradient}
                >
                  <Text style={styles.topicText}>{topic}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input Box */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask something..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => sendMessage(input)}
            />
            <TouchableOpacity onPress={() => sendMessage(input)} style={styles.sendBtn}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 28, color: colors.white },
  headerText: { color: colors.white, fontSize: 22, fontWeight: '700', marginLeft: 10 },
  headerSub: { color: '#fff', opacity: 0.9, marginTop: 6 },

  chatContainer: { padding: 14 },

  msgBubble: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 16,
    maxWidth: '78%',
  },

  aiBubble: { backgroundColor: colors.purple, alignSelf: 'flex-start' },
  userBubble: { backgroundColor: colors.purpleLight, alignSelf: 'flex-end' },

  aiText: { color: '#fff' },
  userText: { color: colors.purple },

  loadingRow: { paddingLeft: 20, paddingBottom: 8 },

  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },

  topicScroll: { paddingLeft: 10 },
  topicBtn: { marginRight: 10 },
  topicGradient: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  topicText: { color: '#fff', fontWeight: '600', fontSize: 12 },

  inputRow: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  sendBtn: {
    marginLeft: 8,
    backgroundColor: colors.purple,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  sendText: { color: '#fff', fontWeight: '700' },
});
