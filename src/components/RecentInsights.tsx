import { FileTextIcon, ExternalLinkIcon } from "lucide-react";
import {
  COMPANY_NAMES,
  MAIN_CATEGORIES,
  AI_EMOTIONS,
  NON_MARKET_TAGS,
} from "./constants/insight.ts";
import INSIGHT_CONTENTS from "./constants/insightContents";
import ClovaSummary from "./service/StockInsights";
import { useState, useEffect } from "react";
import { TOTAL_SCORES } from "../index.tsx"; //이게 최종 점수입니다.
import { getNonMarketNewsSummary } from "./service/StockInsights";

interface Insight {
  companyName?: string;
  title: string;
  mainCategory: string;
  subCategories: string[];
  aiEmotion: string;
  score: number;
  date: string;
  source: string;
  content?: string;
}

const emotionStyles = {
  긍정적: "bg-[#d2f5c4] text-green-700",
  보류: "bg-[#fff7b2] text-yellow-700",
  부정적: "bg-[#ffd6d6] text-red-600",
};

const getEmotionFromScore = (score: number) => {
  if (score >= 75) return "긍정적";
  if (score >= 60) return "보류";
  return "부정적";
};

const InsightItem = ({
  insight,
  onDetail,
  index,
}: {
  insight: Insight;
  onDetail: (insight: Insight) => void;
  index: number;
}) => {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex items-start">
        <div className={`p-2 rounded-lg mr-3 ${index === 1 ? 'bg-red-50' : 'bg-blue-50'}`}>
          <FileTextIcon className={`h-5 w-5 ${index === 1 ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs px-1.5 py-0.5 bg-[#e2ebf0] rounded-full text-gray-600 ">
              {insight.mainCategory}
            </span>
            {insight.subCategories.slice(0, 2).map((sub, idx) => (
              <span
                key={idx}
                className="text-xs px-1.5 py-0.5 bg-[#c2e9fb] rounded-full text-blue-600"
              >
                {sub}
              </span>
            ))}
            {insight.subCategories.length > 2 && (
              <span className="text-xs px-1.5 py-0.5 bg-[#c2e9fb] rounded-full text-blue-600">
                +{insight.subCategories.length - 2}
              </span>
            )}
            {insight.companyName && (
              <span className="text-xs px-1.5 py-0.5 bg-[#ffe0b2] rounded-full text-orange-700">
                {insight.companyName}
              </span>
            )}
            {insight.aiEmotion && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  emotionStyles[
                    insight.aiEmotion as keyof typeof emotionStyles
                  ] ?? "bg-gray-200 text-gray-700"
                }`}
              >
                {insight.aiEmotion}
              </span>
            )}
          </div>
          <h4 className="font-medium mt-2">{insight.title}</h4>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div>
              {insight.date} | {insight.source}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  insight.score === 0 
                    ? "bg-blue-50 text-blue-600" 
                    : emotionStyles[
                        getEmotionFromScore(insight.score) as keyof typeof emotionStyles
                      ] ?? "text-gray-600"
                }`}
              >
                {insight.score === 0 ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    분석 중...
                  </span>
                ) : (
                  `AI 점수: ${Math.round(insight.score)}`
                )}
              </span>
              <button
                className="flex items-center text-blue-600 hover:text-blue-800"
                onClick={() => onDetail(insight)}
              >
                <span className="mr-1">자세히</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecentInsights = () => {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [summary, setSummary] = useState("");
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  const [insightData, setInsightData] = useState<Insight[]>([
    {
      companyName: COMPANY_NAMES.SAMSUNG.name,
      title: "삼성물산, 신정동 1152 재개발 수주…단지명 '목동 래미안 트라메종'",
      mainCategory: MAIN_CATEGORIES.INFORMATION_TECHNOLOGY,
      subCategories: ["건설", "KRX 300"],
      aiEmotion: AI_EMOTIONS.POSITIVE,
      score: 0,
      date: "2025-07-20",
      source: "아시아경제",
      content: INSIGHT_CONTENTS[0],
    },
    {//비시장적 뉴스
      title:
        "🇰🇷 한국 국가안보실장, 관세 시한 앞두고 워싱턴 방문",
      mainCategory: NON_MARKET_TAGS.DIPLOMACY,
      subCategories: [NON_MARKET_TAGS.USA,NON_MARKET_TAGS.RISK_FACTOR],
      aiEmotion: AI_EMOTIONS.NEGATIVE,
      score: 0,
      date: "2025-07-20",
      source: "로이터 통신",
      content: INSIGHT_CONTENTS[1],
    },
    {
      title:
        "J&J 실적에 바이오株 반등…트럼프發 관세 타격 없다, 그 이유는?[투자360]",
      mainCategory: MAIN_CATEGORIES.HEALTHCARE,
      subCategories: ["바이오"],
      aiEmotion: AI_EMOTIONS.POSITIVE,
      score: 0,
      date: "2024-07-20",
      source: "해럴드경제",
      content: INSIGHT_CONTENTS[2],
    },
    {
      title:
        "‘타코맨’ 트럼프, 車 관세 높일까?…“25%만 지켜도 자동차株 주가 반등”[투자360]",
      mainCategory: MAIN_CATEGORIES.AUTOMOTIVE,
      subCategories: ["자동차", "자동차부품"],
      aiEmotion: AI_EMOTIONS.NEGATIVE,
      score: 0,
      date: "2024-07-20",
      source: "서울경제",
      content: INSIGHT_CONTENTS[3],
    },
    {
      companyName: COMPANY_NAMES.CHIPOLE.name,
      title: "치폴레(CMG), 하반기 성장세 가속 기대돼 -BMO",
      mainCategory: MAIN_CATEGORIES.CONSUMER_STAPLES,
      subCategories: ["식품"],
      aiEmotion: AI_EMOTIONS.POSITIVE,
      score: 0,
      date: "2024-07-18",
      source: "연합인포해외",
      content: INSIGHT_CONTENTS[4],
    },
  ]);

  const [nonMarketSummary, setNonMarketSummary] = useState<{ summary: string; companies: string[] } | null>(null);
  const [loadingNonMarket, setLoadingNonMarket] = useState(false);
  const [errorNonMarket, setErrorNonMarket] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (TOTAL_SCORES.some((score) => score > 0)) {
        setScores([...TOTAL_SCORES]);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handleDetail = async (insight: Insight, index: number) => {
    setSelectedInsight(insight);
    setSummary("");
    setNonMarketSummary(null);
    setErrorNonMarket("");
    if (index === 1) {
      setLoadingNonMarket(true);
      try {
        const res = await getNonMarketNewsSummary(insight.content || insight.title);
        setNonMarketSummary(res);
      } catch (e) {
        setErrorNonMarket("요약 실패");
      }
      setLoadingNonMarket(false);
    }
  };

  const closeModal = () => setSelectedInsight(null);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-800">최근 인사이트</h3>
      </div>

      <div className="space-y-4">
        {insightData.map((insight, index) => (
          <InsightItem
            key={index}
            insight={{ ...insight, score: scores[index] ?? 0 }}
            onDetail={() => handleDetail(insight, index)}
            index={index}
          />
        ))}
      </div>

      {selectedInsight && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "white",
              borderRadius: 8,
              minWidth: 350,
              maxWidth: 500,
              padding: 24,
              maxHeight: 600,
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ float: "right", fontSize: 18, marginBottom: 8 }}
              onClick={closeModal}
            >
              X
            </button>
            {/* 2번 항목만 별도 처리 */}
            {selectedInsight && insightData[1] && selectedInsight.title === insightData[1].title ? (
              <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">비시장 뉴스 AI 요약</h2>
                </div>
                <div className="overflow-y-auto" style={{maxHeight: 350}}>
                  {loadingNonMarket ? (
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium">AI가 뉴스를 분석하고 있습니다...</span>
                    </div>
                  ) : errorNonMarket ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{errorNonMarket}</span>
                      </div>
                    </div>
                  ) : nonMarketSummary ? (
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-red-100">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed text-sm mb-4">
                          {nonMarketSummary.summary}
                        </div>
                        <div className="mt-4 pt-4 border-t border-red-100">
                          <div className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            영향받는 기업
                          </div>
                          <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            {nonMarketSummary.companies.map((c, i) => (
                              <li key={i} className="text-sm">{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto" style={{maxHeight: 350}}>
                <ClovaSummary
                  text={selectedInsight.content || selectedInsight.title}
                  onSummary={setSummary}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
