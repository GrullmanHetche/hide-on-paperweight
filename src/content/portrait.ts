export type PortraitObservation = Readonly<{
  id: string;
  text: string;
  dateObserved?: string;
  category?: string;
  relatedBelongingId?: string;
}>;
export type Belonging = Readonly<{
  id: string;
  name: string;
  asset: string;
  desc: string;
  initialPosition: { x: number; y: number };
  mobilePosition: { x: number; y: number };
  imageSize: { width: number; height: number };
}>;
export type PortraitData = Readonly<{
  name: string;
  birthDate: string;
  tokenAsset: string;
  bagAsset: string;
  observations: readonly PortraitObservation[];
  belongings: readonly Belonging[];
  artwork?: { asset: string; alt: string; caption?: string; width: number; height: number };
}>;
export const portrait: PortraitData = {
  name: "LEE SANGHYEOK",
  birthDate: "1996.05.07",
  tokenAsset: "/shnng.png",
  bagAsset: "/shbag.png",
  observations: [{ id: "remembering", text: "말이 적은 사람.\n하지만 내가 한 말을 생각보다 오래 기억한다." }],
  belongings: [
    { id: "book", name: "공책", asset: "/shbook.png", desc: "무언가를 기록할 수도 있으니까.", initialPosition: { x: .04, y: .10 }, mobilePosition: { x: 0, y: .04 }, imageSize: { width: 500, height: 500 } },
    { id: "charger", name: "충전기", asset: "/shcharger.png", desc: "항상 두 개씩 챙김.", initialPosition: { x: .73, y: .02 }, mobilePosition: { x: 1, y: .22 }, imageSize: { width: 500, height: 500 } },
    { id: "glasses", name: "안경집", asset: "/shglasses.png", desc: "예비 안경 포함.", initialPosition: { x: .22, y: .72 }, mobilePosition: { x: 0, y: .49 }, imageSize: { width: 500, height: 500 } },
    { id: "nivea", name: "니베아 립밤", asset: "/shnivea.png", desc: "오래된 습관.", initialPosition: { x: .83, y: .61 }, mobilePosition: { x: 1, y: .65 }, imageSize: { width: 479, height: 521 } },
    { id: "toothbrush", name: "칫솔", asset: "/shtoothbrush.png", desc: "칫솔 세트 中 1.", initialPosition: { x: .49, y: .86 }, mobilePosition: { x: .02, y: .96 }, imageSize: { width: 401, height: 622 } },
    { id: "toothpaste", name: "치약", asset: "/shtoothpaste.png", desc: "칫솔 세트 中 2.", initialPosition: { x: .95, y: .91 }, mobilePosition: { x: 1, y: .96 }, imageSize: { width: 500, height: 500 } },
  ],
};

export const yuhyeonPortrait: PortraitData = {
  name: "LEE YUHYEON", birthDate: "2004.12.17", tokenAsset: "/yhnng.png", bagAsset: "/yhbag.png",
  observations: [{ id: "like-glasses", text: "안경 같은 사람.\n열심히 생각해 봤습니다. 이유는... 비밀입니다." }],
  belongings: [
    {"id": "macbook", "name": "맥북", "asset": "/yhmacbook.png", "desc": "항상 켜져 있음. 탭 47개.", "initialPosition": {"x": 0.04, "y": 0.04}, "mobilePosition": {"x": 0, "y": 0.0}, "imageSize": {"width": 500, "height": 500}},
    {"id": "headset", "name": "헤드셋", "asset": "/yhheadset.png", "desc": "혼자 있고 싶을 때 필수템.", "initialPosition": {"x": 0.4, "y": 0.0}, "mobilePosition": {"x": 1, "y": 0.1111111111111111}, "imageSize": {"width": 500, "height": 500}},
    {"id": "medicine", "name": "진통제", "asset": "/yhmedicine.png", "desc": "두통이 잦아서 항상 챙김.", "initialPosition": {"x": 0.86, "y": 0.15}, "mobilePosition": {"x": 0, "y": 0.2222222222222222}, "imageSize": {"width": 411, "height": 608}},
    {"id": "tumbler", "name": "텀블러", "asset": "/yhtumbler.png", "desc": "따뜻한 물만 마심.", "initialPosition": {"x": 0.02, "y": 0.44}, "mobilePosition": {"x": 1, "y": 0.3333333333333333}, "imageSize": {"width": 500, "height": 500}},
    {"id": "camera", "name": "핑크 디카", "asset": "/yhcamera.png", "desc": "상혁 씨가 보내준 카메라.", "initialPosition": {"x": 0.71, "y": 0.42}, "mobilePosition": {"x": 0, "y": 0.4444444444444444}, "imageSize": {"width": 485, "height": 515}},
    {"id": "perfume", "name": "향수", "asset": "/yhperfume.png", "desc": "은은한 플로럴 계열.", "initialPosition": {"x": 0.93, "y": 0.64}, "mobilePosition": {"x": 1, "y": 0.5555555555555556}, "imageSize": {"width": 500, "height": 500}},
    {"id": "pouch", "name": "메이크업 파우치", "asset": "/yhpouch.png", "desc": "꼭 필요한 것들만.", "initialPosition": {"x": 0.08, "y": 0.86}, "mobilePosition": {"x": 0, "y": 0.6666666666666666}, "imageSize": {"width": 500, "height": 500}},
    {"id": "notebook", "name": "공책", "asset": "/yhnotebook.png", "desc": "매일 뭔가를 적어둠.", "initialPosition": {"x": 0.37, "y": 0.75}, "mobilePosition": {"x": 1, "y": 0.7777777777777778}, "imageSize": {"width": 500, "height": 500}},
    {"id": "scrunch", "name": "스크런치", "asset": "/yhscrunch.png", "desc": "머리 묶을 때.", "initialPosition": {"x": 0.6, "y": 0.96}, "mobilePosition": {"x": 0, "y": 0.8888888888888888}, "imageSize": {"width": 500, "height": 500}},
    {"id": "powder", "name": "파우더", "asset": "/yhpowder.png", "desc": "외출 전 마지막 단계.", "initialPosition": {"x": 0.85, "y": 0.98}, "mobilePosition": {"x": 1, "y": 1.0}, "imageSize": {"width": 500, "height": 500}},
  ],
};

export const portraits: readonly PortraitData[] = [portrait, yuhyeonPortrait];
