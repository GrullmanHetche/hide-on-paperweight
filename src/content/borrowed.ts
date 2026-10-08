import assets from "./borrowed-assets.json";

export type BorrowedPage = { file: string; width: number; height: number; text?: string };
type BorrowedMetadata = {
  id: string;
  file: string;
  title?: string;
  subtitle?: string;
  note?: string;
  creator?: string;
  received?: string;
  ratio?: string; // Original catalogue metadata; never used to crop artwork.
  series?: string;
  width: number;
  height: number;
  alt: string;
};
export type BorrowedWork = BorrowedMetadata & (
  | { kind: "image" }
  | { kind: "animated"; still: string }
  | { kind: "document"; pages: readonly [BorrowedPage, ...BorrowedPage[]] }
);

// Original commissions.ts order and captions. Only Leon's obsolete Exchange
// reference/link is removed. There was no separate creator or received field.
export const borrowedWorks: readonly BorrowedWork[] = [
  { ...assets.holdinghyuk, "id": "holdinghyuk", "kind": "image", "file": "/borrowed/holdinghyuk.jpg", "title": "피규어를 든 사람", "subtitle": "그림 커미션 · 흉상", "note": "유현이 상혁의 피규어를 들고 있다. 들고 있는 쪽이 더 소중해 보이는 그림.", "ratio": "3/4", "alt": "피규어를 손에 든 유현의 흉상 그림" },
  { ...assets.ynm, "id": "ynm", "kind": "image", "file": "/borrowed/ynm.png", "title": "독백", "subtitle": "글 커미션 · 이상혁 시점", "note": "상혁의 시점에서 쓰인 독백. 말하지 않는 사람의 말이 여기 있다.", "alt": "상혁 시점의 독백이 적힌 글 커미션 원본" },
  { ...assets.yhfull, "id": "yhfull", "kind": "image", "file": "/borrowed/yhfull.jpg", "title": "한 판 꽉", "subtitle": "그림 커미션 · 선화", "note": "유현을 화면 가득 담은 선화. 여백 없이 꽉 찬 한 장.", "ratio": "3/4", "alt": "유현의 선화 그림" },
  { ...assets.childshyh, "id": "childshyh", "kind": "animated", "file": "/borrowed/childshyh.gif", "title": "손바닥 위의 상혁", "subtitle": "그림 커미션 · 어린이날", "note": "어린이날 기념. 어린이가 된 유현이 상혁을 손에 들고 있다. 움직이는 그림.", "ratio": "1/1", "alt": "어린이가 된 유현이 작은 상혁을 손에 든 움직이는 그림" },
  { ...assets.yhsheet, "id": "yhsheet", "kind": "image", "file": "/borrowed/yhsheet.jpg", "title": "유현 설정 시트", "subtitle": "그림 커미션 · 캐릭터 시트", "note": "큰 처진 눈, 토끼 핀, 점 두 개. 유현을 이루는 것들을 한 장에 모아둔 설정화.", "alt": "유현의 캐릭터 설정 시트" },
  { ...assets.yhbunny, "id": "yhbunny", "kind": "image", "file": "/borrowed/yhbunny.jpg", "title": "토끼 핀", "subtitle": "그림 커미션 · 반신", "note": "토끼 핀을 꽂은 유현의 반신. 인과 아웃 사이 쌍꺼풀까지 담겼다.", "alt": "토끼 핀을 꽂은 유현의 반신 그림" },
  { ...assets.pairexam, "id": "pairexam", "kind": "document", "file": "/borrowed/pairexam.pdf", "title": "전국연합페어평가", "subtitle": "글 커미션 · 모의고사 · @monzi_0_0", "note": "상혁과 유현을 문제로 푸는 14문항짜리 페어고사. 정답과 해설, 둘의 한마디까지 붙어 있다.", "alt": "전국연합페어평가 원본 시험지", pages: assets.pairexam.pages as [BorrowedPage, ...BorrowedPage[]] },
  { ...assets.leon, "id": "leon", "kind": "document", "file": "/borrowed/leon.pdf", "title": "레옹을 보고", "subtitle": "글 커미션", "note": "영화 〈레옹〉을 함께 본 뒤 받은 글.", "alt": "레옹을 보고 받은 글 커미션 원본", pages: assets.leon.pages as [BorrowedPage, ...BorrowedPage[]] },
  { ...assets.shnyhlove, "id": "shnyhlove", "kind": "document", "file": "/borrowed/shnyhlove.pdf", "title": "외사랑과 짝사랑", "subtitle": "글 커미션 · 조각글", "note": "유현은 외사랑을, 상혁은 짝사랑을 한다. 같은 방향을 다르게 부르는 두 단어에 대하여.", "alt": "외사랑과 짝사랑 글 커미션 원본", pages: assets.shnyhlove.pages as [BorrowedPage, ...BorrowedPage[]] },
];

export function plateNumber(index: number): string {
  let number = index + 1;
  let numeral = "";
  for (const [value, mark] of [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]] as const) {
    while (number >= value) { numeral += mark; number -= value; }
  }
  return `PLATE ${numeral}.`;
}
