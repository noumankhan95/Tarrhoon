import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
const GameBannerAd = () => {
  return (
    <GAMBannerAd
      unitId={TestIds.BANNER}
      sizes={[BannerAdSize.FULL_BANNER]}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};

export default GameBannerAd;
