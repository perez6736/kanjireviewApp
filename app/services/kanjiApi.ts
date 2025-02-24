const BASE_URL = "https://japanese-kanji-api.onrender.com";

export type KanjiData = {
  kanji: string;
  unicode: string;
  grade: string;
  stroke_count: string;
  freq: string;
  jlpt: string;
  meanings: {
    en: string[];
  };
  readings: {
    ja_on: string[];
    ja_kun: string[];
  };
};

export async function fetchKanjiByMode(
  mode: string,
  difficulty: string,
  count: number
): Promise<KanjiData[]> {
  let endpoint = "";

  switch (mode) {
    case "jouyou":
      const grade = difficulty.split("-")[1];
      endpoint = `/api/list/jouyou/${grade}`;
      break;
    case "jlpt":
      // Map N5 to N4 since the API doesn't support N5
      const level =
        difficulty.toUpperCase() === "N5"
          ? "4"
          : difficulty.toUpperCase().replace("N", "");
      endpoint = `/api/list/jlpt/${level}`;
      break;
    case "frequency":
      endpoint = `/api/list/jouyou/`; // We'll filter by frequency later
      break;
    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }

  console.log("Fetching from endpoint:", `${BASE_URL}${endpoint}`); // Debug log

  try {
    console.log(
      `Fetching kanji: mode=${mode}, difficulty=${difficulty}, count=${count}`
    );
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API response:", data);

    // Extract the kanji array from the response.kanjis property
    const kanjiArray = data?.kanjis || [];
    console.log(`Received ${kanjiArray.length} kanji`);

    let filteredData = kanjiArray;
    if (mode === "frequency") {
      filteredData = kanjiArray
        .sort((a: KanjiData, b: KanjiData) => Number(a.freq) - Number(b.freq))
        .slice(0, difficulty === "top-100" ? 100 : 500);
    }

    if (filteredData.length === 0) {
      throw new Error("No kanji data received");
    }

    const selectedKanji = filteredData
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    console.log(`Returning ${selectedKanji.length} kanji for review`);
    return selectedKanji;
  } catch (error) {
    console.error("Error fetching kanji:", error);
    throw error;
  }
}
