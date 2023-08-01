import { useState, useEffect, useRef } from "react";
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
  AdEventType

} from "react-native-google-mobile-ads";
import { Platform } from "react-native";
const GameBannerAd = () => {
  const [IsBannerLoaded, setsetIsBannerLoaded] = useState(false)
  const bannerAd = useRef(null)
  // useEffect(() => {
  //   if (!bannerAd.current) return
  //   // const bannerAd = new GAMBannerAd(TestIds.GAM_BANNER);
  //   bannerAd.current.onAdLoaded(() => { console.log("ad loaded"); setsetIsBannerLoaded(p => true) })
  //   bannerAd.current.onAdFailedToLoad(() => { console.log("ad failed loaded"); setsetIsBannerLoaded(p => true) })

  // }, [bannerAd]);
  // if (!IsBannerLoaded) return null

  return (
    <GAMBannerAd
      unitId={Platform.OS === "android" ? process.env.ANDROID_BANNER : process.env.IOS_BANNER}
      sizes={[BannerAdSize.FULL_BANNER]}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      ref={bannerAd}

    />
  );
};

export default GameBannerAd;
