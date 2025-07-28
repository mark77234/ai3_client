export const COMPANY_NAMES = {
  SAMSUNG: { name: "삼성물산" },
  CHIPOLE: { name: "치폴레" },
}; // 1. 만약 기사에 회사의 이름이 있는 경우 그 이름이 뜨도록, 객체 형태로 변경하여 키로 회사 구분

export const MAIN_CATEGORIES = {
  INFORMATION_TECHNOLOGY: "정보기술",
  INDUSTRIALS: "산업재",
  SEMICONDUCTOR: "반도체",
  FINANCE: "금융",
  HEALTHCARE: "헬스케어",
  CONSUMER_DISCRETIONARY: "자유소비재",
  AUTOMOTIVE: "자동차",
  MEDIA_ENTERTAINMENT: "미디어&엔터테이먼트",
  MATERIALS: "소재",
  MACHINERY_EQUIPMENT: "기계장비",
  BANK: "은행",
  ENERGY_CHEMICALS: "에너지화학",
  CONSUMER_STAPLES: "필수소비재",
  TRANSPORTATION: "운송",
  CYCLICAL_CONSUMER_GOODS: "경기소비재",
  STEEL: "철강",
  COMMUNICATION_SERVICES: "커뮤니케이션서비스",
  INSURANCE: "보험",
  BROADCASTING_TELECOMMUNICATIONS: "방송통신",
  UTILITIES: "유틸리티",
  CONSTRUCTION: "건설",
  SECURITIES: "증권",
}; // 2. 카테고리 나눈것, KRX 한국거래소 기준, 배열에서 객체로 변경하여 키로 구분

// 3은 ai점수인데 일단은 insightData 안에 property로 넣어두었습니다.
export const AI_EMOTIONS = {
  POSITIVE: "긍정적",
  HOLD: "보류",
  NEGATIVE: "부정적",
};
//4. 비시장적 뉴스 태그
export const NON_MARKET_TAGS = {
  POLITICS: "정치",
  DIPLOMACY: "외교",
  SECURITY: "안보",
  SYSTEM_CHANGE: "제도변경",
  TRADE_POLICY: "통상정책",
  LEGAL_ISSUE: "사법이슈",
  LABOR_SOCIAL: "노동사회",
  MARKET_CONFIDENCE: "시장신뢰",
  SUPPLY_CHAIN_RISK: "공급망위협",
  MACRO_UNCERTAINTY: "거시불확실성",
  RISK_FACTOR: "리스크요인",
  POLICY_OPPORTUNITY: "정책기회",
  KOREA: "대한민국",
  USA: "미국",
  CHINA: "중국",
  NORTH_KOREA: "북한",
  EU: "EU",
  SOUTHEAST_ASIA: "동남아",
  GLOBAL: "글로벌",
  URGENT: "긴급",
  PREDICTED: "예고",
  ONGOING: "진행중",
  NEEDS_ANALYSIS: "분석필요",
};