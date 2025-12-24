import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking
} from 'react-native';
import { WebView } from 'react-native-webview';
import { updateProgress } from '../utils/ProgressTracker';

const BASE_PDF_URL =
  'https://raw.githubusercontent.com/KishorKudnar/dnyanai-pdfs/main/';

export default function SubjectPDFScreen({ route, navigation }) {
  const { pdfFile, subjectName } = route.params;
  const [zoomLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateProgress(subjectName, 'pdf');
  }, [subjectName]);

  const finalUrl =
    pdfFile.startsWith("http") ? pdfFile : `${BASE_PDF_URL}${pdfFile}`;

  const googleViewer = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    finalUrl
  )}`;

  const zoomedUrl = googleViewer + `&zoom=${zoomLevel * 100}`;

  const openExternally = () => {
    Linking.openURL(finalUrl);
  };

  return (
    <View style={styles.container}>
      {/* HEADER TOOLBAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.title}>
          {subjectName} PDF
        </Text>
      </View>

      {/* ACTION TOOLBAR */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={openExternally}>
          <Text style={styles.toolText}>⬇</Text>
        </TouchableOpacity>
      </View>

      {/* PDF VIEWER */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6A5AE0" />
        </View>
      )}

      <WebView
        source={{ uri: zoomedUrl }}
        onLoadEnd={() => setLoading(false)}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
    backgroundColor: "#6A5AE0",
  },

  backButton: {
    fontSize: 28,
    color: "#fff",
    marginRight: 12,
  },

  title: {
    flex: 1,
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },

  extButton: {
    fontSize: 22,
    color: "#fff",
  },

  toolbar: {
    flexDirection: "row",
    backgroundColor: "#EDEAFF",
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  toolBtn: {
    backgroundColor: "#6A5AE0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },

  toolText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  zoomText: {
    fontSize: 16,
    fontWeight: "700",
  },

  loader: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
