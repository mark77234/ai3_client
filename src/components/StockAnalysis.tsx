import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getPosNegScore, getAnalystScore, getNewsScore } from "./service/StockInsights";

interface StockData {
  name: string;
  code: string;
  score: number;
  trend: "up" | "down";
  change: number;
  insight: string;
  // 점수 계산을 위한 데이터
  positive: number;
  negative: number;
  analystRating: number;
  newsSummary: string;
}
//말씀하신 기준으로 더미데이터 넣어서 그 함수들 사용했습니다.
export const StockAnalysis = () => {
  const [stockAnalysis, setStockAnalysis] = useState<StockData[]>([
    {
      name: "삼성전자",
      code: "005930",
      score: 0,
      trend: "up",
      change: 3.5,
      insight: "반도체 시장 회복 신호로 인한 긍정적 전망",
      positive: 85,
      negative: 15,
      analystRating: 8.5,
      newsSummary: "삼성전자는 반도체 시장 회복 신호와 함께 AI 반도체 수요 증가로 인한 긍정적 전망을 보이고 있습니다. 최근 실적 개선과 기술 혁신으로 시장에서 우위를 점하고 있으며, 향후 성장 가능성이 높다고 평가됩니다.",
    },
    {
      name: "SK하이닉스",
      code: "000660",
      score: 0,
      trend: "up",
      change: 2.1,
      insight: "AI 반도체 수요 증가로 인한 성장 기대",
      positive: 80,
      negative: 20,
      analystRating: 8.0,
      newsSummary: "SK하이닉스는 AI 반도체 수요 증가와 메모리 시장 회복으로 인한 성장 기대가 높습니다. 최근 기술 개발과 생산성 향상으로 경쟁력을 강화하고 있으며, 글로벌 시장에서의 입지가 확대되고 있습니다.",
    },
    {
      name: "현대차",
      code: "005380",
      score: 0,
      trend: "down",
      change: 1.2,
      insight: "글로벌 공급망 이슈로 인한 생산 차질 우려",
      positive: 60,
      negative: 40,
      analystRating: 6.5,
      newsSummary: "현대차는 글로벌 공급망 이슈와 원자재 가격 상승으로 인한 생산 차질 우려가 있습니다. 하지만 전기차 시장 진출과 신기술 개발로 장기적 성장 가능성은 여전히 유지하고 있습니다.",
    },
    {
      name: "카카오",
      code: "035720",
      score: 0,
      trend: "up",
      change: 0.8,
      insight: "신규 서비스 출시로 인한 성장 모멘텀 확보",
      positive: 75,
      negative: 25,
      analystRating: 7.5,
      newsSummary: "카카오는 신규 서비스 출시와 플랫폼 확장으로 인한 성장 모멘텀을 확보하고 있습니다. 디지털 전환 가속화로 인한 수요 증가와 함께 다양한 사업 영역에서의 성장 가능성이 높습니다.",
    },
  ]);

  useEffect(() => {
    const calculateScores = async () => {
      const updatedStocks = await Promise.all(
        stockAnalysis.map(async (stock) => {
          try {
            // 감정 점수 (20점)
            const emotionScore = await getPosNegScore(stock.positive, stock.negative);
            
            // 애널리스트 점수 (40점)
            const analystScore = await getAnalystScore(stock.analystRating);
            
            // 뉴스 점수 (40점)
            const newsScore = await getNewsScore(stock.newsSummary);
            
            const totalScore = emotionScore + analystScore + newsScore;
            
            return {
              ...stock,
              score: totalScore,
            };
          } catch (error) {
            console.error(`${stock.name} 점수 계산 실패:`, error);
            return stock;
          }
        })
      );
      
      setStockAnalysis(updatedStocks);
    };

    calculateScores();
  }, []);
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-800">주식 AI 분석</h3>
      </div>
      <div className="flex flex-col gap-3">
        {stockAnalysis.map((stock, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-50 rounded-lg p-3 shadow-sm"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 text-lg font-bold ${
                stock.score === 0
                  ? "bg-blue-50 text-blue-600"
                  : stock.score >= 75
                  ? "bg-green-100 text-green-800"
                  : stock.score >= 60
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {stock.score === 0 ? (
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                Math.round(stock.score)
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm bg-blue-50 px-2 py-1 rounded">
                  {stock.name}
                </span>
                <span className="text-xs text-gray-500 bg-gray-50 px-1 py-0.5 rounded">{stock.code}</span>
                <span
                  className={`flex items-center ml-2 text-xs font-semibold ${
                    stock.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stock.trend === "up" ? (
                    <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                  )}
                  {stock.change}%
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">{stock.insight}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
