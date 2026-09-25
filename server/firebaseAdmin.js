import admin from 'firebase-admin';

// Your service account JSON credentials
const serviceAccount = {
  type: "service_account",
  project_id: "remotepatient-75414",
  private_key_id: "5256bbbac950f154d2c3f2bbc3976eecf1f3d92b",
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4rlGRAL0DGkbz
plqqVW/PvjzR/zPTy1lacEWdLoLAoMOYVNGrjiASHu7dXP6CSFEMya7gr/eVWo//
RQ0fIckYJ5Mp1oqqvWUHDVC4ywSF5fBz+51MXN78/koRrGtcF0TmQmEBM+6g/6K5
56bqYN3nnk09zDrXo/bgTGVgXjDxhFpw2ZE4vx792zrEx8jWCGxEun3+AieI/4ui
JGBWKwESF1gO6y2WEdhLJVPW/CmVEthPvAVBDENTAaQs9saZnjVIVdLuVhCuh6zU
DvR1XBdRrM4cJJXXq6GfyCmngAzsNTrKhauYj4d07J+rPc33dgqaon180shDLVh2
dl5Xqh4HAgMBAAECggEAGw3KPBwoFCrGxw2RDY/Le9rJ7Rdd/8IzujhlMkPseoxy
ar/OITwGPbFTW5EyZWJzoRRwblDIy5PDMWlrpSpdW5D8kW3wzVdGU/Si5Rc0d+r5
wPvUjKm0LsqPjiw8Y/ayrKp/rF3vsJ0SOPqS7JW5HCOH/CwNWKaX1T7LwQS7Vb3G
hZWKI2p36uyXD8e+TT51iXRqtm2Q8m1TChfmljIqS0lq6zrqzvziDWdPiemBx1/g
0aRG4VgcgI5F27qLOPXmZab7ZefooHPD3HKt6my1ns/qwyB9FyU5o63MNdqYyScW
vNVsOjqLx2MGqEsueuqeuygD8t4/0PBIDmWT33xPqQKBgQDhHIWszFXUKqYPj6ct
MWLXS1P3s9/3v4IISj2Owf0zizouzuVpkC8jHeqDPOODBl6JcNaVWxjDO2dwktqa
UjfC9fp0UH7J7UhhmgaIxSfnMJ9l1WTrUhEUlA3FItVBiy9PJVinq4ETcKHemTEU
/+BcR2VQzKBtDNqTBU5FgK/q2QKBgQDSBZjKF7ucyJuoOywZOT7VR6M8qFWkAgNw
uEjtwu4FDvwItun+J+RcIjh7sZm7bRoVlG5PNBE8elmRNd1S/yyL9X+Q/YH8k2Yw
rPxfIE0lP8UP/IhUcVs6BqnSuMa4/JQQC56bmBSLxv5loHJSwaoyKgxBGohVZOer
mT6KwIwD3wKBgE3LBYcJtj9z3Z9TDXrYrkeoiIP5bVS4ob8rqMpEz7OYUasLZMxu
P1vrYrenuxf0g4cLr5w9tvkA9mY42cKq1wpQ5xR7HNW7YmAYUlnBiGCktPEEJbQM
0EpEP934g6n654Z6aYDIC/sj2UyLtCKFqos5QRIDJQ2Ke56DHuF171VBAoGAB2wD
NkEYdDXyqkNND6ciPU9GyYH5ZM5daMJacWyOFMeuyHAOXNj0DP14mYZxNFpqrZCN
RWdFpKl+OM96ftBdtqR6WZlb2p0q41V5pbLyhvp18FawSqum2aoankPBYhAq+1Yt
yLnbIAVsQBMndx048oTh4fsaDkp+lWXY+/ZJ/GkCgYA3ylW5GkonMVSgwd5fGSR6
6AeFEbNR/zlaEPVamZDJ3t4Re18FOO9Ggh/QrKEhyoZvQLT1vb2/g1DP9ha06+Dk
mjQbtS0EP5OelDc5zVgy61OVj7E29njxfk24fbZAHCyumwOEdBkqfTPBan+v0jAs
UHqJLxlTeRKCUs9h2D2wjA==
-----END PRIVATE KEY-----`,
  client_email: "firebase-adminsdk-toq8w@remotepatient-75414.iam.gserviceaccount.com",
  client_id: "113925996775049719352",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-toq8w%40remotepatient-75414.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export the admin instance
export default admin;
