import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getWeeklyData } from '../utils/ProgressTracker';

export default function WeeklyGraphScreen() {
  const [labels, setLabels] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [aiData, setAiData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const week = await getWeeklyData();
      const today = new Date();
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today.getTime() - i * 86400000);
        days.push(d.toISOString().slice(0, 10));
      }

      const lbls = [];
      const pdfs = [];
      const ais = [];

      days.forEach((d) => {
        lbls.push(d.slice(5)); // MM-DD
        const entry = week[d] || { pdf: 0, ai: 0 };
        pdfs.push(entry.pdf || 0);
        ais.push(entry.ai || 0);
      });

      setLabels(lbls);
      setPdfData(pdfs);
      setAiData(ais);
    };

    load();
  }, []);

  const screenWidth = Dimensions.get('window').width - 30;

  const chartConfig = {
    backgroundGradientFrom: '#A18DFF',
    backgroundGradientTo: '#6A5AE0',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    style: { borderRadius: 12 },
  };

  return (
    <ScrollView style={{ padding: 15 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center' }}>Weekly Learning (last 7 days)</Text>

      <Text style={{ marginTop: 12, marginBottom: 6, fontWeight: '600' }}>PDFs opened</Text>
      <BarChart
        data={{ labels, datasets: [{ data: pdfData }] }}
        width={screenWidth}
        height={200}
        fromZero
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={{ borderRadius: 12 }}
      />

      <Text style={{ marginTop: 20, marginBottom: 6, fontWeight: '600' }}>AI interactions</Text>
      <BarChart
        data={{ labels, datasets: [{ data: aiData }] }}
        width={screenWidth}
        height={200}
        fromZero
        chartConfig={chartConfig}
        style={{ borderRadius: 12 }}
      />
    </ScrollView>
  );
}
