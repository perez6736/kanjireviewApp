import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import { router } from "expo-router";

type StudyMode = "jouyou" | "jlpt" | "frequency";

export default function WelcomeScreen() {
  const handleModeSelect = (mode: StudyMode) => {
    router.push({
      pathname: "/kanji-selection",
      params: { mode },
    });
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.content} elevation={1}>
        <Text variant="headlineLarge" style={styles.title}>
          漢字 Study
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Master Kanji through personalized review sessions
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.modeButton}
            onPress={() => handleModeSelect("jouyou")}
          >
            Jouyou
          </Button>
          <Button
            mode="contained"
            style={styles.modeButton}
            onPress={() => handleModeSelect("jlpt")}
          >
            JLPT
          </Button>
          <Button
            mode="contained"
            style={styles.modeButton}
            onPress={() => handleModeSelect("frequency")}
          >
            Frequency
          </Button>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 32,
    textAlign: "center",
    opacity: 0.7,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  modeButton: {
    width: "100%",
  },
});
