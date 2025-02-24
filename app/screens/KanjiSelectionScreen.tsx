import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, Surface, SegmentedButtons } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { router, useLocalSearchParams } from "expo-router";

type DifficultyOption = {
  value: string;
  label: string;
};

const DIFFICULTY_OPTIONS = {
  jouyou: [
    { value: "grade-1", label: "Grade 1" },
    { value: "grade-2", label: "Grade 2" },
    { value: "grade-3", label: "Grade 3" },
    { value: "grade-4", label: "Grade 4" },
    { value: "grade-5", label: "Grade 5" },
    { value: "grade-6", label: "Grade 6" },
    { value: "secondary", label: "Secondary School" },
  ],
  jlpt: [
    { value: "n5", label: "N5" },
    { value: "n4", label: "N4" },
    { value: "n3", label: "N3" },
    { value: "n2", label: "N2" },
    { value: "n1", label: "N1" },
  ],
  frequency: [
    { value: "top-100", label: "Top 100" },
    { value: "top-500", label: "Top 500" },
  ],
};

export default function KanjiSelectionScreen() {
  const { mode } = useLocalSearchParams<{
    mode: keyof typeof DIFFICULTY_OPTIONS;
  }>();
  const [kanjiCount, setKanjiCount] = useState(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
    DIFFICULTY_OPTIONS[mode][0].value
  );

  const handleStartReview = () => {
    router.push({
      pathname: "/kanji-review",
      params: {
        mode,
        difficulty: selectedDifficulty,
        count: kanjiCount,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.content} elevation={1}>
        <Text variant="headlineMedium" style={styles.title}>
          Configure Your Review
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium">Number of Kanji: {kanjiCount}</Text>
          <Slider
            value={kanjiCount}
            onValueChange={setKanjiCount}
            minimumValue={5}
            maximumValue={50}
            step={5}
            style={styles.slider}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Difficulty Level
          </Text>
          <View style={styles.buttonsWrapper}>
            {DIFFICULTY_OPTIONS[mode].map((option) => (
              <Button
                key={option.value}
                mode={
                  selectedDifficulty === option.value ? "contained" : "outlined"
                }
                onPress={() => setSelectedDifficulty(option.value)}
                style={styles.difficultyButton}
              >
                {option.label}
              </Button>
            ))}
          </View>
        </View>

        <Button
          mode="contained"
          style={styles.startButton}
          onPress={handleStartReview}
        >
          Start Review
        </Button>
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
    padding: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  slider: {
    height: 40,
  },
  startButton: {
    marginTop: 8,
  },
  buttonsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  difficultyButton: {
    marginBottom: 8,
    flex: 1,
    minWidth: 100,
  },
});
