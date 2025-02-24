import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text, Button, Surface, Card, Portal, Modal } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";

type ResultsParams = {
  mode: string;
  difficulty: string;
  correct: string;
  total: string;
  reviewedKanji: string; // We'll need to pass this from KanjiReviewScreen
};

type KanjiDetails = {
  kanji: string;
  meanings: string[];
  readings: {
    ja_on: string[];
    ja_kun: string[];
  };
  stroke_count: string;
  isCorrect: boolean;
};

export default function ResultsScreen() {
  const params = useLocalSearchParams<ResultsParams>();
  const score = Math.round(
    (Number(params.correct) / Number(params.total)) * 100
  );
  const [selectedKanji, setSelectedKanji] = useState<KanjiDetails | null>(null);

  // Parse the reviewedKanji from params
  const reviewedKanji = React.useMemo(() => {
    try {
      return JSON.parse(params.reviewedKanji || "[]") as KanjiDetails[];
    } catch (error) {
      console.error("Error parsing reviewed kanji:", error);
      return [];
    }
  }, [params.reviewedKanji]);

  const handleReviewAgain = () => {
    router.push({
      pathname: "/kanji-review",
      params: {
        mode: params.mode,
        difficulty: params.difficulty,
        count: params.total,
      },
    });
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.content} elevation={1}>
          <Text variant="headlineMedium" style={styles.title}>
            Review Complete!
          </Text>

          <View style={styles.scoreContainer}>
            <Text variant="displayLarge" style={styles.score}>
              {score}%
            </Text>
            <Text variant="titleMedium" style={styles.scoreDetails}>
              {params.correct} / {params.total} kanji
            </Text>
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Reviewed Kanji
          </Text>
          <View style={styles.kanjiGrid}>
            {reviewedKanji.map((kanji, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedKanji(kanji)}
                style={[
                  styles.kanjiCard,
                  {
                    backgroundColor: kanji.isCorrect ? "#4CAF50" : "#f44336",
                  },
                ]}
              >
                <Text style={[styles.kanjiCharacter, { color: "#FFFFFF" }]}>
                  {kanji.kanji}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleReviewAgain}
              style={styles.button}
            >
              Review Again
            </Button>
            <Button
              mode="outlined"
              onPress={handleGoHome}
              style={styles.button}
            >
              Return Home
            </Button>
          </View>
        </Surface>
      </ScrollView>

      <Portal>
        <Modal
          visible={!!selectedKanji}
          onDismiss={() => setSelectedKanji(null)}
          contentContainerStyle={[
            styles.modalContent,
            {
              margin: 20,
              backgroundColor: "white",
              padding: 20,
              alignSelf: "center",
            },
          ]}
        >
          {selectedKanji && (
            <View>
              <Text style={styles.modalKanji}>{selectedKanji.kanji}</Text>
              <Text style={styles.modalReadings}>
                On: {selectedKanji.readings.ja_on?.join("、 ") || "None"}
              </Text>
              <Text style={styles.modalReadings}>
                Kun: {selectedKanji.readings.ja_kun?.join("、 ") || "None"}
              </Text>
              <Text style={styles.modalMeanings}>
                {selectedKanji.meanings.en?.join(", ") ||
                  "No meanings available"}
              </Text>
              <Text style={styles.modalStrokeCount}>
                Stroke count: {selectedKanji.stroke_count}
              </Text>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  content: {
    padding: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  score: {
    color: "#4CAF50",
    marginBottom: 8,
  },
  scoreDetails: {
    opacity: 0.7,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  kanjiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginBottom: 24,
  },
  kanjiCard: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 2,
  },
  kanjiCharacter: {
    fontSize: 28,
    fontWeight: "500",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    margin: 16,
    borderRadius: 12,
    width: 300,
    maxWidth: "90%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -100 }],
  },
  modalKanji: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 16,
  },
  modalReadings: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalMeanings: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  modalStrokeCount: {
    fontSize: 14,
    marginTop: 16,
    opacity: 0.7,
  },
});
