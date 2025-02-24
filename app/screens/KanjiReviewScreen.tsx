import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Text, Button, Surface, IconButton, Card } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { fetchKanjiByMode, KanjiData } from "../services/kanjiApi";

type ReviewParams = {
  mode: string;
  difficulty: string;
  count: string;
};

type Answer = {
  isCorrect: boolean;
  revealed: boolean;
};

export default function KanjiReviewScreen() {
  const params = useLocalSearchParams<ReviewParams>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [kanjiList, setKanjiList] = useState<KanjiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    loadKanji();
  }, []);

  const loadKanji = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchKanjiByMode(
        params.mode as string,
        params.difficulty as string,
        Number(params.count)
      );
      if (!data || data.length === 0) {
        throw new Error("No kanji data received");
      }
      setKanjiList(data);
      setAnswers(
        new Array(data.length).fill({ isCorrect: false, revealed: false })
      );
    } catch (error) {
      console.error("Error loading kanji:", error);
      setError(error instanceof Error ? error.message : "Failed to load kanji");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = { isCorrect, revealed: true };
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentIndex < kanjiList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    const reviewedKanji = kanjiList.map((kanji, index) => ({
      ...kanji,
      isCorrect: answers[index]?.isCorrect || false,
    }));

    router.push({
      pathname: "/results",
      params: {
        mode: params.mode,
        difficulty: params.difficulty,
        correct: answers.filter((a) => a.isCorrect).length.toString(),
        total: answers.length.toString(),
        reviewedKanji: JSON.stringify(reviewedKanji),
      },
    });
  };

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text variant="bodyLarge" style={styles.errorText}>
          {error}
        </Text>
        <Button mode="contained" onPress={loadKanji} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  if (loading || !kanjiList.length) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const currentKanji = kanjiList[currentIndex];
  const currentAnswer = answers[currentIndex] || {
    isCorrect: false,
    revealed: false,
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.content} elevation={1}>
        <Text variant="headlineMedium" style={styles.title}>
          Kanji Review ({params.mode} - {params.difficulty})
        </Text>

        <Card style={styles.kanjiCard}>
          <View style={styles.kanjiContainer}>
            <Text variant="displayLarge" style={styles.kanjiCharacter}>
              {currentKanji.kanji}
            </Text>
          </View>

          {currentAnswer?.revealed && currentKanji && (
            <View style={styles.detailsContainer}>
              <Text variant="titleMedium" style={styles.readings}>
                On: {currentKanji.readings.ja_on?.join("、 ") || "None"}
              </Text>
              <Text variant="titleMedium" style={styles.readings}>
                Kun: {currentKanji.readings.ja_kun?.join("、 ") || "None"}
              </Text>
              <Text variant="titleMedium" style={styles.meanings}>
                {currentKanji.meanings.en?.join(", ") ||
                  "No meanings available"}
              </Text>
              <Text variant="bodyMedium" style={styles.strokeCount}>
                Stroke count: {currentKanji.stroke_count}
              </Text>
            </View>
          )}
        </Card>

        {!currentAnswer?.revealed ? (
          <View style={styles.quizContainer}>
            <Text variant="titleMedium" style={styles.question}>
              Do you know this kanji?
            </Text>
            <View style={styles.answerButtons}>
              <Button
                mode="contained"
                onPress={() => handleAnswer(true)}
                style={[styles.answerButton, styles.correctButton]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                I know this
              </Button>
              <Button
                mode="contained"
                onPress={() => handleAnswer(false)}
                style={[styles.answerButton, styles.incorrectButton]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Still learning
              </Button>
            </View>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={
              currentIndex === kanjiList.length - 1 ? handleFinish : handleNext
            }
            style={styles.nextButton}
          >
            {currentIndex === kanjiList.length - 1 ? "Finish" : "Next Kanji"}
          </Button>
        )}

        <Text variant="titleMedium" style={styles.progress}>
          {currentIndex + 1} / {params.count}
        </Text>
      </Surface>
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
    padding: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  kanjiCard: {
    marginVertical: 16,
    width: "100%",
    backgroundColor: "#ffffff",
    minHeight: 200,
  },
  kanjiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    zIndex: 1,
  },
  kanjiCharacter: {
    fontSize: 56,
    textAlign: "center",
    includeFontPadding: false,
    color: "rgba(0, 0, 0, 0.87)",
  },
  detailsContainer: {
    marginTop: 160,
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: 16,
  },
  readings: {
    color: "#000000",
  },
  meanings: {
    marginTop: 8,
    textAlign: "center",
    color: "#000000",
  },
  strokeCount: {
    marginTop: 8,
    color: "rgba(0, 0, 0, 0.87)",
  },
  quizContainer: {
    alignItems: "center",
    gap: 16,
  },
  question: {
    marginBottom: 8,
  },
  answerButtons: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    maxWidth: 500,
    paddingHorizontal: 16,
  },
  answerButton: {
    flex: 1,
    height: 48,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    textAlign: "center",
  },
  correctButton: {
    backgroundColor: "#4CAF50",
  },
  incorrectButton: {
    backgroundColor: "#f44336",
  },
  nextButton: {
    marginVertical: 16,
  },
  progress: {
    textAlign: "center",
    marginTop: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 8,
  },
});
