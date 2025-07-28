import "./index.css";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { getPosNegScore, getAnalystScore, getNewsScore } from "./components/service/StockInsights";
import INSIGHT_CONTENTS from "./components/constants/insightContents";
import {
  ANALYST_COMPANY,
  ANALYST_Industry,
} from "./components/constants/analyst_Analysis";
import { EMOTIONS } from "./components/constants/emotion";

render(<App />, document.getElementById("root"));

// 내부 저장소
export let TOTAL_SCORES: number[] = [0, 0, 0, 0, 0];

// 외부 접근 안전 함수
export function getTotalScores(): number[] {
  return TOTAL_SCORES;
}

// 초기화 실행,만들어주신 3개의 함수로 점수 환산합니다.
(async () => {
  try {
    // 더미 데이터로 점수 계산 (실제로는 각 인사이트의 실제 데이터를 사용해야 함)
    const totalScores = await Promise.all(
      INSIGHT_CONTENTS.slice(0, 5).map(async (_, idx) => {
        try {
          // 감정 점수 (20점) - constant/EMOTIONS 데이터 사용 80 20,60 40 형식으로 바꾸었습니다.
          const emotionData = EMOTIONS[idx];
          const emotionScore = await getPosNegScore(emotionData.positive, emotionData.negative);

          // 애널리스트 점수 (40점) - ANALYST_Industry 데이터 사용
          const industryText = ANALYST_Industry[idx];
          const industryMatch = industryText.match(/([\d.]+)%/);
          const analystRating = industryMatch ? parseFloat(industryMatch[1]) / 10 : 0;
          const analystScore = await getAnalystScore(analystRating);

          // 뉴스 점수 (40점) - INSIGHT_CONTENTS 사용
          const newsScore = await getNewsScore(INSIGHT_CONTENTS[idx]);

          const totalScore = emotionScore + analystScore + newsScore;
          //맨처음에 뉴스만 4개 데이터 이렇게 산출하는데 필요없으시면 지우셔도됩니당.
          console.log(`인사이트 ${idx + 1} 점수:`, { emotionScore, analystScore, newsScore, totalScore });
          
          return totalScore;
        } catch (error) {
          console.error(`인사이트 ${idx + 1} 점수 계산 실패:`, error);
          return 0;
        }
      })
    );

    TOTAL_SCORES = totalScores;
    console.log("TOTAL_SCORES 초기화 완료:", TOTAL_SCORES);
  } catch (err) {
    console.error("점수 초기화 실패:", err);
    TOTAL_SCORES = [0, 0, 0, 0, 0];
  }
})();
