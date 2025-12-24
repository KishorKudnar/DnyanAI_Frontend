import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getHistory } from '../utils/ProgressTracker';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const h = await getHistory();
      setHistory(h || []);
    };
    load();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Learning Timeline</Text>

      {history.length === 0 && <Text style={{ color: '#888' }}>No activity yet.</Text>}

      {history.map((item, idx) => (
        <View
          key={idx}
          style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
            elevation: 2,
          }}
        >
          <Text style={{ fontWeight: '700' }}>{item.subject}</Text>
          <Text style={{ color: '#666' }}>{item.type === 'pdf' ? 'Opened PDF' : 'AI Interaction'}</Text>
          <Text style={{ marginTop: 6, color: '#999' }}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
