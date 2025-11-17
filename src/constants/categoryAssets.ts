const CATEGORY_ASSETS: Array<{
  key: string;
  hero?: any;
  hangout?: any;
  topCollection?: any;
  bottomLeft?: any;
  bottomRight?: any;
}> = [
  {
    key: "default",
    hero: require("../assets/images/herobanner1.png"),
    hangout: require("../assets/images/image2.png"),
    topCollection: require("../assets/images/image3.png"),
    bottomLeft: require("../assets/images/image4.png"),
    bottomRight: require("../assets/images/image5.png"),
  },
  {
    key: "cat1",
    hero: require("../assets/images/herobanner1.png"),
    hangout: require("../assets/images/image2.png"),
    topCollection: require("../assets/images/image3.png"),
    bottomLeft: require("../assets/images/image4.png"),
    bottomRight: require("../assets/images/image5.png"),
  },
];

export const getCategoryAssets = (index: number) => {
  if (
    typeof index === "number" &&
    index >= 0 &&
    index < CATEGORY_ASSETS.length
  ) {
    return CATEGORY_ASSETS[index];
  }
  return CATEGORY_ASSETS[0];
};

export default CATEGORY_ASSETS;
