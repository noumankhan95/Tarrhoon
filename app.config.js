export default {
  name: "Tarrhoon",
  slug: "social_assistance",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/appicon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
  },
  android: {
    icon: "./assets/simpleicon.png",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    adaptiveIcon: {
      foregroundImage: "./assets/appicon.png",
      backgroundColor: "#7369ef",
    },
    package: "com.muhammad1700.social_assistance",
    permissions: [
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.ACCESS_MEDIA_LOCATION",
      "android.permission.RECORD_AUDIO",
      "android.permission.MODIFY_AUDIO_SETTINGS",
    ],
  },
  extra: {
    eas: {
      projectId: "ac4a3de0-a120-498b-901c-0d3c4c4968e9",
    },
  },
};
