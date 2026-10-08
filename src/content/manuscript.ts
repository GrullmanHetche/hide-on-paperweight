export type RevisionAnnotation = Readonly<{
  id: string;
  type: "note" | "underline" | "strike" | "insertion" | "replacement";
  target?: { sectionId: string; start?: number; end?: number };
  text?: string;
}>;
export type ManuscriptSection = Readonly<{ id: string; title?: string; content: string }>;
export type ManuscriptRevision = Readonly<{
  id: string;
  label?: string;
  date?: string;
  sections: readonly [ManuscriptSection, ...ManuscriptSection[]];
  annotations?: readonly RevisionAnnotation[];
}>;
export type ManuscriptWork = Readonly<{
  id: string;
  title?: string;
  index?: string;
  form?: "poetry" | "prose" | "fiction" | "fragment" | "hybrid" | "experimental";
  layout?: "squared" | "flow";
  createdAt?: string;
  status?: "draft" | "fragment" | "complete";
  note?: string;
  currentRevision: string;
  revisions: readonly [ManuscriptRevision, ...ManuscriptRevision[]];
  plate?: { asset: string; alt: string; width: number; height: number; caption?: string };
  relatedPressedWorkId?: string;
  relatedMarginaliaIds?: readonly string[];
}>;

// Only works explicitly selected by the user are added. No archive migration,
// sample writing, empty work objects or generated titles belong in this array.
export const manuscriptWorks: readonly ManuscriptWork[] = [
  {
    "id": "m-001",
    "index": "M-001",
    "layout": "squared",
    "currentRevision": "original",
    "revisions": [
      {
        "id": "original",
        "sections": [
          {
            "id": "text",
            "content": "어떤 빛은 출발한 별이 이미 사라진 뒤에야 눈에 닿습니다 우리가 밤하늘이라고 부르는 것의 대부분은 사실 부재의 기록이지요 저는 오랫동안 그런 빛을 모으는 사람이었습니다 닿을 수 없는 것들의 잔상을 가슴에 쌓아두고 그것을 충만이라고 부르던\n\n당신도 그런 빛이었는지 모릅니다 가장 환하게 보이던 순간에 이미 식어가고 있었던\n\n손을 뻗으면 닿을 것 같아서, 그 거리가 내내 착각이었다는 것을 알면서도, 뻗는 것을 멈출 수가 없었습니다 그것이 제 과오였는지 아니면 그냥 그런 계절이었는지 아직도\n\n다시는 오지 않겠지만\n답장을 기다립니다"
          }
        ]
      }
    ]
  },
  {
    "id": "m-002",
    "index": "M-002",
    "layout": "squared",
    "currentRevision": "original",
    "revisions": [
      {
        "id": "original",
        "sections": [
          {
            "id": "text",
            "content": "당신을 위해 죽을 수 있냐는 질문은 너무 쉽습니다 나는 당신을 위해서 살 수 있어요 화학 물질에 녹은 내 머리카락과 마음 기꺼이 번지 할 준비가 되어 있습니다\n\n태양에 그을린 당신 살갗이라면 내 시야를 포기해도 좋아요 곱슬진 머리칼에 다시 닿을 수 있으면 일생의 베갯머리라도 잘라 드리겠습니다 눈을 맞았던 그 반지에 키스하고 함께 걷는 그날까지 하루도 당신 생각을 빼 놓지 않겠습니다\n\n사랑을 노래하는 음유시인들은 너무나 많습니다 어머니와 그들의 어머니와 아버지 또 그들의 어머니와 아버지―시곗바늘이라는 파도가 해변을 덮치고 그까짓 사랑에 눈먼 연인들은 다시 모래성을 쌓지요 우리도 우리만의 궁전을 쌓지 않을래요 내 손을 잡아요 무한 우주에 순간의 빛일지라도\n\n그대, 연인, 사랑이라는 동의어 아래 해 줄 수 있는 것은 작고 보잘것없는 나의 전부입니다\n\n\n기타를 연주해 드리고 싶네요\n답장을 기다립니다"
          }
        ]
      }
    ]
  }
];

export function currentRevision(work: ManuscriptWork, id = work.currentRevision) {
  return work.revisions.find(revision => revision.id === id) ?? work.revisions[0];
}
